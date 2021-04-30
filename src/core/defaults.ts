import execa from 'execa'
import {EZG_APP_PATH} from './paths'
import {getAppEnv} from './env'

export const getDefaultExecaOptions = (): execa.Options => ({
  cwd: EZG_APP_PATH,
  env: getAppEnv(),
  stdio: 'pipe',
  windowsHide: true,
  shell: true,
})
