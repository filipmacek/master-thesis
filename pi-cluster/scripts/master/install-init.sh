while :
do
    echo -e "Updating OS and Installing Utilities"
    sudo apt-get update && sudo apt-get install -y bmon sshpass isc-dhcp-server nfs-kernel-server && sudo apt-get upgrade -y 
    if [ $? -eq 0 ]
    then
        break
    else
        echo -e "\nUpdate failed. Retrying system update in 10 seconds\n"
        sleep 10
    fi
done

echo "Setting iptables to legacy mode"
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy > /dev/null
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy > /dev/null


echo -e "\nDiabling Linux swap file - Required for Kubernetes\n"
#disable swap
sudo dphys-swapfile swapoff > /dev/null
sudo dphys-swapfile uninstall > /dev/null
sudo systemctl disable dphys-swapfile > /dev/null


# Setting GPU Memory to minimum - 16MB
echo "gpu_mem=16" | sudo tee -a /boot/config.txt > /dev/null


# Enable I2C
sudo raspi-config nonint do_i2c 0
# Enable SPI
sudo raspi-config nonint do_spi 0

# sed -i option saves the files after apending
sudo sed -i -e '$i \/usr/bin/tvservice -o\n' /etc/rc.local

echo "Enabling cgroup support for Kubernetes"
sudo sed -i 's/$/ ipv6.disable=1 cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1/' /boot/cmdline.txt


echo "Reneme the Raspberry pi Kubernetes Master to k8master.local"
sudo raspi-config noint do_hostname 'k8master'
