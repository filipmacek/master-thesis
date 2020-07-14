import React,{Component} from 'react';
import Web3 from "web3";
import Header from "./components/Header";
import {ThemeProvider} from "rimble-ui";
import MovementWeb3 from "./utils/MovementWeb3";


class App extends Component {
    state = {
        route: "default"
    }

    // Optional Parameter
    config={
        accountBalanceMinimum: 0.001,
        requiredNetwork: 3
    }

    showRoute = route => {
        this.setState({
            route
        })
    }



    render(){
        return (
            <ThemeProvider>
                <MovementWeb3 config={this.config}>
                    <div className="main">
                        <Header/>
                        <h1>Tralalalal</h1>

                        <button type="button" className="btn btn-primary">Stisni</button>
                    </div>
                </MovementWeb3>
            </ThemeProvider>
        );
    }
}

export default App;
