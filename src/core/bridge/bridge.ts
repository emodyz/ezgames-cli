import {HelloReply, HelloRequest, BridgeServer, GetVersionRequest, GetVersionReply} from './proto/bridge'
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from '@grpc/grpc-js'

export class Bridge implements BridgeServer {
  sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    const msg = `Hello ${call.request.name}`
    console.log(msg)
    callback(null, {message: msg})
  }

  [name: string]: UntypedHandleCall

  getVersion(call: ServerUnaryCall<GetVersionRequest, GetVersionReply>, callback: sendUnaryData<GetVersionReply>): void {
    const version = 'v0.0.21'
    callback(null, {version: version})
  }
}

