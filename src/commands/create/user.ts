import {Command, flags} from '@oclif/command'
import {TaskWrapper} from 'listr2/dist/lib/task-wrapper'
import {ListrContext as Ctx} from 'listr2/dist/interfaces/listr.interface'
import {prompt} from 'enquirer'
import validator from 'validator'
import {isIPv4} from 'net'

export async function createUserForm(role?: string, task?: TaskWrapper<Ctx, any>) {
  const form = {
    type: 'form',
    message: 'Create a new user:',
    choices: [
      {name: 'name', message: 'Username', required: true},
      {name: 'email', message: 'User\'s email address', required: true},
      {name: 'password', message: 'User\'s password', required: true},
      {name: 'role', message: 'User\'s Role', initial: role, disabled: Boolean(role)},
    ],
    validate: (input: any) => {
      return validator.isAlpha(input.name) && (validator.isFQDN(input.domain) || isIPv4(input.domain)) && validator.isEmail(input.wmEmail)
    },
  }

  const answers = task ? await task.prompt(form) : await prompt(form)
  if (role) {
    answers.role = role
  }
  return answers
}

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
    if (!(flags.username && flags.email && flags.password && flags.role)) {
      await createUserForm()
    }
  }
}
