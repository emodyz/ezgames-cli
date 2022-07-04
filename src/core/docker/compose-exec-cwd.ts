import execa, {ExecaChildProcess} from 'execa'
import {getDefaultExecaOptions} from '../defaults'

export function dockerComposeExecCwd(target: string, cmd: string, tty = false, containerCwd = '/var/www/app', execaOptions?: execa.Options): ExecaChildProcess  {
  execaOptions = Object.assign({}, getDefaultExecaOptions(), execaOptions)

  return execa.command(`docker compose exec ${tty ? '-T' : ''} -w ${containerCwd} ${target} ${cmd}`, execaOptions)
}
