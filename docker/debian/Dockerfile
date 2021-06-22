FROM node:15-buster

WORKDIR /usr/share/emodyz/ezg-cli

RUN apt update && apt upgrade -y

RUN apt install -y apt-utils

RUN yarn global add @oclif/dev-cli aws-sdk
