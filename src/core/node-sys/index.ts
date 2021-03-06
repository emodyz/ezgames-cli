import which from 'which'
import {fork, spawn} from 'child_process'
import {dirname, join} from 'path'
// import { createRequire } from 'module';

const __dn = dirname(__filename)
const sync = which.sync

/**
 * Supported package commands
 */
export const SYS_COMMANDS: any = {
  brew: 'brew install',
  port: 'sudo port install',
  pkgin: 'sudo pkgin install',
  choco: 'choco install',
  powershell: "powershell 'Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))'",
  'apt-get': 'sudo apt-get install',
  yum: 'sudo yum install',
  dnf: 'sudo dnf install',
  nix: 'nix-env --install',
  zypper: 'sudo zypper in',
  emerge: 'sudo emerge -a',
  pacman: 'sudo pacman -S',
  pkg: 'pkg install',
  pkg_add: 'pkg_add',
  crew: 'crew install',
}

/**
 * Supported package managers
 */
const SYS_MANAGERS: any = {
  darwin: ['brew', 'port', 'pkgin'],
  win32: ['choco', 'powershell'],
  linux: ['apt-get', 'yum', 'dnf', 'nix', 'zypper', 'emerge', 'pacman', 'crew'],
  freebsd: ['pkg', 'pkg_add'],
  sunos: ['pkg'],
  netbsd: ['none'],
  win64: ['choco'],
  shell: ['powershell'],
}

function Sys() { }

function sysManager(): any {
  let managers: any = SYS_MANAGERS[process.platform]
  if (!managers || !managers.length) {
    throw new Error('Unsupported platform \'' + process.platform + '\'')
  }

  managers = managers.filter(function (mng: any) {
    return mng /*(where(mng) !== null)*/
  })

  if (!managers.length) {
    return 'System OS package manager not found'
  }

  return SYS_COMMANDS[managers[0]].split(' ')
}

/**
 * Gets the system package manager install command.
 *
 * @returns {Object}
 *```
 * sudo: boolean, // true or false,
 * command: string, // 'apk-get' - system package manager command,
 * installer: string, // 'sudo apk-get install' - full install command
 *```
 * - Defaults to 'get os-manager installer' if no package manager is found.
 *
 * @throws if `process.platform` is none of darwin, freebsd, linux, sunos or win32.
 */
export const packager = Sys.packager = function () {
  const sys = sysManager()
  if (isArray(sys) && sys[0])
    return {
      sudo: (sys[0] === 'sudo'),
      command: ((!sys[2]) ? sys[0] : sys[1]),
      installer: sys.join(' '),
    }
  throw new Error(sys)
}

/**
 * Install package using the system package manager command.
 *
 * @param {String|Array} application package to install.
 * @param {Function} progress callback for any output doing installation.
 * - Any value returned in `callback` will be the final resolved result.
 *
 * @returns {Promise} Promise Output of spawn command.
 * - E.g. 'sudo apg-get install' for Debian based systems.
 * - Defaults to 'get os-manager installer' if no package manager is found.
 * @rejects On any spawn error, or if `process.platform` is none of
 * darwin, freebsd, linux, sunos or win32.
 */
export const installer = Sys.installer = function (application: any, progress: any): any {
  if (!application)
    return new Promise((resolve, reject) => {
      return reject('No package, application name missing.')
    })

  const manager = sysManager()
  if (!isArray(manager))
    return new Promise((resolve, reject) => {
      return reject(manager)
    })
  let cmd = manager[0]
  let args = null
  let install = null
  if (manager[1])
    args = [manager[1]]
  if (manager[2])
    install = [manager[2]]

  // @ts-ignore
  const whatToInstall: any = isArray(application) ? [].concat(application).concat(['-y']) : [].concat([application]).concat(['-y'])
  let system = whatToInstall
  if ((args) && (!install))
    system = args.concat(whatToInstall)
  else if ((args) && (install))
    system = args.concat(install).concat(whatToInstall)

  if (cmd != 'powershell') {
    if (cmd.includes('choco') && process.platform == 'win32') {
      cmd = where('choco')
      system = [cmd].concat(system)
      cmd = join(__dn, 'bin', 'sudo.bat')
    }

    return spawning(cmd, system, progress)
  }
  return new Promise((resolve, reject) => {
    return reject('No package manager installed!')
  })
}

