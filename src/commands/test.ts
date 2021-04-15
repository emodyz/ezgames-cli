import {Command, flags} from '@oclif/command'
import {EZG_APP_PATH} from '../core/paths'
import {getAppEnv} from '../core/env'
import {dockerComposeExec} from '../core/docker/compose-exec'

export default class Test extends Command {
  static description = 'Dummy Command used to test features'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await dockerComposeExec('php', 'yarn run production', EZG_APP_PATH, getAppEnv(), false)
  }
}
