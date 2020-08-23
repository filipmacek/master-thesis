#!/usr/bin/env bash

#Installing docker if it doesnt exists
echo -e "\nInstalling Docker\n"
sudo docker --version
if [ $? -ne 0 ]
then
  curl -sSL get.docker.com | sh  && sudo usermod -aG docker $USER
fi

# Install docker-compose and tools for debugging docker containers
sudo apt-get install -y docker-compose

## Build and get Docker images
sudo docker-compose build

## Run
sudo docker-compose up -d

sleep 5

chmod +x ./docker_chainlink
chmod +x ./docker_postgres

./docker_postgres


# Chainlink node
mkdir ~/.chainlink-kovan/
cp env ~/.chainlink-kovan/.env
cp docker_chainlink ~/.chainlink-kovan/docker_chainlink

cd ~/.chainlink-kovan/ && docker_chainlink