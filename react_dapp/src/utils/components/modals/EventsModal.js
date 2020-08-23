import React, {Component} from 'react';
import ModalCard from "../ModalCard";
import {Modal} from "react-bootstrap";
import EventCard from "./EventCard";

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
            <Modal show={this.props.isOpen} onHide={this.props.closeModal}>
                <Modal.Header>Route Events</Modal.Header>
                <Modal.Body>
                    {this.props.endEvents.map((item,i)=>
                        <EventCard startEvent={this.props.startEvents[i]}
                            endEvent={this.props.endEvents[i]}/>)}
                </Modal.Body>
                {}
            </Modal>



        );
    }
}

export default EventsModal;