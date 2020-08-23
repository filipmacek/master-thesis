import React, {Component} from 'react';
import {Card,Accordion} from "react-bootstrap";
import CheckIcon from '@material-ui/icons/Check';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import VisibilityIcon from '@material-ui/icons/Visibility';

class RouteCard extends Component {
    state = {
        status:null,
        color:null,
        iconIndex:null,
        isStarted:null,
        isFinished:null,
        isCompleted:null,
        isOwner:false,
        events:[]
    }

    changeStatus = () =>{
        const route = this.props.route
        if(route.isStarted ===false && route.isFinished === false){
            this.setState({status:"Available",color:"green",iconIndex:1})
        }else if(route.isStarted === true && route.isFinished === false){
            this.setState({status:"In progress",color:"blue",iconIndex:2})
        }else if(route.isFinished === true && route.isCompleted === false) {
            this.setState({status:"Waiting for validation",color:"purple",iconIndex:3})
        }else if(route.isFinished === true && route.isCompleted === true){
            this.setState({status:"Completed",color:"green",iconIndex:4})
        }
    }

    setStatusOfRoute=()=>{
        this.setState({isStarted:this.props.route.isStarted,isFinished:this.props.route.isFinished,
            isCompleted: this.props.route.isCompleted})
        this.changeStatus()
    }


    renderIcon = index => {
        switch (index){
            case 1:
                return <AlarmOnIcon style={{fill:"green"}}/>
            case 2:
                return <DirectionsRunIcon style={{fill:"blue"}}/>
            case 3:
                return <AutorenewIcon style={{fill:"blue"}}/>
            default:
                return <CheckCircleIcon style={{fill:"green"}}/>


        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.route.isStarted !== this.state.isStarted ||
           this.props.route.isFinished!== this.state.isFinished ||
            this.props.route.isCompleted !== this.state.isCompleted) {
            this.setStatusOfRoute()
        }
        // if(this.props.account !== undefined && this.state.route.maker !== undefined){
        //     console.log("update")
        // }

    }

    componentDidMount() {
        this.setStatusOfRoute()
        // Check if account is the maker of this route
        if(this.props.account !== null && this.props.route.maker !== null) {
            if(this.props.account.toLowerCase() === this.props.route.maker.toLowerCase()){
                this.setState({isOwner:true})
            }
        }

    }


    render() {

        return (
                <Card className={`mb-3 ${this.state.isOwner ? "border border-primary":null}`}>
                    <Card.Header style={{display:'flex'}}>
                        <span> RouteId:    {this.props.route.routeId}</span>
                        <span style={{marginLeft:'auto'}}>{this.state.isOwner ? <VisibilityIcon/>:null }</span>


                    </Card.Header>
                    <Card.Body>
                        <Card.Text>Maker:  {this.props.route.maker}</Card.Text>
                        <Card.Text>StartLocation:         {this.props.route.startLocation}</Card.Text>
                        <Card.Text>EndLocation:         {this.props.route.endLocation}</Card.Text>
                        <Card.Text>Description:          {this.props.route.description}</Card.Text>
                        <Card.Text>
                            Status:  <span style={{color:this.state.color,marginRight:'12px',marginLeft:'8px'}}>{this.state.status}</span>
                            {this.renderIcon(this.state.iconIndex)}
                        </Card.Text>
                        <Accordion>
                            <Card>
                                <Card.Body>
                                    <Accordion.Toggle as={Card.Header} eventKey="0">
                                        Events
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <div>

                                            <p>1. StartEvent receiver by user with usernam Madin</p>
                                            <p>2. EndEvent received</p>
                                            <p>3. Route status checking</p>
                                        </div>


                                    </Accordion.Collapse>
                                </Card.Body>
                            </Card>
                        </Accordion>
                    </Card.Body>
                </Card>

        );
    }
}

export default RouteCard;