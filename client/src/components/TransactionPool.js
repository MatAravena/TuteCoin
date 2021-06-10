import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Transaction from './Transaction'

const POLL_INERVAL_MS = 200000;

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => {
                this.setState({ transactionPoolMap: json });
                console.log('json', json);
            });
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(() => {
            this.fetchTransactionPoolMap(), POLL_INERVAL_MS
        })
    }

    componentWillUnmount() {
        clearInterval(this.fetchPoolMapInterval);
    }

    render() {
        return (
            <div className="TransactionPool" >
                <Link to="/" >Home</Link>
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(tran => {
                        return (
                            <div key={tran.id}>
                                <hr />
                                <Transaction transaction={tran} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default TransactionPool;