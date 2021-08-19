export namespace Pm2Errors {
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
