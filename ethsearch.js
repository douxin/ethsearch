/**
 * entry of the tool
 */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
require('dotenv').config();
const web3 = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}`);

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

const prettyPrintRes = (res) => {
    console.log(JSON.stringify(res, null, 4));
};

const getBalance = async () => {
    const addr = args.address;
    const balanceInWei = await web3.eth.getBalance(addr);
    const balanceInEth = web3.utils.fromWei(balanceInWei);
    console.log(`balance of ${addr}: ${balanceInEth} eth`);
}

const getNFTs = async () => {
    const owner = args.owner;
    const nfts = await web3.alchemy.getNfts({ owner });
    console.log(`total nfts count of ${owner}: ${nfts.totalCount}`);
    console.log(`\nnfts list:\n----------------------`);
    for (const nft of nfts.ownedNfts) {
        console.log(`nft title: ${nft.title}`);
        console.log(`contract address: ${nft.contract.address}`);
        console.log(`token id: ${nft.id.tokenId}`);
        console.log(`token type: ${nft.id.tokenMetadata.tokenType}`);
        console.log(`nft desc: ${nft.description}`);
        console.log(`last updated at: ${nft.timeLastUpdated}`);
        console.log(`----------------------`);
    }
}

const getNFTDetail = async () => {
    const contractAddr = args.contractAddr;
    const tokenId = args.tokenId;
    const nft = await web3.alchemy.getNftMetadata({ contractAddress: contractAddr, tokenId });
    console.log(`metadata for nft ${contractAddr} with tokenId ${tokenId}`);
    prettyPrintRes(nft);
}

const getTransfers = async () => {
    const fromAddr = args.fromAddr || null;
    const toAddr = args.toAddr || null;
    if (!fromAddr && !toAddr) {
        console.error(`fromAddr and toAddr cannot both empty`)
    } else {
        let option = {};
        if (fromAddr) option.fromAddr = fromAddr;
        if (toAddr) option.toAddr = toAddr;
        const txs = await web3.alchemy.getAssetTransfers(option);
        console.log(txs);
    }
}

const getBlockNumber = async () => {
    const number = await web3.eth.getBlockNumber();
    console.log(number);
}

const getBlockInfo = async () => {
    const blockNum = args.blockNumber;
    const withTrx = args.withTrx || false;
    const info = await web3.eth.getBlock(blockNum, withTrx);
    console.log(info);
}

const getGasPrice = async () => {
    const priceInWei = await web3.eth.getGasPrice();
    const priceInEth = await web3.utils.fromWei(priceInWei, 'ether');
    console.log(`gas price: ${priceInWei} wei, and ${priceInEth} eth`);
}

const cmd = args._;
async function main() {
    if (cmd == 'getBalance') {
        await getBalance();
    } else if (cmd == 'getNFTs') {
        await getNFTs();
    } else if (cmd == 'getNFTDetail') {
        await getNFTDetail();
    } else if (cmd == 'getTransfers') {
        await getTransfers();
    } else if (cmd == 'getBlockNumber') {
        await getBlockNumber();
    } else if (cmd == 'getBlockInfo') {
        await getBlockInfo();
    } else if (cmd == 'getGasPrice') {
        await getGasPrice();
    } else {
        console.error('you should never reach here');
    }
}

main();