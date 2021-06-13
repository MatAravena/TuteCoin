import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Transaction from './Transaction'
import history from '../history'

const POLL_INERVAL_MS = 10000;

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => {
                this.setState({ transactionPoolMap: json });
            });
    }

    fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`).
            then(response => {
                if (response.status === 200) {
                    alert('sucess');
                    history.push('/blocks')
                } else {
                    alert('the mine-transcations block request did not complete');
                }
            })
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(() => {
            fetchTransactionPoolMap(), POLL_INERVAL_MS
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
                <hr />
                <Button
                    bsStyle="danger"
                    onClick={this.fetchMineTransactions}>
                    Mine Transaction
                </Button>

            </div>
        )
    }
}

export default TransactionPool;