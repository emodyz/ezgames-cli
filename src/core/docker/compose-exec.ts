import execa, {ExecaChildProcess} from 'execa'
import {getDefaultExecaOptions} from '../defaults'

export function dockerComposeExec(target: string, cmd: string, tty = false, execaOptions?: execa.Options): ExecaChildProcess  {
  execaOptions = Object.assign({}, getDefaultExecaOptions(), execaOptions)

  return execa.command(`docker compose exec ${tty ? '-T' : ''}  ${target} ${cmd}`, execaOptions)
}
