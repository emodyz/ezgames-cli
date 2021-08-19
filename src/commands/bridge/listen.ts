import {Command, flags} from '@oclif/command'
import {BridgeManager} from '../../core/bridge/src/bridge-manager'

export default class BridgeListen extends Command {
  static description = 'Internal command used to bind the grpc bridge server to the pm2 daemon'

  static hidden = true

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    daemon: flags.boolean({char: 'd', description: ''}),
  }

  // static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(BridgeListen)
    const bridge = new BridgeManager('localhost', 6660, false, flags.daemon)

    bridge.listen()
  }
}
