import execa, {ExecaChildProcess} from 'execa'
import {execaDefaultOptions} from '../defaults'

export function dockerComposeBuild(execaOptions?: execa.Options): ExecaChildProcess {
  execaOptions = Object.assign({}, execaDefaultOptions, execaOptions)

  return execa('docker-compose', ['build'/* , '--no-cache' */], execaOptions)
}
