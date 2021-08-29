import {Command, flags} from '@oclif/command'
import {BridgeClient} from '../../core/bridge/proto/bridge'
import {credentials} from '@grpc/grpc-js'

export default class BridgeTest extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'name', required: true}]

  async run() {
    const {args} = this.parse(BridgeTest)

    const client = new BridgeClient('host.docker.internal:6660', credentials.createInsecure())

    client.sayHello({name: args.name}, (err, res) => {
      if (err) {
        throw new Error(err.message)
      }
      this.log(res.message)
    })
  }
}
