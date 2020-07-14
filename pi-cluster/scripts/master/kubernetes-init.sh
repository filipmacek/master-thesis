#!/bin/bash
echo "Pulling Kubernetes images"
kubeadm config images pull

echo "Installing Kubernetes master"

sudo kubeadm init --apiserver-advertise-address=192.168.1.5 --pod-network-cidr=10.244.0.0/16 --token-ttl 0 --skip-token-print

rm -r -f $HOME/.kube
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
