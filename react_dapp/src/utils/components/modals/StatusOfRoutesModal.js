import React, {Component} from 'react';
import ModalCard from "../ModalCard";
import {Modal} from "react-bootstrap";
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
                            {this.props.routes.map((item,i) =><RouteCard route={item}/>)}
                        </Modal.Body>
                    </Modal>

        );
    }
}

export default StatusOfRoutesModal;