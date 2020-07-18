import React, {Component, createElement} from 'react';
import ReactDOM from 'react-dom'
import {Web3Utils} from "./Web3Utils";
import Web3 from "web3";
import ConnectionModalsUtil from "./ConnectionModalsUtil";
import {toast, ToastContainer} from "react-toastify";
import SmartContractControl from "./panels/SmartContractPanel";

// Address of smart contract
const contractAddress="0xc9c9c05859D3B2DDAb93628167D7b3d84DaC78f5"

// Contract ABI -got it from remixd
const abi=[
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "NewUserCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_username",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_password",
                "type": "string"
            }
        ],
        "name": "addUser",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getPassword",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getUsername",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUsersCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_username",
                "type": "string"
            }
        ],
        "name": "isUser",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "users",
        "outputs": [
            {
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "password",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isExist",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "usersByUsername",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usersCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]



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
        data: {
            noWeb3BrowserModalIsOpen: {},
            noWalletModalIsOpen: {},
            connectionModalIsOpen: {},
            accountConnectionPending: {},
            userRejectedConnect: {},
            accountValidationPending: {},
            userRejectedValidation: {},
            wrongNetworkModalIsOpen: {},
            transactionConnectionModalIsOpen: {},
            lowFundsModalIsOpen: {}
        },
        methods: {
            openNoWeb3BrowserModal: () => {},
            closeNoWeb3BrowserModal: () => {},
            closeConnectionPendingModal: () => {},
            openConnectionPendingModal: () => {},
            closeUserRejectedConnectionModal: () => {},
            openUserRejectedConnectionModal: () => {},
            closeValidationPendingModal: () => {},
            openValidationPendingModal: () => {},
            closeUserRejectedValidationModal: () => {},
            openUserRejectedValidationModal: () => {},
            closeWrongNetworkModal: () => {},
            openWrongNetworkModal: () => {},
            closeTransactionConnectionModal: () => {},
            openTransactionConnectionModal: () => {},
            closeLowFundsModal: () => {},
            openLowFundsModal: () => {}
        }
    },
    transaction: {
        data: {
            transactions: {}
        },
        meta:{},
        methods:{}
    },
    users:[]

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
        console.log("initAccount")
        this.openConnectionPendingModal()
        // try metamask connect method
        if(window.ethereum){
            // Request Account Access

            try{
                await window.ethereum.enable().then(wallets =>{
                    const account= wallets[0]
                    this.closeConnectionPendingModal()
                    this.setState({account})
                    console.log("Wallet address ",this.state.account)

                    //After Account is completed, get balance
                    this.getAccountBalance(account)

                    // Init contract
                    this.initContract()

                    //watch for account change
                    this.pullAccountChange()

                })
            }catch (e) {
               // user denied access
               console.log("user denied access")

               //reject connect
               this.rejectAccountConnect()
            }
        }
    }

    initContract= async () => {
        console.log("Connecting and syncing with smart contract")

        try {
            const contract = await new this.state.web3.eth.Contract(abi,contractAddress)
            this.setState({contract})
            console.log("Connected with contract")
            console.log(contract)
        } catch (e) {
           console.log("Could not create contract.")
           toast.error("Contract creation failed",{
               position: "bottom-right",
               autoClose: 3000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: false,
               draggable: true,
               progress: undefined,
           })
        }

    }

    fetchUsers = () =>{
        console.log("getting users")

        try {
            this.state.contract.methods.getUsersCount().call().then(value => {
                console.log("Users count: ", value)
                this.setState({
                    users:[]
                })
                var i;
                let promise1,promise2,promise3;
                for(i=1;i <=value;i++) {
                    console.log("i ", i)
                    promise1 = this.state.contract.methods.getUsername(i).call()
                    promise2 = this.state.contract.methods.getPassword(i).call()
                    promise3 = this.state.contract.methods.getAddress(i).call()
                    Promise.all([promise1, promise2, promise3]).then(result => {
                        this.setState(prevState => ({
                            users: [...prevState.users, {username: result[0], password: result[1], address: result[2]}]
                        }))
                    })
                }
            }).catch(error => {
                console.log("Cannot get users with 2")
            })
        }catch (e) {
            console.log("error getting users with 2",e)
        }



    }

    fetchRoutes = () =>{

    }

    fetchNodes= () => {

    }


    pullAccountChange = () => {
        let account = this.state.account
        let requiresUpdate=false
        let accountInterval = setInterval(()=>{
            // account is currently pending and validating
            if(
                this.state.modals.data.accountConnectionPending ||
                this.state.modals.data.accountValidationPending
            ) {
                return
            }
            if(window.ethereum.isConnected()){
                const updatedAccount= window.web3.eth.accounts[0]
                if(updatedAccount.toLowerCase() !== account.toLowerCase()){
                    requiresUpdate=true
                }

                // If account balance changed, that means you got some funds
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
        if (localAccount) {
            try {
                await this.state.web3.eth
                    .getBalance(localAccount)
                    .then(accountBalance => {
                        if (!isNaN(accountBalance)) {
                            accountBalance = this.state.web3.utils.fromWei(
                                accountBalance,
                                "ether"
                            );
                            accountBalance = parseFloat(accountBalance);

                            // Only update if changed
                            if (accountBalance !== this.state.accountBalance) {
                                this.setState({ accountBalance });
                                this.determineAccountBalanceLow();
                            }
                        } else {
                            this.setState({ accountBalance: "--" });
                            console.log("account balance FAILED", accountBalance);
                        }
                    });
            } catch (error) {
                console.log("Failed to get account balance." + error);
            }
        } else {
            console.log("No account on which to get balance");
            return false;
        }
    };

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

            toast.info("You now have enough funds!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
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
                    console.log("nije proslo")
                    //RejectValidation
                    this.rejectValidation(error)

                }else {
                    console.log("proslo")
                    const successMessage="Connected"
                    console.log(successMessage,signature)
                    toast.success("Welcome to the Movement Demo DApp", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                    this.closeValidationPendingModal()
                    this.setState({
                        accountValidated:true
                    })
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

    closeConnectionPendingModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.accountConnectionPending = false;
        this.setState({ modals });
    };

    openConnectionPendingModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.accountConnectionPending = true;
        modals.data.transactionConnectionModalIsOpen = false;
        modals.data.connectionModalIsOpen = false;

        this.setState({ modals });
    };
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

    closeUserRejectedValidationModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.userRejectedValidation = false;
        modals.data.connectionModalIsOpen = false;
        modals.data.transactionConnectionModalIsOpen = false;
        this.setState({ modals });
    };

    openUserRejectedValidationModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.userRejectedValidation = true;
        modals.data.connectionModalIsOpen = false;
        modals.data.transactionConnectionModalIsOpen = false;
        this.setState({ modals });
    };

    closeWrongNetworkModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.wrongNetworkModalIsOpen = false;
        this.setState({ modals });
    };

    openWrongNetworkModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.wrongNetworkModalIsOpen = true;
        this.setState({ modals });
    };


    closeTransactionConnectionModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.transactionConnectionModalIsOpen = false;
        this.setState({ modals });
    };

    openTransactionConnectionModal = (e, callback) => {
        if (typeof e !== "undefined" && e !== null) {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.transactionConnectionModalIsOpen = true;
        this.setState({ modals, callback: callback });
    };

    closeLowFundsModal = e => {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.lowFundsModalIsOpen = false;
        this.setState({ modals });
    };

    openLowFundsModal = (e, callback) => {
        if (typeof e !== "undefined" && e !== null) {
            e.preventDefault();
        }

        let modals = { ...this.state.modals };
        modals.data.lowFundsModalIsOpen = true;
        this.setState({ modals, callback: callback });
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
            data: {
                noWeb3BrowserModalIsOpen: this.noWeb3BrowserModalIsOpen,
                noWalletModalIsOpen: this.noWalletModalIsOpen,
                connectionModalIsOpen: null,
                accountConnectionPending: null,
                userRejectedConnect: null,
                accountValidationPending: null,
                userRejectedValidation: null,
                wrongNetworkModalIsOpen: null,
                transactionConnectionModalIsOpen: null,
                lowFundsModalIsOpen: null
            },
            methods: {
                openNoWeb3BrowserModal: this.openNoWeb3BrowserModal,
                closeNoWeb3BrowserModal: this.closeNoWeb3BrowserModal,
                openNoWalletModal: this.openNoWalletModal,
                closeNoWalletModal: this.closeNoWalletModal,
                closeConnectionModal: this.closeConnectionModal,
                openConnectionModal: this.openConnectionModal,
                closeConnectionPendingModal: this.closeConnectionPendingModal,
                openConnectionPendingModal: this.openConnectionPendingModal,
                closeUserRejectedConnectionModal: this.closeUserRejectedConnectionModal,
                openUserRejectedConnectionModal: this.openUserRejectedConnectionModal,
                closeValidationPendingModal: this.closeValidationPendingModal,
                openValidationPendingModal: this.openValidationPendingModal,
                closeUserRejectedValidationModal: this.closeUserRejectedValidationModal,
                openUserRejectedValidationModal: this.openUserRejectedValidationModal,
                closeWrongNetworkModal: this.closeWrongNetworkModal,
                openWrongNetworkModal: this.openWrongNetworkModal,
                closeTransactionConnectionModal: this.closeTransactionConnectionModal,
                openTransactionConnectionModal: this.openTransactionConnectionModal,
                closeLowFundsModal: this.closeLowFundsModal,
                openLowFundsModal: this.openLowFundsModal
            }
        },
        users:[]
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