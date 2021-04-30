import {dockerComposeExec} from '../compose-exec'
import {stdIo} from '../../../types/execa'

export function requestTLS(cmd: string, tty = false, stdio: stdIo = 'pipe',) {
  return dockerComposeExec('ezgames', `php artisan ${cmd}`, tty, {stdio: stdio})
}
