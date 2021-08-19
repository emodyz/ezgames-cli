import chalk from 'chalk'

export namespace CliErrors {
  export class CommandNotYetImplementedError extends Error {
    constructor() {
      const message = chalk`{red.bold This Command has not been implemented yet}`
      super(message)
      this.name = 'CliCommandNotYetImplementedError'
    }
  }
}