export const testWin = function () {
  const CMD: any = {
    win32: join(__dn, 'bin', 'sudo.bat'),
    darwin: 'sudo osascript'
  };
  const SYSTEM: any = {
    win32: join(__dn, 'bin', 'installChocolatey.cmd'),
    darwin: join(__dn, 'bin','xcode-brew-install.scpt')
  };

  return CMD[process.platform] +' '+ [SYSTEM[process.platform]]

  /*
  return  spawning(CMD[process.platform], [SYSTEM[process.platform]], progress)
    .then(function () {
      console.log('Finished...')
    })
    .catch(function (err) {
      console.error(err);
    })*/
}

/**
 * Like the unix `which` utility.
 *
 * Finds the first instance of a specified executable in the PATH environment variable.
 * @returns String|Null
 * @param executable
 */
export const where = Sys.where = function (executable: string) {
  const found = sync(executable, {
    nothrow: true,
  })

  return found
}

/**
 * Spawn subprocess with `Promise` features, pass callbacks for `.on('data')` events, with ability to run as admin.
 *
 * @param {String} command - platform command
 * @param {Array} argument - command arguments
 * @param {Function|Object} progressOptions - either callback for `stdout.on('data')` event or `options`.
 * - the callback will received an object:
 *```js
 * spawn: object, // child process **spawn** `instance`.
 * output: string, // any **output** data.
 * fork: object, // if created, child process **fork** `instance`.
 *```
 * - any `return` is the **`resolve()` .then()** result.
 * @param {Object} options - Any child process `spawn` options, defaults: stdio: 'pipe'.
 * - Additionally:
 *```js
 * sudo: boolean, // run as administrator.
 * fork: string, //  execute an additional module, a child_process.`fork` IPC communication channel.
 * onerror: callable, // callback for `stderr.on('data')` event.
 * onprogress: callable, // callback for `stdout.on('data')` event.
 * onmessage: callable, // callback for `on('message')` for `fork` event.
 *```
 */
export const spawning = Sys.spawning = function (command: any, argument: any, progressOptions: any, options: any = null) {
  return new Promise((resolve, reject) => {
    options = options || {
      stdio: 'pipe',
      sudo: false,
      fork: null,
      onerror: null,
      onprogress: null,
      onmessage: null,
    }

    options.stdio = options.stdio || 'pipe'
    const forked = isString(options.fork) ? fork(options.fork) : null
    let progress = progressOptions
    if (isObjectOnly(progressOptions))
      options = Object.assign(options, progressOptions)

    if (isFunction(options.onprogress))
      progress = options.onprogress

    let error: any = null
    let output: any = null
    const sudo = options.sudo || false
    const onerror = options.onerror || null
    const onmessage = options.onmessage || null

    delete options.sudo
    delete options.fork
    delete options.onerror
    delete options.onprogress
    delete options.onmessage

    if (sudo) {
      argument = [command].concat(argument)
      command = (isWindows()) ? join(__dn, 'bin', 'sudo.bat') : 'sudo'
    }

    const spawned = spawn(command, argument, options)
    spawned.on('error', data => {
      return reject(data)
    })

    spawned.on('close', code => {
      if (code === 0) {
        return resolve(output)
      }

      return reject(error + code)
    })

    spawned.on('exit', code => {
      if (forked)
        setTimeout(() => {
          forked.kill()
        }, 1000)

      if (code === 0) {
        return resolve(output)
      }

      return reject(error + code)
    })

    spawned.stdout.on('data', data => {
      const input = data.toString()
      output += input
      try {
        if (isFunction(progress)) {
          output = progress({spawn: spawned, output: input, fork: forked}) || output
        }
      } catch (e) {
        return reject(e.toString())
      }

      if (argument.includes('fake-js')) {
        spawned.kill('SIGKILL')
        return resolve('For testing only. ' + output)
      }
    })

    spawned.stderr.on('data', data => {
      const err = data.toString()
      error += err
      if (isFunction(onerror))/* c8 ignore next */
        error = onerror(err) || error
    })

    if (forked) {
      forked.on('message', data => {
        if (isFunction(onmessage))
          onmessage(data)
      })
    }

    // @ts-ignore
    if (argument.includes('fake-js') && Object.getOwnPropertyDescriptor(process, 'platform').value == 'darwin') {
      spawned.kill('SIGKILL')
      return resolve('For testing only. ' + output)
    }
  })
}

