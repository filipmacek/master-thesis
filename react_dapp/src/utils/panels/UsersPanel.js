import {Button, Col, Container, Form, Row,FormControl} from "react-bootstrap";
import React from "react";
import DAppWeb3 from "../DAppWeb3";
import {Box, Text} from "rimble-ui";




class UsersPanel extends React.Component {
    state={
        contract:{},
        users:[],
        username:null,
        address:null,
        isAccountCreate:false
    }





    submitUser = ()=>{
        console.log("Submitting user")
        this.props.contractMethodSendWrapper("addUser",
            {
                username: this.state.username,
                password: this.state.password,
                address: this.state.address })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // this.setState({users:this.props.users})
        // if(this.state.)
    }

    renderUserConectedContent = (user) => {
        return(
            <Box marginLeft={"30px"}>
                <Text.span fontSize={1} color={'mid-gra'}>
                    Username:   {user.username}
                </Text.span>
                <br/>
                <Text.span fontSize={1} color={'mid-gra'}>
                    Address:   {user.address}
                </Text.span>
                <br/>
                <Text.span fontSize={1} color={'mid-gra'}>
                    Routes started:   {user.routesStarted}
                </Text.span>
                <br/>
                <Text.span fontSize={1} color={'mid-gra'}>
                    Routes finished:   {user.routesFinished}
                </Text.span>
                <br/>
                <Text.span fontSize={1} color={'mid-gra'}>
                    Routes completed:   {user.routesCompleted}
                </Text.span>
            </Box>
    );
    }



    render() {
        return (
            <DAppWeb3.Consumer>
                {({
                    account,
                    contract,
                      user,
                    modals,
                    isUserCreated
                  })=>(
                    (isUserCreated ? this.renderUserConectedContent(user):
                        <Box maxWidth={'640px'} mx={'auto'} p={3} mt={2}>

                            <Container>
                                <Form.Group style={{marginright: '70px', width: '300px'}}>
                                    <Form.Label >Username</Form.Label>
                                    <FormControl  onChange={e=>this.setState({username: e.target.value})} type="text"/>
                                </Form.Group>
                            </Container>
                            <Container>
                                <Form.Group style={{marginright: '70px', width: '300px'}}>
                                    <Form.Label>Password</Form.Label>
                                    <FormControl onChange={e=>this.setState({password: e.target.value})} type="text"/>
                                    <small classname="text-muted form-text">Your password will be hashed for protection</small>
                                </Form.Group>
                            </Container>


                            <Container>
                                        <Form.Group style={{width:'320px'}}>
                                            <Form.Label>Address</Form.Label>
                                            <FormControl value={account}  onChange={e=>this.setState({address: e.target.value})} type="text"/>
                                            <small classname="text-mutex form-text">It's best to use this wallet address as your
                                                account's address</small>
                                        </Form.Group>
                            </Container>
                            <Container>
                                <Row>
                                    <Col>
                                        <Button variant="primary" type="Button" onClick={this.submitUser}>Submit</Button>
                                    </Col>
                                    <Col>
                                        <Button variant="secondary" type="Button" onClick={modals.methods.openListUserModal}>List users</Button>
                                    </Col>
                                </Row>
                            </Container>



                        </Box>
                    )

                )}
            </DAppWeb3.Consumer>
        )
    }
}
export default UsersPanel;