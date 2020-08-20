import React, {Component} from 'react';
import {Row, Col, Container, Button} from "react-bootstrap";
import DAppWeb3 from "../DAppWeb3";
import {Box} from "rimble-ui";

class RoutesPanel extends Component {

    renderRoute1 = (route) =>{
        return(
            <Container className='m-2'>
                <Row>
                    <Col>
                        <h6>Route Id:1</h6>
                    </Col>
                    <Col className="text-primary">
                        <h6>In progress</h6>
                    </Col>
                    <Col>
                        <Button variant="info" size='sm'>Check</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
    renderRoute2 = (route) =>{
        return(
            <Container className='m-2'>
                <Row>
                    <Col>
                        <h6>Route Id:2</h6>
                    </Col>
                    <Col className="text-success">
                        <h6>Completed</h6>
                    </Col>
                    <Col>
                        <Button variant="success" size='sm'>Withdraw</Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    renderContent = ()=>{
        return(
            <Container>
                {this.renderRoute1()}

                {this.renderRoute2()}

            </Container>


        )
    }
    render() {
        return (
            <DAppWeb3.Consumer>
                {({
                    user
                  })=>(
                    (user === null ? <p>Not connected</p>:this.renderContent())

                )}
            </DAppWeb3.Consumer>
        );
    }
}

export default RoutesPanel;