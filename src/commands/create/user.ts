import {Command, flags} from '@oclif/command'
import {TaskWrapper} from 'listr2/dist/lib/task-wrapper'
import {ListrContext as Ctx} from 'listr2/dist/interfaces/listr.interface'
import {prompt} from 'enquirer'
import validator from 'validator'
import {phpArtisan} from '../../core/docker/php/artisan'

export async function createUserForm(role = 'default', task?: TaskWrapper<Ctx, any>) {
  const form = {
    type: 'form',
    message: 'Create a new user:',
    name: 'user',
    choices: [
      {name: 'username', message: 'User\'s name', required: false},
      {name: 'email', message: 'User\'s email address', required: false},
      {name: 'password', message: 'User\'s password', required: false},
      {name: 'role', message: 'User\'s Role', initial: role, disabled: Boolean(role)},
    ],
    validate: (input: any) => {
      return validator.isAscii(input.username) && validator.isEmail(input.email)
    },
  }

  const answers = task ? await task.prompt(form) : await prompt(form)

  return task ? answers : answers.user
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
    let answers: any = flags
    if (!(flags.username && flags.email && flags.password && flags.role)) {
      answers = await createUserForm('')
    }

    await phpArtisan(`create:user ${answers.username} ${answers.email} ${answers.password} ${answers.role}`, true, true)
  }
}
