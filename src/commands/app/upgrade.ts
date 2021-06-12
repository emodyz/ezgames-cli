import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import {getGitInfo, getGitInstance, GitInfoBasic} from '../../core/git'
import {gitHubApi} from '../../core/github'
import collect from 'collect.js'
import semver from 'semver'
import {savePatchedEnv, supportedVersions} from '../../core/env/env'
import /* Enquirer, */ {prompt} from 'enquirer'
// import ChoiceOptions = Enquirer.prompt.FormQuestion.ChoiceOptions
import {dockerComposeExec} from '../../core/docker/compose-exec'
import {dockerComposeDown} from '../../core/docker/compose-down'
import {dockerComposeBuild} from '../../core/docker/compose-build'
import BuildFront from '../build/front'
import {dockerComposeUp} from '../../core/docker/compose-up'
import cli from 'cli-ux'
import {waitForHealthyApp} from '../../core/api/status'
import {UpdaterErrors} from '../../core/errors/updater'
import UnsupportedCurrentVersionError = UpdaterErrors.UnsupportedCurrentVersionError

export default class AppUpgrade extends Command {
  static description = chalk`{magenta.bold EZGames} {cyan Updater}`

  static aliases = ['upgrade']

  static flags = {
    help: flags.help({char: 'h'}),
    list: flags.boolean({char: 'l', description: 'Lists available upgrade targets'}),
    'allow-pre-releases': flags.boolean({description: 'Allows the user to select a pre-release as upgrade target'}),
    // TODO: Add a flag to manually set a target version
  }

  // TODO: Check if App is running
  async run() {
    const {flags} = this.parse(AppUpgrade)

    const gitInfo = await getGitInfo()

    if (!gitInfo.isTag || !semver.valid(gitInfo.current)) {
      throw new UnsupportedCurrentVersionError(gitInfo.current)
    }

    const relevantChoices = await this.getRelevantChoices(gitInfo, flags)

    if (relevantChoices.length <= 0) {
      this.log(chalk`{green.bold Current Version:} {cyan ${gitInfo.current}}`)
      this.log(chalk`{green.bold Already up to date!}`)
      this.exit(0)
    }

    const {upgradeTarget} = await this.upgradeTargetForm(relevantChoices)

    const rebuildFront = await this.shouldRebuildFront(upgradeTarget.toString())
    const rebuildContainers = await this.shouldRebuildContainers(upgradeTarget.toString())

    await dockerComposeExec('php', 'php artisan down', true, {stdio: 'inherit'})

    const git = getGitInstance()
    await git.checkout(upgradeTarget.toString())

    await dockerComposeDown({stdio: 'inherit'})

    await savePatchedEnv(gitInfo.current, upgradeTarget.toString())

    if (rebuildContainers) {
      await dockerComposeBuild({stdio: 'inherit'})
    }

    await dockerComposeUp({stdio: 'inherit'})

    this.log(chalk`{yellow.bold Waiting for startup completion... (this will take a few minutes)}`)

    await cli.wait(90000)
    await dockerComposeExec('php', 'php artisan up', true, {stdio: 'inherit'})
    await waitForHealthyApp()

    if (rebuildFront) {
      await BuildFront.build(true, 'inherit')
    }

    this.log(chalk`{green.bold Update} {cyan ${upgradeTarget}} {green.bold Successfully installed!}`)
  }

  async shouldRebuildFront(upgradeTarget: string): Promise<boolean> {
    const git = getGitInstance()
    const diff = await git.diffSummary([`tags/${upgradeTarget}`,
      'resources',
      'storage',
      'public',
      '.eslintrc.yml',
      '.eslintignore',
      'package.json',
      'yarn.lock',
      'webpack.mix.js',
      'webpack.config.js',
      'tsconfig.json',
      'tailwind.config.js',
      'tailwind.typography.config.js',
      '.env.example'])

    return diff.changed > 0
  }

  async shouldRebuildContainers(upgradeTarget: string): Promise<boolean> {
    const git = getGitInstance()
    const diff = await git.diffSummary([`tags/${upgradeTarget}`,
      'docker',
      'docker-compose.yml'])

    return diff.changed > 0
  }

  async upgradeTargetForm(upgradeChoices: FormChoiceOptions[]): Promise<Record<any, any>> {
    const form = {
      message: 'Choose a version',
      type: 'Select',
      name: 'upgradeTarget',
      choices: upgradeChoices,
    }

    return prompt(form)
  }

  async getRelevantChoices(gitInfo: GitInfoBasic, flags: Record<any, any>): Promise<FormChoiceOptions[]> {
    const releases = collect((await gitHubApi('GET /repos/{owner}/{repo}/releases', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data)

    const supportedReleases = releases.filter((value: any) => {
      return semver.satisfies(value.tag_name, supportedVersions) && semver.gt(value.tag_name, gitInfo.current)
    })

    const availableReleases = supportedReleases.filter((value: any) => {
      // eslint-disable-next-line no-negated-condition
      return !flags['allow-pre-releases'] ? !value.prerelease : true
    })

    if (availableReleases.isEmpty()) {
      //
    }

    return  availableReleases.map((item: any): FormChoiceOptions => {
      return {
        name: item.tag_name,
        message: `${item.name}${item.prerelease ? chalk` {yellow [Pre-release]}` : ''}`,
        value: item.tag_name,
      }
    }).all()
  }
}

export type FormChoiceOptions = {
  name: string;
  value?: string;
  message: string;
  hint?: string;
  initial?: string;
  disabled?: boolean;
};
