import React, {Component} from 'react';
import {Box,Heading} from 'rimble-ui';


class Header extends Component {
    render() {
        return (
            <Box bg="salmon" color="white" fontSize={4} p={2} justifyContent="center" flexDirection="column">
                <Box mx="auto" maxWidth="400px">
                    <Heading fontSize={4} color="white">Movement DApp</Heading>
                </Box>
            </Box>
        );
    }
}

export default Header;