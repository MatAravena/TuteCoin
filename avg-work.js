const BlockChain = require("./blockChain");
const blockChain = new BlockChain();

blockChain.addBlock({ data: "Initial" });
console.log("first block", blockChain.chain[blockChain.chain.length - 1]);

let previoTimestamp, nextTimestamp, nextblock, timeDiff, avg;

const times = [];

for (let i = 0; i < 10000; i++) {

    previoTimestamp = blockChain.chain[blockChain.chain.length - 1].timestamp;

    blockChain.addBlock({ data: `block  ${i} ` });
    nextblock = blockChain.chain[blockChain.chain.length - 1];

    nextTimestamp = nextblock.timestamp;
    timeDiff = nextTimestamp - previoTimestamp;
    times.push(timeDiff);

    avg = times.reduce((total, num) => (total + num)) / times.length;

    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextblock.difficulty}. Average time: ${avg}ms`)
}