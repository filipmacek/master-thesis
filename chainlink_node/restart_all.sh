#!/usr/bin/env bash
docker stop chainlink postgres
docker rm chainlink postgres
sudo rm -rf ~/postgres-data
mkdir ~/postgres-data