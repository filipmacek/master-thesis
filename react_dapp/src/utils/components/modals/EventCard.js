import React, {Component} from 'react';
import {Card, Col, Container, Row} from "react-bootstrap";

class EventCard extends Component {



    render() {
        return (
            <Card>
                <Card.Header>
                    <span>EventId: {this.props.startEvent.routeStartId}</span>
                </Card.Header>
                <Card.Body>
                    <p>RouteId: {this.props.startEvent.routeId}</p>
                    <p>Username: {this.props.startEvent.username}</p>

                <Container className="border border-info">
                    <Row>
                        <Col>
                            <p>Timestamp: {this.props.startEvent.timestamp.toTimeString()}</p>
                            <p>NodeId: {this.props.startEvent.nodeId}</p>
                        </Col>
                        <Col>
                            <p>Timestamp: {this.props.endEvent.timestamp.toTimeString()}</p>
                            <p>DataPoints: {this.props.endEvent.dataPoints}</p>
                            <p>NodeId: {this.props.endEvent.nodeId}</p>
                            <p>User status: {this.props.endEvent.userStatus}</p>
                        </Col>

                    </Row>
                </Container>

                </Card.Body>



            </Card>

        );
    }
}

export default EventCard;