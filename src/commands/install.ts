import {Command, flags} from '@oclif/command'
import { installer, where } from '../node-sys'
import {Listr, ListrContext as Ctx} from 'listr2'
import delay from 'delay'
import execa from 'execa'

export default class Install extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    stage: flags.string({options: Install.getVersions()})
  }

  async run() {

    const {flags} = this.parse(Install)
    let stage = flags.stage
    /*
    if (!stage) {
      stage = await this.chooseVersion()
    }
    this.log(`the stage is: ${stage}`)*/

    const tasks = new Listr<Ctx>(
      [
        {
          title: 'Required Dependencies',
          task: (ctx, task): Listr =>
            task.newListr([
              {
                title: 'Git',
                task: async (): Promise<void> => {
                  const hasGit = where('git')
                  if (hasGit) {
                    await delay(1000)
                  }
                }
              },
              {
                title: 'Docker',
                task: async (): Promise<void> => {
                  const hasDocker = where('docker')
                  if (hasDocker) {
                    await delay(1000)
                  }
                }
              },
              {
                title: 'Docker Compose',
                task: async (): Promise<void> => {
                  const hasDockerCompose = where('docker-compose')
                  if (hasDockerCompose) {
                    await delay(1000)
                  }
                }
              }
            ])
        },
        {
          title: 'Install EZGames',
          task: (ctx, task): Listr =>
            task.newListr([
              {
                title: 'Choose a Version',
                enabled: (): boolean => !stage,
                task: async (ctx, task): Promise<void> => {
                  stage = await task.prompt<string>({ type: 'Select', choices: Install.getVersions(), message: 'Choose the version of EZGames you wish to install: ' })
                }
              },
              {
                title: 'Setting up EZGames (2.0.0-beta.3)...',
                enabled: (): boolean => !!stage,
                task: async (ctx, task): Promise<void> => {
                  await delay(3000)
                }
              },
            ])
        },
        {
          title: 'Git Status',
          enabled: () => false,
          task: async () => {
            const {stdout} = await execa('git', ['status', '--porcelain'])
          }
        }
      ],
      { concurrent: false }
    )

    try {
      await tasks.run()
    } catch (e) {
      // it will collect all the errors encountered if { exitOnError: false } is set as an option but will not throw them
      // elsewise it will throw the first error encountered as expected
      console.error(e)
    }
  }

  /*
  async chooseVersion():Promise<string> {

  }*/

  static getVersions(): Array<string> {
    return ['Development (2.0.0-beta.3)', 'Stable (1.19.3)']
  }
}
