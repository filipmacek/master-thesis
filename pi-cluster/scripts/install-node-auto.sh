#!/bin/bash

SCRIPTS_DIR="~/master-thesis/pi-cluster/scripts"
kernel64bit=false
ipaddress=''
k8snodeNumber=''

 valid_ip()
{
    local  ip=$1
    local  stat=1

    if [[ $ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
        OIFS=$IFS
        IFS='.'
        ip=($ip)
        IFS=$OIFS
        [[ ${ip[0]} -le 255 && ${ip[1]} -le 255 \
            && ${ip[2]} -le 255 && ${ip[3]} -le 255 ]]
        stat=$?
    fi
    return $stat
}


remote_cmd() {
    sshpass -p "raspberry" ssh pi@$hostname $1
}


wait_for_network() {
  echo
  printf "Waiting for network connection to Raspberry Pi."
  while :
  do
    # Loop until network response
    ping $hostname -c 2 > /dev/null
    if [ $? -eq 0 ]
    then
      break
    else
      printf "."
      sleep 2
    fi    
  done 
  echo -e " Connected.\n"
  sleep 2
}


wait_for_ready () {
  sleep 4
  echo "Waiting for the Raspberry Pi to be ready."

  while :
  do
    # Loop until you can successfully execute a command on the remote system
    remote_cmd 'uname -a' 2> /dev/null
    if [ $? -eq 0 ]
    then
      break
    else
      echo "Waiting"
      sleep 4
    fi    
  done    
  echo -e "Ready.\n"
  sleep 2
}


while getopts i:n:fxhu flag; do
  case $flag in
    i)
      ipaddress=$OPTARG
      ;;
    n)
      k8snodeNumber=$OPTARG
      ;;
    x)
      kernel64bit=true
      ;;
    h)
      echo "Startup options -i Node IP Address, -n Node Number, Optional: -f Install FanSHIM support, -x Enable Linux 64bit Kernel"
      exit 0
      ;;   
    *)
      echo "Startup options -i Node IP Address, -n Node Number, Optional: -f Install FanSHIM support, -x Enable Linux 64bit Kernel"
      exit 1;
      ;;
  esac
done

if [ -z "$ipaddress" ] || [ -z "$k8snodeNumber" ]
then
  echo -e "\nExpected -i IP Address and -n Kubernetes Node Number."
  echo -e "Startup options -i Node IP Address, -n Node Number, Optional: -f Install FanSHIM support, -x Enable Linux 64bit Kernel\n"
  exit 1
fi

# Validate IP Address
if ! valid_ip $ipaddress
then
  echo "invalid IP Address entered. Try again"
  exit 1
fi

# Validate node number is numeric
if [[ -z "$k8snodeNumber" || -n ${NodeNumber//[0-9]/} ]];
then
    echo "Kubernetes Node number not numeric!"
    exit 1
fi

hostname=$ipaddress

# delete existing kubernetes node
kubectl delete node k8snode$k8snodeNumber &> /dev/null

# Remove any existing ssh finger prints for the device
ssh-keygen -f "/home/pi/.ssh/known_hosts" -R "k8snode$k8snodeNumber.local" &> /dev/null
ssh-keygen -f "/home/pi/.ssh/known_hosts" -R "$hostname" &> /dev/null

wait_for_network

ssh-keyscan -H $hostname >> ~/.ssh/known_hosts  2> /dev/null # https://www.techrepublic.com/article/how-to-easily-add-an-ssh-fingerprint-to-your-knownhosts-file-in-linux/

wait_for_ready $hostname

sshpass -p "raspberry" scp ~/k8s-join-node.sh $hostname:~/

echo "Adding execute rights to k8s-join-node.sh"
remote_cmd  'sudo chmod +x ~/k8s-join-node.sh'

echo "Downloading installation bootstrap"

remote_cmd 'rm -r -f ~/Raspberry-Pi-Kubernetes-Cluster-master'
remote_cmd 'rm ~/master.zip'

remote_cmd 'wget -q https://github.com/gloveboxes/Raspberry-Pi-Kubernetes-Cluster/archive/master.zip'
remote_cmd 'unzip -qq ~/master.zip'
remote_cmd 'rm ~/master.zip'


echo -e "\nSetting Execution Permissions for installation scripts\n"
remote_cmd 'sudo chmod +x ~/master-thesis/pi-cluster/scripts/*.sh'
remote_cmd "sudo chmod +x $SCRIPTS_DIR/common/*.sh"
remote_cmd "sudo chmod +x $SCRIPTS_DIR/node/*.sh"

# Enable 64bit Kernel
if $kernel64bit
then
  # r=$(sed -n "/arm_64bit=1/=" /boot/config.txt)
  
  # if [ "$r" = "" ]
  # then
    echo -e "\nEnabling 64bit Linux Kernel\n"
    remote_cmd 'echo "arm_64bit=1" | sudo tee -a /boot/config.txt > /dev/null'
    remote_cmd 'sudo reboot'

    wait_for_ready
  # fi
fi

echo -e "Updating System, configuring prerequisites, renaming, rebooting"
# Update, set config, rename and reboot
remote_cmd "$SCRIPTS_DIR/node/install-init.sh $k8snodeNumber"

wait_for_ready $hostname
# Install Docker
remote_cmd "$SCRIPTS_DIR/common/install-docker.sh"

wait_for_ready $hostname

# Install log2ram
remote_cmd "$SCRIPTS_DIR/common/install-log2ram.sh"

wait_for_ready $hostname

# Install Kubernetes
remote_cmd "$SCRIPTS_DIR/common/install-kubernetes.sh"

echo "Joining Node to Kubernetes Master"
remote_cmd "sudo ~/k8s-join-node.sh"

echo -e "\nInstallation Completed!\n"
