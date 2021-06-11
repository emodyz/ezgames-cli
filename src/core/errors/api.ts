import chalk from 'chalk'

export namespace ApiErrors {
  export class InvalidHealthCheckResponseError extends Error {
    constructor() {
      const message = chalk`{red.bold Invalid HealthCheck Response}`
      super(message)
      this.name = 'ApiInvalidHealthCheckResponseError'
    }
  }
}
