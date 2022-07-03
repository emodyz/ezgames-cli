import {expect, test} from '@oclif/test'

describe('bridge:setup', () => {
  test
  .stdout()
  .command(['bridge:setup'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['bridge:setup', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
