#!/bin/bash
# Motivation
# By default, the Raspberry Pi uses a micro SD card as storage device. The SD card as a FLASH device is subject of ‘wear-out’: each FLASH block can only be erased and written a limited number of time, and after that it fails. The ‘wear leveling’ of the disk device will allocate and use a new flash block in that case, but after some time there are no free blocks any more and the system will fail.

echo "deb http://packages.azlux.fr/debian/ buster main" | sudo tee /etc/apt/sources.list.d/azlux.list
wget -qO - https://azlux.fr/repo.gpg.key | sudo apt-key add -
sudo apt update
sudo apt install log2ram
sudo sed -i "s/SIZE=40M/SIZE=120M/g" /etc/log2ram.conf

sudo reboot
