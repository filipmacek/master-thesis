import React, {Component} from 'react';
import {Card} from "react-bootstrap";

class RouteCard extends Component {
    state = {
        status:null,
        color:null
    }

    setStatus = route => {
        if(route.isStarted ===false && route.isFinished === false){
            this.setState({status:"Available",color:"green"})
        }else if(route.isStarted === true && route.isFinished === false){
            this.setState({status:"In progress",color:"blue"})
        }else if(route.isFinished === true && route.isCompleted === false) {
            this.setState({status:"Waiting for validation",color:"purple"})
        }else if(route.isFinished === true && route.isCompleted === true){
            this.setState({status:"Completed",color:"green"})
        }
    }

    componentDidMount() {
       this.setStatus(this.props.route)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setStatus(this.props.route)
    }

    render() {

        return (
                <Card className="mb-3">
                    <Card.Header>RouteId:    {this.props.route.routeId}</Card.Header>
                    <Card.Body>
                        <Card.Text>Maker:  {this.props.route.maker}</Card.Text>
                        <Card.Text>StartLocation:         {this.props.route.startLocation}</Card.Text>
                        <Card.Text>EndLocation:         {this.props.route.endLocation}</Card.Text>
                        <Card.Text>Description:          {this.props.route.description}</Card.Text>
                        <Card.Text>Status:  <span style={{color:this.state.color}}>{this.state.status}</span></Card.Text>
                    </Card.Body>
                </Card>

        );
    }
}

export default RouteCard;