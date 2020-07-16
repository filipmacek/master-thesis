import React, {Component} from 'react';
import DAppWeb3 from "../utils/DAppWeb3";
import {Card} from "rimble-ui";
import SmartContractControlPlane from "./SmartContractControlPlane";
class PrimaryCard extends Component {
    render() {
        return (
            <DAppWeb3.Consumer>
                {({
                    contract,
                    account,
                    transactions,
                    initContract,
                    initAccount,
                    contractMethodSendWrapper
                  })=>(
                      <Card maxWidth={"640px"} px={4} mx={"auto"}>
                          <SmartContractControlPlane>

                          </SmartContractControlPlane>
                      </Card>

                )}
            </DAppWeb3.Consumer>
        );
    }
}

export default PrimaryCard;