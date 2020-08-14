#!/bin/bash

sudo apt install -y nfs-common


# Chane ownership of /mnt directory
sudo chown pi:pi /mnt

# Make mount folder nfs
mkdir mnt/nfs

# Setup /etc/idmapd.conf to match user
sudo sed -i "s/nobody/pi/g" /etc/idmapd.conf
sudo sed -i "s/nogroup/pi/g" /etc/idmapd.conf

#Mounting
sudo mount 192.168.1.5:/opt/nfs /mnt

#Edit fstab to mount on boot
sudo echo "192.168.1.5:/opt/nfs /mnt/nfs nfs rw 0 0" >> /etc/fstab
