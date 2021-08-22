const hexBinary = require("hex-to-binary")
const Block = require("./block")
const { GENESIS_DATA, MINE_RATE } = require("../config")
const { cryptoHash } = require("../util")

const block = require("./block")
describe("Block", () => {

    const timestamp = 2000;
    const lastHash = "foo-lastHash";
    const hash = "foo-hash";
    const data = ["TuteChain", "data"];

    //proof of work atributes
    const nonce = 1;
    const difficulty = 1;

    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

    it("has a timestamp, lastHas, hash, and data property", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe("genesis()", () => {
        const genesisBlock = Block.genesis();

        it("returns a Block isntance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
        });

        it(" returns the genesis data", () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe("mineBlock()", () => {
        const lastBlock = Block.genesis();
        const data = "mined data";
        const minedBlock = Block.mineBlock({ lastBlock, data });

        it("returns a Block instance", () => {
            expect(minedBlock instanceof Block).toEqual(true);
        });
        it("sets the 'lastHash' to be the 'hash' of the lastBlock ", () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it("sets the 'data", () => {
            expect(minedBlock.data).toEqual(data);
        });
        it("sets a 'timestamp", () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it("creates a SHA256 'hash' based on the proper inputs", () => {
            expect(minedBlock.hash)
                .toEqual(
                    cryptoHash(
                        minedBlock.timestamp,
                        minedBlock.nonce,
                        minedBlock.difficulty,
            lastBlock.hash,
            data
                    ));
        });

        it("sets a 'hash' that matches the difficulty criteria", () => {
            expect(hexBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
                .toEqual("0".repeat(minedBlock.difficulty));

        });


        it("Adjust the difficulty", () => {
            const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });

    });

    describe("adjustDifficulty()", () => {
        it("raises the difficulty for a quickly mined block", () => {

            // console.log("quickly block", block);
            expect(Block.adjustDifficulty(
                {
                    originalBlock: block,
                    timestamp: block.timestamp + MINE_RATE - 100
                })).toEqual(block.difficulty + 1);
        });

    it('lowers the difficulty for a slowly mined block', () => {

            // console.log("slowly block", block);
      expect(Block.adjustDifficulty({
        originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
      })).toEqual(block.difficulty-1);
    });

    it('has a lower limit of 1', () => {
      block.difficulty = -1;

      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
    });
});

// @ponicode
describe("block.genesis", () => {
    test("0", () => {
        let callFunction = () => {
            block.genesis()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("block.mineBlock", () => {
    test("0", () => {
        let callFunction = () => {
            block.mineBlock({ lastBlock: { hash: ".Matrix53" }, data: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            block.mineBlock({ lastBlock: { hash: "!Lov3MyPianoPony" }, data: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            block.mineBlock({ lastBlock: { hash: "!ush3r" }, data: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            block.mineBlock({ lastBlock: { hash: "$p3onyycat" }, data: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            block.mineBlock({ lastBlock: { hash: "1Ki77y" }, data: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            block.mineBlock({ lastBlock: undefined, data: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("block.adjustDifficulty", () => {
    test("0", () => {
        let callFunction = () => {
            block.adjustDifficulty({ originalBlock: { timestamp: -100 }, timestamp: -1 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            block.adjustDifficulty({ originalBlock: { timestamp: -10 }, timestamp: 0.0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            block.adjustDifficulty({ originalBlock: { timestamp: -1 }, timestamp: 1 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            block.adjustDifficulty({ originalBlock: { timestamp: 0 }, timestamp: -1 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            block.adjustDifficulty({ originalBlock: { timestamp: 0.0 }, timestamp: 10 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            block.adjustDifficulty({ originalBlock: undefined, timestamp: Infinity })
        }
    
        expect(callFunction).not.toThrow()
    })
})
