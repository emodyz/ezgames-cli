import {
  HelloReply,
  HelloRequest,
  BridgeServer,
  EmptyMessage,
  GetCpVersionReply,
  CheckForCpUpdateReply, UpgradeCpRequest,
} from './proto/bridge'
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from '@grpc/grpc-js'
import {getGitInfo} from '../git'
import AppUpgrade from '../../commands/app/upgrade'
import semver from 'semver/preload'
import execa from 'execa'
import {getDefaultExecaOptions} from '../defaults'

export class Bridge implements BridgeServer {
  sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    const msg = `Hello ${call.request.name}`
    console.log(msg)
    callback(null, {message: msg})
  }

  [name: string]: UntypedHandleCall

  async getCpVersion(call: ServerUnaryCall<EmptyMessage, GetCpVersionReply>, callback: sendUnaryData<GetCpVersionReply>): Promise<void> {
    const gitInfo = await getGitInfo()
    const version = gitInfo.current
    callback(null, {version: version})
  }

  async checkForCpUpdate(call: ServerUnaryCall<EmptyMessage, CheckForCpUpdateReply>, callback: sendUnaryData<CheckForCpUpdateReply>): Promise<void> {
    const gitInfo = await getGitInfo()
    const current = gitInfo.current
    const availableTargets = (await AppUpgrade.getUpgradeTargets(gitInfo, true)).map(item => item.tag_name)

    let target = 'none'

    if (availableTargets.isNotEmpty()) {
      target = semver.maxSatisfying(availableTargets.all(), `>${current}`)
    }

    callback(null, {target})
  }

  async upgradeCp(call: ServerUnaryCall<UpgradeCpRequest, EmptyMessage>, callback: sendUnaryData<EmptyMessage>): Promise<void> {
    const target = call.request.version

    // TODO: add cli auto update without implementing an inf loop
    await execa.command(`ezgames upgrade --allow-pre-releases -t=${target}`, getDefaultExecaOptions())

    callback(null, null)
  }
}

