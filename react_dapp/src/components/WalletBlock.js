import React, {Component} from 'react';
import {Card, Text, Button, Flex,Box,Checkbox} from "rimble-ui";

import AccountOverview from "../utils/components/AccountOverview";

class WalletBlock extends Component {
    state = {
        rememberWallet:false
    }



    handleConnectAccount = () => {
        this.props.connectAndValidateAccount(this.state.rememberWallet,result =>{
            if(result ==='success'){
                console.log("Callback SUCCESS")
            }else if (result === "error"){
                console.log("Callback ERROR")
            }
        })
    }

    renderContent =() =>{
        if(this.props.account && this.props.accountValidated) {
            return (
                <AccountOverview
                    account={this.props.account}
                    accountBalanceLow={this.props.accountBalanceLow}
                    accountBalance={this.props.accountBalance}
                />
            )
        }else {
            return (
                <Flex flexDirection={"row"}>
                    <Box width={2/7}>
                        <Checkbox label="Remember me" required={true}
                                  checked = {this.state.rememberWallet}
                                  onChange={ e=> this.setState({rememberWallet: e.target.checked})}
                        />
                    </Box>
                    <Box width={5/7}>
                        <Button onClick={this.handleConnectAccount} width={1}>
                            Connect your wallet
                        </Button>
                    </Box>
                </Flex>
            )
        }
    }


    render() {
        return (
           <Card maxWidth={"640px"} mx={"auto"} p={3} mt={2}>
               <Text fontWeight={3} mb={3} fontFamily="sansSerif">
                   Wallet
               </Text>
               {this.renderContent()}
           </Card>
        );
    }
}

export default WalletBlock;