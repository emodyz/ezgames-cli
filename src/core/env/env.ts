import {parse as parseEnv, stringify as stringifyEnv} from 'envfile'
import {readFileSync, writeFile} from 'fs-extra'
import {EZG_APP_ENV_EXAMPLE_PATH, EZG_APP_ENV_PATH} from '../paths'
import validator from 'validator'
import {randomBytes} from 'crypto'
import {Range as SemverRange} from 'semver'
import EnvUpdater from './updater/updater'
import {getGitInfo} from '../git'
import {writeFileSync} from 'fs'

export function getAppEnv(example = false): any {
  return parseEnv(readFileSync(example ? EZG_APP_ENV_EXAMPLE_PATH : EZG_APP_ENV_PATH, 'utf-8'))
}

export async function saveFullConfigToEnv(answers: { name: string; domain: string; wmEmail: string}) {
  const env = getAppEnv(true)

  const isDomain = validator.isFQDN(answers.domain)

  env.APP_NAME = `"EZGames | ${answers.name}"`
  env.APP_DEBUG = false
  env.APP_ENV = 'production'
  env.APP_URL = isDomain ? `https://${answers.domain}` : `http://${answers.domain}`

  env.SANCTUM_STATEFUL_DOMAINS = `${answers.domain},localhost,127.0.0.1,127.0.0.1:8000,::1`
  env.SESSION_DOMAIN = answers.domain

  env.DB_USERNAME = 'ezgames'
  env.DB_PASSWORD = randomBytes(20).toString('hex')

  /* TODO: FIND OUT WHY THIS ONLY WORKS AFTER A REBOOT & RESET
  * env.PUSHER_APP_KEY = randomBytes(16).toString('hex')
  */
  env.EZG_HOST = answers.domain
  env.EZG_WM_EMAIL = answers.wmEmail
  env.EZG_NGINX_SHOULD_PUBLISH_TEMPLATES = '.template'

  // READ BY NGINX CONF
  env.EZG_NGINX_HOST = answers.domain

  env.LARAVEL_WEBSOCKETS_VERIFY_PEER = false

  if (!isDomain) {
    delete env.LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT
    delete env.LARAVEL_WEBSOCKETS_SSL_LOCAL_PK
    delete env.LARAVEL_WEBSOCKETS_SSL_PASSPHRASE
    delete env.LARAVEL_WEBSOCKETS_CA_FILE
    // READ BY NGINX CONF
    env.EZG_NGINX_HOST = '_'
  }

  env.MAIL_FROM_ADDRESS = `"${answers.wmEmail}"`
  env.MAIL_FROM_NAME = `"${answers.name}"`

  /**
   * ⚠️ This is necessary to prevent volume collisions between installs
   */
  env.COMPOSE_PROJECT_NAME = `ezgames_${Date.now()}`

  const gitInfo = await getGitInfo()

  const patcher = new EnvUpdater('base', gitInfo.current)
  const patched = await patcher.patch(env)

  await writeFile(EZG_APP_ENV_PATH, stringifyEnv(patched))
}

export async function savePatchedEnv(currentVersion: string, targetVersion: string) {
  const env = getAppEnv()

  const patcher = new EnvUpdater(currentVersion, targetVersion)
  const patched = await patcher.patch(env)

  await writeFile(EZG_APP_ENV_PATH, stringifyEnv(patched))
}

// TODO: allow the edition of multiple key-value pairs with only two I/O ops
export function saveKeyToEnv(key: string, value: string | number) {
  const env = getAppEnv()

  env[key] = value

  writeFileSync(EZG_APP_ENV_PATH, stringifyEnv(env))
}

// See readme for semver.satisfies() at https://www.npmjs.com/package/semver
export const supportedVersions: SemverRange = new SemverRange('0.x >= 0.0.1 <= 0.0.5')
