import React, {Component} from 'react';
import {Box, Button, Flex, Heading, MetaMaskButton, Modal, Text,Icon,Link} from "rimble-ui";
import ModalCard from './ModalCard'

class ListUsersModal extends Component {


    renderModalContent=() =>{
        return(
            <React.Fragment>
                <Box mt={4} mb={5}>
                    <Heading fontSize={[4,5]}>List of users</Heading>
                    <Text fontSize={[2,3]} my={3}>This users are create and registered on Movement DApp</Text>
                </Box>


            </React.Fragment>
        )
    }


    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <ModalCard closeFunc={this.props.closeModal}>
                    <React.Fragment>
                        <ModalCard.Body>
                            {this.renderModalContent()}
                        </ModalCard.Body>
                    </React.Fragment>
                </ModalCard>

            </Modal>
        );
    }
}

export default ListUsersModal;