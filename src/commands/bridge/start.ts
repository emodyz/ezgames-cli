import {Command, flags} from '@oclif/command'
import pm2 from 'pm2'
import {CliErrors} from '../../core/errors/cli'
import Pm2DaemonError = CliErrors.Pm2DaemonError
import Pm2ProcessError = CliErrors.Pm2ProcessError
import Pm2RpcError = CliErrors.Pm2RpcError

export default class BridgeStart extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  // static args = [{name: 'file'}]

  // TODO: Execute "pm2 install pm2-logrotate" with cli installation
  async run() {
    // const {args, flags} = this.parse(BridgeStart)
    pm2.connect(function (err) {
      if (err) {
        throw new Pm2DaemonError(err)
      }

      pm2.start({
        script: 'ezgames bridge:listen',
        name: 'ezg-bridge',
      }, function (err) {
        if (err) {
          pm2.disconnect()
          throw new Pm2ProcessError(err)
        }

        pm2.launchBus(function (err, pm2_bus) {
          pm2_bus.on('process:msg', function (packet: any) {
            console.log(packet)
          })

          pm2_bus.on('process:endLogs', function () {
            pm2.disconnect()
          })

          if (err) {
            pm2.disconnect()
            throw new Pm2RpcError(err)
          }
        })
      })
    })
  }
}
