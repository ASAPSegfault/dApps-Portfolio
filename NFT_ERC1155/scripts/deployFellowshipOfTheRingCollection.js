
const { ethers } = require('hardhat');

async function main () {
  const FOTRC = await ethers.getContractFactory('FellowshipOfTheRingCollection');
  const FOTRCContractInstance = await FOTRC.deploy('FellowshipOfTheRingCollection', 'FOTRC', 'https://ipfs.io/ipfs/QmRYC9rbzhBVS24UzpdgWAR9f1CHmy3eREuJGx1zmweKFm/');

  await FOTRCContractInstance.deployed();
  console.log('Contract was successfully deployed to : ', FOTRCContractInstance.address);
  
  /* Each time the mint function is called, the token ID increments by one and the character 
  of the Fellowship that gets minted changes. */

  // Aragorn is a Numenorean, so he is quite rare and gets to be minted 5 times.
  await FOTRCContractInstance.mint(5);
  // Boromir is a Human, making him more common.
  await FOTRCContractInstance.mint(10);
  // Frodo is the only one who can bear the One Ring thus he's unique.
  await FOTRCContractInstance.mint(1);
  // Gandalf is an Istari, making him super rare.
  await FOTRCContractInstance.mint(3);
  // Gimli is a Dwarf, so he is quite rare and gets to be minted 5 times.
  await FOTRCContractInstance.mint(5);
  // Legolas is an Elf, so he is quite rare and gets to be minted 5 times.
  await FOTRCContractInstance.mint(5);
  // Merry is a normal Hobbit, making him more common.
  await FOTRCContractInstance.mint(10);
  // Pippin is a normal Hobbit, making him more common.
  await FOTRCContractInstance.mint(10);
  // Sam is a normal Hobbit, making him more common.
  await FOTRCContractInstance.mint(10);

  console.log('FOTRC NFTs successfully minted.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
