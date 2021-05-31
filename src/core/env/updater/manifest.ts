import {collect} from 'collect.js'
import {EnvPatchesManifest, EnvPatchesManifestItem} from './types/manifest'

const manifest: EnvPatchesManifest = collect<EnvPatchesManifestItem>([
  {
    version: '0.0.4',
    fileName: '0-0-4',
  },
])

export default manifest
