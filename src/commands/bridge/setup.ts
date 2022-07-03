import {Command, flags} from '@oclif/command'

export default class BridgeSetup extends Command {
  static description = 'Internal command used to setup the grpc bridge server upon first install'

  static hidden = true

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(BridgeSetup)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/wirk/Documents/Work/Emodyz/ezgames-cli/src/commands/bridge/setup.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
