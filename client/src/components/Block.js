import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

class Block extends Component {
    state = { displayTrans: false };

    toggleTransaction = () => {
        this.setState({ displayTrans: !this.state.displayTrans })
    }

    get displayTransaction() {
        const { data } = this.props.block;

        const stringifiedData = JSON.stringify(data);

        const dataDisplay = stringifiedData.length > 35 ?
            `${stringifiedData.substring(0, 35)}...` :
            stringifiedData;

        // data.map(transaction => (
        //     console.log("transaction", transaction)
        // ))

        if (this.state.displayTrans) {
            return (
                <div>
                    {/*  {JSON.stringify(data)} */}
                    {/*
                        data.map(transaction => (
                            <h6 key={transaction}> { JSON.stringify(data)}</h6>
                        ))
                     */}

                    {
                        data.map(transaction => (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        ))
                    }

                    <br />
                    <Button
                        bsStyle="danger"
                        bsSize="small"
                        onClick={this.toggleTransaction}
                    > Show Less</Button>
                </div >
            )
        }

        return (
            <div>
                <div>Data {dataDisplay} </div>
                <Button
                    bsStyle="danger"
                    bsSize="small"
                    onClick={this.toggleTransaction}
                > Show More</Button>
            </div >
        )
    }

    render() {
        const { timestamp, hash } = this.props.block;
        const hashDisplay = `${hash.substring(0, 15)}...`;

        return (
            <div className="Block">
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
                {/* <div>Data: {dataDisplay}</div> */}
                {this.displayTransaction}
            </div >
        )
    }
}

export default Block;