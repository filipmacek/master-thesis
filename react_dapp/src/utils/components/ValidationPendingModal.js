import React from "react";
import {
    Heading,
    Text,
    Modal,
    Flex,
    Box,
    Loader
} from "rimble-ui";
import ModalCard from './ModalCard';

class ValidationPendingModal extends React.Component {
    renderContent = () => {
        return (
            <React.Fragment>
                <Heading.h2 my={3}>Verify Ethereum account</Heading.h2>

                <Text my={4}>
                    Sign the message that's just appeared and we'll connect you. This
                    shows us you have access to this account. If you can't see a
                    message, open your MetaMask extension.

                    .
                </Text>

                <Box bg={"#f6f6fc"} p={3} display={["none", "block"]}>
                    <Flex alignItems={"center"}>
                        <Box position={"relative"} width={"4em"}>
                            <Box>
                                <Loader size={"3em"} />
                            </Box>
                        </Box>
                        <Box>
                            <Text fontWeight={4}>Waiting for you to sign...</Text>
                            <Text fontWeight={2}>This won’t cost you any Ether</Text>
                        </Box>
                    </Flex>
                </Box>
            </React.Fragment>
        );
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

export default ValidationPendingModal;