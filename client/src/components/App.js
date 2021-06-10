import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/logoA_small.png'

class App extends Component {

    // default value
    // state = { walletInfo: { address: 'fooxb6', balance: 9999 } };
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }))
        // .then(json => console.log("json", json))
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div className="App">
                <img className="logo" src={logo} />
                <div>
                    Welcome to the Tute blockchain.
                </div>
                <br />
                <div><Link to="/blocks">Blocks</Link></div>
                <div><Link to="/conduct-transaction">Conduct a Transaction</Link></div>
                <div><Link to="/transaction-pool">Transaction Pool</Link></div>
                <br />
                <div className="WalletInfo">
                    <div>Adress: {address} </div>
                    <br />
                    <div>Balance: {balance} </div>
                </div>
            </div>
        );
    }
}

export default App;