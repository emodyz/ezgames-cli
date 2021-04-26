import {Command, flags} from '@oclif/command'
import {dockerComposeUp} from '../../core/docker/compose-up'
import {EZG_APP_PATH} from '../../core/paths'
import {getAppEnv} from '../../core/env'

export default class AppStart extends Command {
  static description = 'Starts EZGames\'s containers'

  static aliases = ['start']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await dockerComposeUp(EZG_APP_PATH, getAppEnv(), true)
  }
}
