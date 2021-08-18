import {expect, test} from '@oclif/test'

describe('bridge:test', () => {
  test
  .stdout()
  .command(['bridge:test'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['bridge:test', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
