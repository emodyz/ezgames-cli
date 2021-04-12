import {Command, flags} from '@oclif/command'
import Table from 'cli-table'
import chalk from 'chalk'
import {collect} from 'collect.js'
import {getAppHealth} from '../../core/api/status'

export default class AppStatus extends Command {
  static description = 'Shows the status of the internal infrastructure'

  static aliases = ['status']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const health = await getAppHealth()

    const state = collect(Object.values(health)).slice(1).map((item: any) => this.paintByStatus(item.status))

    const table = new Table({
      head: ['EZGames', 'Environment', 'Database', 'Storage', 'Redis', 'Logger'].map(header => chalk.cyan(header)),
      colors: false,
    })

    table.push([this.paintByStatus(health.status), ...state.all()])
    this.log(table.toString())
  }

  paintByStatus(input: string) {
    switch (input) {
    case 'OK':
      return chalk.bold.green('HEALTHY')
    case 'PROBLEM':
      return chalk.bold.red('ERROR')
    }
  }
}
