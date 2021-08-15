import * as grpc from '@grpc/grpc-js'
import {BridgeService, HelloReply, HelloRequest, BridgeServer} from './proto/bridge'
import {sendUnaryData, ServerCredentials, ServerUnaryCall, UntypedHandleCall} from '@grpc/grpc-js'

class Bridge implements BridgeServer {
  sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    callback(null, {message: `Hello ${call.request.name}`})
  }

  [name: string]: UntypedHandleCall
}

function serve(): void {
  const server = new grpc.Server()

  server.addService(BridgeService, new Bridge())

  server.bindAsync('localhost:666', ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      throw err
    }
    console.log(`Listening on ${port}`)
    server.start()
  })
}
