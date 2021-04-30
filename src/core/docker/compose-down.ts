import execa, {ExecaChildProcess} from 'execa'
import {execaDefaultOptions} from '../defaults'

export function dockerComposeDown(execaOptions?: execa.Options): ExecaChildProcess {
  execaOptions = Object.assign({}, execaDefaultOptions, execaOptions)

  return execa('docker-compose', ['down'], execaOptions)
}
