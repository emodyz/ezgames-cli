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
ezgames-cli/0.0.8-alpha.14 darwin-x64 node-v18.4.0
$ ezgames --help [COMMAND]
USAGE
  $ ezgames COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ezgames app:exec TARGET COMMAND`](#ezgames-appexec-target-command)
* [`ezgames app:restart`](#ezgames-apprestart)
* [`ezgames app:start`](#ezgames-appstart)
* [`ezgames app:status`](#ezgames-appstatus)
* [`ezgames app:stop`](#ezgames-appstop)
* [`ezgames app:upgrade`](#ezgames-appupgrade)
* [`ezgames autocomplete [SHELL]`](#ezgames-autocomplete-shell)
* [`ezgames bridge:setup [FILE]`](#ezgames-bridgesetup-file)
* [`ezgames bridge:start`](#ezgames-bridgestart)
* [`ezgames bridge:stop`](#ezgames-bridgestop)
* [`ezgames bridge:test NAME`](#ezgames-bridgetest-name)
* [`ezgames build:front`](#ezgames-buildfront)
* [`ezgames config`](#ezgames-config)
* [`ezgames create:user`](#ezgames-createuser)
* [`ezgames help [COMMAND]`](#ezgames-help-command)
* [`ezgames install`](#ezgames-install)
* [`ezgames ssl:sign [FILE]`](#ezgames-sslsign-file)
* [`ezgames test`](#ezgames-test)
* [`ezgames update [CHANNEL]`](#ezgames-update-channel)

## `ezgames app:exec TARGET COMMAND`

Executes the provided command inside the targeted docker compose service

```
USAGE
  $ ezgames app:exec TARGET COMMAND

ARGUMENTS
  TARGET   The name of the docker compose service inside which the command is to be executed.
  COMMAND  The the desired command to be executed.

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ ezgames exec
```

_See code: [src/commands/app/exec.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/app/exec.ts)_

## `ezgames app:restart`

Restarts EZGames's containers

```
USAGE
  $ ezgames app:restart

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ ezgames restart
```

_See code: [src/commands/app/restart.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/app/restart.ts)_

## `ezgames app:start`

Starts EZGames's containers

```
USAGE
  $ ezgames app:start

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ ezgames start
  $ ezgames up
```

_See code: [src/commands/app/start.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/app/start.ts)_

## `ezgames app:status`

Shows the status of the internal infrastructure

```
USAGE
  $ ezgames app:status

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ ezgames status
```

_See code: [src/commands/app/status.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/app/status.ts)_

## `ezgames app:stop`

Stops EZGames's containers

```
USAGE
  $ ezgames app:stop

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ ezgames stop
  $ ezgames down
```

_See code: [src/commands/app/stop.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/app/stop.ts)_

## `ezgames app:upgrade`

[35m[1mEZGames[22m[39m [36mUpdater[39m

```
USAGE
  $ ezgames app:upgrade

OPTIONS
  -h, --help            show CLI help
  -l, --list            Lists available upgrade targets
  -t, --target=target   The version you wish to upgrade to
  --allow-pre-releases  Allows the user to select a pre-release as upgrade target
  --[no-]maintenance    Puts the app into maintenance mode before starting the upgrade process

ALIASES
  $ ezgames upgrade
```

_See code: [src/commands/app/upgrade.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/app/upgrade.ts)_

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

## `ezgames bridge:setup [FILE]`

describe the command here

```
USAGE
  $ ezgames bridge:setup [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/bridge/setup.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/bridge/setup.ts)_

## `ezgames bridge:start`

Starts the bridge server

```
USAGE
  $ ezgames bridge:start

OPTIONS
  -H, --host=host  [default: 0.0.0.0]
  -P, --port=port  [default: 6660]
  -h, --help       show CLI help
```

_See code: [src/commands/bridge/start.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/bridge/start.ts)_

## `ezgames bridge:stop`

Stops the bridge server

```
USAGE
  $ ezgames bridge:stop

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/bridge/stop.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/bridge/stop.ts)_

## `ezgames bridge:test NAME`

describe the command here

```
USAGE
  $ ezgames bridge:test NAME

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/bridge/test.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/bridge/test.ts)_

## `ezgames build:front`

(Re)Build EZGames's FontEnd Application

```
USAGE
  $ ezgames build:front

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/build/front.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/build/front.ts)_

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

_See code: [src/commands/config/index.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/config/index.ts)_

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

_See code: [src/commands/create/user.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/create/user.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.3.1/src/commands/help.ts)_

## `ezgames install`

[35m[1mEZGames[22m[39m [36mInstaller[39m

```
USAGE
  $ ezgames install

OPTIONS
  -h, --help             show CLI help
  -r, --release=release  GitHub Release Tag
```

_See code: [src/commands/install/index.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/install/index.ts)_

## `ezgames ssl:sign [FILE]`

describe the command here

```
USAGE
  $ ezgames ssl:sign [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/ssl/sign.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/ssl/sign.ts)_

## `ezgames test`

Dummy Command used to test features

```
USAGE
  $ ezgames test

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/test.ts](https://github.com/ezmodyz/ezgames-cli/blob/v0.0.8-alpha.14/src/commands/test.ts)_

## `ezgames update [CHANNEL]`

update the ezgames CLI

```
USAGE
  $ ezgames update [CHANNEL]

OPTIONS
  --from-local  interactively choose an already installed version
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.5.0/src/commands/update.ts)_
<!-- commandsstop -->
