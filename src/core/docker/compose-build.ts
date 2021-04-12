import execa, {ExecaChildProcess} from 'execa'

export function dockerComposeBuild(cwd = process.cwd(), env = process.env): ExecaChildProcess {
  return execa('docker-compose', ['build', '--no-cache'], {cwd: cwd, env: env, windowsHide: true, shell: true, stdio: 'inherit'})
}
