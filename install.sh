#!/bin/bash
{
    set -e
    SUDO=''
    if [ "$(id -u)" != "0" ]; then
      SUDO='sudo'
      echo "This script requires superuser access."
      echo "You will be prompted for your password by sudo."
      # clear any previous sudo permission
      sudo -k
    fi


    # run inside sudo
    $SUDO bash <<SCRIPT
  set -e

  echoerr() { echo "\$@" 1>&2; }

  if [[ ! ":\$PATH:" == *":/usr/local/bin:"* ]]; then
    echoerr "Your path is missing /usr/local/bin, you need to add this to use this installer."
    exit 1
  fi

  if [ "\$(uname)" == "Darwin" ]; then
    OS=darwin
  elif [ "\$(expr substr \$(uname -s) 1 5)" == "Linux" ]; then
    OS=linux
  else
    echoerr "This installer is only supported on Linux and MacOS"
    exit 1
  fi

  ARCH="\$(uname -m)"
  if [ "\$ARCH" == "x86_64" ]; then
    ARCH=x64
  elif [[ "\$ARCH" == aarch* ]]; then
    ARCH=arm
  else
    echoerr "unsupported arch: \$ARCH"
    exit 1
  fi

  mkdir -p /usr/local/lib
  cd /usr/local/lib
  rm -rf ezgames
  rm -rf ~/.local/share/ezgames/client
  if [ \$(command -v xz) ]; then
    URL=https://ezg-cli-test-apt-repo.s3.eu-west-3.amazonaws.com/ezgames-\$OS-\$ARCH.tar.xz
    TAR_ARGS="xJ"
  else
    URL=https://ezg-cli-test-apt-repo.s3.eu-west-3.amazonaws.com/ezgames-\$OS-\$ARCH.tar.gz
    TAR_ARGS="xz"
  fi
  echo "Installing CLI from \$URL"
  if [ \$(command -v curl) ]; then
    curl "\$URL" | tar "\$TAR_ARGS"
  else
    wget -O- "\$URL" | tar "\$TAR_ARGS"
  fi
  # delete old ezgames bin if exists
  rm -f \$(command -v ezgames) || true
  rm -f /usr/local/bin/ezgames
  ln -s /usr/local/lib/ezgames/bin/ezgames /usr/local/bin/ezgames

  # on alpine (and maybe others) the basic node binary does not work
  # remove our node binary and fall back to whatever node is on the PATH
  /usr/local/lib/ezgames/bin/node -v || rm /usr/local/lib/ezgames/bin/node

SCRIPT
  # test the CLI
  LOCATION=$(command -v ezgames)
  echo "ezgames installed to $LOCATION"
  ezgames version
}
