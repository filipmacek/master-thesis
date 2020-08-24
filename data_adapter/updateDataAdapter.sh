#!/usr/bin/env bash
docker stop data_adapter mongo
docker rm data_adapter mongo
sudo rm -rf mongo-data
sudo docker-compose -f ~/master-thesis/data_adapter/docker-compose.yml build data_adapter
sudo docker-compose -f ~/master-thesis/data_adapter/docker-compose.yml up -d data_adapter