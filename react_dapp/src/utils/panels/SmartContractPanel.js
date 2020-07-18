import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Box} from "rimble-ui";
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import GestureIcon from '@material-ui/icons/Gesture';
import ComputerIcon from "@material-ui/icons/Computer"
import UsersPanel from "./UsersPanel";


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
                        <Typography className={styles.heading}>Users</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <UsersPanel contract={props.contract}/>
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
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <div className="mr-2">
                            <ComputerIcon/>
                        </div>
                        <Typography className={styles.heading}>Nodes</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography>
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

