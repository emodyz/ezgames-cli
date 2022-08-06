import {Command, flags as flgs} from '@oclif/command'
import chalk from 'chalk'
import {getGitInfo, getGitInstance, GitInfoBasic} from '../../core/git'
import {gitHubApi} from '../../core/github'
import collect, {Collection} from 'collect.js'
import semver from 'semver'
import {savePatchedEnv, supportedVersions} from '../../core/env/env'
import {prompt} from 'enquirer'
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
    help: flgs.help({char: 'h'}),
    list: flgs.boolean({char: 'l', description: 'Lists available upgrade targets'}),
    'allow-pre-releases': flgs.boolean({description: 'Allows the user to select a pre-release as upgrade target'}),
    maintenance: flgs.boolean({
      description: 'Puts the app into maintenance mode before starting the upgrade process',
      default: true,
      allowNo: true}),
    target: flgs.string({char: 't', description: 'The version you wish to upgrade to'}),
  }

  static availableReleases: Collection<any>

  async run() {
    const {flags: base_flags} = this.parse(AppUpgrade)

    const gitInfo = await getGitInfo()

    if (!gitInfo.isTag || !semver.valid(gitInfo.current)) {
      throw new UnsupportedCurrentVersionError(gitInfo.current)
    }

    const relevantChoices = await this.getRelevantChoices(gitInfo, base_flags)

    AppUpgrade.flags.target = flgs.string({
      options: AppUpgrade.availableReleases.all(),
      char: 't', description: 'The version you wish to upgrade to',
    })
    const {flags} = this.parse(AppUpgrade)

    if (relevantChoices.length <= 0) {
      this.log(chalk`{green.bold Current Version:} {cyan ${gitInfo.current}}`)
      this.log(chalk`{green.bold Already up to date!}`)
      this.exit(0)
    }

    const upgradeTarget: string = flags.target ? flags.target : (await this.upgradeTargetForm(relevantChoices)).upgradeTarget

    const rebuildFront = await this.shouldRebuildFront(upgradeTarget)
    const rebuildContainers = await this.shouldRebuildContainers(upgradeTarget)
    // TODO: Add should restart bridge!

    if (flags.maintenance) {
      await dockerComposeExec('php', 'php artisan down', true, {stdio: 'inherit'})
    }

    const git = getGitInstance()
    await git.checkout(upgradeTarget)

    await dockerComposeDown({stdio: 'inherit'})

    await savePatchedEnv(gitInfo.current, upgradeTarget)

    if (rebuildContainers) {
      await dockerComposeBuild({stdio: 'inherit'})
    }

    await dockerComposeUp({stdio: 'inherit'})

    this.log(chalk`{yellow.bold Waiting for startup completion... (this will take a few minutes)}`)

    await cli.wait(60_000)
    await dockerComposeExec('php', 'php artisan up', true, {stdio: 'inherit'})
    await waitForHealthyApp()

    if (rebuildFront) {
      await BuildFront.build(true, 'inherit')
    }

    this.log(chalk`{green.bold Update} {cyan ${upgradeTarget}} {green.bold has been installed successfully!}`)
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

  static async getUpgradeTargets(gitInfo: GitInfoBasic, allowPre: boolean): Promise<Collection<any>> {
    const releases = collect((await gitHubApi('GET /repos/{owner}/{repo}/releases', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data)

    const supportedReleases = releases.filter((value: any) => {
      return semver.satisfies(value.tag_name, supportedVersions) && semver.gt(value.tag_name, gitInfo.current)
    })

    return supportedReleases.filter((value: any) => {
      // eslint-disable-next-line no-negated-condition
      return !allowPre ? !value.prerelease : true
    })
  }

  async getRelevantChoices(gitInfo: GitInfoBasic, flags: Record<any, any>): Promise<FormChoiceOptions[]> {
    const availableReleases = await AppUpgrade.getUpgradeTargets(gitInfo, flags['allow-pre-releases'])

    if (availableReleases.isEmpty()) {
      //
    }

    AppUpgrade.availableReleases = availableReleases.map(item => item.tag_name)

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
