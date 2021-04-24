import {Command, flags} from '@oclif/command'
import {EZG_APP_PATH} from '../core/paths'
import {getAppEnv} from '../core/env'
import {dockerComposeExec} from '../core/docker/compose-exec'
import {Listr, ListrContext as Ctx} from 'listr2'
import {createUserForm} from './create/user'
import {phpArtisan} from '../core/docker/php/artisan'
// import execa from 'execa'
// import * as readline from 'readline'

export default class Test extends Command {
  static description = 'Dummy Command used to test features'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    // await dockerComposeExec('php', 'yarn run production', EZG_APP_PATH, getAppEnv(), false, true)

    const tasks = new Listr<Ctx>(
      [
        {
          title: 'This task will execute.',
          options: {persistentOutput: true},
          task: async (ctx, task): Promise<any> => {
            const answers = await createUserForm('owner', task)
            await phpArtisan(`create:user ${answers.username} ${answers.email} ${answers.password} ${answers.role}`, false, true)
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
  }
}
