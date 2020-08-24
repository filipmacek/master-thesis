import React, {Component} from 'react';
import  {Row,Col,Card, Container} from 'react-bootstrap';
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

            </div>
        )


    }
    renderCheckStatus =() =>{

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