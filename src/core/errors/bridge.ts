import chalk from 'chalk'

export namespace BridgeErrors {
  export class BridgeProcessNotManagedByPm2Error extends Error {
    constructor(attemptedOperation: string) {
      const message = chalk`{red.bold This Operation is only available when the bridge is managed by pm2:} {yellow ${attemptedOperation}}`
      super(message)
      this.name = 'CliCommandNotYetImplementedError'
    }
  }
}
