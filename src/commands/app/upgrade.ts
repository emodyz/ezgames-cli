import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import {getGitInfo} from '../../core/git'
import {gitHubApi} from '../../core/github'
import collect from 'collect.js'
import semver from 'semver'
import {supportedVersions} from '../../core/env'
import Enquirer, {prompt} from 'enquirer'
import ChoiceOptions = Enquirer.prompt.FormQuestion.ChoiceOptions

export default class AppUpgrade extends Command {
  static description = chalk`{magenta.bold EZGames} {cyan Updater}`

  static aliases = ['upgrade']

  static flags = {
    help: flags.help({char: 'h'}),
    list: flags.boolean({char: 'l', description: 'Lists available upgrade targets'}),
    'allow-pre-releases': flags.boolean({description: 'Allows the user to select a pre-release as upgrade target'}),
  }

  async run() {
    const {flags} = this.parse(AppUpgrade)

    const gitInfo = await getGitInfo()

    if (!gitInfo.isTag || !semver.valid(gitInfo.current)) {
      throw new Error(chalk`{bgRed.white.bold \nCurrent version: "${gitInfo.current}"\nAutomatic updates are only supported when tracking a "semver" compliant GitHub release and not a branch like "master" or "dev"}`)
    }

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

    const upgradeChoices: ChoiceOptions[] = availableReleases.map((item: any): ChoiceOptions => {
      return {
        name: item.tag_name,
        message: `${item.name}${item.prerelease ? chalk` {yellow [Pre-release]}` : ''}`,
        value: item.tag_name,
      }
    }).all()

    const form = {
      message: 'Choose a version',
      type: 'Select',
      name: 'upgradeTarget',
      choices: upgradeChoices,
    }

    const {upgradeTarget} = await prompt(form)

    console.log(upgradeTarget)
  }
}
