import React, {Component} from 'react';
import ConnectionModal from "./components/ConnectionModal";
import ValidationPendingModal from "./components/ValidationPendingModal";
import UserRejectedValidationModal from "./components/UserRejectedValidationModal";
import ConnectionPendingModal from "./components/ConnectionPendingModal";
import WrongNetworkModal from "./components/WrongNetworkModal";
import TransactionConnectionModal from "./components/TransactionConnectionModal";
import UserRejectedConnectionModal from "./components/UserRejectedConnectionModal";
import LowFundsModal from "./components/LowFundsModal";


class ConnectionModalsUtil extends Component {
    render() {
        return (
            <div>
                <WrongNetworkModal
                    closeModal={this.props.modals.methods.closeWrongNetworkModal}
                    isOpen={this.props.modals.data.wrongNetworkModalIsOpen}
                    network={this.props.network}
                />

                <ConnectionModal
                    closeModal={this.props.modals.methods.closeConnectionModal}
                    validateAccount={this.props.validateAccount}
                    isOpen={
                        this.props.modals.data.connectionModalIsOpen &&
                        !this.props.accountValidated
                    }
                    currentNetwork={this.props.network.current}
                />

                <TransactionConnectionModal
                    closeModal={this.props.modals.methods.closeTransactionConnectionModal}
                    validateAccount={this.props.validateAccount}
                    isOpen={this.props.modals.data.transactionConnectionModalIsOpen}
                    currentNetwork={this.props.network.current}
                />

                <ConnectionPendingModal
                    closeModal={this.props.modals.methods.closeConnectionPendingModal}
                    isOpen={this.props.modals.data.accountConnectionPending}
                    currentNetwork={this.props.network.current}
                />
                <UserRejectedConnectionModal
                    closeModal={
                        this.props.modals.methods.closeUserRejectedConnectionModal
                    }
                    isOpen={this.props.modals.data.userRejectedConnect}
                    initAccount={this.props.initAccount}
                />

                <ValidationPendingModal
                    closeModal={this.props.modals.methods.closeValidationPendingModal}
                    isOpen={this.props.modals.data.accountValidationPending}
                    currentNetwork={this.props.network.current}
                    account={this.props.account}
                />
                <UserRejectedValidationModal
                    closeModal={
                        this.props.modals.methods.closeUserRejectedValidationModal
                    }
                    isOpen={this.props.modals.data.userRejectedValidation}
                    validateAccount={this.props.validateAccount}
                />

                <LowFundsModal
                    closeModal={this.props.modals.methods.closeLowFundsModal}
                    isOpen={this.props.modals.data.lowFundsModalIsOpen}
                    currentNetwork={this.props.network.current}
                    account={this.props.account}
                />
            </div>
        );
    }
}

export default ConnectionModalsUtil;