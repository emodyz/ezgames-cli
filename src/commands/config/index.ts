import {Command, flags} from '@oclif/command'
import {prompt} from 'enquirer'
import validator from 'validator'
import {TaskWrapper} from 'listr2/dist/lib/task-wrapper'
import {ListrContext as Ctx} from 'listr2/dist/interfaces/listr.interface'
import {isIPv4} from 'net'
import {saveEnv} from '../../core/env'

export async function configureAppForm(task?: TaskWrapper<Ctx, any>) {
  const form =
    {
      type: 'form',
      message: 'Please provide the following information:',
      choices: [
        {name: 'name', message: 'Community Name'},
        {name: 'wmEmail', message: 'WebMaster\'s email address'},
        {name: 'domain', message: 'Domain Name (Recommended) or IPv4'},
      ],
      validate: (input: any) => {
        return validator.isAlpha(input.name) && (validator.isFQDN(input.domain) || isIPv4(input.domain)) && validator.isEmail(input.wmEmail)
      },
    }

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Community Name',
      required: true,
      validate: (input: string) => {
        return validator.isAlpha(input)
      },
    },
    {
      type: 'input',
      name: 'wmEmail',
      message: 'WebMaster\'s email address',
      required: true,
      validate: (input: string) => {
        return validator.isEmail(input)
      },
    },
    {
      type: 'input',
      name: 'domain',
      message: 'Domain Name (Recommended) or IPv4',
      required: true,
      validate: (input: string) => {
        return validator.isFQDN(input) || isIPv4(input)
      },
    },
  ]

  return task ? task.prompt(form) : prompt(questions)
}

export default class ConfigIndex extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'Community Name'}),
    domain: flags.string({char: 'd', description: 'Domain Name or IPv4'}),
    email: flags.string({char: 'm', description: 'WebMaster\'s email address'}),
  }

  async run() {
    const {flags} = this.parse(ConfigIndex)
    if (flags.domain && flags.name && flags.email) {
      return saveEnv({name: flags.name, domain: flags.domain, wmEmail: flags.email})
    }
    saveEnv(await configureAppForm())
  }
}
