import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React from "react";
import DAppWeb3 from "../DAppWeb3";

class UsersPanel extends React.Component {
    state={
        contract:{},
        users:[],
        usersCount:0,
    }




    getUsers =  () => {

        console.log(this.state.users)





    }

    submitUser = () => {
        alert("Submitin user to Ropsten")
    }



    render() {
        return (
            <DAppWeb3.Consumer>
                {({
                    account,
                    contract,users
                  })=>(
                        <div>

                            <Container>
                                <Form.Group style={{marginright: '70px', width: '300px'}}>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control/>
                                </Form.Group>
                            </Container>
                            <Container>
                                <Form.Group style={{marginright: '70px', width: '300px'}}>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control/>
                                    <small classname="text-muted form-text">Your password will be hashed for protection</small>
                                </Form.Group>
                            </Container>


                            <Container>
                                        <Form.Group style={{width:'450px'}}>
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control value={account} id="address"/>
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
                                        <Button variant="secondary" type="Button" onClick={this.getUsers}>List users</Button>
                                    </Col>
                                </Row>
                            </Container>

                            <h1>Users</h1>
                            {this.state.users.forEach(user =>{
                                return <p>Username: {user.username}  Password: {user.password}  Address: {user.address}</p>
                            })}


                        </div>

                )}
            </DAppWeb3.Consumer>
        )
    }
}
export default UsersPanel;