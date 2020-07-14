#!/bin/bash

# memberlist secret containts the secretkey to encrypt the communication between speakers for tthe fast dead node detection
kubectl create secret generic -n metallb-system memberlist --from-literal=secretkey="$(openssl rand -base64 128)"
