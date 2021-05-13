import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import {getGitInfo} from '../../core/git'

export default class AppUpgrade extends Command {
  static description = chalk`{magenta.bold EZGames} {cyan Updater}`

  static aliases = ['upgrade']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    console.log(await getGitInfo())
  }
}
