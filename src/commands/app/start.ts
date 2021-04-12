import {Command, flags} from '@oclif/command'
import {dockerComposeUp} from '../../core/docker/compose-up'
import {EZG_APP_PATH} from '../../core/paths'
import {getAppEnv} from '../../core/env'

export default class AppStart extends Command {
  static description = 'Starts the EZGames container'

  static aliases = ['start']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {stdout, stderr} = await dockerComposeUp(EZG_APP_PATH, getAppEnv())
    console.log(stdout)
    console.error(stderr)
  }
}
