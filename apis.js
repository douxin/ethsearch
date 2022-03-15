const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
require('dotenv').config();
const web3 = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}`);

const getAccountType = async (addr) => {
    const code = await web3.eth.getCode(addr);
    if (code == '0x') {
        return 'wallet';
    }

    return 'contract';
}

const getBalance = async (args) => {
    const addr = args.address;
    const balanceInWei = await web3.eth.getBalance(addr);
    const balanceInGWei = web3.utils.fromWei(balanceInWei, 'gwei');
    const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');
    const accountType = await getAccountType(addr);
    console.log(`address: ${addr}`);
    console.log(`type: ${accountType}`);
    console.log(`balance: ${balanceInWei} wei, \n\t${balanceInGWei} gwei, \n\t${balanceInEth} eth`);
}

const getNFTs = async (args) => {
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

const getNFTDetail = async (args) => {
    const contractAddr = args.contractAddr;
    const tokenId = args.tokenId;
    const nft = await web3.alchemy.getNftMetadata({ contractAddress: contractAddr, tokenId });
    console.log(`metadata for nft ${contractAddr} with tokenId ${tokenId}`);
    prettyPrintRes(nft);
}

const getTransfers = async (args) => {
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

const getBlockNumber = async (args) => {
    const number = await web3.eth.getBlockNumber();
    console.log(number);
}

const getBlockInfo = async (args) => {
    const blockNum = args.blockNumber;
    const withTrx = args.withTrx || false;
    const info = await web3.eth.getBlock(blockNum, withTrx);
    console.log(info);
}

const getGasPrice = async (args) => {
    const priceInWei = await web3.eth.getGasPrice();
    const priceInEth = await web3.utils.fromWei(priceInWei, 'ether');
    console.log(`gas price: ${priceInWei} wei, and ${priceInEth} eth`);
}

const getTransaction = async (args) => {
    const trx = await web3.eth.getTransaction(args.trxHash);
    console.log(`transaction: ${JSON.stringify(trx, null, 4)}`);
}

module.exports = {
    getBalance,
    getNFTs,
    getNFTDetail,
    getTransfers,
    getBlockNumber,
    getBlockInfo,
    getGasPrice,
    getTransaction,
}