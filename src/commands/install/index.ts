import {Command, flags as flgs} from '@oclif/command'
import {where, packager, SYS_COMMANDS} from '../../core/node-sys'
import {
  Listr,
  ListrContext as Ctx,
} from 'listr2'
import cli from 'cli-ux'
import execa from 'execa'
import collect, {Collection} from 'collect.js'
import {TaskWrapper} from 'listr2/dist/lib/task-wrapper'
import GitHub from '../../core/github'
import {EZG_APP_PATH} from '../../core/paths'
import moment from 'moment/moment'
import chalk from 'chalk'
import fs from 'fs-extra'
import {configureAppForm} from '../config'
import {tick as checkMark} from 'figures'
import {dockerComposeLog, dockerComposeUp} from '../../core/docker/compose-up'
import {getAppEnv, saveEnv} from '../../core/env'
import {dockerComposeBuild} from '../../core/docker/compose-build'
import {waitForHealthyApp} from '../../core/api/status'
import {dockerComposeExec} from '../../core/docker/compose-exec'
import BuildFront from '../build/front'

export default class InstallIndex extends Command {
  static description = chalk`{magenta.bold EZGames} {cyan Installer}`

  static flags = {
    help: flgs.help({char: 'h', description: chalk`{cyan show CLI} {green.bold help}`}),
    release: flgs.string({char: 'r', description: chalk`{cyan GitHub Release} {green.bold Tag}`}),
  }

  static allReleases: Collection<any>

  async run() {
    InstallIndex.flags.release = flgs.string({
      options: (await InstallIndex.getVersions()).availableVersions,
      char: 'r', description: chalk`{cyan GitHub Release} {green.bold Tag}`,
    })

    const {flags} = this.parse(InstallIndex)
    let requestedReleaseTag = flags.release

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
          task: (ctx, task): Listr =>
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
                title: 'Downloading EZGames ...',
                enabled: (): boolean => Boolean(requestedReleaseTag),
                task: async (_, task) => {
                  task.title = `Downloading EZGames (${requestedReleaseTag})...`
                  return execa('git', ['clone', '--progress', '-b', `${requestedReleaseTag}`, '--depth', '1', 'https://github.com/emodyz/MultigamingPanel.git', `${EZG_APP_PATH}`]).stderr
                },
              },
              {
                title: 'Configuring EZGames ...',
                enabled: (): boolean => Boolean(requestedReleaseTag),
                task: async (_, task: any) => {
                  task.title = `Configuring EZGames (${requestedReleaseTag})...`

                  saveEnv(await configureAppForm(task))

                  ctx.isConfigSuccessful = true
                },
              },
            ], {concurrent: false}),
        },
        {
          title: 'Building Infrastructure... (This will take a few minutes)',
          enabled: ctx => Boolean(ctx.isConfigSuccessful),
          task: async ctx => {
            await dockerComposeBuild(EZG_APP_PATH, getAppEnv())
            ctx.isBuildSuccessful = true
          },
        },
        {
          title: 'Starting EZGames... (This will take a few minutes)',
          enabled: ctx => Boolean(ctx.isBuildSuccessful),
          task: async ctx => {
            await dockerComposeUp(EZG_APP_PATH, getAppEnv())
            // TODO: Maybe increase the retry limit instead
            await cli.wait(180000)
            await waitForHealthyApp()
            await BuildFront.build()
            ctx.isStartUpSuccessful = true
          },
        },
        {
          title: 'Create your administrative account',
          enabled: ctx => Boolean(ctx.isStartUpSuccessful),
          task: async ctx => {
            await cli.wait(3000)
            ctx.isInstallSuccessful = true
          },
        },
      ],
      {concurrent: false},
    )

    await tasks.run()
    this.log(' ')
    this.log(chalk.cyan`{green ${checkMark}} {cyan.bold EZGames} {green ${requestedReleaseTag}} is now {green.bold available} at {cyan.bold.underline ${getAppEnv().APP_URL}}`)
  }

  async chooseVersion(task: TaskWrapper<Ctx, any>): Promise<string> {
    const choice = await task.prompt<string>(
      // @ts-ignore
      {
        type: 'Select',
        choices: (await InstallIndex.getVersions()).choices,
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
        choices: InstallIndex.allReleases.map(item => {
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

    InstallIndex.allReleases = collect((await GitHub.requestWithAuth('GET /repos/{owner}/{repo}/releases', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data)

    const latestPreRelease = InstallIndex.allReleases.filter((item: any) => item.prerelease).first()

    return {
      availableVersions: InstallIndex.allReleases.map(item => item.tag_name).all(),
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
          name: '77',
          message: 'Feature #77 | Docker is coming 🏴‍☠️',
          value: 'feature/77',
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
