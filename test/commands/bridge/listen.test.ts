import {expect, test} from '@oclif/test'

describe('bridge:listen', () => {
  test
  .stdout()
  .command(['bridge:listen'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['bridge:listen', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
