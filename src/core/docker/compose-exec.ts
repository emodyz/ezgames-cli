import execa, {ExecaChildProcess} from 'execa'
import {execaDefaultOptions} from '../defaults'

export function dockerComposeExec(target: string, cmd: string, tty = false, execaOptions?: execa.Options): ExecaChildProcess  {
  execaOptions = Object.assign({}, execaDefaultOptions, execaOptions)

  return execa.command(`docker-compose exec ${tty ? '-T' : ''}  ${target} "${cmd}"`, execaOptions)
}
