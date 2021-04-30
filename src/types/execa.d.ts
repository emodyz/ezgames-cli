import execa, {StdioOption} from 'execa'
import {EZG_APP_PATH} from '../core/paths'

export type stdIo = 'pipe' | 'ignore' | 'inherit' | readonly StdioOption[] | undefined
