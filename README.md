ezgames-cli
===========

EZGames CLI Toolkit

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ezgames-cli.svg)](https://npmjs.org/package/ezgames-cli)
[![Downloads/week](https://img.shields.io/npm/dw/ezgames-cli.svg)](https://npmjs.org/package/ezgames-cli)
[![License](https://img.shields.io/npm/l/ezgames-cli.svg)](https://github.com/ezmodyz/ezgames-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ezgames-cli
$ ezgames COMMAND
running command...
$ ezgames (-v|--version|version)
ezgames-cli/0.0.0 darwin-x64 node-v15.11.0
$ ezgames --help [COMMAND]
USAGE
  $ ezgames COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ezgames config`](#ezgames-config)
* [`ezgames create:user [FILE]`](#ezgames-createuser-file)
* [`ezgames help [COMMAND]`](#ezgames-help-command)
* [`ezgames install`](#ezgames-install)

## `ezgames config`

describe the command here

```
USAGE
  $ ezgames config

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/config/index.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.0/src/commands/config/index.ts)_

## `ezgames create:user [FILE]`

describe the command here

```
USAGE
  $ ezgames create:user [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/create/user.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.0/src/commands/create/user.ts)_

## `ezgames help [COMMAND]`

display help for ezgames

```
USAGE
  $ ezgames help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `ezgames install`

[35m[1mEZGames[22m[39m [36mInstaller[39m

```
USAGE
  $ ezgames install

OPTIONS
  -h, --help             show CLI help
  -r, --release=release  GitHub Release Tag
```

_See code: [src/commands/install.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.0/src/commands/install.ts)_
<!-- commandsstop -->
