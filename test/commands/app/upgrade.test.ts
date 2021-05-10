import {expect, test} from '@oclif/test'

describe('app:upgrade', () => {
  test
  .stdout()
  .command(['app:upgrade'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['app:upgrade', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
