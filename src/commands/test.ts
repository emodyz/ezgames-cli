import {Command, flags} from '@oclif/command'
import {waitForHealthyApp} from '../core/api/status'
import {dockerComposeBuild} from '../core/docker/compose-build'
import {EZG_APP_PATH} from '../core/paths'
import {getAppEnv} from '../core/env'
import {dockerComposeUp} from '../core/docker/compose-up'
import {dockerComposeExec} from '../core/docker/compose-exec'

export default class Test extends Command {
  static description = 'Dummy Command used to test features'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await dockerComposeExec('php', 'php artisan migrate --force', EZG_APP_PATH, getAppEnv())
  }
}
