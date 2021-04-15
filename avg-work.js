const BlockChain = require("./blockChain");
const blockChain = new BlockChain();

blockChain.addBlock({ data: "Initial" });

let previoTimestamp, nextTimestamp, nextblock, timeDiff, avg;

const time = [];

