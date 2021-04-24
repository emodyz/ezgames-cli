import {dockerComposeExec} from '../compose-exec'
import {EZG_APP_PATH} from '../../paths'
import {getAppEnv} from '../../env'

export function phpArtisan(cmd: string, stdio = false, tty = false) {
  return dockerComposeExec('php', `php artisan ${cmd}`, EZG_APP_PATH, getAppEnv(), stdio, tty)
}
