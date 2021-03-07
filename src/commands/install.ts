import {Command, flags} from '@oclif/command'
import {where} from '../node-sys'
import {Listr, ListrContext as Ctx} from 'listr2'
import {request as gitHubRequest} from '@octokit/request'
import cli from 'cli-ux'
import execa from 'execa'
import collect from 'collect.js'

export default class Install extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    release: flags.string(/* {options: Install.getVersions()} */),
  }

  async run() {
    const {flags} = this.parse(Install)
    const releaseFlag = flags.release
    let requestedRelease: any
    /*
    if (!stage) {
      stage = await this.chooseVersion()
    }
    this.log(`the stage is: ${stage}`) */

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
                  if (!hasGit) {
                    await cli.wait(1000)
                  }
                },
              },
              {
                title: 'Docker',
                task: async (): Promise<void> => {
                  const hasDocker = where('docker')
                  if (!hasDocker) {
                    await cli.wait(1000)
                  }
                },
              },
              {
                title: 'Docker Compose',
                task: async (): Promise<void> => {
                  const hasDockerCompose = where('docker-compose')
                  if (!hasDockerCompose) {
                    await cli.wait(1000)
                  }
                },
              },
            ]),
        },
        {
          title: 'Install EZGames',
          task: (ctx, task): Listr =>
            task.newListr([
              {
                title: 'Choose a Version',
                enabled: (): boolean => !releaseFlag,
                task: async (ctx, task): Promise<void> => {
                  // TODO: use the enquirer package instead of the one integrated in listr2
                  // @ts-ignore
                  requestedRelease = await task.prompt<string>({type: 'Select', choices: await Install.getVersions(), message: 'Choose the version of EZGames you wish to install: ', result() {
                    // @ts-ignore
                    return this.focused.value
                  }})
                },
              },
              {
                title: 'Setting up EZGames (2.0.0-beta.3)...',
                enabled: (): boolean => Boolean(releaseFlag),
                task: async (): Promise<void> => {
                  await cli.wait(3000)
                },
              },
            ]),
        },
        {
          title: 'Git Status',
          enabled: () => false,
          task: async () => {
            const {stdout} = await execa('git', ['status', '--porcelain'])
            this.log(stdout)
          },
        },
      ],
      {concurrent: false}
    )

    try {
      await tasks.run()
      console.log(requestedRelease)
    } catch (error) {
      // it will collect all the errors encountered if { exitOnError: false } is set as an option but will not throw them
      // elsewise it will throw the first error encountered as expected
      console.error(error)
    }
  }

  /*
  async chooseVersion():Promise<string> {

  } */

  static async getVersions(): Promise<Array<Record<string, string | null>>> {
    const latestRelease = (await gitHubRequest('GET /repos/{owner}/{repo}/releases/latest', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data

    const allReleases = collect((await gitHubRequest('GET /repos/{owner}/{repo}/releases', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data)

    const latestPreRelease = allReleases.filter((item: any) => item.prerelease).first()

    return [
      {
        name: 'dev',
        message: 'Development',
        value: 'dev',
      },
      {
        name: 'preRelease',
        message: `Pre-release (${latestPreRelease.tag_name})`,
        value: latestPreRelease.tag_name,
      },
      {
        name: 'stable',
        message: `Stable (${latestRelease.tag_name})`,
        value: latestPreRelease.tag_name,
      },
      {
        name: 'showAll',
        message: 'Show all versions',
        value: null,
      },
    ]

    // return ['Development', `Pre-release (${latestPreRelease.tag_name})`, `Stable (${latestRelease.tag_name})`, 'Show all versions']
  }
}
