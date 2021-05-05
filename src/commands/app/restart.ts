import {Command, flags} from '@oclif/command'
import {dockerComposeUp} from '../../core/docker/compose-up'
import {dockerComposeDown} from '../../core/docker/compose-down'

export default class AppRestart extends Command {
  static description = 'Restarts EZGames\'s containers'

  static aliases = ['restart']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await dockerComposeDown({stdio: 'inherit'})
    await dockerComposeUp({stdio: 'inherit'})
  }
}
