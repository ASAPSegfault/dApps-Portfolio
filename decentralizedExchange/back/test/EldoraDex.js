const EBat = artifacts.require('EldoraBAT.sol');
const EDai = artifacts.require('EldoraDAI.sol');
const EGolem = artifacts.require('EldoraGOLEM.sol');
const ELink = artifacts.require('EldoraLINK.sol');
const EldoraDex = artifacts.require('EldoraDex.sol');

contract('EldoraDex', (accounts) => {
    let ebat, edai, egolem, elink;
    const user1 = accounts[1];
    const user2 = accounts[2];
    const [EBAT, EDAI, EGNT, ELINK] = ['EBAT', 'EDAI', 'EGNT', 'ELINK']
        .map(ticker => web3.utils.fromAscii(ticker));
    
    beforeEach(async () => {
        ([ebat, edai, egnt, elink] = await Promise.all([
            EBat.new(),
            EDai.new(),
            EGolem.new(),
            ELink.new()
        ]));

        const dex = await EldoraDex.new();
        await Promise.all([
            dex.addToken(EBAT, ebat.address),
            dex.addToken(EDAI, edai.address),
            dex.addToken(EGNT, egnt.address),
            dex.addToken(ELINK, elink.address)
        ]);

        const seedAmount = web3.utils.toWei('1000');
        const seedTokensBalances = async(token, user) => {
            await token.faucet();
            await token.approve(
                dex.address,
                seedAmount,
                {from : user}
            );
        }

        await Promise.all([ebat, edai, egnt, elink].map(
                token => seedTokensBalances(token, user1)
            )
        );
        await Promise.all([ebat, edai, egnt, elink].map(
                token => seedTokensBalances(token, user2)
            )
        );
    });
});