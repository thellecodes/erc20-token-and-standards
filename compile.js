const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const ERC20Token = path.resolve(__dirname, "contracts", "erc20_token_contract.sol");
const source = fs.readFileSync(ERC20Token, "utf8");

var input = {
    language: 'Solidity',
    sources: {
        'erc20_token_contract.sol': {
            content: source
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'erc20_token_contract.sol'
].ERC20Token;