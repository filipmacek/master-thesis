import React, {Component} from 'react';
import {Modal} from "rimble-ui";
import ModalCard from "./ModalCard";

class EventsModal extends Component {
    renderModalContent = () =>{
        return(
            <React.Fragment>
                <p className="h1">Events modal</p>

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

export default EventsModal;