import React, {Component} from 'react';
import ConnectionModal from "./components/modals/ConnectionModal";
import ValidationPendingModal from "./components/modals/ValidationPendingModal";
import UserRejectedValidationModal from "./components/modals/UserRejectedValidationModal";
import ConnectionPendingModal from "./components/modals/ConnectionPendingModal";
import WrongNetworkModal from "./components/modals/WrongNetworkModal";
import TransactionConnectionModal from "./components/modals/TransactionConnectionModal";
import UserRejectedConnectionModal from "./components/modals/UserRejectedConnectionModal";
import ListUsersModal from "./components/modals/ListUsersModal";
import CreateRouteModal from "./components/modals/CreateRouteModal";
import EventsModal from "./components/modals/EventsModal";
import StatusOfRoutesModal from "./components/modals/StatusOfRoutesModal";


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
                    clearAccount={this.props.clearAccount}
                />

                <ListUsersModal
                    closeModal={this.props.modals.methods.closeListUserModal}
                    isOpen={this.props.modals.data.listUserModalIsOpen}
                    users={this.props.users}
                    account={this.props.account}
                    contractMethodSendWrapper={this.props.contractMethodSendWrapper}
                />
                <CreateRouteModal
                    closeModal = {this.props.modals.methods.closeCreateRouteModal}
                    isOpen = {this.props.modals.data.createRouteModalIsOpen}
                    account={this.props.account}
                    contractMethodSendWrapper={this.props.contractMethodSendWrapper}
                />
                <EventsModal
                    closeModal = {this.props.modals.methods.closeEventsModal}
                    isOpen={this.props.modals.data.eventsModalIsOpen}
                    startEvents = {this.props.startEvents}
                    endEvents = {this.props.endEvents}
                />
                <StatusOfRoutesModal
                    closeModal = {this.props.modals.methods.closeStatusOfRoutesModal}
                    isOpen = {this.props.modals.data.statusOfRoutesModalIsOpen}
                    routes={this.props.routes}
                    account = {this.props.account}
                    startEvents={this.props.startEvents}
                    endEvents={this.props.endEvents}
                    checkStatusEvents = {this.props.checkStatusEvents}
                />


            </div>
        );
    }
}

export default ConnectionModalsUtil;