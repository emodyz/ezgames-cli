import {Range as SemverRange} from 'semver'
import {Collection} from 'collect.js'

export type EnvPatchesManifestItem = {
  version: string;
  fileName: string;
}

export type EnvPatchesManifest = Collection<EnvPatchesManifestItem>
