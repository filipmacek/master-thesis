import React,{Component} from 'react';
import Web3 from "web3";
import Header from "./components/Header";
import DAppWeb3 from "./utils/DAppWeb3";
import ConnectionBanner from '@rimble/connection-banner'
import NetworkIndicator from '@rimble/network-indicator'

import {Box, Flex, Heading, Text, ThemeProvider,Card} from "rimble-ui";
import WalletBlock from "./components/WalletBlock";

function Proba(props){
    console.log("proba props")
    console.log(props)
    const imaweb3 = props.web3Fallback
    if (imaweb3){
         return <h1>Nema web3 buraz</h1>
    }else {
        return <h1>sve je sjajno</h1>
    }
}

class App extends Component {
    state = {
        route: "default"
    }

    // Optional Parameter
    config={
        accountBalanceMinimum: 0.001,
        requiredNetwork: 3
    }

    showRoute = route => {
        this.setState({
            route
        })
    }



    render(){
        return (
            <ThemeProvider>
                <DAppWeb3 config={this.config}>
                  <DAppWeb3.Consumer>
                      {({
                          account,
                          accountBalance,
                          connectAndValidateAccount,
                          accountValidated,
                          web3Fallback,
                          network
                        })=>(
                            <Box>
                              <Header/>
                                  <Box maxWidth={"640px"} p={3} mx={"auto"}>
                                      <ConnectionBanner
                                          currentNetwork={network.current.id}
                                          requiredNetwork={this.config.requiredNetwork}
                                          onWeb3Fallback={web3Fallback}/>
                                  </Box>

                                  <Flex maxWidth={"640px"} mx={"auto"} p={3}>
                                        <Heading.h2 mr={3}>
                                            <img src="/static/run_icon.png" alt="Movement DApp logo"/>
                                        </Heading.h2>
                                      <Text fontFamily="sansSerif">
                                            This is Movement DApp. An decentralized application deployed on Ropsten Ethereum blockhain.
                                            It offers way of communication with smart contracts deployed on blockchain.
                                            Use MetaMask to interact with dapp.
                                      </Text>

                                  </Flex>

                                  <Card maxWidth={"640px"} mx={"auto"} p={3} px={4}>
                                      <NetworkIndicator
                                          currentNetwork={network.current.id}
                                          requiredNetwork={network.required.id}
                                          />
                                  </Card>

                                <WalletBlock
                                    account={account}
                                    accountValidated={accountValidated}
                                    connectAndValidateAccount={connectAndValidateAccount}
                                    />



                            </Box>
                      )}
                  </DAppWeb3.Consumer>
                </DAppWeb3>
            </ThemeProvider>

        );
    }
}


export default App;
