import React, {Component} from 'react';
import {isBrowserWeb3Capable} from './Web3Utils'
const DAppTransactionContext= React.createContext({
    contract:{},
    account:{},
    accountBalance:{},
    web3:{},
    initWeb3: ()=>{},
    initContract: ()=>{},
    initAccount: ()=>{},
    network: {
        required: {},
        current: {},
        isCorrectNetwork:null,
        checkNetwork:()=>{}
    },
    modals: {
        data:{
            noWeb3BrowserModalIsOpen:{},
            noWalletModalIsOpen:{},
            connectionModalIsOpen:{},
            wrongNetworkModalIsOpen:{}

        },
        methods: {
            openNoWeb3BrowserModal: ()=>{},
            closeNoWeb3BrowserModal: ()=>{},
            openConnectionPendingModal:()=>{},
            closeConnectionPendingModal: ()=>{},
        }
    },
    transaction: {
        data: {
            transactions: {}
        },
        meta:{},
        methods:{}
    }

})



class MovementWeb3 extends Component {
    static Consumer = DAppTransactionContext.Consumer


    componentDidMount() {
        isBrowserWeb3Capable()
    }

    checkModernBrowser = async() => {

    }


    // Initialize web3 provider
    initWeb3 = async () => {

    }



    state={
        contract:{},
        account: null,
        web3: null
    }

    render() {
        return (
            <div>
                {this.props.children}
               <p>{this.props.config.accountBalanceMinimum}</p>
               <p>{this.props.config.requiredNetwork}</p>
            </div>
        );
    }
}

export default MovementWeb3;