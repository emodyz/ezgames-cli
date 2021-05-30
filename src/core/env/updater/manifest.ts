import {collect} from 'collect.js'
import {EnvPatchesManifest, EnvPatchesManifestItem} from './types/manifest'

const manifest: EnvPatchesManifest = collect<EnvPatchesManifestItem>([
  {
    version: '0.0.1',
    fileName: '',
  },
])

export default manifest
