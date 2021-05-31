import manifest from './manifest'
import semver from 'semver/preload'
import {major} from 'semver'
import {Collection} from 'collect.js'

export default class EnvUpdater {
  public readonly currentVersion: string

  public readonly targetVersion: string

  public readonly relevantPatches: Collection<string>

  private manifest = manifest

  constructor(curr: string, target: string) {
    this.currentVersion = curr
    this.targetVersion = target

    this.relevantPatches = this.getRelevantPatches().map(item => item.fileName)
  }

  private getRelevantPatches() {
    return manifest.filter(item => {
      // TODO: Switch to this condition before release when strict semver compliance is enforced
      // return semver.gt(item.version, this.currentVersion) && major(item.version).toString() <= major(this.targetVersion).toString()
      return semver.gt(item.version, this.currentVersion) && semver.lte(item.version, this.targetVersion)
    })
  }

  public async patch(env: Record<string, any>): Promise<Record<string, any>> {
    let patched = env

    await this.relevantPatches.each(async item => {
      const {default: PatchC} = await import(`./patches/${item}`)

      const patch = new PatchC()

      patched = patch.run(patched)
    })

    return patched
  }
}
