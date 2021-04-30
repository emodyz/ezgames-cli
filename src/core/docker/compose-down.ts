import execa, {ExecaChildProcess} from 'execa'
import {getDefaultExecaOptions} from '../defaults'

export function dockerComposeDown(execaOptions?: execa.Options): ExecaChildProcess {
  execaOptions = Object.assign({}, getDefaultExecaOptions(), execaOptions)

  return execa('docker-compose', ['down'], execaOptions)
}
