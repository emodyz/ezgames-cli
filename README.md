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
* [`ezgames app:start`](#ezgames-appstart)
* [`ezgames autocomplete [SHELL]`](#ezgames-autocomplete-shell)
* [`ezgames config`](#ezgames-config)
* [`ezgames create:user`](#ezgames-createuser)
* [`ezgames help [COMMAND]`](#ezgames-help-command)
* [`ezgames install`](#ezgames-install)
* [`ezgames test [FILE]`](#ezgames-test-file)

## `ezgames app:start`

Starts the EZGames container

```
USAGE
  $ ezgames app:start

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ ezgames start
```

_See code: [src/commands/app/start.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.0/src/commands/app/start.ts)_

## `ezgames autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ ezgames autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ ezgames autocomplete
  $ ezgames autocomplete bash
  $ ezgames autocomplete zsh
  $ ezgames autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `ezgames config`

describe the command here

```
USAGE
  $ ezgames config

OPTIONS
  -d, --domain=domain  Domain Name or IPv4
  -h, --help           show CLI help
  -m, --email=email    WebMaster's email address
  -n, --name=name      Community Name
```

_See code: [src/commands/config/index.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.0/src/commands/config/index.ts)_

## `ezgames create:user`

Create a user

```
USAGE
  $ ezgames create:user

OPTIONS
  -h, --help               show CLI help
  -m, --email=email        Email of the future user
  -n, --username=username  Username of the future user
  -p, --password=password  Password username of the future user
  -r, --role=role          Role to be assigned to the future user
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

_See code: [src/commands/install/index.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.0/src/commands/install/index.ts)_

## `ezgames test [FILE]`

describe the command here

```
USAGE
  $ ezgames test [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/test.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.0/src/commands/test.ts)_
<!-- commandsstop -->
