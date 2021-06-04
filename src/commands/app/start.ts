import {Command, flags} from '@oclif/command'
import {dockerComposeUp} from '../../core/docker/compose-up'

export default class AppStart extends Command {
  static description = 'Starts EZGames\'s containers'

  static aliases = ['start', 'up']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await dockerComposeUp({stdio: 'inherit'})
  }
}
