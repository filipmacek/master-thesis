import React, {Component} from 'react';
import Web3 from "web3";
import ConnectionModalsUtil from "./ConnectionModalsUtil";
import {toast} from "react-toastify";
import {ContractMetadata} from "./ContractMetadata";

// Address of smart contract
const contractAddress=ContractMetadata.address
// Contract ABI -got it from remixd
const abi=ContractMetadata.abi


const DAppTransactionContext= React.createContext({
    contract:{},
    account:{},
    accountBalance:{},
    accountBalanceLow:{},
    web3:{},
    initWeb3: ()=>{},
    validateAccount: ()=>{},
    accountValidated:{},
    initContract: ()=>{},
    initAccount: ()=>{},
    connectAndValidateAccount: ()=>{},
    contractMethodSendWrapper: ()=>{},
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
            listUserModalIsOpen: {}
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
            openListUserModal: ()=>{},
            closeListUserModal: ()=>{}
        }
    },
    transaction: {},
    users:[],
    isUserCreated:{}

})




class DAppWeb3 extends Component {
    static Consumer = DAppTransactionContext.Consumer


    componentDidMount() {
        this.initWeb3()
        this.checkIfWalletExists()
        this.setupIntervals()

    }

    setupIntervals= () => {
        let accountChange=setInterval(()=>{
            const localAccount=this.state.account
            const globalAccount=window.web3.eth.accounts[0]
            if(localAccount == null) {
                return;
            }
            if(globalAccount !== localAccount){
                // Clear storage if wallet is remembered
                if(this.state.rememberWallet){
                    localStorage.clear()
                    this.setState({
                        account:null,
                        accountValidated:null,
                        rememberWallet:null,
                        isUserCreated:false
                    })
                }


            }

        },1000)

        let accountBalanceChange=setInterval(()=>{
            let account = this.state.account
            if(account === null){return;}
            if(this.state.modals.data.accountConnectionPending ||
                    this.state.modals.data.accountValidationPending
                ) {
                    return
                }
                if(window.ethereum.isConnected()){

                    // If account balance changed, that means you got some funds
                    this.getAccountBalance(account)
                }else {
                    console.log("Not connected wallet")
                }

        },1000)
    }