const toString = Object.prototype.toString

/**
 * Determine if a value is an Array.
 *
 * @param {Object} value The value to test.
 * @returns {boolean} True if value is an Array, otherwise false.
 */
export const isArray = Sys.isArray = function (value: any) {
  return toString.call(value) === '[object Array]'
}

/**
 * Determine if a value is undefined.
 *
 * @param {Object} value The value to test.
 * @returns {boolean} True if the value is undefined, otherwise false.
 */
export const isUndefined = Sys.isUndefined = function (value: any) {
  return typeof value === 'undefined'
}

/**
 * Determine if a value is a Buffer.
 *
 * @param {Object} value The value to test.
 * @returns {boolean} True if value is a Buffer, otherwise false.
 */
export const isBuffer = Sys.isBuffer = function (value: any) {
  return value !== null && !isUndefined(value) && value.constructor !== null && !isUndefined(value.constructor) &&
    typeof value.constructor.isBuffer === 'function' && value.constructor.isBuffer(value)
}

/**
 * Determine if a value is an ArrayBuffer.
 *
 * @param {Object} value The value to test.
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
export const isArrayBuffer = Sys.isArrayBuffer = function (value: any) {
  return toString.call(value) === '[object ArrayBuffer]'
}

/**
 * Determine if a value is a String.
 *
 * @param {Object} value The value to test.
 * @returns {boolean} True if value is a String, otherwise false.
 */
export const isString = Sys.isString = function (value: any) {
  return typeof value === 'string'
}

/**
 * Determine if a value is a Number.
 *
 * @param {Object} value The value to test.
 * @returns {boolean} True if value is a Number, otherwise false.
 */
export const isNumber = Sys.isNumber = function (value: any) {
  return typeof value === 'number'
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} value The value to test.
 * @returns {boolean} True if value is an Object, otherwise false.
 */
export const isObject = Sys.isObject = function (value: any) {
  return value !== null && typeof value === 'object'
}

/**
 * Determine if a value is only a Object, not an `Array` or `Function`.
 *
 * @param {Object} value The value to test.
 * @return {boolean} True if value is a `Object` only, otherwise false.
 */
export const isObjectOnly = Sys.isObjectOnly = function (value: any) {
  if (toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} value The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
export const isBlob = Sys.isBlob = function (value: any) {
  return toString.call(value) === '[object Blob]'
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} value The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
export const isFunction = Sys.isFunction = function (value: any) {
  return toString.call(value) === '[object Function]'
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} value The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
export const isDate = Sys.isDate = function (value: any) {
  return toString.call(value) === '[object Date]'
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} value The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
export const isStream = Sys.isStream = function (value: any) {
  return isObject(value) && isFunction(value.pipe)
}

/**
 * Determine if a value is a boolean
 *
 * @param {Object} value The value to test
 * @returns {boolean} True if value is a boolean, otherwise false
 */
export const isBool = Sys.isBool = function (value: any) {
  return (value === true) || (value === false)
}

/**
 * Determine if a value is a null
 *
 * @param {Object} value The value to test
 * @returns {boolean} True if value is a null, otherwise false
 */
export const isNull = Sys.isNull = function (value: any) {
  return value === null
}

/**
 * Determine if platform is Windows
 *
 * @returns {boolean} True if Windows OS, otherwise false
 */
export const isWindows = Sys.isWindows = function () {
  return process.platform === 'win32'
}

/**
 * Determine if platform is Linux
 *
 * @returns {boolean} True if Linux OS, otherwise false
 */
export const isLinux = Sys.isLinux = function () {
  return process.platform === 'linux'
}

/**
 * Determine if platform is Apple Mac
 *
 * @returns {boolean} True if Apple macOS, otherwise false
 */
export const isMac = Sys.isMac = function () {
  return process.platform === 'darwin'
}

/**
 * Include an `CommonJS` module the old way.
 *
 * @param {string} module
 */
// export const require = createRequire(import.meta.url);

export default Sys
export const System = Sys
