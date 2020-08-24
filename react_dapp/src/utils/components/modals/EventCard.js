import React, {Component} from 'react';
import {Card, Col, Container, Row} from "react-bootstrap";
import CheckIcon from '@material-ui/icons/Check';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
const textStyle = {
    fontSize:"12px",
    marginBottom:"6px"
}
class EventCard extends Component {

    makeTimeString = (time) =>{
        return time.substring(0,time.length-4)
    }

    renderIcon = index => {
        switch (index){
            case 1:
                return <CheckCircleIcon style={{fill:"green",fontSize:"15px",marginLeft:"10px"}}/>
            case 2:
                return <CancelIcon style={{fill:"red",fontSize:"15px",marginLeft:"10px"}}/>
            default:
                return null
        }
    }

    renderUserCancelled = () => {
        return(
            <p style={{color:"red"}}>User cancelled</p>
        )

    }
    renderUserSubmitted =(event) =>{
        return(
            <div>
                <p style={textStyle}>Node1DataPoints:  {event.node1DataPoints}</p>
                <p style={textStyle}>Node2DataPoints:  {event.node2DataPoints}</p>
                <p style={{color:"green"}}>User submitted</p>


            </div>


        )
    }

    render() {

        return (
            <Card className="mb-3">
                <Card.Header>
                    <span>EventID:    {this.props.startEvent.routeStartId}</span>
                </Card.Header>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col>
                                <p>RouteID: {this.props.startEvent.routeId}</p>
                            </Col>
                            <Col>
                                <p>User: {this.props.startEvent.username}</p>
                            </Col>
                        </Row>
                    </Container>

                <Container style={{paddingRight:'0',paddingLeft:0}}>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header style={{display:'flex',fontSize:'14px'}}>Start Event
                                    <span style={{marginLeft:'auto'}}>
                                        {this.props.startEvent.timestamp ? <CheckIcon style={{fill:"green"}}/> :null}
                                    </span>

                                </Card.Header>
                                <Card.Body>
                                    <p style={textStyle}><b>Time:</b> {this.makeTimeString(this.props.startEvent.timestamp.toUTCString())}</p>
                                    <p style={textStyle}><b>Node1Status</b>{this.props.startEvent.node1Status ? this.renderIcon(1):this.renderIcon(2)}</p>
                                    <p style={textStyle}><b>Node2Status</b>{this.props.startEvent.node2Status ? this.renderIcon(1): this.renderIcon(2)}</p>
                                    <p style={textStyle}><a target="_blank" href={"https://kovan.etherscan.io/tx/"+this.props.startEvent.txHash}>Transaction</a></p>
                                </Card.Body>

                            </Card>

                            {/*<p>NodeId: {this.props.startEvent.nodeId}</p>*/}
                        </Col>
                        <Col>
                            <Card>
                                <Card.Header style={{display:"flex",fontSize:'14px'}}>End Event
                                    <span style={{marginLeft:'auto'}}>
                                        {this.props.endEvent.timestamp ? <CheckIcon style={{fill:"green"}}/> :null}
                                    </span>

                                </Card.Header>
                                <Card.Body>
                                    <p style={textStyle}><b>Time:</b> {this.makeTimeString(this.props.endEvent.timestamp.toUTCString())}</p>
                                    <p style={textStyle}><b>DataPoints:</b>  {this.props.endEvent.dataPoints.toString()}</p>
                                    {this.props.endEvent.userStatus === "1" ? this.renderUserCancelled():this.renderUserSubmitted(this.props.endEvent)}

                                    <p style={textStyle}><a target="_blank" href={"https://kovan.etherscan.io/tx/"+this.props.endEvent.txHash}>Transaction</a></p>


                                </Card.Body>
                            </Card>


                            {/*<p>DataPoints: {this.props.endEvent.dataPoints}</p>*/}
                            {/*<p>NodeId: {this.props.endEvent.nodeId}</p>*/}
                            {/*<p>User status: {this.props.endEvent.userStatus}</p>*/}
                        </Col>

                    </Row>
                </Container>

                </Card.Body>



            </Card>

        );
    }
}

export default EventCard;