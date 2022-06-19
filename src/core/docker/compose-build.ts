import execa, {ExecaChildProcess} from 'execa'
import {getDefaultExecaOptions} from '../defaults'

export function dockerComposeBuild(execaOptions?: execa.Options): ExecaChildProcess {
  execaOptions = Object.assign({}, getDefaultExecaOptions(), execaOptions)

  return execa('docker compose', ['build'/* , '--no-cache' */], execaOptions)
}
