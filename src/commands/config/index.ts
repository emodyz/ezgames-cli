import {Command, flags} from '@oclif/command'
import {EZG_APP_ENV_EXAMPLE_PATH, EZG_APP_ENV_PATH} from '../../core/consts'
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

export async function configureApp(task?: TaskWrapper<Ctx, any>) {
  const forms = [
    {
      type: 'form',
      message: 'Please provide the following information:',
      choices: [
        {name: 'name', message: 'Community Name'},
        {name: 'domain', message: 'Domain Name (Recommended) or IPv4'},
      ],
      validate: (input: any) => {
        return validator.isAlpha(input.name) && (validator.isFQDN(input.domain) || isIPv4(input.domain))
      },
    },

  ]

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Community Name',
      required: true,
      initial: '',
      validate: (input: string) => {
        return validator.isAlpha(input)
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
  // @ts-ignore
  return task ? task.prompt(forms) : prompt(questions)
}

export function saveEnv(answer: { name: string; domain: string}) {
  const env = getAppEnv()

  env.APP_NAME = `"EZGames | ${answer.name}"`
  env.APP_DEBUG = false
  env.APP_ENV = 'production'
  env.APP_URL = validator.isFQDN(answer.domain) ? `https://${answer.domain}` : `http://${answer.domain}`

  env.SANCTUM_STATEFUL_DOMAINS = `${answer.domain},localhost,127.0.0.1,127.0.0.1:8000,::1`
  env.SESSION_DOMAIN = answer.domain

  env.DB_DATABASE = 'ezg.db'
  env.DB_PASSWORD = randomBytes(20).toString('hex')

  writeFileSync(EZG_APP_ENV_PATH, stringifyEnv(env))
}

export default class ConfigIndex extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    console.log(await configureApp())
  }
}
