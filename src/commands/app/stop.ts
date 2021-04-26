import {Command, flags} from '@oclif/command'
import {dockerComposeDown} from '../../core/docker/compose-down'
import {EZG_APP_PATH} from '../../core/paths'
import {getAppEnv} from '../../core/env'

export default class AppStop extends Command {
  static description = 'Stops EZGames\'s containers'

  static aliases = ['stop']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await dockerComposeDown(EZG_APP_PATH, getAppEnv(), true)
  }
}
