import {Command, flags} from '@oclif/command'
import pm2 from 'pm2'
import {Pm2Errors} from '../../core/errors/pm2'
import Pm2DaemonError = Pm2Errors.Pm2DaemonError
import Pm2ProcessError = Pm2Errors.Pm2ProcessError
import Pm2RpcError = Pm2Errors.Pm2RpcError

// TODO: move all custom flags to "core"
const portNum = flags.build<number>({char: 'P', default: 6660, parse: input => Number.parseInt(input, 10)})

export default class BridgeStart extends Command {
  static description = 'Starts the bridge server'

  static flags = {
    host: flags.string({char: 'H', default: '0.0.0.0'}),
    port: portNum(),
    help: flags.help({char: 'h'}),
  }

  // TODO: Execute "pm2 install pm2-logrotate" with cli installation or add a cron job to avoid massive disk usage
  async run() {
    const {flags} = this.parse(BridgeStart)
    flags.port = flags.port ? flags.port : 6660

    pm2.connect(function (err) {
      if (err) {
        throw new Pm2DaemonError(err)
      }

      pm2.start({
        script: `ezgames bridge:listen -H ${flags.host} -P ${flags.port} --daemon`,
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
