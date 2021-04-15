import execa, {ExecaChildProcess} from 'execa'

export function dockerComposeUp(cwd = process.cwd(), env = process.env, stdio = false): ExecaChildProcess {
  return execa('docker-compose', ['up', '-d'], {cwd: cwd, env: env, windowsHide: true, shell: true, stdio: stdio ? 'inherit' : 'pipe'})
}

export function dockerComposeLog(cwd = process.cwd(), env = process.env, stdio = false): ExecaChildProcess  {
  return execa('docker-compose', ['logs', '-f', '-t'], {cwd: cwd, env: env, windowsHide: true, shell: true, stdio: stdio ? 'inherit' : 'pipe'})
}
