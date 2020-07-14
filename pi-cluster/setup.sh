#!/bin/bash

red='\033[1;31m'
grn='\033[1;32m'
yel='\033[1;33m'
blu='\033[1;36m'
pnk='\033[1;35m'
clr='\033[0m'

# read_char var
read_char() {
	  stty -icanon -echo
	  eval "$1=\$(dd bs=1 count=1 2>/dev/null)"
	  stty icanon echo
		  
}

echo -e "${grn}Hello. We are starting with installation of raspberry pi kubernetes cluster${clr}"
echo -e "${blu}Do you wish to proceed${clr}"
read_char response

if [ ! $response = 'y' ]
then
	exit 
fi

cd ~/

echo "${grn}Getting master-thesis folder from github${clr}"
curl -O -J -L https://github.com/filipmacek/master-thesis/archive/master.zip

BOOTSTRAP_DIR=~/pi-kubernetes-cluster

if [ -d "$BOOTSTRAP_DIR" ]; then
	echo -e "${grn}$BOOTSTRAP_DIR already exists so we are deleting it to start again."
	rm -rf $BOOTSTRAP_DIR
	mkdir $BOOTSTRAP_DIR
else
	echo -e "${grn}BOOTSTRAP_DIR doesnt exists.\nCreating .....${clr}"
	mkdir $BOOTSTRAP_DIR
fi

echo -e "${grn}Cleaning and moving files${clr}"
unzip -qq master-thesis-master.zip
rm master-thesis-master.zip
mv ~/master-thesis-master/pi-cluster/* $BOOTSTRAP_DIR
rm -rf ~/master-thesis-master
echo -e "${grn}Setting Execute Permissions for scripts${clr}"
cd ~/pi-kubernetes-cluster/scripts
sudo chmod +x *.sh



while true; do
	echo ""
	read -p "Kubernetes Master or Node Setup? ([Master], [N]ode) or [Quit]: " Kube_Setup_Mode
	case $Kube_Setup_Mode in 
		[Mm]* ) break;;
		[Nn]* ) break;;
		[Qq]* ) exit 1;;
	esac
done

if [ $Kube_Setup_Mode = 'M' ] || [ $Kube_Setup_Mode ='m' ]; then
	 "${BOOTSTRAP_DIR}/scripts/install-master.sh"
else
	
	 "${BOOTSTRAP_DIR}/scripts/install-node.sh"
fi
