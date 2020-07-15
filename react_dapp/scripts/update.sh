#!/usr/bin/env bash

# Delete old folders
ssh pi@192.168.1.6 "rm ~/react_dapp/bundles/main.js"
ssh pi@192.168.1.7 "rm ~/react_dapp/bundles/main.js"

scp ~/Desktop/master-thesis/react_dapp/bundles/main.js pi@192.168.1.6:~/react_dapp/bundles/main.js
scp ~/Desktop/master-thesis/react_dapp/bundles/main.js pi@192.168.1.7:~/react_dapp/bundles/main.js

ssh pi@192.168.1.6 "cd react_dapp && docker build . --tag react_dapp"
ssh pi@192.168.1.7 "cd react_dapp && docker build . --tag react_dapp"


kubectl get pods | grep dapp | awk '{print $1}' | xargs kubectl delete pod