    checkIfWalletExists = () => {

        if(localStorage.getItem('account') === null){
            // account is not remembered
            return;
        }else{
            let accountFromStorage=localStorage.getItem("account")
            let accountValidatedFromStorage=localStorage.getItem('accountValidated')
            this.setState({
                account: accountFromStorage,
                accountValidated: accountValidatedFromStorage
            })
        }
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
                    this.setState({account},()=> {
                        console.log("Wallet address ", this.state.account)

                        // If rememberWallet is true save account to local storage
                        if (this.state.rememberWallet) {
                            console.log("Putting account in local storage")
                            localStorage.setItem('account',account)
                        }

                        //After Account is completed, get balance
                        this.getAccountBalance(account)

                        // Check if user is already create
                        this.checkIfUserCreated()
                    })
                    //watch for account change
                    // this.pullAccountChange()
                })
            }catch (e) {
               // user denied access
               console.log("user denied access")

               //reject connect
               this.rejectAccountConnect()
            }
        }
    }

    checkIfUserCreated = () =>{
        const userExists=this.state.users.find(user =>user.address.toLowerCase()===this.state.account.toLowerCase())
        if(userExists !== undefined){
            console.log("User is already created")
            this.setState({isUserCreated:true})
        }
    }

    initContract= async () => {
        console.log("Connecting and syncing with smart contract")

        try {
            const contract = await new this.state.web3.eth.Contract(abi,contractAddress)

            console.log("Connected with contract")
            this.setState({contract},()=>{
                this.fetchUsers()
            })
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
        console.log("Fetching users")
        let users=[]

        try {
            this.state.contract.methods.getUsersCount().call().then(value => {
                console.log("Users count: ", value)
                // Init users so its always empty

                var i;
                let promise1,promise3;
                for(i=0;i <value;i++) {
                    promise1 = this.state.contract.methods.getUsername(i).call()
                    // promise2 = this.state.contract.methods.getPassword(i).call()
                    promise3 = this.state.contract.methods.getAddress(i).call()
                    Promise.all([promise1,  promise3]).then(result => {
                        users.push({username: result[0], address: result[1]})
                    })
                }
            }).catch(error => {
                console.log("Cannot get users with 2")
            })
        }catch (e) {
            console.log("error getting users with 2",e)
        }

        // Subscribe to any new users created event when site loaded
        // so your users are always updated
        this.state.contract.events.NewUserCreated()
            .on("connected",function (subscriptionId) {console.log("SubscriptionId  ",subscriptionId)})
            .on("data",(event)=> {
                console.log("Event - New user created",event)
                console.log(this.state.users)

            })

        this.setState({users:users},()=>{
            console.log("Callback from fetch users ",this.state.users)

        })

    }


    contractMethodSendWrapper = (contractMethod,value) => {
        // If Network is not valid
        if (this.state.network.current.id !== this.state.network.required.id) {
            alert("Please switch to right network. Use Rinkeby.")
            return;
        }

        // If your are not connected with wallet
        if (!this.state.account) {
            alert("Please connect with your wallet to send transactions")
            return;
        }

        // Is there enough funds in wallet
        if(this.state.accountBalanceLow){
            alert("You dont have enough funds to send transaction. Fund your account with ETH.")
            return;
        }

        // Is contract loaded
        if(!this.state.contract){
            alert("Contract is not loaded")
            return;
        }

         // Create transaction object
        let transaction = this.createTransaction()
        this.addTransaction(transaction)

        // Add metadata to transaction
        transaction.method=contractMethod
        transaction.type="contract"
        transaction.status="started"



        this.updateTransaction(transaction)

        const {contract,account}= this.state


        if(contractMethod === 'addUser') {
            this.contractAddUser(contract, account, transaction, value)
        }else if (contractMethod === "deleteUser") {
            this.contractDeleteUser(contract,account,transaction,value)
        }


        // Network and account are connected,its OK to send transaction


    }

    contractDeleteUser =(contract,account,transaction,value) => {
        try {
            contract.methods.deleteUser(value.username).send({
                from:account,
            })
                .on("transactionHash",hash =>{
                    console.log("Hash ",hash)
                    // Transaction is submitted to block and you received transaction hash

                    //Toast Transaction Created
                    toast.info('Transaction created', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: true,
                    });

                    transaction.hash = hash
                    transaction.status = "pending"
                    transaction.recentEvent="transactionHash"
                    this.updateTransaction(transaction)
                })
                .on("confirmation",(confirmationNumber,receipt) =>{
                    console.log("ConfirmationNUmber",confirmationNumber)
                    console.log("Receipt",receipt)
                    // Update confirmation count on each subsequent confirmation
                    transaction.confirmationCount+=1

                    // How many confirmations should be received before informing the user
                    const confidenceThreshold = 3

                    if(transaction.confirmationCount ===1 ){
                        // Initial confimation receipt
                        transaction.status="confirmed"
                    }else if (transaction.confirmationCount < confidenceThreshold) {
                        // Not enough confirmation
                    }else if( transaction.confirmationCount === confidenceThreshold) {
                        // Confirmation match threshold
                        // Check the status from result
                        if(receipt.status) {
                            transaction.status = "success"
                        }else if(!receipt.status){
                            transaction.status="error"
                        }

                    }else if(transaction.confirmationCount > confidenceThreshold) {

                    }
                    // Update transaction with receipt details
                    transaction.recentEvent="confirmation"
                    this.updateTransaction(transaction)

                })
                .on("receipt",receipt => {
                    // Received receipt
                    console.log("Receipt")
                    transaction.recentEvent = 'receipt'
                    this.updateTransaction(transaction)

                })
                .on("error",error => {
                    console.log("Errorrrr ",error)
                    transaction.status = 'error'
                    transaction.recentEvent='error'
                    this.updateTransaction(transaction)

                })

        } catch (e) {
            transaction.status = "error"
            this.updateTransaction(transaction)
            console.log("Error sending transaction ",transaction)

        }


    }
    contractAddUser = (contract,account,transaction,value) =>{

        try {
            contract.methods.addUser(value.username,value.password).send({
                from:account,
            })
                .on("transactionHash",hash =>{
                    console.log("Hash ",hash)

                    //Toast Transaction Created
                    toast.info('Transaction created', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: true,
                    });



                    // Transaction is submitted to block and you received transaction hash
                    transaction.hash = hash
                    transaction.status = "pending"
                    transaction.recentEvent="transactionHash"
                    this.updateTransaction(transaction)
                })
                .on("confirmation",(confirmationNumber,receipt) =>{
                    console.log("ConfirmationNUmber",confirmationNumber)
                    console.log("Receipt",receipt)
                    // Update confirmation count on each subsequent confirmation
                    transaction.confirmationCount+=1

                    // How many confirmations should be received before informing the user
                    const confidenceThreshold = 3

                    if(transaction.confirmationCount ===1 ){
                        // Initial confimation receipt
                        transaction.status="confirmed"
                    }else if (transaction.confirmationCount < confidenceThreshold) {
                        // Not enough confirmation
                    }else if( transaction.confirmationCount === confidenceThreshold) {
                        // Confirmation match threshold
                        // Check the status from result
                        if(receipt.status) {
                            transaction.status = "success"
                        }else if(!receipt.status){
                            transaction.status="error"
                        }

                    }else if(transaction.confirmationCount > confidenceThreshold) {

                    }
                    // Update transaction with receipt details
                    transaction.recentEvent="confirmation"
                    this.updateTransaction(transaction)

                })
                .on("receipt",receipt => {
                    // Received receipt
                    console.log("Receipt")
                    transaction.recentEvent = 'receipt'
                    this.updateTransaction(transaction)

                })
                .on("error",error => {
                    console.log("Errorrrr ",error)
                    transaction.status = 'error'
                    transaction.recentEvent='error'
                    this.updateTransaction(transaction)

                })

        } catch (e) {
            transaction.status = "error"
            this.updateTransaction(transaction)
            console.log("Error sending transaction ",transaction)

        }



    }

    addTransaction = (transaction) => {
        let transactions = {...this.state.transactions}
        console.log("Adding transaction ",transaction)
        transactions[`${transaction.created}`]=transaction
        this.setState({transactions})
    }

    updateTransaction =(updatedTransaction) => {
        let transactions={...this.state.transactions}
        let transaction = {...updatedTransaction}
        transaction.lastUpdated=Date.now()
        transactions[`${transaction.created}`] = transaction
        this.setState({transactions})

    }

    createTransaction = () => {
        let transaction={}
        transaction.created=Date.now()
        transaction.lastUpdated=Date.now()
        transaction.status='initialized'
        transaction.confirmationCount=0
        return transaction

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
            typeof this.props.config.accountBalanceMinimum ? this.props.config.accountBalanceMinimum : 1

        //check if account balance is low
        const accountBalanceLow =
            this.state.accountBalance < accountBalanceMinimum
        this.setState({accountBalanceLow})

    }

    connectAndValidateAccount= (rememberWallet,callback) =>{
        // If MetaMask is not valid or active
        if(!this.state.web3){
            alert("Please install MetaMask and connect to you wallet to use this DApp")
            return
        }

        // If Network is not valid
        if(this.state.network.current.id !== this.state.network.required.id){
            alert("Please switch to right network. Use Rinkeby.")
            return;
        }

        if(!this.state.account || this.state.accountValidated) {
            this.setState({rememberWallet},() =>{
                this.openConnectionModal()
            })
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

                    // If user wants to remember wallet and is rejecting validation
                    if(this.state.rememberWallet){
                        localStorage.setItem('accountValidated',false)
                    }


                    //RejectValidation
                    this.rejectValidation(error)

                }else {
                    console.log("Account has been validated: ",this.state.account)
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

                    if(this.state.rememberWallet){
                        console.log("Validating account from local storage that user accepted")

                        localStorage.setItem('accountValidated',true)
                    }

                }
            }
        )





    }

    rejectValidation = error => {
        let modals = {...this.state.modals}
        modals.data.userRejectedValidation=true
        this.closeValidationPendingModal()
        this.setState({modals})
    }

    checkNetwork = async () => {
        this.getRequiredNetwork()
        await this.getNetworkId()
        await this.getNetworkName()
        console.log("Network ",this.state.network)

        // Validate for required network
        let network = {...this.state.network}
        network.isCorrectNetwork =
            this.state.network.current.id === this.state.network.required.id;
        this.setState({network},()=>{
            // if correct network init Contract
            if(this.state.network.isCorrectNetwork){
                this.initContract()
            }

        })


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





    closeListUserModal = (e) =>{

        if (typeof e !== "undefined"){
            e.preventDefault()
        }

        let modals = {...this.state.modals}
        modals.data.listUserModalIsOpen=false
        this.setState({modals})
    }


    openListUserModal = (e) =>{

        if (typeof e !== "undefined"){
            e.preventDefault()
        }

        let modals = {...this.state.modals}
        modals.data.listUserModalIsOpen=true
        this.setState({modals})
    }
    clearAccount=()=>{
        this.setState({account:null})
    }




    state={
        contract:{},
        account: null,
        accountBalance: null,
        accountBalanceLow:null,
        rememberWallet: null,
        web3: null,
        web3Fallback: null,
        validateAccount: this.validateAccount,
        accountValidated:null,
        connectAndValidateAccount: this.connectAndValidateAccount,
        contractMethodSendWrapper: this.contractMethodSendWrapper,
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
                listUserModalIsOpen:null,
                userSubmitModalIsOpen:null
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
                closeListUserModal: this.closeListUserModal,
                openListUserModal: this.openListUserModal
            }
        },
        users:[],
        transactions:{},
        isUserCreated:false
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
                   users={this.state.users}
                   contractMethodSendWrapper={this.contractMethodSendWrapper}
                   clearAccount={this.clearAccount}
               />


           </div>
        );
    }
}

export default DAppWeb3;