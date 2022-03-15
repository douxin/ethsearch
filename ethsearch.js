/**
 * entry of the tool
 */
const args = require('./args');
const apis = require('./apis');

const cmd = args._;
async function main() {
    if (cmd == 'getBalance') {
        await apis.getBalance(args);
    } else if (cmd == 'getNFTs') {
        await apis.getNFTs(args);
    } else if (cmd == 'getNFTDetail') {
        await apis.getNFTDetail(args);
    } else if (cmd == 'getTransfers') {
        await apis.getTransfers(args);
    } else if (cmd == 'getBlockNumber') {
        await apis.getBlockNumber(args);
    } else if (cmd == 'getBlockInfo') {
        await apis.getBlockInfo(args);
    } else if (cmd == 'getGasPrice') {
        await apis.getGasPrice(args);
    } else if (cmd == 'getTransaction') {
        await apis.getTransaction(args);
    } else {
        console.error('you should never reach here');
    }
}

main();