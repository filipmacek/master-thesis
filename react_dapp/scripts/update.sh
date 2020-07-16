#!/usr/bin/env bash

# Delete old folders
ssh pi@192.168.1.6 "rm -rf ~/react_dapp/"
ssh pi@192.168.1.7 "rm -rf ~/react_dapp/"

rm -rf ~/Desktop/master-thesis/react_dapp/node_modules/

# static folder
scp -r ~/Desktop/master-thesis/react_dapp/ pi@192.168.1.6:~/react_dapp
scp -r ~/Desktop/master-thesis/react_dapp/ pi@192.168.1.7:~/react_dapp


ssh pi@192.168.1.6 "cd react_dapp && docker build . --tag react_dapp"
ssh pi@192.168.1.7 "cd react_dapp && docker build . --tag react_dapp"\



kubectl get pods | grep dapp | awk '{print $1}' | xargs kubectl delete pod

cd ~/Desktop/master-thesis/react_dapp/ && npm i