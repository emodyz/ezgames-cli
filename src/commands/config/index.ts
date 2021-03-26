import {Command, flags} from '@oclif/command'
import {EZG_APP_ENV_EXAMPLE_PATH, EZG_APP_ENV_PATH} from '../../core/paths'
import {prompt} from 'enquirer'
import validator from 'validator'
import {TaskWrapper} from 'listr2/dist/lib/task-wrapper'
import {ListrContext as Ctx} from 'listr2/dist/interfaces/listr.interface'
import {parse as parseEnv, stringify as stringifyEnv} from 'envfile'
import {readFileSync, writeFileSync} from 'fs-extra'
import {isIPv4} from 'net'
import {randomBytes} from 'crypto'

export function getAppEnv(): any {
  return parseEnv(readFileSync(EZG_APP_ENV_EXAMPLE_PATH, 'utf-8'))
}

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

export function saveEnv(answers: { name: string; domain: string; wmEmail: string}) {
  const env = getAppEnv()

  const isDomain = validator.isFQDN(answers.domain)

  env.APP_NAME = `"EZGames | ${answers.name}"`
  env.APP_DEBUG = false
  env.APP_ENV = 'production'
  env.APP_URL = isDomain ? `https://${answers.domain}` : `http://${answers.domain}`

  env.SANCTUM_STATEFUL_DOMAINS = `${answers.domain},localhost,127.0.0.1,127.0.0.1:8000,::1`
  env.SESSION_DOMAIN = answers.domain

  env.DB_PASSWORD = randomBytes(20).toString('hex')

  if (!isDomain) {
    delete env.LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT
    delete env.LARAVEL_WEBSOCKETS_SSL_LOCAL_PK
    delete env.LARAVEL_WEBSOCKETS_SSL_PASSPHRASE
    delete env.LARAVEL_WEBSOCKETS_VERIFY_PEER
  }

  env.MAIL_FROM_ADDRESS = `"${answers.wmEmail}"`
  env.MAIL_FROM_NAME = `"${answers.name}"`

  writeFileSync(EZG_APP_ENV_PATH, stringifyEnv(env))
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
