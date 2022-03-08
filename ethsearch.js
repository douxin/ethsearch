/**
 * entry of the tool
 */
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const {createAlchemyWeb3} = require('@alch/alchemy-web3');
require('dotenv').config();
const web3 = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}`);

const args = yargs(hideBin(process.argv))
    .command('getBalance', 'get balance of the given address', (y) => {
        return y.option('address', {describe: "the wallet address to query", type: 'string'})
            .demandOption('address', 'address must input')
    })
    .command('getNFTs', 'get all NFTs of the fiven address', (y) => {
        return y.option('owner', {describe: 'owner address', type: 'string'})
            .demandOption('owner', 'owner address must input')
    })
    .command('getNFTDetail', 'get the detail info of the given contract address', (y) => {
        return y.option('contractAddr', {describe: "contract address", type: "string"})
            .option('tokenId', {describe: "nft's tokenId", type: "string"})
            .demandOption(['contractAddr', 'tokenId'], 'contractAddr and tokenId all required')
    })
    .command('getTransfers', 'get transfers of the given address', (y) => {
        return y.option('fromAddr', {describe: "sender address", type: 'string'})
            .demandOption('fromAddr', 'fromAddr must input')
    })
    .demandCommand(1, 1, 'you should at least one command to run this tool', 'only one command at once time')
    .help()
    .argv;

const prettyPrintRes = (res) => {
    console.log(JSON.stringify(res, null, 4));
};

const cmd = args._;
async function main() {
    if (cmd == 'getBalance') {
        const addr = args.address;
        const balanceInWei = await web3.eth.getBalance(addr);
        const balanceInEth = web3.utils.fromWei(balanceInWei);
        console.log(`balance of ${addr}: ${balanceInEth} eth`);
    } else if (cmd == 'getNFTs') {
        const owner = args.owner;
        const nfts = await web3.alchemy.getNfts({owner});
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
    } else if (cmd == 'getNFTDetail') {
        const contractAddr = args.contractAddr;
        const tokenId = args.tokenId;
        const nft = await web3.alchemy.getNftMetadata({contractAddress: contractAddr, tokenId});
        console.log(`metadata for nft ${contractAddr} with tokenId ${tokenId}`);
        prettyPrintRes(nft);
    } else if (cmd == 'getTransfers') {
        const fromAddr = args.fromAddr;
        const txs = await web3.alchemy.getAssetTransfers({fromAddress: fromAddr});
        console.log(txs);
    } else {
        console.error('you should never reach here');
    }
}

main();