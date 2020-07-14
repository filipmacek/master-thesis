#!/bin/bash
SCRIPTS_DIR="~/pi-kubernetes-cluster/scripts/scriptlets"
ipaddress=''
kernel64bit=false

valid_ip() {
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

remote_cmd(){
	ssh -i ~/.ssh/id_rsa_rpi_kube_cluster pi@$hostname $1
}

wait_for_network(){
	echo ""
	echo "Waiting for network connection to Raspberry pi"
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
	echo -e "Connected. \n"
	sleep 2

}


wait_for_ready () {
  sleep 2
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
      sleep 2
    fi    
  done    
  echo -e "Ready.\n"
  sleep 2
}



while getopts i:xh flag; do
	case $flag in
		i)
			ipaddress=$OPTARG
			echo "Ipaddress that will be used is $ipaddress"
			;;
		x)
			kernel64bit=true
			;;
		h)
			echo "help"
			;;
		*)
			echo "exit"
			exit 1
			;;
	esac
done


if [ -z "$ipaddress" ]
then
	echo "Expected -i IP address"
	exit 1
fi

# Validate ip address
if ! valid_ip $ipaddress
then
	echo "Invalid ip address entered"
	exit 1
fi

hostname=$ipaddress

wait_for_network

wait_for_ready


echo "Downloading installation bootstrap folder onto Raspberry Pi"
# remote_cmd "sudo rm master.zip"
remote_cmd "wget -q https://github.com/filipmacek/master-thesis/archive/master.zip"
# remote_cmd "sudo rm -rf pi-kubernetes-cluster"
remote_cmd "unzip -qq master.zip"
remote_cmd "rm master.zip"
remote_cmd "mkdir pi-kubernetes-cluster"
remote_cmd "mv ~/master-thesis-master/pi-cluster/* ~/pi-kubernetes-cluster"
remote_cmd "rm -rf ~/master-thesis-master"


echo "Setting Execution Permissions for installation scripts"
remote_cmd 'sudo chmod +x ~/pi-kubernetes-cluster/scripts/*.sh'
remote_cmd "sudo chmod +x $SCRIPTS_DIR/common/*.sh"
remote_cmd "sudo chmod +x $SCRIPTS_DIR/master/*.sh"


# Enabling 64bit Kernel mode
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


# UPDATING SYSTEM ,CONFIGURATIONS AND EVERYHTING ELSE

# ======== COMMON =========
remote_cmd "$SCRIPTS_DIR/common/install-docker.sh"
remote_cmd "$SCRIPTS_DIR/common/install-haveged.sh"
remote_cmd "$SCRIPTS_DIR/common/install-kubernetes.sh"
remote_cmd "$SCRIPTS_DIR/common/install-log2ram.sh"

# ======== MASTER ==========

# install-init.sh
remote_cmd "$SCRIPTS_DIR/master/install-init.sh"

wait_for_ready

# Install NFS server
remote_cmd "$SCRIPTS_DIR/master/install-nfs-server.sh"

wait_for_ready

# Kuberenetes init
remote_cmd "$SCRIPTS_DIR/master/kubernetes-init.sh"

# Kubernetes setup
remote_cmd "$SCRIPTS_DIR/master/kubernetes-setup.sh"

