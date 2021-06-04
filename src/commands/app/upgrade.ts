import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import {getGitInfo, getGitInstance, GitInfoBasic} from '../../core/git'
import {gitHubApi} from '../../core/github'
import collect from 'collect.js'
import semver from 'semver'
import {supportedVersions} from '../../core/env/env'
import Enquirer, {prompt} from 'enquirer'
import ChoiceOptions = Enquirer.prompt.FormQuestion.ChoiceOptions
import {dockerComposeExec} from '../../core/docker/compose-exec'

export default class AppUpgrade extends Command {
  static description = chalk`{magenta.bold EZGames} {cyan Updater}`

  static aliases = ['upgrade']

  static flags = {
    help: flags.help({char: 'h'}),
    list: flags.boolean({char: 'l', description: 'Lists available upgrade targets'}),
    'allow-pre-releases': flags.boolean({description: 'Allows the user to select a pre-release as upgrade target'}),
    // TODO: Add a flag to manually set a target version
  }

  async run() {
    const {flags} = this.parse(AppUpgrade)

    const gitInfo = await getGitInfo()

    if (!gitInfo.isTag || !semver.valid(gitInfo.current)) {
      throw new Error(chalk`{bgRed.white.bold \nCurrent version: "${gitInfo.current}"\nAutomatic updates are only supported when tracking a "semver" compliant GitHub release and not a branch like "master" or "dev"}`)
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

  async upgradeTargetForm(upgradeChoices: ChoiceOptions[]) {
    const form = {
      message: 'Choose a version',
      type: 'Select',
      name: 'upgradeTarget',
      choices: upgradeChoices,
    }

    return prompt(form)
  }

  async getRelevantChoices(gitInfo: GitInfoBasic, flags: Record<any, any>): Promise<ChoiceOptions[]> {
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

    return  availableReleases.map((item: any): ChoiceOptions => {
      return {
        name: item.tag_name,
        message: `${item.name}${item.prerelease ? chalk` {yellow [Pre-release]}` : ''}`,
        value: item.tag_name,
      }
    }).all()
  }
}
