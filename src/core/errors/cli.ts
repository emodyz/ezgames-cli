import chalk from 'chalk'

export namespace CliErrors {
  export class CommandNotYetImplementedError extends Error {
    constructor() {
      const message = chalk`{red.bold This Command has not been implemented yet}`
      super(message)
      this.name = 'CliCommandNotYetImplementedError'
    }
  }

  export class Pm2DaemonError extends Error {
    constructor(error: Error) {
      super(error.message)
      this.name = 'Pm2DaemonError'
      this.stack = error.stack
    }
  }

  export class Pm2ProcessError extends Error {
    constructor(error: Error) {
      super(error.message)
      this.name = 'Pm2ProcessError'
      this.stack = error.stack
    }
  }

  export class Pm2RpcError extends Error {
    constructor(error: Error) {
      super(error.message)
      this.name = 'Pm2RpcError'
      this.stack = error.stack
    }
  }
}
