import React, { Component } from 'react';
import logoA_small_icon_only from '../../assets/logoA_small.png'
import Blocks from "./Blocks";

class App extends Component {

    // default value
    // state = { walletInfo: { address: 'fooxb6', balance: 9999 } };
    state = { walletInfo: {} };

    componentDidMount() {
        fetch('http://localhost:3000/api/wallet-info')
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }))
        // .then(json => console.log("json", json))
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div className="App">
                <img className="logo" src={logoA_small_icon_only} />
                <div>
                    Welcome to the Tute blockchain.
                </div>
                <br />

                <div className="WalletInfo">
                    <div>Adress: {address} </div>
                    <br />
                    <div>Balance: {balance} </div>
                </div>

                <br />
                <Blocks />
            </div>
        );
    }
}
export default App;