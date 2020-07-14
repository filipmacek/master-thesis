#!/bin/bash

# === Variables
ipaddress=''
set64BitKernelFlag=''


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


getIpAddress() {
	while :
	do
		echo ""
		read -p "Enter the Raspberry IP Address for the Kubernetes Master " ipaddress
		if valid_ip $ipaddress 
		then
			ping $ipaddress -c 2 > /dev/null
			if [ $? -eq 0  ]
			then
				echo "Address is valid"
				break
			else 
				echo "Address not found on your network"
			fi
		else
			echo "Invalid IP adrress"
		fi
	done
}

enable64BitKernel() {
    while :
    do
        echo ""
        read -p "Enable 64 Bit Kernel on each Kubernetes Node (Raspberry Pi 3 or better) ? ([Y]es, [N]o): " kernel64bit
        case $kernel64bit in
            [Yy]* ) set64BitKernelFlag='-x'; break;;
            [Nn]* ) set64BitKernelFlag=''; break;;
            * ) echo "Please answer [Y]es, [N]o).";;
        esac
    done
}

generateSSH() {
	if [ ! -f ~/.ssh/id_rsa_rpi_kube_cluster ]; then
		echo "Generating SSH key for Rapeberry Pi Kuberentes cluster"
		
		if [ ! -d "~/.ssh" ]; then
			mkdir -p ~/.ssh
			echo "Sudoing .ssh directory"
			sudo chmod -R 700 ~/.ssh
		fi

        ssh-keygen -t rsa -N "" -b 4096 -f ~/.ssh/id_rsa_rpi_kube_cluster

	fi
	
	echo "${grn}About to copy public SSH key to raspberry Pi.${clr}" 
	
	# Remove old keys for specified hostname ipadress on raspberry pies
	ssh-keygen -f "/home/pi/.ssh/known_hosts" -R "$ipaddress" &> /dev/null 
    ssh-keyscan -H $ipaddress >> ~/.ssh/known_hosts 2> /dev/null
   
	ssh-copy-id -i ~/.ssh/id_rsa_rpi_kube_cluster pi@$ipaddress
}



getIpAddress
enable64BitKernel
generateSSH

./install-master-auto.sh -i $ipaddress $set64BitKernelFlag
