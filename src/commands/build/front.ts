import {Command, flags} from '@oclif/command'
import {dockerComposeExec} from '../../core/docker/compose-exec'
import {stdIo} from '../../types/execa'

export default class BuildFront extends Command {
  static description = '(Re)Build EZGames\'s FontEnd Application'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await BuildFront.build(true, 'inherit')
  }

  static async build(tty = true, stdio: stdIo = 'pipe') {
    return dockerComposeExec('php', 'yarn run production', tty, {stdio: stdio})
  }
}
