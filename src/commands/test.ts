import {Command, flags} from '@oclif/command'
// import EnvUpdater from '../core/env/updater/updater'
// import {collect} from 'collect.js'
// import {getGitInfo} from '../core/git'
// import {getAppEnv} from '../core/env'
// import {dockerComposeExec} from '../core/docker/compose-exec'
// import {Listr, ListrContext as Ctx} from 'listr2'
// import {createUserForm} from './create/user'
// import {phpArtisan} from '../core/docker/php/artisan'
// import {cli} from 'cli-ux'
// import execa from 'execa'
// import * as readline from 'readline'
// import semver from 'semver'
// import {supportedVersions} from '../core/env/env'
// import chalk from 'chalk'
import {EZG_APP_PATH} from '../core/paths'
import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git'

export default class Test extends Command {
  static description = 'Dummy Command used to test features'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const options: Partial<SimpleGitOptions> = {
      baseDir: EZG_APP_PATH,
      binary: 'git',
      maxConcurrentProcesses: 6,
    }

    const git: SimpleGit = simpleGit(options)

    console.log(await git.diffSummary(['tags/v0.0.3',
      'resources',
      'storage',
      'public',
      'package.json',
      'yarn.lock',
      'webpack.mix.js',
      'webpack.config.js',
      'tsconfig.json',
      'tailwind.config.js',
      'tailwind.typography.config.js',
      '.env.example']))
    // const up = new EnvUpdater('0.0.1', '0.0.4')
    // console.log(await up.patch({test: true}))
    // console.log(up.relevantPatches)
    // const source = collect(['../core/foo', '../core/bar'])
    // const {default: str} = await import(source.random().toString())
    // console.log(str)
    // console.log(semver.satisfies('v1.0.1', supportedVersions))
    // console.log(await getGitInfo())
    // await dockerComposeExec('php', 'yarn run production', EZG_APP_PATH, getAppEnv(), false, true)
    /*
    const tasks = new Listr<Ctx>(
      [
        {
          title: 'This task will execute.',
          options: {persistentOutput: true},
          task: async (ctx, task): Promise<any> => {
            const answers = await createUserForm('owner', task)
            task.output = (JSON.stringify(answers))
            await cli.wait(8000)
          },
        },
      ],
      {
        concurrent: false,
        rendererOptions: {
          collapse: false,
        },
      },
    )

    await tasks.run()
    */
  }
}
