import {expect, test} from '@oclif/test'

describe('ssl:sign', () => {
  test
  .stdout()
  .command(['ssl:sign'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['ssl:sign', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
