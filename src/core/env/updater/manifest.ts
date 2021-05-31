import {collect} from 'collect.js'
import {EnvPatchesManifest, EnvPatchesManifestItem} from './types/manifest'

const manifest: EnvPatchesManifest = collect<EnvPatchesManifestItem>([
  {
    version: '0.0.2',
    fileName: '0-0-2',
  },
  {
    version: '0.0.3',
    fileName: '0-0-3',
  },
  {
    version: '0.0.4',
    fileName: '0-0-4',
  },
  {
    version: '0.0.5',
    fileName: '0-0-5',
  },
])

export default manifest
