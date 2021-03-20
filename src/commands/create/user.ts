import {Command, flags} from '@oclif/command'

export default class CreateUser extends Command {
  static description = 'Create a user'

  static flags = {
    help: flags.help({char: 'h'}),
    username: flags.string({char: 'n', description: 'Username of the future user'}),
    email: flags.string({char: 'm', description: 'Email of the future user'}),
    password: flags.string({char: 'p', description: 'Password username of the future user'}),
    role: flags.string({char: 'r', description: 'Role to be assigned to the future user'}),
  }

  async run() {
    const {flags} = this.parse(CreateUser)
  }
}

export async function createUserForm() {

}
