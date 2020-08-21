import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Box, Flex} from "rimble-ui";
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import GestureIcon from '@material-ui/icons/Gesture';
import UsersPanel from "./UsersPanel";
import {Star} from '@rimble/icons'
import RoutesPanel from "./RoutesPanel";
import {Row,Button, Col, Container} from "react-bootstrap";
export default function SmartContractPanel(props) {
   const styles = {
        root: {
            width: '100%',
        },
        heading: {
            fontSize: 0/9375,
            fontWeight: 400,
        },
    };
    return (
        <Box maxWidth={"640px"} mx={"auto"} mt={2}>
            <div style={styles.root}>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <div className="mr-2">
                            <AccessibilityIcon/>
                        </div>
                        <Flex flexDirection={'row'}>

                            <Box marginRight="15px">
                                <Typography className={styles.heading}>User</Typography>
                            </Box>
                            <Box>
                                {props.isUserCreated ?
                                    <Star color="green"/> : null
                                }
                            </Box>

                        </Flex>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <UsersPanel
                            contract={props.contract}
                            account={props.account}
                            users={props.users}
                            contractMethodSendWrapper={props.contractMethodSendWrapper}

                        />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <div className="mr-2">
                            <GestureIcon/>
                        </div>
                        <Typography className={styles.heading}>Routes</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                       <RoutesPanel/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>



            </div>
        </Box>
    );
}
//
// SmartContractPanel.propTypes = {
//     classes: PropTypes.object.isRequired,
// };
//
// export default withStyles(styles)(SmartContractPanel);

