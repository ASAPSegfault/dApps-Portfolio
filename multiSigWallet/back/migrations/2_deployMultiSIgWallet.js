const MultiSigWallet = artifacts.require("multiSigWallet");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(MultiSigWallet, [accounts[0], accounts[1], accounts[2]], 2);
  const multiSigWallet = await MultiSigWallet.deployed();
  await web3.eth.sendTransaction({from: accounts[0], to: multiSigWallet.address, value: 10000});
};
