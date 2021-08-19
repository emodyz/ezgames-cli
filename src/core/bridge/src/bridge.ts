import {HelloReply, HelloRequest, BridgeServer} from './proto/bridge'
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from '@grpc/grpc-js'

export class Bridge implements BridgeServer {
  sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    callback(null, {message: `Hello ${call.request.name}`})
  }

  [name: string]: UntypedHandleCall
}

