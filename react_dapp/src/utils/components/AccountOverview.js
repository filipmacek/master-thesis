import React, {Component} from 'react';
import {Text,Flex} from "rimble-ui";
import ShortHash from "./ShortHash";

class AccountOverview extends Component {
    trimEth = eth => {
        eth = parseFloat(eth);
        eth = eth * 10000;
        eth = Math.round(eth);
        eth = eth / 10000;
        eth = eth.toFixed(4);

        return eth;
    };

    render() {
        const roundedBalance = this.trimEth(this.props.accountBalance)
        return (
            <div>

            </div>
        );
    }
}

export default AccountOverview;