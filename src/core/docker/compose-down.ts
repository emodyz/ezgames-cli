import execa, {ExecaChildProcess} from 'execa'

export function dockerComposeDown(cwd = process.cwd(), env = process.env, stdio = false): ExecaChildProcess {
  return execa('docker-compose', ['down'], {cwd: cwd, env: env, windowsHide: true, shell: true, stdio: stdio ? 'inherit' : 'pipe'})
}
