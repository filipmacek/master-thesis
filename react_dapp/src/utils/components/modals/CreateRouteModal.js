import React, {Component} from 'react';
import ModalCard from "../ModalCard";
import {Button, Form, Modal} from 'react-bootstrap'

class CreateRouteModal extends Component {
    state = {
        startLocation:null,
        endLocation:null,
        description: null,
        address:null
    }

    submitRoute = () =>{
        console.log("Submiting route")
        this.props.contractMethodSendWrapper("addRoute",{
            startLocation:this.state.startLocation,
            endLocation: this.state.endLocation,
            description: this.state.description
        })

    }

    render() {
        return (
            <Modal show={this.props.isOpen} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Route</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group >
                            <Form.Label>Start Location</Form.Label>
                            <Form.Control
                                onChange={e => this.setState({startLocation:e.target.value})}
                                type="text"
                                placeholder="E.g. -> 45.73831,15.54312"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>End location</Form.Label>
                            <Form.Control
                                onChange={e => this.setState({endLocation:e.target.value})}
                                type='text'
                                placeholder="E.g. -> 45.73831,15.54312"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control onChange={e => this.setState({description:e.target.value})}  type='text'/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>From Address(Maker)</Form.Label>
                            <Form.Control value={this.props.account}  type='text' readOnly/>
                        </Form.Group>


                        <Button variant="primary" onClick={this.submitRoute}>Submit</Button>


                    </Form>

                </Modal.Body>

            </Modal>



        );
    }
}

export default CreateRouteModal;