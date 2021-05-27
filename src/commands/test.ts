import {Command, flags} from '@oclif/command'
import {getGitInfo} from '../core/git'
// import {EZG_APP_PATH} from '../core/paths'
// import {getAppEnv} from '../core/env'
// import {dockerComposeExec} from '../core/docker/compose-exec'
// import {Listr, ListrContext as Ctx} from 'listr2'
// import {createUserForm} from './create/user'
// import {phpArtisan} from '../core/docker/php/artisan'
// import {cli} from 'cli-ux'
// import execa from 'execa'
// import * as readline from 'readline'
import semver from 'semver'
import {supportedVersions} from '../core/env'
import chalk from 'chalk'
import {EZG_APP_PATH} from '../core/paths'

export default class Test extends Command {
  static description = 'Dummy Command used to test features'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    console.log(semver.satisfies('v0.0.1', supportedVersions))
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
