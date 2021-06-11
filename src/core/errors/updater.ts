import chalk from 'chalk'

export namespace UpdaterErrors {
  export class UnsupportedCurrentVersionError extends Error {
    constructor(currentVersion: string) {
      const message = chalk`{bgRed.white.bold \nCurrent version: "${currentVersion}"\nAutomatic updates are only supported when tracking a "semver" compliant GitHub release and not a branch like "master" or "dev"}`
      super(message)
      this.name = 'UpdaterUnsupportedCurrentVersionError'
    }
  }
}
