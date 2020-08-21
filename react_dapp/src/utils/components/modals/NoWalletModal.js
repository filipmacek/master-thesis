import React, {Component} from 'react';
import ModalCard from '../ModalCard';
import {
    Heading,
    Text,
    MetaMaskButton,
    Modal

} from "rimble-ui";

class NoWalletModal extends Component {
    renderContent =() => {
        return (
            <React.Fragment>
                <Heading.h2 my={3}>
                    Install MetaMask to use Movement DApp
                </Heading.h2>

                <MetaMaskButton href="https://metamask.io"
                                target="_blank"
                                title="MetaMask website"
                                mb={[5,0]}>
                    Install MetaMask
                </MetaMaskButton>
            </React.Fragment>
        )

    }


    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <ModalCard closeFunc={this.props.closeModal}>
                    <ModalCard.Body>
                        {this.renderContent()}
                    </ModalCard.Body>
                </ModalCard>

            </Modal>
        );
    }
}

export default NoWalletModal;