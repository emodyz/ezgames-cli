import * as grpc from '@grpc/grpc-js'
import {BridgeService, HelloReply, HelloRequest, BridgeServer} from './proto/bridge'
import {sendUnaryData, ServerCredentials, ServerUnaryCall, UntypedHandleCall} from '@grpc/grpc-js'
import {BridgeErrors} from '../../errors/bridge'
import BridgeProcessNotManagedByPm2Error = BridgeErrors.BridgeProcessNotManagedByPm2Error

class Bridge implements BridgeServer {
  sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    callback(null, {message: `Hello ${call.request.name}`})
  }

  [name: string]: UntypedHandleCall
}

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

    this.server.bindAsync(`${this.host}:${this.port}`, ServerCredentials.createInsecure(), (error, port) => {
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
      this.server.start()
      if (this.daemon) {
        this.sendIpm('log', {log: `Listening on ${port}`})
        this.sendIpm('endLogs', {end: true})
      }
    })
  }

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
