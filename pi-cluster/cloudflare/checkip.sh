#!/bin/bash


# Sourcing env file
source ~/Desktop/master-thesis/pi-cluster/cloudflare/envs


key=$(echo $api_key)
email=$(echo $email)
zone_id=$(echo $zone_id)
ttl=1
proxied=false
rec_type=A
record_id=''

get_record_id(){
    # Get the record id for the entry we're trying to change if it's not provided
	hostname=$1
    rec_response_json=`curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records?name=$hostname" \
		-H "X-Auth-Email: $email" \
		-H "X-Auth-Key: $key" \
		-H "Content-Type: application/json"`
    record_id=`echo $rec_response_json | jq -r ".result | .[] | .id"`
    if [ "$record_id" = "" ]
    then
        echo "Cloudflare DNS Record id could not be found, please make sure it exists"
        exit 1
    fi
}

update_record() {

	#Update record
	hostname=$1
	rec_id=$2
	update_response=`curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records/$rec_id" \
		-H "X-Auth-Email: $email" \
		-H "X-Auth-Key: $key" \
		-H "Content-Type: application/json" \
		--data "{\"id\":\"$rec_id\",\"type\":\"$rec_type\",\"name\":\"$hostname\",\"content\":\"$current_ip\",\"ttl\":$ttl,\"proxied\":$proxied}"`

	success=$(echo $update_response | jq -r ".success")
	echo $update_response
	if [ $success = true ];
	then
		echo "Record successfully update"
	else
		echo "Record update failed"
		exit 1
	fi

}




current_ip=`curl -s ifconfig.me`
written_ip=`cat written_ip`
if [ $current_ip = $written_ip ]; then
	echo "Ip address has not been changed"
	exit 0
fi
echo "Setting up new ip address"

#Writing log
echo "Writing log for IP change"
date=$(date)
echo "$date --------  $current_ip" >> log_change 


# Send telegram
python3 alert-telegram.py " Old_ip: $written_ip  New_ip: $current_ip"


# Loop through all hostnames in dns_records file
while read line;
do
    get_record_id "$line"
	echo "hostname: $line RecordID: ${record_id}"
	update_record $line $record_id 

done <dns_records

