#!/usr/bin/env bash

# Update ContractMetaData.js
touch ContractMetaData.js
echo "const address=\"$1\"" >> ContractMetaData.js
abi="$( cat ~/Desktop/master-thesis/truffle_movementApp/bin/Movement.abi)"
echo "const abi=${abi}" >> ContractMetaData.js
cat <<EOF >> ContractMetaData.js
module.exports ={
  address,
  abi
}
EOF

# Move created ContractMetaData.js to source, where it belongs
cp ContractMetaData.js ./src/service/ContractMetaData.js
cp ContractMetaData.js ../react_dapp/src/ContractMetaData.js
rm ContractMetaData.js



while read ip;do
  echo "$ip"
  scp -i ~/Desktop/master-thesis/chainlink_node/node1.pem src/service/ContractMetaData.js ubuntu@${ip}:~/master-thesis/data_adapter/src/service/ContractMetaData.js
  ssh -i  ~/Desktop/master-thesis/chainlink_node/node1.pem  ubuntu@${ip} "bash -s" < updateDataAdapter.sh
  echo "Gotovo za ${ip}"
done <ips

