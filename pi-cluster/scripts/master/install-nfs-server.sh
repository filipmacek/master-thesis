#!/bin/bash

# Prepare the directories
sudo mkdir -p /opt/nfs
sudo chown pi:pi /opt/nfs
# Eveyone can read, write and executes
sudo chmod -R 777 /opt/nfs


# Check hard drive disks with lsblk then mount it
sudo mount /dev/sda2 /opt/nfs


# Add put mount command in rc.local for startup
# FOr some reason fstab file is not working
sudo sed -i -e '$i \mount /dev/sda2 /opt/nfs\n' /etc/rc.local


# Install NFS server packages
sudo apt install nfs-kernel-server nfs-common rpcbind -y

# Setting up nfs server configuration
sudo echo "/opt/nfs 192.168.1.0/24(rw,all_squash,async,no_subtree_check)" | sudo tee -a /etc/exports  > /dev/null


# reload exports
sudo exportfs -ra


#Enable services
#Enable also nfs-common client on host computer of nfs-server
sudo systemctl enable nfs-kernel-server
sudo systemctl enable nfs-common
sudo systemctl enable rpcbind
