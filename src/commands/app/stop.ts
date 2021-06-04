import {Command, flags} from '@oclif/command'
import {dockerComposeDown} from '../../core/docker/compose-down'

export default class AppStop extends Command {
  static description = 'Stops EZGames\'s containers'

  static aliases = ['stop', 'down']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await dockerComposeDown({stdio: 'inherit'})
  }
}
