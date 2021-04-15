const { genesis } = require("./block");
const BlockChain = require("./blockChain");
const Block = require("./block");
const cryptoHash = require("./crypto-hash");

describe("BlockChain", () => {

    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new BlockChain();
        newChain = new BlockChain();

        originalChain = blockchain.chain;
    });

    it("contains a 'chain' Array instance", () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it("starts with the genesis bloc", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it("Adds a new block to the chain", () => {
        const newData = "foobar";
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe("isValidChain()", () => {
        describe("When the chain does not start with the genesis block", () => {
            it("returns false", () => {
                blockchain.chain[0] = { data: "fake-genesis" };

                expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe("When the chain starts with the genesis block and has multiple blokcs", () => {
            beforeEach(() => {
                blockchain.addBlock({ data: "Nose 1" });
                blockchain.addBlock({ data: "Nose 2" });
                blockchain.addBlock({ data: "Nose 3" });
            })

            describe("and a lastHash reference has changed", () => {
                it("returns false", () => {

                    blockchain.chain[2].lastHash = "broken-lastHash"
                    expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("and the chain contains a block with a invalid field", () => {
                it("returns false", () => {
                    blockchain.chain[2].data = "some-bad-and-evil-data";
                    expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
                });
            });


            describe(" and the chain contains a block with a jumped difficulty", () => {
                it("returns false", () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const lastHash = lastBlock.lastHash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);
                    const badBlock = new Block({
                        timestamp, lastHash, hash, nonce, difficulty, data
                    });

                    blockchain.push(badBlock);
                    expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("and the chain contains any invalid blocks", () => {
                it("returns true", () => {
                    expect(BlockChain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe("replaceChain()", () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe("when the new chain is no longer", () => {
            beforeEach(() => {
                newChain.chain[0] = { new: 'chain' };
                blockchain.replaceChain(newChain.chain);
            });

            it("does not replace the chain ", () => {
                newChain.chain[0] = { new: 'chain' };

                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain);
            });

            it("logs an error", () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe("when the new chain is longer", () => {
            beforeEach(() => {
                newChain.addBlock({ data: "Nose 1" });
                newChain.addBlock({ data: "Nose 2" });
                newChain.addBlock({ data: "Nose 3" });
            });

            describe("when the new chain is invalid", () => {
                beforeEach(() => {
                    newChain.chain[2].hash = "some-fake-hash";
                    blockchain.replaceChain(newChain.chain);
                });

                it("does not replace the chain", () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it("logs an error", () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe("when the new chain is valid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });

                it("replaces the chain ", () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});