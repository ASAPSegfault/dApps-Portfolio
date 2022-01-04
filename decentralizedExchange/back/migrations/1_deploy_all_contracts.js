const EBat = artifacts.require('EldoraBAT.sol');
const EDai = artifacts.require('EldoraDAI.sol');
const EGolem = artifacts.require('EldoraGOLEM.sol');
const ELink = artifacts.require('EldoraLINK.sol');
const EldoraDex = artifacts.require('EldoraDex.sol');

const [EBAT, EDAI, EGNT, ELINK] = ['EBAT', 'EDAI', 'EGNT', 'ELINK']
    .map(ticker => web3.utils.fromAscii(ticker));

module.exports = async function(deployer) {
    await Promise.all(
        [EBat, EDai, EGolem, ELink, EldoraDex].map(contract => deployer.deploy(contract))
    );
    const [ebat, edai, egnt, elink, dex] = await Promise.all(
        [EBat, EDai, EGolem, ELink, EldoraDex].map(contract => contract.deployed())
    );

    await Promise.all([
        dex.addToken(EBAT, ebat.address),
        dex.addToken(EDAI, edai.address),
        dex.addToken(EGNT, egnt.address),
        dex.addToken(ELINK, elink.address)
    ]);
}