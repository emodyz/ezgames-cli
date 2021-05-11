import {Command, flags} from '@oclif/command'
import {dockerComposeExec} from '../../core/docker/compose-exec'

export default class AppExec extends Command {
  static description = 'Executes the provided command inside the targeted docker-compose service'

  static aliases = ['exec']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'target',
      description: 'The name of the docker-compose service inside which the command is to be executed.',
      required: true,
    },
    {
      name: 'command',
      description: 'The the desired command to be executed.',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(AppExec)

    await dockerComposeExec(args.target, args.command, false, {stdio: 'inherit'})
  }
}
