import React, { Component } from 'react';

class Block extends Component {

    render() {
        const { timestamp, hash, data } = this.props.block;

        const hashDisplay = `${hash.substring(0, 15)}...`;
        const stringifyData = JSON.stringify(data);

        const dataDisplay = stringifyData.length > 15 ?
            `${stringifyData.substring(0, 15)}...` :
            stringifyData;

        return (
            <div className="Block">
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
                <div>Data: {dataDisplay}</div>
            </div >
        )
    }

}

export default Block;