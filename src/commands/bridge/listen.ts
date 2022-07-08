import {Command, flags} from '@oclif/command'
import {BridgeManager} from '../../core/bridge/bridge-manager'

const portNum = flags.build<number>({char: 'P', default: 6660, parse: input => Number.parseInt(input, 10)})

export default class BridgeListen extends Command {
  static description = 'Internal command used to bind the grpc bridge server to the pm2 daemon'

  static hidden = true

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    host: flags.string({char: 'H', default: '0.0.0.0'}),
    port: portNum(),
    // flag with no value (-f, --force)
    daemon: flags.boolean({char: 'd', description: ''}),
  }

  async run() {
    const {flags} = this.parse(BridgeListen)
    flags.port = flags.port ? flags.port : 6660
    const bridge = new BridgeManager(flags.host, flags.port, false, flags.daemon)

    bridge.listen()
  }
}
