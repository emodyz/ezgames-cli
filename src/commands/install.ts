import {Command, flags as flgs} from '@oclif/command'
import {where, packager, SYS_COMMANDS} from '../core/node-sys'
import {
  Listr,
  ListrContext as Ctx,
} from 'listr2'
import cli from 'cli-ux'
import execa from 'execa'
import collect, {Collection} from 'collect.js'
import {TaskWrapper} from 'listr2/dist/lib/task-wrapper'
import GitHub from '../core/github'
import {EZG_APP_PATH} from '../core/consts'
import moment from 'moment/moment'
import chalk from 'chalk'
import fs from 'fs-extra'

export default class Install extends Command {
  static description = chalk`{magenta.bold EZGames} {cyan Installer}`

  static flags = {
    help: flgs.help({char: 'h', description: chalk`{cyan show CLI} {green.bold help}`}),
    release: flgs.string({char: 'r', description: chalk`{cyan GitHub Release} {green.bold Tag}`}),
  }

  static allReleases: Collection<any>

  async run() {
    Install.flags.release = flgs.string({
      options: (await Install.getVersions()).availableVersions,
      char: 'r', description: chalk`{cyan GitHub Release} {green.bold Tag}`,
    })

    const {flags} = this.parse(Install)
    let requestedReleaseTag = flags.release

    try {
      const pkgManager = packager()

      const hasPkgM = Boolean(where(pkgManager.command))

      let hasDeps = false
      let hasGit = Boolean(where('git'))
      let hasDocker = Boolean(where('docker'))
      const hasDockerCompose = Boolean(where('docker-compose'))

      if (!(fs.readdirSync(EZG_APP_PATH).length <= 1)) {
        throw new Error(chalk`{bgRed.white.bold EZGames has already been installed in: "${EZG_APP_PATH}"}`)
      }

      const tasks = new Listr<Ctx>(
        [
          {
            title: 'Required Dependencies',
            enabled: (): boolean => hasPkgM,
            task: (ctx, task): Listr =>
              task.newListr([
                {
                  title: 'Git',
                  task: async (): Promise<any> => {
                    if (!hasGit) {
                      // await installer('git', task.output)
                      // hasGit = true
                      throw new Error(chalk`{yellow.bold Could not find Git on this system.}
{cyan.bold Please run:} {green.bold ${SYS_COMMANDS[pkgManager.command]} git}
{bgRed.white.bold Before restarting the installer}`)
                    }
                    hasGit = Boolean(where('git'))
                  },
                },
                {
                  title: 'Docker Engine',
                  enabled: hasGit,
                  task: async (): Promise<any> => {
                    if (!hasDocker) {
                      throw new Error(chalk`{yellow.bold Could not find Docker on this system.}
{cyan.bold Please run:} {green.bold ${SYS_COMMANDS[pkgManager.command]} docker}
{bgRed.white.bold Before restarting the installer}`)
                    }
                    hasDocker = Boolean(where('git'))
                  },
                },
                {
                  title: 'Docker Compose',
                  enabled: hasDocker,
                  task: async (): Promise<any> => {
                    if (!hasDockerCompose) {
                      await cli.wait(1000)
                      throw new Error(chalk`{yellow.bold Could not find docker-compose on this system.}
{cyan.bold Please run:} {green.bold ${SYS_COMMANDS[pkgManager.command]} docker-compose}
{bgRed.white.bold Before restarting the installer}`)
                    }
                    hasDeps = true
                  },
                },
              ]),
          },
          {
            title: 'EZGames Installer',
            enabled: (): boolean => hasDeps,
            task: (_, task): Listr =>
              task.newListr([
                {
                  title: 'Choose a Version',
                  enabled: (): boolean => !requestedReleaseTag,
                  task: async (_, task: any): Promise<void> => {
                    // TODO: Waiting on this pr https://github.com/enquirer/enquirer/pull/307
                    requestedReleaseTag = await this.chooseVersion(task)
                  },
                },
                {
                  title: 'Setting up EZGames...',
                  enabled: (): boolean => Boolean(requestedReleaseTag),
                  task: (_, task): Listr =>
                    task.newListr([
                      {
                        title: `Downloading EZGames (${requestedReleaseTag})`,
                        task: async () => {
                          return execa('git', ['clone', '--progress', '-b', `${requestedReleaseTag}`, '--depth', '1', 'https://github.com/emodyz/MultigamingPanel.git', `${EZG_APP_PATH}`]).stderr
                        },
                      },
                      {
                        title: `Configuring EZGames (${requestedReleaseTag})`,
                        task: async (_, task: any) => {
                          await this.configureApp(task)
                        },
                      },
                    ], {concurrent: false}),
                },
              ], {concurrent: false}),
          },
        ],
        {concurrent: false},
      )

      await tasks.run()
    } catch (error) {
      this.error(error)
      // it will collect all the errors encountered if { exitOnError: false } is set as an option but will not throw them
      // elsewise it will throw the first error encountered as expected
      // this.error(error)
    }
  }

  async configureApp(task: TaskWrapper<Ctx, any>) {
    const community: Record<any, any> = await task.prompt<Record<any, any>>(
      {
        type: 'Form',
        message: 'Please provide the following information:',
        choices: [
          {name: 'name', message: 'Community Name', initial: 'Emodyz'},
          {name: 'domain', message: 'Domain Name', initial: 'ezg.emodyz.eu'},
        ],
      })

    if (community.name === 'Emodyz' || community.domain === 'ezg.emodyz.eu') {
      throw new Error('Please answer the question.')
    }
    return {
      community,
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

  static async getVersions(): Promise<{ availableVersions: Array<string> | undefined; choices: Array<Record<string, string | null>> }> {
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
