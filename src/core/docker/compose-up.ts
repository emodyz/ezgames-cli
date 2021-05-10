import execa, {ExecaChildProcess} from 'execa'
import {getDefaultExecaOptions} from '../defaults'

// TODO: Block Startup IF env version !== env example version & prompt to execute config command. ie: Upgrade of both the dashboard & cli
export function dockerComposeUp(execaOptions?: execa.Options): ExecaChildProcess {
  execaOptions = Object.assign({}, getDefaultExecaOptions(), execaOptions)

  return execa('docker-compose', ['up', '-d'], execaOptions)
}

export function dockerComposeLog(execaOptions?: execa.Options): ExecaChildProcess  {
  execaOptions = Object.assign({}, getDefaultExecaOptions(), execaOptions)
  return execa('docker-compose', ['logs', '-f', '-t'], execaOptions)
}
