import {HelloReply, HelloRequest, BridgeServer} from './proto/bridge'
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from '@grpc/grpc-js'

export class Bridge implements BridgeServer {
  sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    const msg = `Hello ${call.request.name}`
    console.log(msg)
    callback(null, {message: msg})
  }

  [name: string]: UntypedHandleCall
}

