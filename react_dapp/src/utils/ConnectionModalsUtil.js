import React, {Component} from 'react';
import NoWalletModal from "./components/NoWalletModal";
import ConnectionModal from "./components/ConnectionModal";
import ValidationPendingModal from "./components/ValidationPendingModal";

class ConnectionModalsUtil extends Component {
    render() {
        return (
            <div>
                <ConnectionModal
                   closeModal={this.props.modals.methods.closeConnectionModal}
                   validateAccount={this.props.validateAccount}
                   isOpen={this.props.modals.data.connectionModalIsOpen && !this.props.accountValidated}
                 />

                 <ValidationPendingModal
                     closeModal={this.props.modals.methods.closeValidationPendingModal}
                     isOpen={this.props.modals.data.accountValidationPending}
                 />
            </div>
        );
    }
}

export default ConnectionModalsUtil;