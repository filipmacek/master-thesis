import React, {Component} from 'react';
import {Row, Col, Card, Container, Table} from 'react-bootstrap';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
const textStyle = {
    fontSize:"12px",
    marginBottom:"6px",
}

class RouteEventContainer extends Component {
    state = {
        event:null
    }

    getType= (event) => {
        if("routeStartId" in event){
            this.setState({event:"Start Event"})
        }else if("routeEndId" in event){
            this.setState({event:"End Event"})
        }else if("checkStatusId" in event){
            this.setState({event:"Check Status"})
        } else if("routeCompletedId" in event){
            this.setState({event:"Route Completed"})
        }
    }

    renderStartEvent =() =>{
        return(
            <div>
                <p style={textStyle}><b>User:</b> {this.props.event.username}</p>
                <Container>
                    <Row>
                        <Col style={{paddingLeft:"0"}}>
                            <p style={textStyle}><b>Node1Status</b>{this.props.event.node1Status ? this.renderIcon(1):this.renderIcon(2)}</p>
                        </Col>
                        <Col>
                            <p style={textStyle}><b>Node2Status</b>{this.props.event.node2Status ? this.renderIcon(1): this.renderIcon(2)}</p>
                        </Col>
                    </Row>
                </Container>
            </div>

        )

    }
    renderEndEvent =() =>{
        return(
            <div>
                <p style={textStyle}><b>User:</b> {this.props.event.username}</p>
                <p style={textStyle}><b>AppData Points:</b>  {this.props.event.dataPoints}</p>
                <Container>
                    <Row>
                        <Col style={{paddingLeft:"0"}}>
                            <p style={textStyle}><b>Node1DataPoints</b>  {this.props.event.node1DataPoints}</p>
                        </Col>
                        <Col>
                            <p style={textStyle}><b>Node2DataPoints</b>  {this.props.event.node2DataPoints}</p>
                        </Col>
                    </Row>
                </Container>
                <p style={textStyle}><b>User Action: </b>{this.props.event.userStatus === "1" ?
                    <span style={{color:"red"}}>Route Cancelled</span> :
                    <span style={{color:"green"}}>Route Submitted</span>
                }</p>
            </div>
        )


    }
    renderCheckStatus =() =>{
        return (<div>
            <p style={textStyle}><b>User:</b> {this.props.event.username}</p>
            <Table striped bordered hover size="sm">
                <thead>
                    <th> </th>
                    <th>Distance</th>
                    <th>Time</th>
                    <th>Status</th>
                </thead>
                <tbody>
                <tr>
                    <td>Node1</td>
                    <td>{this.props.event.node1Distance.toString()}</td>
                    <td>{this.props.event.node1Time.toString()}</td>
                    <td>{this.props.event.node1Status.toString()}</td>
                </tr>
                <tr>
                    <td>Node2</td>
                    <td>{this.props.event.node2Distance.toString()}</td>
                    <td>{this.props.event.node2Time.toString()}</td>
                    <td>{this.props.event.node2Status.toString()}</td>
                </tr>
                </tbody>
            </Table>


        </div>
        )

    }
    renderRouteCompleted = () =>{

    }


    makeTimeString = (time) =>{
        return time.substring(0,time.length-4)
    }
    componentDidMount() {
        this.getType(this.props.event)
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

    renderSwitch=(param) => {
        switch (param){
            case "Start Event":
                return this.renderStartEvent()
            case "End Event":
                return this.renderEndEvent()
            case "Check Status":
                return this.renderCheckStatus()
            case "Route Completed":
                return this.renderRouteCompleted()
            default:
                return null
        }
}
    render() {
        return (
            <Card className="mb-3">
                 <Card.Header style={{display:"flex",fontSize: "12px"}}>
                     <span style={{marginRight:"5px"}}><b>{this.props.num.toString()}.</b></span>
                     <span><b>{this.state.event}</b></span>
                     <span style={{marginLeft:"auto"}}>{this.makeTimeString(this.props.event.timestamp.toUTCString())}</span>
                 </Card.Header>
                <Card.Body style={{padding:"8px"}}>
                    {this.renderSwitch(this.state.event)}
                    <p style={textStyle}><a target="_blank" href={"https://kovan.etherscan.io/tx/"+this.props.event.txHash}>Transaction</a></p>
                </Card.Body>
            </Card>

        );
    }
}

export default RouteEventContainer;