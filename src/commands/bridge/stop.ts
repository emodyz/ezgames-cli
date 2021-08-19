import {Command, flags} from '@oclif/command'
import pm2 from 'pm2'
import {Pm2Errors} from '../../core/errors/pm2'
import Pm2DaemonError = Pm2Errors.Pm2DaemonError
import chalk from 'chalk'

export default class BridgeStop extends Command {
  static description = 'Stops the bridge server'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const self = this
    pm2.connect(function (err) {
      if (err) {
        throw new Pm2DaemonError(err)
      }

      pm2.stop('ezg-bridge', (err, _) => {
        if (err) {
          throw new Pm2DaemonError(err)
        }

        self.log(chalk`{cyan Bridge:} {red.bold Stopped}`)
        pm2.disconnect()
      })
    })
  }
}
