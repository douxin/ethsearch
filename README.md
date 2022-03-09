# ethsearch cli
ethsearch is a cmd tool to search infos on eth network, you can search balance of the given address, or transactions, nfts.

## how to use
first, install `nodejs`, `git` in your OS

then, clone the source code with git, and install modules
```bash
git clone https://github.com/douxin/ethsearch.git
cd ethsearch
npm i
```

create `.env`, add your [Alchemy](https://www.alchemy.com/) api key
```bash
touch .env
echo "API_KEY=YOUR_API_KEY" > .env
```

then, we can print the help doc with:
```bash
node ethsearch --help
```

get command help with:
```bash
node ethsearch CMD --help
node ethsearch getBlock --help
```

## how to develop
The script only support few commands now, you can clone the code and add more commands if you want. I use [Alchemy](https://www.npmjs.com/package/@alch/alchemy-web3) and [eth3](https://www.npmjs.com/package/web3), see the docs for more information.