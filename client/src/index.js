import React from 'react';
import ReactDOM from "react-dom";
import { Router, Switch, Route } from "react-router-dom"
import App from './components/App';
import "./index.css"
import history from "./history";
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';

// const element = <div><h1>TUTE COIN </h1><br /><App></App></div>;
const element =
    <Router history={history}>
        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/blocks" component={Blocks} />
            <Route path="/conduct-transaction" component={ConductTransaction} />
            <Route path="/transaction-pool" component={TransactionPool} />
        </Switch>
    </Router>;

ReactDOM.render(element, document.getElementById('root'));
