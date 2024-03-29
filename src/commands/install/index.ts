import {Command, flags as flgs} from '@oclif/command'
import {where, packager} from '../../core/node-sys'
import {
  Listr,
  ListrContext as Ctx,
} from 'listr2'
import cli from 'cli-ux'
import execa from 'execa'
import collect, {Collection} from 'collect.js'
import {TaskWrapper} from 'listr2/dist/lib/task-wrapper'
import {gitHubApi} from '../../core/github'
import {EZG_APP_PATH} from '../../core/paths'
import moment from 'moment/moment'
import chalk from 'chalk'
import fs from 'fs-extra'
import {configureAppForm} from '../config'
import {tick as checkMark} from 'figures'
import {dockerComposeUp} from '../../core/docker/compose-up'
import {getAppEnv, saveFullConfigToEnv, saveKeyToEnv, supportedVersions} from '../../core/env/env'
import {dockerComposeBuild} from '../../core/docker/compose-build'
import {waitForHealthyApp} from '../../core/api/status'
import BuildFront from '../build/front'
import {createUserForm} from '../create/user'
import {phpArtisan} from '../../core/docker/php/artisan'
import validator from 'validator'
import {requestTLS} from '../../core/docker/nginx/certbot'
import semver from 'semver/preload'
import {InstallerErrors} from '../../core/errors/installer'
import EzgAlreadyInstalledError = InstallerErrors.EzgAlreadyInstalledError
import GitNotFoundError = InstallerErrors.GitNotFoundError
import DockerEngineNotFoundError = InstallerErrors.DockerEngineNotFoundError
import DockerComposeNotFoundError = InstallerErrors.DockerComposeNotFoundError
import EzgNoSupportedVersionAvailableError = InstallerErrors.EzgNoSupportedVersionAvailableError
import BridgeSetup from '../bridge/setup'
import BridgeStart from '../bridge/start'
import {getDefaultExecaOptions} from '../../core/defaults'

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
    const hasDockerCompose = true // TODO: Fix this Boolean(where('docker compose'))

    if (!(fs.readdirSync(EZG_APP_PATH).length <= 1)) {
      throw new EzgAlreadyInstalledError()
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
                    throw new GitNotFoundError()
                  }

                  hasGit = Boolean(where('git'))
                },
              },
              {
                title: 'Docker Engine',
                enabled: hasGit,
                task: async (): Promise<any> => {
                  if (!hasDocker) {
                    throw new DockerEngineNotFoundError()
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
                    throw new DockerComposeNotFoundError()
                  }

                  hasDeps = true
                },
              },
            ]),
        },
        // TODO: MAYBE PUT EVERYTHING UNDER EZGAMES INSTALLER ???
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
                title: 'Downloading EZGames...',
                enabled: (): boolean => Boolean(requestedReleaseTag),
                task: async (_, task) => {
                  task.title = `Downloading EZGames (${requestedReleaseTag})...`
                  return execa('git', ['clone', '--progress', '-b', `${requestedReleaseTag}`, /* '--depth', '1', */ 'https://github.com/emodyz/MultigamingPanel.git', `${EZG_APP_PATH}`]).stderr
                },
              },
              {
                title: 'Configuring EZGames...',
                enabled: (): boolean => Boolean(requestedReleaseTag),
                task: async (_, task: any) => {
                  const answers = await configureAppForm(task)
                  await saveFullConfigToEnv(answers)
                  ctx.hostIsFQDN = validator.isFQDN(answers.domain)
                  ctx.isConfigSuccessful = true
                },
              },
            ], {concurrent: false}),
        },
        {
          title: 'Building Infrastructure... (This may take a few minutes)',
          enabled: ctx => Boolean(ctx.isConfigSuccessful),
          task: async ctx => {
            await dockerComposeBuild()
            ctx.isBuildSuccessful = true
          },
        },
        {
          title: 'Starting EZGames... (This will take a few minutes)',
          enabled: ctx => Boolean(ctx.isBuildSuccessful),
          task: async ctx => {
            await dockerComposeUp()
            await cli.wait(60_000)
            await waitForHealthyApp()
            ctx.isStartUpSuccessful = true
          },
        },
        {
          title: 'Building FrontEnd... (This will take a few minutes)',
          enabled: ctx => Boolean(ctx.isStartUpSuccessful),
          task: async ctx => {
            // TODO: Wait for https://github.com/cenk1cenk2/listr2/issues/368 ???
            await BuildFront.build(true)
            ctx.isFrontEndBuildSuccessful = true
          },
        },
        {
          title: 'Generating TLS Certificates... (This might take a few moments)',
          enabled: ctx => Boolean(ctx.hostIsFQDN) && Boolean(ctx.isFrontEndBuildSuccessful),
          task: async ctx => {
            // TODO: Add cron job to auto renew tls certs
            await requestTLS(true/* , 'inherit' */)
            saveKeyToEnv('EZG_NGINX_SHOULD_PUBLISH_TEMPLATES', '.notemplate')
            /************
              WebSockets
             ***********/
            // eslint-disable-next-line no-template-curly-in-string
            saveKeyToEnv('LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT', '"/etc/letsencrypt/live/${EZG_HOST}/fullchain.pem"')
            // eslint-disable-next-line no-template-curly-in-string
            saveKeyToEnv('LARAVEL_WEBSOCKETS_SSL_LOCAL_PK', '"/etc/letsencrypt/live/${EZG_HOST}/privkey.pem"')
            ctx.isCertBotGenSuccessful = true
          },
        },
        {
          title: 'Create your account (Admin)',
          enabled: ctx => Boolean(ctx.isFrontEndBuildSuccessful) || Boolean(ctx.isCertBotGenSuccessful),
          options: {persistentOutput: true},
          task: async (ctx, task) => {
            const answers = await createUserForm('owner', task)
            await phpArtisan(`create:user ${answers.username} ${answers.email} ${answers.password} ${answers.role}`, true)
            ctx.isInstallSuccessful = true
          },
        },
        {
          title: 'Setting up gRPC Bridge...',
          enabled: ctx => Boolean(ctx.isInstallSuccessful),
          task: async ctx => {
            await BridgeSetup.secure(true)
            ctx.isBridgeSecureSuccessful = true
          },
        },
      ],
      {concurrent: false},
    )

    await tasks.run()

    // Weired Fix for wss not working
    await phpArtisan('queue:restart')

    this.log(' ')
    this.log(chalk`{cyan Bridge:} {green.bold Certificates have been successfully generated!}`)
    this.log(' ')
    this.log(chalk.cyan`{green ${checkMark}} {cyan.bold EZGames} {green ${requestedReleaseTag}} is now {green.bold available} at {cyan.bold.underline ${getAppEnv().APP_URL}}`)

    await execa.command('ezgames bridge:start', getDefaultExecaOptions())

    // TODO: Add notifications. see: https://oclif.io/docs/notifications
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
    InstallIndex.allReleases = collect((await gitHubApi('GET /repos/{owner}/{repo}/releases', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data).filter((item: any) => {
      return semver.satisfies(item.tag_name.toString(), supportedVersions)
    })

    if (InstallIndex.allReleases.isEmpty()) {
      throw new EzgNoSupportedVersionAvailableError()
    }

    // TODO: Replace this in the same fashion as the latestPreRelease
    const latestRelease = (await gitHubApi('GET /repos/{owner}/{repo}/releases/latest', {
      owner: 'emodyz',
      repo: 'MultigamingPanel',
    })).data

    const latestPreRelease = InstallIndex.allReleases.filter((item: any) => item.prerelease).first()

    return {
      availableVersions: InstallIndex.allReleases.map(item => item.tag_name).all(),
      choices: [
        {
          name: 'stable',
          message: `Stable (${latestRelease.tag_name})`,
          value: latestRelease.tag_name,
        },
        // TODO: Programmatically build this array in order to check if a pre-release/stable release exist in the first place
        {
          name: 'preRelease',
          message: `Pre-release (${latestPreRelease.tag_name})`,
          value: latestPreRelease.tag_name,
        },
        /* TODO: Update "EnvPatcher" to support non-tagged release installation
        {
          name: '77',
          message: 'Feature #77 | Docker is coming 🏴‍☠️',
          value: 'feature/77',
        },
        {
          name: 'dev',
          message: 'Development',
          value: 'dev',
        }, */
        {
          name: 'showAll',
          message: 'Show all versions',
          value: 'other',
        },
      ],
    }
  }
}
