#!/bin/env python3
import json
import sys,argparse
import os
from web3 import Web3
INFURA_URL=os.getenv("INFURA_URL")
LOCAL_WSS="wss://localhost:8546"
local_url="http://localhost:8545"
LINKPOOL_URL="wss://ropsten-rpc.linkpool.io/ws"

web3=Web3(Web3.WebsocketProvider(INFURA_URL))
# web3=Web3(Web3.HTTPProvider(local_url))
class Contract(object):

    def __init__(self,name,address):
        self.address=address
        self.abi=self.load_abi(name+".json")
        self.contract=web3.eth.contract(address=self.address,abi=self.abi)

    def load_abi(self,contract):
        with open(str(os.path.join(os.getcwd(),'build/contracts',contract))) as abi_stream:
            rez=json.load(abi_stream)
        return rez["abi"]
    def name(self):
        return self.contract.functions.name().call()
    def symbol(self):
        return self.contract.functions.symbol().call()

def cmd_arguments():

    msg="Interactive script for smart contracts on ethereum"
    parser=argparse.ArgumentParser(description=msg)

    parser.add_argument("-a","--address", help="Address of smart contract")

    parser.add_argument("-c","--call",help="Smart Contract function call")

    args=parser.parse_args()

if __name__ == "__main__":
    cmd_arguments()

    web3.eth.DefaultAccount = web3.eth.account.from_key("a11ceaf064a3e33ecdab7f50428718dabdd73c000f01ab9137128caab3a882e7")
    
    contract=Contract("Users","0x48cC33b920b8ec35D65662D3B19474e672F3E45D")
