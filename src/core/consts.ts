import path from 'path'
import {getDataHome} from 'platform-folders'

export const EMODYZ_DATA_PATH: string = path.join(getDataHome(), 'Emodyz')
export const EZG_DATA_PATH: string = path.join(EMODYZ_DATA_PATH, 'EZGames')
export const EZG_CLI_DATA_PATH: string = path.join(EZG_DATA_PATH, 'Cli')
export const EZG_APP_PATH: string = path.join(EZG_DATA_PATH, 'App')
