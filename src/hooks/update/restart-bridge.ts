import {Hook} from '@oclif/config'

const hook: Hook<'update'> = async function (opts) {
  // @ts-ignore
  process.stdout.write(`example postupdate hook running ${opts.id}\n`)
}

export default hook
