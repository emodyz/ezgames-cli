import {
  HelloReply,
  HelloRequest,
  BridgeServer,
  GetCpVersionRequest,
  GetCpVersionReply,
  CheckForCpUpdateRequest, CheckForCpUpdateReply,
} from './proto/bridge'
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from '@grpc/grpc-js'
import {getGitInfo} from '../git'
import AppUpgrade from '../../commands/app/upgrade'
import semver from 'semver/preload'

export class Bridge implements BridgeServer {
  sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    const msg = `Hello ${call.request.name}`
    console.log(msg)
    callback(null, {message: msg})
  }

  [name: string]: UntypedHandleCall

  async getCpVersion(call: ServerUnaryCall<GetCpVersionRequest, GetCpVersionReply>, callback: sendUnaryData<GetCpVersionReply>): Promise<void> {
    const gitInfo = await getGitInfo()
    const version = gitInfo.current
    callback(null, {version: version})
  }

  async checkForCpUpdate(call: ServerUnaryCall<CheckForCpUpdateRequest, CheckForCpUpdateReply>, callback: sendUnaryData<CheckForCpUpdateReply>): Promise<void> {
    const gitInfo = await getGitInfo()
    const current = gitInfo.current
    const availableTargets = (await AppUpgrade.getUpgradeTargets(gitInfo, true)).map(item => item.tag_name)

    let target = 'none'

    if (availableTargets.isNotEmpty()) {
      target = semver.maxSatisfying(availableTargets.all(), `>${current}`)
    }

    callback(null, {target})
  }
}

