import React, {Component} from 'react';
import {Box, Button, Flex, Heading, MetaMaskButton, Modal, Text,Icon,Link} from "rimble-ui";
import ModalCard from '../ModalCard'

class ConnectionModal extends Component {


    renderModalContent=() =>{
        return(
            <React.Fragment>
                <Box mt={4} mb={5}>
                    <Heading fontSize={[4,5]}>You are connecting to Movement Demo Dapp</Heading>
                    <Text fontSize={[2,3]} my={3}>Connecting gives you ability to create users and routes</Text>
                </Box>

                <Flex flexDirection={["column","row"]}
                      justifyContent={"space-between"}
                      my={[0,4]}
                      >
                    <Box flex={'1 1'} width={1} mt={[3,0]} mb={[4,0]} mr={4}>
                        <Flex justifyContent={"center"} mb={3}>
                            <Icon
                                name="Public"
                                color="primary"
                                size="4rem"
                            />
                        </Flex>
                        <Heading fontSize={2}>The blockchain is public</Heading>
                        <Text fontSize={1}>
                            Your Ethereum account activity is public on the
                            blockchain. Choose an account you don’t mind being
                            linked with your activity here.
                        </Text>
                    </Box>


                    <Box flex={'1 1'} width={1} mt={[3,0]} mb={[4,0]} mr={4}>
                        <Flex justifyContent={"center"} mb={3}>
                            <Icon
                                name="AccountBalanceWallet"
                                color="primary"
                                size="4rem"
                            />
                        </Flex>
                        <Heading fontSize={2}>Have some Ether for fees</Heading>
                        <Text fontSize={1} mb={3}>
                            You’ll need Ether to pay transaction fees.
                        </Text>

                    </Box>

                        <Box flex={'1 1'} width={1} mt={[3,0]} mb={[4,0]} mr={4}>
                            <Flex justifyContent={"center"} mb={3}>
                                <Icon
                                    name="People"
                                    color="primary"
                                    size="4rem"
                                />
                            </Flex>
                            <Heading fontSize={2}>Have the right account ready</Heading>
                            <Text fontSize={1}>
                                If you have multiple Ethereum accounts, check that the
                                one you want to use is active in your browser.
                            </Text>
                        </Box>
                </Flex>

            </React.Fragment>
        )
    }

    renderConnectButton=() => {
       return (
                <MetaMaskButton
                    onClick={this.props.validateAccount}
                    width={[1,1/2]}
                    mb={[5,0]}
                    >
                    Connect with MetaMask
                </MetaMaskButton>
            )

    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <ModalCard closeFunc={this.props.closeModal}>
                    <React.Fragment>
                        <ModalCard.Body>
                            {this.renderModalContent()}
                        </ModalCard.Body>
                        <ModalCard.Footer>
                            {this.renderConnectButton()}
                        </ModalCard.Footer>
                    </React.Fragment>
                </ModalCard>

            </Modal>
        );
    }
}

export default ConnectionModal;