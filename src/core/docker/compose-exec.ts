import execa, {ExecaChildProcess} from 'execa'

export function dockerComposeExec(target: string, cmd: string, cwd = process.cwd(), env = process.env, stdio = false): ExecaChildProcess  {
  return execa.command(`docker-compose exec ${target} ${cmd}`, {cwd: cwd, env: env, windowsHide: true, shell: true, stdio: stdio ? 'inherit' : 'pipe'})
}
