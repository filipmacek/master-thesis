#!/bin/bash
if [[ -z "$1" || -n ${NodeNumber//[0-9]/} ]]; 
then
    echo "Node number needs to be passed to bash script. Either number missing or not a number!"
    exit 1
fi

echo -e "Updating System\n"
while :
do
    sudo apt-get update && sudo apt-get upgrade -y 
    if [ $? -eq 0 ]
    then
        break
    else
        echo -e "\nUpdate failed. Retrying system update in 10 seconds\n"
        sleep 10
    fi
done

echo -e "Setting iptables to legacy mode\n"
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy > /dev/null
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy > /dev/null


#disable swap
echo -e "Disabling Linux Swap file\n"
sudo dphys-swapfile swapoff > /dev/null
sudo dphys-swapfile uninstall > /dev/null
sudo systemctl disable dphys-swapfile > /dev/nul


# Enable I2C
sudo raspi-config nonint do_i2c 0
# Enable SPI
sudo raspi-config nonint do_spi 0

# maximise memory by reducing gpu memory
echo "gpu_mem=16" | sudo tee -a /boot/config.txt > /dev/null


# disable wifi on the node board as network will be over Ethernet
echo "dtoverlay=disable-wifi" | sudo tee -a /boot/config.txt > /dev/null


# Disable hdmi to reduce power consumption
sudo sed -i -e '$i \/usr/bin/tvservice -o\n' /etc/rc.local


# enable cgroups for Kubernetes
sudo sed -i 's/$/ ipv6.disable=1 cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1/' /boot/cmdline.txt


sudo raspi-config nonint do_hostname "k8snode$1"

sudo reboot
