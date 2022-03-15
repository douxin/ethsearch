/**
 * parse args
 */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const args = yargs(hideBin(process.argv))
    .command('getBalance', 'get balance of the given address', (y) => {
        return y.option('address', { describe: "the wallet address to query", type: 'string' })
            .demandOption('address', 'address must input')
    })
    .command('getNFTs', 'get all NFTs of the fiven address', (y) => {
        return y.option('owner', { describe: 'owner address', type: 'string' })
            .demandOption('owner', 'owner address must input')
    })
    .command('getNFTDetail', 'get the detail info of the given contract address', (y) => {
        return y.option('contractAddr', { describe: "contract address", type: "string" })
            .option('tokenId', { describe: "nft's tokenId", type: "string" })
            .demandOption(['contractAddr', 'tokenId'], 'contractAddr and tokenId all required')
    })
    .command('getTransfers', 'get transfers of the given address', (y) => {
        return y.option('fromAddr', { describe: 'sender address', type: 'string' })
            .option('toAddr', { describe: 'receiver address', type: 'string' })
    })
    .command('getTransaction', 'get transaction info', (y) => {
        return y.option('trxHash', { describe: 'transaction hash', type: 'string' })
    })
    .command('getBlockNumber', 'get current block number')
    .command('getBlockInfo', 'get block info with a given block number', (y) => {
        return y.option('blockNumber', { describe: 'block number', type: 'number' })
            .option('withTrx', { describe: 'return transaction or not', type: 'boolean' })
            .demandOption(['blockNumber'], 'blockNumber must input')
    })
    .command('getGasPrice', 'get current gas price')
    .demandCommand(1, 1, 'you should at least one command to run this tool', 'only one command at once time')
    .help()
    .argv;

module.exports = args;