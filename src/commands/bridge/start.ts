import {Command, flags} from '@oclif/command'
import pm2 from 'pm2'
import {Pm2Errors} from '../../core/errors/pm2'
import Pm2DaemonError = Pm2Errors.Pm2DaemonError
import Pm2ProcessError = Pm2Errors.Pm2ProcessError
import Pm2RpcError = Pm2Errors.Pm2RpcError

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
        script: 'ezgames bridge:listen --daemon',
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

          pm2_bus.on('process:log', function (packet: any) {
            console.log(packet.data.log)
          })

          pm2_bus.on('process:endLogs', function () {
            pm2.disconnect()
          })

          pm2_bus.on('process:error', function (packet: any) {
            pm2.stop('ezg-bridge', (err, _) => {
              if (err) {
                throw new Pm2DaemonError(err)
              }

              pm2.disconnect()
              throw new Pm2ProcessError(packet.data.error)
            })
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
