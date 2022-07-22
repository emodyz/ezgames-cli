import {Hook} from '@oclif/config'

const hook: Hook<'update'> = async function (opts) {
  // @ts-ignore
  process.stdout.write(`example hook running ${opts.id}\n`)
}

export default hook
