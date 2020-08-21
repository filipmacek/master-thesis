import React,{Component} from 'react';
import Web3 from "web3";
import Header from "./components/Header";
import DAppWeb3 from "./utils/DAppWeb3";
import ConnectionBanner from '@rimble/connection-banner'
import NetworkIndicator from '@rimble/network-indicator'

import {Box, Flex, Heading, Text, ThemeProvider,Card} from "rimble-ui";
import WalletBlock from "./components/WalletBlock";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import SmartContractPanel from "./utils/panels/SmartContractPanel";
import {Button, Col, Container, Row} from "react-bootstrap";



class App extends Component {
    state = {
        route: "default"
    }

    // Optional Parameter
    config={
        accountBalanceMinimum: 0.001,
        requiredNetwork: 42
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
                          accountBalanceLow,
                          contract,
                          connectAndValidateAccount,
                          accountValidated,
                          web3Fallback,
                          network,
                          users,
                          contractMethodSendWrapper,
                          isUserCreated,
                          modals
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
                                            This is Movement DApp. An decentralized application deployed on Rinkeby Ethereum testnet blockhain.
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
                                    accountBalance={accountBalance}
                                    accountBalanceLow={accountBalanceLow}
                                    accountValidated={accountValidated}
                                    connectAndValidateAccount={connectAndValidateAccount}
                                    />
                                   <SmartContractPanel
                                       users={users}
                                       contract={contract}
                                       account={account}
                                       contractMethodSendWrapper={contractMethodSendWrapper}
                                       isUserCreated={isUserCreated}
                                       modals={modals}
                                   />
                                   <Box maxWidth='640px' p={3} mx={"auto"}>
                                       <Container className="mt-4">
                                           <Row>
                                               <Col>
                                                   <Button variant="outline-success" onClick={modals.methods.openCreateRouteModal}>Create Route</Button>
                                               </Col>
                                               <Col>
                                                   <Button variant="outline-info" onClick={modals.methods.openStatusOfRoutesModal}>Status of routes</Button>
                                               </Col>
                                               <Col>
                                                   <Button variant="outline-dark" onClick={modals.methods.openEventsModal}>Events</Button>
                                               </Col>
                                           </Row>
                                       </Container>

                                   </Box>

                            </Box>
                      )}
                  </DAppWeb3.Consumer>
                </DAppWeb3>
                <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
            />
            </ThemeProvider>

        );
    }
}


export default App;
