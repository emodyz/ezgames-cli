import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import {getGitInfo} from '../../core/git'
import GitHub from '../../core/github'
import collect from 'collect.js'
import semver from 'semver'
import {supportedVersions} from '../../core/env'

export default class AppUpgrade extends Command {
  static description = chalk`{magenta.bold EZGames} {cyan Updater}`

  static aliases = ['upgrade']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const gitInfo = await getGitInfo()

    if (!gitInfo.isTag) {
      throw new Error(chalk`{bgRed.white.bold \nCurrent version: "${gitInfo.current}"\nAutomatic updates are only supported when tracking GitHub releases and not a branch like "master" or "dev"}`)
    }

    const gitHubApi = process.env.EZG_CLI_GITHUB_TOKEN ? GitHub.requestWithAuth : GitHub.requestAnonymously

    const releases = collect((await gitHubApi('GET /repos/{owner}/{repo}/releases', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data)

    const availableReleases = releases.filter((value: any) => {
      return semver.satisfies(value.tag_name, supportedVersions)
    })

    console.log(availableReleases)
  }
}
