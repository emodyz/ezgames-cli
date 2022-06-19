import Patch from './base'

export default class Patch004 extends Patch {
  readonly restrictions: string = ''

  readonly version: string = '0.0.14'

  run(env: Record<string, any>): Record<string, any> {
    const patched = env

    patched.BROADCAST_DRIVER = 'pusher'
    patched.CACHE_DRIVER = 'redis'
    patched.QUEUE_CONNECTION = 'redis'
    patched.SESSION_DRIVER = 'redis'

    return patched
  }
}
