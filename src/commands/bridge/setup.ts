import {Command, flags} from '@oclif/command'
import {stdIo} from '../../types/execa.d'
import {dockerComposeExecCwd} from '../../core/docker/compose-exec-cwd'

export default class BridgeSetup extends Command {
  static description = 'Internal command used to setup the grpc bridge server upon first install'

  static hidden = true

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    await BridgeSetup.generateCa(true, 'inherit')
    await BridgeSetup.generateKey(true, 'inherit')
    await BridgeSetup.generateRequest(true, 'inherit')
    await BridgeSetup.generateCert(true, 'inherit')
  }

  static async secure(tty = true, stdio: stdIo = 'pipe') {
    await BridgeSetup.generateCa(tty, stdio)
    await BridgeSetup.generateKey(tty, stdio)
    await BridgeSetup.generateRequest(tty, stdio)
    await BridgeSetup.generateCert(tty, stdio)
  }

  private static async generateCa(tty = true, stdio: stdIo = 'pipe') {
    // TODO: setup crontab to regenerate credentials every 720 days
    return dockerComposeExecCwd('php', 'openssl req -new -newkey rsa:2048 -days 730 -nodes -x509 -subj "/C=/ST=/O=Emodyz/localityName=/commonName=Ezgames/organizationalUnitName=BridgeCA/emailAddress=bridge-ca@ezgames.eu/" -keyout "ca.key" -out "ca.pem"', tty, '/var/www/app/storage/bridge', {stdio: stdio})
  }

  private static async generateKey(tty = true, stdio: stdIo = 'pipe') {
    // TODO: setup crontab to regenerate credentials every 720 days
    return dockerComposeExecCwd('php', 'openssl genrsa -out cert.key 2048', tty, '/var/www/app/storage/bridge', {stdio: stdio})
  }

  private static async generateRequest(tty = true, stdio: stdIo = 'pipe') {
    // TODO: setup crontab to regenerate credentials every 720 days
    return dockerComposeExecCwd('php', 'openssl req -new -key cert.key -out cert.csr -subj "/C=/ST=/O=Emodyz/localityName=/commonName=Ezgames/organizationalUnitName=Bridge/emailAddress=bridge@ezgames.eu/" -config openssl.conf', tty, '/var/www/app/storage/bridge', {stdio: stdio})
  }

  private static async generateCert(tty = true, stdio: stdIo = 'pipe') {
    // TODO: setup crontab to regenerate credentials every 720 days
    return dockerComposeExecCwd('php', 'openssl x509 -req -sha256 -days 730 -CA ca.pem -CAkey ca.key -CAcreateserial -in cert.csr -out cert.crt -extensions v3_req -extfile openssl.conf', tty, '/var/www/app/storage/bridge', {stdio: stdio})
  }
}
