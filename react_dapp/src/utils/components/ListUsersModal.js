import React, {Component} from 'react';
import {Box, Button, Flex, Heading, MetaMaskButton, Modal, Text,Icon,Link} from "rimble-ui";
import ModalCard from './ModalCard'
import UserCard from "./UserCard";
import {CardGroup} from "react-bootstrap";

class ListUsersModal extends Component {




    renderModalContent=() =>{
        return(
            <React.Fragment >
                <Box mt={4} mb={3}>
                    <Heading fontSize={[4,5]}>List of users</Heading>
                    <Text fontSize={[2,3]} my={3}>This users are create and registered on Movement DApp</Text>
                </Box>

                <Flex flexDirection={"column"} justifyContent={"space-between"} my={3} >

                {this.props.users.map((user,i) =>{
                    return <UserCard user={user}
                                     account={this.props.account}
                                     contractMethodSendWrapper={this.props.contractMethodSendWrapper}/>
                })}
                </Flex>


            </React.Fragment>
        )
    }


    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <ModalCard closeFunc={this.props.closeModal}>
                        <ModalCard.Body>
                            {this.renderModalContent()}
                        </ModalCard.Body>
                </ModalCard>

            </Modal>
        );
    }
}

export default ListUsersModal;