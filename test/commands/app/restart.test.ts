import {expect, test} from '@oclif/test'

describe('app:restart', () => {
  test
  .stdout()
  .command(['app:restart'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['app:restart', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
