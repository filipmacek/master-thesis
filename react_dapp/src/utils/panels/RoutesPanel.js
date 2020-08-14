import React, {Component} from 'react';
import {Row, Col, Container, Button} from "react-bootstrap";

class RoutesPanel extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Button variant="primary" type="button" onClick={()=>console.log("Creating route")}>Create route</Button>
                    </Col>
                    <Col>
                        <Button variant="secondary" type="button" onClick={()=>console.log("List routes")}>List routes</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default RoutesPanel;