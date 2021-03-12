import path from 'path'
import XDGAppPaths from 'xdg-app-paths'
import fs from 'fs-extra'
// eslint-disable-next-line new-cap
const xdgAppPaths = XDGAppPaths({name: 'Emodyz'})

export const EMODYZ_DATA_PATH: string = xdgAppPaths.data()
export const EZG_DATA_PATH: string = path.join(EMODYZ_DATA_PATH, 'EZGames')
fs.ensureDirSync(EZG_DATA_PATH)
export const EZG_CLI_DATA_PATH: string = path.join(EZG_DATA_PATH, 'Cli')
fs.ensureDirSync(EZG_CLI_DATA_PATH)
export const EZG_APP_PATH: string = path.join(EZG_DATA_PATH, 'App')
fs.ensureDirSync(EZG_APP_PATH)
