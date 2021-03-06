import {dockerComposeExec} from '../compose-exec'
import {stdIo} from '../../../types/execa.d'

export function phpArtisan(cmd: string, tty = true, stdio: stdIo = 'pipe') {
  return dockerComposeExec('php', `php artisan ${cmd}`, tty, {stdio: stdio})
}
