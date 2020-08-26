import React, {Component} from 'react';
import ModalCard from "../ModalCard";
import {Modal,CardGroup} from "react-bootstrap";
import DAppWeb3 from "../../DAppWeb3";
import RouteCard from "./RouteCard";

class StatusOfRoutesModal extends Component {
    renderModalContent = () =>{
        return(
            <React.Fragment>
                <p className="h1">Status of routes</p>

            </React.Fragment>
        )
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {
        return (

                    <Modal show={this.props.isOpen} onHide={this.props.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Route list</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                                {this.props.routes.map((item,i) =>

                                    <RouteCard
                                        route={item}
                                        account={this.props.account}
                                        startEvents={this.props.startEvents.filter(event => event.routeId === item.routeId)}
                                        endEvents = {this.props.endEvents.filter(event => event.routeId === item.routeId)}
                                        checkStatusEvents = {this.props.checkStatusEvents.filter(event => event.routeId === item.routeId)}
                                    />
                                    )}

                        </Modal.Body>
                    </Modal>





        );
    }
}

export default StatusOfRoutesModal;