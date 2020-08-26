import React, {Component} from 'react';
import {Card, Accordion, Container} from "react-bootstrap";
import CheckIcon from '@material-ui/icons/Check';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import VisibilityIcon from '@material-ui/icons/Visibility';
const _ = require("lodash")
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import RouteEventContainer from "./RouteEventContainer";

const textStyle = {
    fontSize:"15px",
    marginBottom:"6px"
}
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


    }

    componentDidMount() {
        this.setStatusOfRoute()
        // Check if account is the maker of this route
        if(this.props.account !== null && this.props.route.maker !== null) {
            if(this.props.account.toLowerCase() === this.props.route.maker.toLowerCase()){
                this.setState({isOwner:true})
            }
        }



        this.setState({events:_.concat(this.props.startEvents,this.props.endEvents,this.props.checkStatusEvents)
                .sort((a,b)=>(a.timestamp > b.timestamp ? 1 : -1) )},()=>{
        })

    }




    render() {

        return (
                <Card className={`mb-4 ${this.state.isOwner ? "border border-primary":null}`}>
                    <Card.Header style={{display:'flex'}}>
                        <span> <b>RouteID:    {this.props.route.routeId}</b></span>
                        <span style={{marginLeft:'auto'}}>{this.state.isOwner ? <VisibilityIcon/>:null }</span>
                    </Card.Header>
                    <Card.Body>
                        <p style={textStyle}><b>Maker:</b>  {this.props.route.maker}</p>
                        <p style={textStyle}><b>StartLocation:</b>         {this.props.route.startLocation}</p>
                        <p style={textStyle}><b>EndLocation:</b>         {this.props.route.endLocation}</p>
                        <p style={textStyle}><b>Description:</b>          {this.props.route.description}</p>
                        <p style={textStyle}>
                            <b>Status:</b>  <span style={{color:this.state.color,marginRight:'12px',marginLeft:'8px'}}>{this.state.status}</span>
                            {this.renderIcon(this.state.iconIndex)}
                        </p>
                        <Accordion>

                                    <Accordion.Toggle as={Container} eventKey="0" className="border p-1" style={{display:"flex"}}>
                                            <span>Events</span>
                                            <span style={{marginLeft:"auto"}}>
                                                <span>{this.state.events.length.toString()}</span>
                                                <FormatAlignJustifyIcon/>
                                            </span>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">

                                       <Container>
                                           {this.state.events.map((event,i)=>
                                                <RouteEventContainer event = {event} num={i+1}/>
                                           )}

                                       </Container>


                                    </Accordion.Collapse>

                        </Accordion>
                    </Card.Body>
                </Card>

        );
    }
}

export default RouteCard;