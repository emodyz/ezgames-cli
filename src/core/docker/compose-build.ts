import execa, {ExecaChildProcess} from 'execa'

// TODO: ReEnable Cashing ???
export function dockerComposeBuild(cwd = process.cwd(), env = process.env, stdio = false): ExecaChildProcess {
  return execa('docker-compose', ['build', '--no-cache'], {cwd: cwd, env: env, windowsHide: true, shell: true, stdio: stdio ? 'inherit' : 'pipe'})
}
