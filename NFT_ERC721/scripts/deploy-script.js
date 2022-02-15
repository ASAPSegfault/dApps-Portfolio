
const { ethers } = require('hardhat');

async function main () {
  const LOTRNFT = await ethers.getContractFactory('LOTRNFT');
  const LOTRNFTContractInstance = await LOTRNFT.deploy('LordOfTheRingsArt', 'LOTRA');

  await LOTRNFTContractInstance.deployed();
  console.log('Contract was successfully deployed to : ', LOTRNFTContractInstance.address);
  await LOTRNFTContractInstance.mint('https://ipfs.io/ipfs/QmdEVHWXQJsBCqSMSWWPjkfuzzRnkhjpRFVZtPhk1SE2je');
  console.log('NFT successfully minted.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
