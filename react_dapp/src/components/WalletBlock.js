import React, {Component} from 'react';
import {Card,Text,Button} from "rimble-ui";

import AccountOverview from "../utils/components/AccountOverview";

class WalletBlock extends Component {


    handleConnectAccount = () => {
        this.props.connectAndValidateAccount(result =>{
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
                <h1>Account validated</h1>
            )
        }else {
            return (
                <Button onClick={this.handleConnectAccount} width={1}>
                    Connect your wallet
                </Button>
            )
        }
    }


    render() {
        return (
           <Card maxWidth={"640px"} mx={"auto"} p={4} mt={2}>
               <Text fontWeight={3} mb={3} fontFamily="sansSerif">
                   Wallet
               </Text>
               {this.renderContent()}
           </Card>
        );
    }
}

export default WalletBlock;