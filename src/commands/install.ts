import {Command, flags as flgs} from '@oclif/command'
import {where} from '../core/node-sys'
import {
  Listr,
  ListrContext as Ctx,
} from 'listr2'
import cli from 'cli-ux'
import execa from 'execa'
import collect, {Collection} from 'collect.js'
import {TaskWrapper} from 'listr2/dist/lib/task-wrapper'
import GitHub from '../core/github'
import {EZG_APP_PATH, EZG_DATA_PATH} from '../core/consts'
import fs from 'fs-extra'
import moment from 'moment/moment'

export default class Install extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flgs.help({char: 'h'}),
    release: flgs.string(),
  }

  static allReleases: Collection<any>

  async run() {
    Install.flags = {
      help: flgs.help({char: 'h'}),
      release: flgs.string({options: (await Install.getVersions()).availableVersions}),
    }

    const {flags} = this.parse(Install)
    let requestedReleaseTag = flags.release

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
          title: 'EZGames Installer',
          task: (ctx, task): Listr =>
            task.newListr([
              {
                title: 'Choose a Version',
                enabled: (): boolean => !requestedReleaseTag,
                task: async (ctx, task: any): Promise<void> => {
                  // TODO: Waiting on this pr https://github.com/enquirer/enquirer/pull/307
                  requestedReleaseTag = await this.chooseVersion(task)
                },
              },
              {
                title: 'Setting up EZGames...',
                enabled: (): boolean => Boolean(requestedReleaseTag),
                task: (ctx, task): Listr =>
                  task.newListr([
                    {
                      title: `Downloading EZGames (${requestedReleaseTag})`,
                      task: async () => {
                        await fs.ensureDir(EZG_DATA_PATH)
                        return execa('git', ['clone', '--progress', '-b', `${requestedReleaseTag}`, '--depth', '1', 'git@github.com:emodyz/MultigamingPanel.git', `${EZG_APP_PATH}`]).stderr
                      },
                    },
                  ]),
              },
            ], {concurrent: false}),
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
    } catch (error) {
      // it will collect all the errors encountered if { exitOnError: false } is set as an option but will not throw them
      // elsewise it will throw the first error encountered as expected
      console.error(error)
    }
  }

  async chooseVersion(task: TaskWrapper<Ctx, any>): Promise<string> {
    const choice = await task.prompt<string>(
      // @ts-ignore
      {
        type: 'Select',
        choices: (await Install.getVersions()).choices,
        message: 'Choose the version of EZGames you wish to install: ',
        result() {
          // @ts-ignore
          return this.focused.value
        },
      })

    if (choice === 'other') {
      return this.chooseOtherVersion(task)
    }

    return choice
  }

  async chooseOtherVersion(task: TaskWrapper<Ctx, any>): Promise<string> {
    const choice = await task.prompt<string>(
      // @ts-ignore
      {
        type: 'Select',
        choices: Install.allReleases.map(item => {
          return {
            name: item.tag_name,
            message: `${item.tag_name} (${moment(item.published_at).format('MMM Do YY')})`,
          }
        })
        .push({
          name: 'back',
          message: 'Go Back',
        })
        .all(),
        message: 'Choose the version of EZGames you wish to install: ',
      })

    if (choice === 'back') {
      return this.chooseVersion(task)
    }

    return choice
  }

  static async getVersions(): Promise<{ availableVersions: Array<string> | undefined; choices: Array<Record<string, string | null>>}> {
    const latestRelease = (await GitHub.requestWithAuth('GET /repos/{owner}/{repo}/releases/latest', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data

    Install.allReleases = collect((await GitHub.requestWithAuth('GET /repos/{owner}/{repo}/releases', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data)

    const latestPreRelease = Install.allReleases.filter((item: any) => item.prerelease).first()

    return {
      availableVersions: Install.allReleases.map(item => item.tag_name).all(),
      choices: [
        {
          name: 'stable',
          message: `Stable (${latestRelease.tag_name})`,
          value: latestRelease.tag_name,
        },
        {
          name: 'preRelease',
          message: `Pre-release (${latestPreRelease.tag_name})`,
          value: latestPreRelease.tag_name,
        },
        {
          name: 'dev',
          message: 'Development',
          value: 'dev',
        },
        {
          name: 'showAll',
          message: 'Show all versions',
          value: 'other',
        },
      ],
    }
  }
}
