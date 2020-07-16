import React, {Component, createElement} from 'react';
import ReactDOM from 'react-dom'
import {Web3Utils} from "./Web3Utils";
import Web3 from "web3";
import ConnectionModalsUtil from "./ConnectionModalsUtil";




const DAppTransactionContext= React.createContext({
    contract:{},
    account:{},
    accountBalance:{},
    web3:{},
    initWeb3: ()=>{},
    validateAccount: ()=>{},
    accountValidated:{},
    initContract: ()=>{},
    initAccount: ()=>{},
    connectAndValidateAccount: ()=>{},
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




class DAppWeb3 extends Component {
    static Consumer = DAppTransactionContext.Consumer


    componentDidMount() {
        this.initWeb3()

    }
    getRequiredNetwork=() => {
        const networkId =
            typeof this.props.config !== "undefined" &&
            typeof this.props.config.requiredNetwork !== "undefined"
            ? this.props.config.requiredNetwork :1
        let networkName=''
        switch (networkId) {
            case 1:
                networkName="Main";
                break;
            case 3:
                networkName="Ropsten"
                break
            case 4:
                networkName="Rinkeby"
                break
            default:
                networkName="unknown"
        }

        let requiredNetwork={
            name: networkName,
            id: networkId
        }
        let network ={...this.state.network}
        network.required=requiredNetwork
        this.setState({network})
    }




    // Initialize web3 provider
    initWeb3 = async () => {

        let web3={}

        if(window.ethereum) {
            console.log("Using modern web3 provider")
            web3=new Web3(window.ethereum)
        }else if (window.web3) {
            console.log("Using Legacy web3 provider")
            web3=new Web3((window.web3.currentProvider))
        }else {
            console.log("No web3 detected.")
            // Show modal for no web3
            this.setState({ web3Fallback: true})
            return false
        }

        this.setState({web3},()=>{
            this.checkNetwork()
        })
        console.log("Web3 init process finished");
    }

    initAccount = async () => {

        // try metamask connect method
        if(window.ethereum){
            // Request Account Access

            try{
                await window.ethereum.enable().then(wallets =>{
                    const account= wallets[0]
                    this.close
                    this.setState({account})
                    console.log("Wallet address ",this.state.account)

                    //After Account is completed, get balance
                    this.getAccountBalance()

                    //watch for account change
                    this.pollAccountUpdates()

                })
            }catch (e) {
               // user denied access
               console.log("user denied access")

               //reject connect
               this.rejectAccountConnect()
            }
        }
    }

    pollAccountUpdates = () => {
        let account = this.state.account
        let requiresUpdate=false
        let accountInterval = setInterval(()=>{
            // account is currently pending and validating
            if(
                this.state.modals.data.accountConnectionPending ||
                this.state.modals.data.accountValidationPending
            ) {return}
            if(window.ethereum.isConnected()){
                const updatedAccount= window.web3.eth.accounts[0]
                if(updatedAccount.toLowerCase() !== account.toLowerCase()){
                    requiresUpdate=true
                }

                this.getAccountBalance()

                if(requiresUpdate){
                    clearInterval(accountInterval)
                    let modals=this.state.modals
                    modals.data.userRejectedConnecd=null
                    this.setState({
                        modals: modals,
                        account: "",
                        accountValidated:null,
                        transactions:[]
                    },()=>{
                        this.initAccount()
                    })
                }
            }
        },1000)
    }

    rejectAccountConnect = error => {
        let modals = {...this.state.modals}
        modals.data.accountConnectionPending=false
        modals.data.userRejectedConnect = true
        this.setState({modals})
    }

    getAccountBalance= async account => {
        const localAccount=account ? account : this.state.account
        if(localAccount){
            try {
                await this.state.web3.eth.getBalance(localAccount)
                    .then(accountBalance => {
                        if(!isNaN(accountBalance)){
                            accountBalance=this.state.web3.util.fromWei(accountBalance,'ether')
                            accountBalance=parseFloat(accountBalance)

                            // only update if account balance changed
                            if(accountBalance !== this.state.accountBalance) {
                                this.setState({accountBalance})
                                console.log("account balance ",accountBalance)
                                this.determineAccountBalanceLow();
                            }
                        }else {
                            this.setState({accountBalance:"--"})
                            console.log("Account balance failed: ",accountBalance)
                        }
                    })

            } catch (e) {
                console.log("No account on which to get account balance")
                return false
            }
        }
    }

    determineAccountBalanceLow = () => {
        const accountBalanceMinimum =
            typeof this.props.config !== "undefined" &&
            typeof this.props.accountBalanceMinimum ? this.props.accountBalanceMinimum : 1

        //check if account balance is low
        const accountBalanceLow =
            this.state.accountBalance < accountBalanceMinimum

        this.setState({accountBalanceLow})

        if(
            accountBalanceLow ===false &&
            this.state.modals.data.lowFundsModalIsOpen
        ) {
            this.closeLowFundsModal()

            window.toastProvider.addMessage("Received Funds!",{
                variant:'success',
                secondaryMessage: "You now have enough ETH"
            })
        }

    }

    connectAndValidateAccount= callback =>{
        // If MetaMask is not valid or active
        if(!this.state.web3){
            alert("Please install MetaMask and connect to you wallet to use this DApp")
            return
        }

        // If Network is not valid
        if(this.state.network.current.id !== this.state.network.required.id){
            alert("Please switch to right network. Use Ropsten.")
            return;
        }

        if(!this.state.account || this.state.accountValidated) {
            this.openConnectionModal()
        }

    }



    closeLowFundsModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.lowFundsModalIsOpen = false;
        this.setState({ modals });
    }

    openLowFundsModal = (e,callback) => {
        if (typeof e !== "undefined" && e !== null) {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.lowFundsModalIsOpen = true;
        this.setState({ modals, callback: callback });
    }



    getNetworkName = async () => {
        try {
            return this.state.web3.eth.net.getNetworkType((error,networkName) => {
                let current= {...this.state.network.current}
                current.name=networkName
                let network= {...this.state.network}
                network.current=current
                this.setState({network})
            })

        } catch (error) {
            console.log("Could not get networkName: ",error)
        }
    }

    getNetworkId = async () => {
        try {
            return this.state.web3.eth.net.getId((error,networkId) => {
                let current= {...this.state.network.current}
                current.id=networkId
                let network={...this.state.network}
                network.current=current
                this.setState({network})
            })

        } catch (error) {
           console.log("Could not get networkname: ",error)
        }
    }


    validateAccount = async () => {
        console.log("validateAccount");

        //Get account wallet if none exists
        if (!this.state.account) {
            await this.initAccount()

            if (!this.state.account) {
                return;
            }
        }

        console.log("Setting state to update UI")

        // Show blocking modal/
        this.openValidationPendingModal()

        console.log("Requesting web3 personal sign")

        return window.web3.personal.sign(
            window.web3.fromUtf8(`Hello from Movement Demo DApp`),
            this.state.account,
            (error,signature) => {
                if(error) {
                    //User rejected account validation

                    //RejectValidation
                    this.rejectValidation(error)
                }
            }
        )





    }

    rejectValidation = error => {
        let modals = {...this.state.modals}
        modals.data.userRejectedValidation=true
    }

    checkNetwork = async () => {
        this.getRequiredNetwork()
        await this.getNetworkId()
        await this.getNetworkName()

        // Validate for required network
        let network = {...this.state.network}
        network.isCorrectNetwork =
            this.state.network.current.id === this.state.network.required.id;
        this.setState({network})


    }

    // CONNECTION MODAL METHODS
    closeConnectionModal = e =>{
        if(typeof e !== "undefined"){
            e.preventDefault()
        }
        console.log('close connection modal')

        let modals={...this.state.modals}
        modals.data.connectionModalIsOpen=false
        this.setState({modals})
    }

    openConnectionModal = (e,callback) => {
        if(typeof e !== "undefined" &&  e!== null){
            console.log(e)
            e.preventDefault()
        }
        let modals={...this.state.modals}
        modals.data.connectionModalIsOpen=true
        this.setState({modals})


    }

    closeUserRejectedConnectionModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.userRejectedConnect = false;
        this.setState({ modals });
    };

    openUserRejectedConnectionModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.userRejectedConnect = true;
        this.setState({ modals });
    };

    closeValidationPendingModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.accountValidationPending = false;
        modals.data.connectionModalIsOpen = false;
        modals.data.transactionConnectionModalIsOpen = false;
        this.setState({ modals });
    };

    openValidationPendingModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.accountConnectionPending = false;
        modals.data.transactionConnectionModalIsOpen = false;
        modals.data.accountValidationPending = true;
        modals.data.userRejectedValidation = false;
        this.setState({ modals });
    };

    state={
        contract:{},
        account: null,
        accountBalance: null,
        accountBalanceMinimum:null,
        web3: null,
        web3Fallback: null,
        validateAccount: this.validateAccount,
        accountValidated:null,
        connectAndValidateAccount: this.connectAndValidateAccount,
        network:{
            required:{},
            current:{},
            isCorrectNetwork: null,
            checkNetwork: this.checkNetwork
        },
        modals: {
            data:{
                connectionModalIsOpen: false,
                userRejectedConnect: null,
                accountValidationPending: null,
                userRejectedValidation:null,

            },
            methods: {
                closeConnectionModal: this.closeConnectionModal,
                openConnectionModal: this.openConnectionModal,
                closeLowFundsModal: this.closeLowFundsModal,
                openLowFundsModal: this.openLowFundsModal,
                closeUserRejectedConnectionModal: this.closeUserRejectedConnectionModal,
                openUserRejectedConnectionModal: this.openUserRejectedConnectionModal,
                openValidationPendingModal: this.openValidationPendingModal,
                closeValidationPendingModal: this.closeValidationPendingModal,
                closeUserRejectedValidationModal: this.closeUserRejectedValidationModal,
                openUserRejectedValidationModal: this.openUserRejectedValidationModal,
            }
        }
    }

    render() {
        return (
           <div>
               <DAppTransactionContext.Provider value={this.state} {...this.props}/>
               <ConnectionModalsUtil
                   initAccount={this.state.initAccount}
                   account={this.state.account}
                   validateAccount={this.state.validateAccount}
                   accountConnectionPending={this.state.accountConnectionPending}
                   accountValidationPending={this.state.modals.data.accountValidationPending}
                   accountValidated={this.state.accountValidated}
                   network={this.state.network}
                   modals={this.state.modals}
               />
           </div>
        );
    }
}

export default DAppWeb3;