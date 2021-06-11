import chalk from 'chalk'
import {EZG_APP_PATH} from '../paths'
import {packager, SYS_COMMANDS} from '../node-sys'

export namespace InstallerErrors {
  export class EzgAlreadyInstalledError extends Error {
    constructor() {
      const message = chalk`{red.bold EZGames has already been installed in:} {cyan.underline "${EZG_APP_PATH}"}`
      super(message)
      this.name = 'InstallerEzgAlreadyInstalledError'
    }
  }

  export class GitNotFoundError extends Error {
    constructor() {
      const pkgManager = packager()
      const message = chalk`{yellow.bold Could not find Git on this system.}
{cyan.bold Please run:} {green.bold ${SYS_COMMANDS[pkgManager.command]} git}
{red.bold Before restarting the installer}`
      super(message)
      this.name = 'InstallerGitNotFoundError'
    }
  }

  export class DockerEngineNotFoundError extends Error {
    constructor() {
      const pkgManager = packager()
      const message = chalk`{yellow.bold Could not find Docker on this system.}
{cyan.bold Please run:} {green.bold ${SYS_COMMANDS[pkgManager.command]} docker}
{red.bold Before restarting the installer}`
      super(message)
      this.name = 'InstallerDockerEngineNotFoundError'
    }
  }

  export class DockerComposeNotFoundError extends Error {
    constructor() {
      const pkgManager = packager()
      const message = chalk`{yellow.bold Could not find docker-compose on this system.}
{cyan.bold Please run:} {green.bold ${SYS_COMMANDS[pkgManager.command]} docker-compose}
{red.bold Before restarting the installer}`
      super(message)
      this.name = 'InstallerDockerComposeNotFoundError'
    }
  }
}
