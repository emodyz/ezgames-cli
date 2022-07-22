import * as grpc from '@grpc/grpc-js'
import {BridgeService} from './proto/bridge'
import {Bridge} from './bridge'
import {BridgeErrors} from '../errors/bridge'
import BridgeProcessNotManagedByPm2Error = BridgeErrors.BridgeProcessNotManagedByPm2Error
import chalk from 'chalk'
import {readFileSync} from 'fs-extra'
import path from 'node:path'
import {EZG_APP_PATH} from '../paths'

export class BridgeManager {
  protected server: grpc.Server

  public host: string

  public port: number

  public secure: boolean

  public daemon: boolean

  constructor(host: string, port: number, secure = false, daemon = false) {
    this.host = host
    this.port = port
    this.secure = secure
    this.daemon = daemon

    this.server = new grpc.Server()
  }

  listen(): void {
    this.server.addService(BridgeService, new Bridge())

    const credentials = grpc.ServerCredentials.createSsl(
      readFileSync(path.join(EZG_APP_PATH, 'storage/bridge/ca.pem')),
      [{
        private_key: readFileSync(path.join(EZG_APP_PATH, 'storage/bridge/cert.key')),
        cert_chain: readFileSync(path.join(EZG_APP_PATH, 'storage/bridge/cert.crt')),
      }],
      true,
    )
    // const credentials = grpc.ServerCredentials.createInsecure()

    this.server.bindAsync(`${this.host}:${this.port}`, credentials, (error, port) => {
      if (error) {
        if (this.daemon) {
          this.sendIpm('error', {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          })
        } else {
          throw error
        }
      }

      console.log(`Listening on ${port}`)
      console.log(chalk`{cyan Bridge:} {red.bold Started}`)
      this.server.start()
      if (this.daemon) {
        this.sendIpm('log', {log: `Listening on ${port}`})
        this.sendIpm('endLogs', {end: true})
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private sendIpm(type: 'msg' | 'log' |'error' | 'endLogs', data: object): void {
    if (!this.daemon) {
      throw new BridgeProcessNotManagedByPm2Error('BridgeManager.sendIpm()')
    }

    process.send?.({
      type: `process:${type}`,
      data: data,
    })
  }
}
