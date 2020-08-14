import React, {Component} from 'react';
import {Box, Card, Heading, Text,Flex} from "rimble-ui";
import {Button} from "react-bootstrap";
import {Star} from "@rimble/icons";

class UserCard extends Component {
    state={
        isUserOwner:false,
        isAccountConnected:false
    }

    componentDidMount() {
        if(this.props.account ){
            this.setState({isAccountConnected:true},()=>{
                if(this.props.account.toLowerCase() === this.props.user.address.toLowerCase()){
                    this.setState({isUserOwner:true})
                }
            })
        }



    }

    deleteUser=() => {
        this.props.contractMethodSendWrapper("deleteUser",this.props.user)
    }

    render() {
        const length_addr=this.props.user.address.length
        const addr=this.props.user.address.slice(0,7)+'...'+
            this.props.user.address.slice(length_addr-6,length_addr)
        let border_class=''
        if(this.state.isUserOwner){
            border_class="border border-success"
        }
        return (
            <Box flex={'1 1'} width={1} mt={[3,0]} mb={[4,2]} mr={2}>
                <Card className="w-100" className={border_class}>
                    <Flex flexDirection={"row"}>
                        <Box width={4/5}>
                            <Flex flexDirection={'row'}>
                                <Heading as={'h4'} mr={2}>{this.props.user.username}</Heading>
                                {this.state.isUserOwner ? <Star color="green"/> :null}
                            </Flex>
                            <Text fontSize={1}>Address: {addr}</Text>
                        </Box>
                        <Box width={1/5}>
                            <Button variant="outline-danger" onClick={this.deleteUser}>
                                Delete
                            </Button>

                        </Box>
                    </Flex>

                </Card>
            </Box>
        );
    }
}

export default UserCard;