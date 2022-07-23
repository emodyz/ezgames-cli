import {HelloReply, HelloRequest, BridgeServer, GetVersionRequest, GetVersionReply} from './proto/bridge'
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from '@grpc/grpc-js'
import {getGitInfo} from '../git'

export class Bridge implements BridgeServer {
  sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    const msg = `Hello ${call.request.name}`
    console.log(msg)
    callback(null, {message: msg})
  }

  [name: string]: UntypedHandleCall

  async getVersion(call: ServerUnaryCall<GetVersionRequest, GetVersionReply>, callback: sendUnaryData<GetVersionReply>): Promise<void> {
    const gitInfo = await getGitInfo()
    const version = gitInfo.current
    callback(null, {version: version})
  }
}

