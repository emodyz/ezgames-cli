import {Command, flags as flgs} from '@oclif/command'
import {where, installer, packager, isWindows} from '../core/node-sys'
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
      let shouldRestartShell = false

      const tasks = new Listr<Ctx>(
        [
          {
            title: 'Package Manager',
            enabled: (): boolean => !hasPkgM,
            task: async (ctx, task): Promise<Listr> => {
              const installChoco = (await task.prompt({
                type: 'confirm',
                name: 'installChoco',
                message: 'Do you wan to install Chocolatey ?',
              })).installChoco
              return task.newListr([
                {
                  title: 'Installing Chocolatey...',
                  enabled: (isWindows && installChoco),
                  task: async () => {
                    const {stderr} = await execa.command('Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://chocolatey.org/install.ps1\'))', {shell: 'powershell'})
                    if (stderr) {
                      return this.error(stderr)
                    }
                    shouldRestartShell = true
                  },
                },
              ])
            },
          },
          {
            title: chalk`{bgRed.white.bold RESTART YOUR SHELL}`,
            enabled: () => shouldRestartShell,
            task: async (): Promise<void> => {
              const {stdout, stderr} = await execa.command('choco -v', {shell: 'powershell'})
              this.log(stdout)
              this.log(chalk`{red.bold ===============================}`)
              this.log(stderr)
            },
          },
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
                      const {stdout, stderr} = await execa.command('choco install git -y', {shell: 'powershell'})
                      if (stderr) {
                        return this.error(stderr)
                      }
                      this.log(stdout)
                      hasGit = true
                    }
                  },
                },
                {
                  title: 'Docker',
                  enabled: hasGit,
                  task: async (): Promise<void> => {
                    const {stdout, stderr} = await execa.command('git --version', {shell: 'powershell'})
                    if (stderr) {
                      return this.error(stderr)
                    }
                    this.log(stdout)
                    if (!hasDocker) {
                      await cli.wait(1000)
                      hasDocker = true
                    }
                  },
                },
                {
                  title: 'Docker Compose',
                  enabled: hasDocker,
                  task: async (): Promise<void> => {
                    if (!hasDockerCompose) {
                      await cli.wait(1000)
                      hasDeps = true
                    }
                  },
                },
              ]),
          },
          {
            title: 'EZGames Installer',
            enabled: (): boolean => hasDeps,
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
                          return execa('git', ['clone', '--progress', '-b', `${requestedReleaseTag}`, '--depth', '1', 'https://github.com/emodyz/MultigamingPanel.git', `${EZG_APP_PATH}`]).stderr
                        },
                      },
                    ]),
                },
              ], {concurrent: false}),
          },
        ],
        {concurrent: false},
      )

      await tasks.run()
    } catch (error) {
      // it will collect all the errors encountered if { exitOnError: false } is set as an option but will not throw them
      // elsewise it will throw the first error encountered as expected
      this.error(error)
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
