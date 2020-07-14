import React, {Component} from 'react';

class MovementWeb3 extends Component {
    render() {
        return (
            <div>
                {this.props.children}
               <p>{this.props.config.accountBalanceMinimum}</p>
               <p>{this.props.config.requiredNetwork}</p>
            </div>
        );
    }
}

export default MovementWeb3;