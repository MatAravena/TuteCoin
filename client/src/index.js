import React from "react";
import ReactDOM, { render } from "react-dom";
import connect from 'react-redux';

const element = <h1>ad, world</h1>;
ReactDOM.render(element, document.getElementById('root'));

// import history from './history';
// import App from './components/App';
// import Blocks from './components/Blocks';
// import ConductTransaction from './components/ConductTransaction';
// import TransactionPool from './components/TransactionPool';

// <Router history={history}>
//     <Switch>
//         <Route exact path='/' component={App} />
//         <Route path='/blocks' component={Blocks} />
//         <Route path='/conduct-transaction' component={ConductTransaction} />
//         <Route path='/transaction-pool' component={TransactionPool} />
//     </Switch>
// </Router>,
//
