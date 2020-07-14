#!/bin/bash

if ! [ -x "$(command -v doker)" ]; then
	sudo apt-get update && sudo apt-get install -y haveged
	sudo update-rc.d haveged defaults
else
	echo "Haveged already installed"
fi
