import React, { Component } from 'react';
import Block from "./Block";

class Blocks extends Component {
    state = { blocks: [] };

    componentDidMount() {
        fetch("http://localhost:3000/api/blocks")
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render() {
        // console.log("ths state", this.state);
        return (
            <div>
                <h3>Blocks</h3>
                <h6>{
                    this.state.blocks.map(block => {
                        return (
                            // <div key={block.hash} className="Block">{block.hash}</div>
                            <Block key={block.hash} block={block} />
                        )
                    })
                }</h6>
            </div>
        )
    }
}

export default Blocks;
