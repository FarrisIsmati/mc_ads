// DEPENDENCIES
require('dotenv').config();

// CONTRACTS
const MutantCatsAdsPlatform = artifacts.require('MutantCatsAdsPlatform');
const Fish = artifacts.require('Fish');

module.exports = async function(deployer, network, ganacheAddresses) {
  const [add1, add2, add3, add4] = ganacheAddresses;

  let ownerAddress = '';
  let sinkAddress = '';
  let fishAddress = '';

  if (network === 'development') {
    // DEVELOPMENT
    await deployer.deploy(Fish);
    const fish = await Fish.deployed();
    await fish.faucet(payer, web3.utils.toWei('10000'));

    ownerAddress = add1;
    sinkAddress = add2;
    fishAddress = fish.addresses;
  } else if (network === 'rinkeby' || network == 'rinkeby-fork') {
    // RINKEBY
    // If no Rinkeby address is provided redeploy FISH contract
    if (!process.env['FISH_ADDRESS_RINKEBY']) {
      await deployer.deploy(Fish);
      const fish = await Fish.deployed();
      await fish.faucet(payer, web3.utils.toWei('10000'));  
      fishAddress = fish.addresses;
    } else {
      fishAddress = process.env['FISH_ADDRESS_RINKEBY'];
    }

    ownerAddress = process.env['RINKEBY_OWNER'];
    sinkAddress = process.env['SINK_ADDRESS_RINKEBY'];
  } else if (network === 'production') {
    // MAINNET
    ownerAddress = process.env['MAINNET_OWNER'];
    sinkAddress = process.env['SINK_ADDRESS_MAINNET'];
    fishAddress = process.env['FISH_ADDRESS_MAINNET'];
  }

  // Deploy contract to network
  await deployer.deploy(MutantCatsAdsPlatform, {gas: 5000000, from: ownerAddress});
  await MutantCatsAdsPlatform.deployed();
  
  console.log('Deployed Contract!');
};
