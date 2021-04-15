import {Command, flags} from '@oclif/command'
import {dockerComposeExec} from '../../core/docker/compose-exec'
import {EZG_APP_PATH} from '../../core/paths'
import {getAppEnv} from '../../core/env'

export default class BuildFront extends Command {
  static description = '(Re)Build EZGames\'s FontEnd Application'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await BuildFront.build(true)
  }

  static async build(stdio = false) {
    return dockerComposeExec('php', 'yarn run production', EZG_APP_PATH, getAppEnv(), stdio)
  }
}
