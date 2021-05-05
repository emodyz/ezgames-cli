import {Command, flags} from '@oclif/command'
import {dockerComposeUp} from '../../core/docker/compose-up'
import {cli} from 'cli-ux'
import {dockerComposeDown} from '../../core/docker/compose-down'

export default class AppRestart extends Command {
  static description = 'Restarts EZGames\'s containers'

  static aliases = ['restart']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await dockerComposeDown({stdio: 'inherit'})
    await cli.wait(10000)
    await dockerComposeUp({stdio: 'inherit'})
  }
}
