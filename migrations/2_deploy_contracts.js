// DEPENDENCIES
require('dotenv').config();

// CONTRACTS
const MutantCatsSpotlightPlatform = artifacts.require('MutantCatsSpotlightPlatform');
const Fish = artifacts.require('Fish');

module.exports = async function(deployer, network, ganacheAddresses) {
  const [add1, add2, add3, add4] = ganacheAddresses;

  let ownerAddress = '';
  let sinkAddress = '';
  let fishAddress = '';
  let maxLeaderboard = 100;

  if (network === 'development') {
    // DEVELOPMENT
    maxLeaderboard = 12;
    ownerAddress = add1; // Deployer of contract
    sinkAddress = add2; // Send 1,000 Fish to sink address to test
    const accountWithFish1 = add3; // Default ganache account 1 with fish for testing
    const accountWithFish2 = add4; // Default ganache account 2 with fish for testing

    await deployer.deploy(Fish);
    const fish = await Fish.deployed();

    // .00000000000001 WEI is worth 10,000 fake fish in ganache effectively worthless
    await fish.faucet(sinkAddress, web3.utils.toWei('.00000000000001'));
    await fish.faucet(accountWithFish1, web3.utils.toWei('.00000000000001'));
    await fish.faucet(accountWithFish2, web3.utils.toWei('.00000000000001'));

    fishAddress = fish.address;
  } else if (network === 'rinkeby' || network == 'rinkeby-fork') {
    // RINKEBY
    ownerAddress = process.env['RINKEBY_OWNER'];
    sinkAddress = process.env['SINK_ADDRESS_RINKEBY'];

    // If no Rinkeby address is provided redeploy FISH contract
    if (!process.env['FISH_ADDRESS_RINKEBY']) {
      await deployer.deploy(Fish);
      const fish = await Fish.deployed();
      await fish.faucet(payer, web3.utils.toWei('10000'));  
      fishAddress = fish.addresses;
    } else {
      fishAddress = process.env['FISH_ADDRESS_RINKEBY'];
    }
  } else if (network === 'production') {
    // MAINNET
    ownerAddress = process.env['MAINNET_OWNER'];
    sinkAddress = process.env['SINK_ADDRESS_MAINNET'];
    fishAddress = process.env['FISH_ADDRESS_MAINNET'];
  }

  // Deploy contract to network
  await deployer.deploy(MutantCatsSpotlightPlatform, sinkAddress, fishAddress, maxLeaderboard, {gas: 5000000, from: ownerAddress});
  await MutantCatsSpotlightPlatform.deployed();
  
  console.log('Deployed Contract!');
};
