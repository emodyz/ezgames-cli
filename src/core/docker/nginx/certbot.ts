import {dockerComposeExec} from '../compose-exec'
import {stdIo} from '../../../types/execa'
import {getAppEnv} from '../../env/env'

export function requestTLS(tty = true, stdio: stdIo = 'pipe') {
  const env = getAppEnv()
  return  dockerComposeExec('ezgames', `certbot --nginx -d ${env.EZG_HOST} -m ${env.EZG_WM_EMAIL} --agree-tos --no-eff-email --keep-until-expiring`, tty, {stdio: stdio})
}
