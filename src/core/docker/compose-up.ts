import execa, {ExecaChildProcess} from 'execa'
import {execaDefaultOptions} from '../defaults'

export function dockerComposeUp(execaOptions?: execa.Options): ExecaChildProcess {
  execaOptions = Object.assign({}, execaDefaultOptions, execaOptions)

  return execa('docker-compose', ['up', '-d'], execaOptions)
}

export function dockerComposeLog(execaOptions?: execa.Options): ExecaChildProcess  {
  execaOptions = Object.assign({}, execaDefaultOptions, execaOptions)
  return execa('docker-compose', ['logs', '-f', '-t'], execaOptions)
}
