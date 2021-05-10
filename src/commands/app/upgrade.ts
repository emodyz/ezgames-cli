import {Command, flags} from '@oclif/command'
import chalk from 'chalk'

export default class AppUpgrade extends Command {
  static description = chalk`{magenta.bold EZGames} {cyan Updater}`

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
  // TODO: MAYBE Have a version of the .env file & tie that to the version of the cli to prevent braking upgrades
  }
}
