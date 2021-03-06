import Patch from './base'
import {randomBytes} from 'node:crypto'

export default class Patch004 extends Patch {
  readonly restrictions: string = ''

  readonly version: string = '0.0.3'

  run(env: Record<string, any>): Record<string, any> {
    const patched = env

    patched.EZG_UPDATER_TEST = randomBytes(20).toString('hex')

    return patched
  }
}
