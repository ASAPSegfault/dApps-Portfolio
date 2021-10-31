const EBat = artifacts.require('EldoraBAT.sol');
const EDai = artifacts.require('EldoraDAI.sol');
const EGolem = artifacts.require('EldoraGOLEM.sol');
const ELink = artifacts.require('EldoraLINK.sol');
const EldoraDex = artifacts.require('EldoraDex.sol');

const [EBAT, EDAI, EGNT, ELINK] = ['EBAT', 'EDAI', 'EGNT', 'ELINK']
    .map(ticker => web3.utils.fromAscii(ticker));

const SIDE = {
    BUY: 0,
    SELL: 1
};

module.exports = async function(contractDeployer, _networks, accounts) {
    const [user1, user2, user3, user4, user5, user6, user7, _] = accounts; 
    await Promise.all(
        [EBat, EDai, EGolem, ELink, EldoraDex].map(contract => contractDeployer.deploy(contract))
    );
    const [ebat, edai, egnt, elink, eldoradex] = await Promise.all(
        [EBat, EDai, EGolem, ELink, EldoraDex].map(contract => contract.deployed())
    );

    await Promise.all([
        eldoradex.addToken(EBAT, ebat.address),
        eldoradex.addToken(EDAI, edai.address),
        eldoradex.addToken(EGNT, egnt.address),
        eldoradex.addToken(ELINK, elink.address)
    ]);

    const seedAmount = web3.utils.toWei('1000');
    const seedTokensBalances = async(token, user) => {
        await token.faucet(user, seedAmount);
        await token.approve(
            eldoradex.address,
            seedAmount,
            {from : user}
        );

        const tokenTicker = await token.name();
        await eldoradex.depositTokens(seedAmount, web3.utils.fromAscii(tokenTicker), {from : user});
    }

    await Promise.all([ebat, edai, egnt, elink].map(
            token =>  seedTokensBalances(token, user1)
        )
    );
    await Promise.all([ebat, edai, egnt, elink].map(
            token => seedTokensBalances(token, user2)
        )
    );
    await Promise.all([ebat, edai, egnt, elink].map(
            token => seedTokensBalances(token, user3)
        )
    );
    await Promise.all([ebat, edai, egnt, elink].map(
            token => seedTokensBalances(token, user4)
        )
    );
    await Promise.all([ebat, edai, egnt, elink].map(
            token => seedTokensBalances(token, user5)
        )
    );
        await Promise.all([ebat, edai, egnt, elink].map(
            token => seedTokensBalances(token, user6)
        )
    );
        await Promise.all([ebat, edai, egnt, elink].map(
            token => seedTokensBalances(token, user7)
        )
    );
    const increaseTime = async (seconds) => {
        await web3.currentProvider.send({
          jsonrpc: '2.0',
          method: 'evm_increaseTime',
          params: [seconds],
          id: 0,
        }, () => {});
        await web3.currentProvider.send({
          jsonrpc: '2.0',
          method: 'evm_mine',
          params: [],
          id: 0,
        }, () => {});
     }
   
     //create trades
     await eldoradex.createLimitOrder(SIDE.BUY, EBAT, 1000, 10, {from: user1});
     await eldoradex.createMarketOrder(SIDE.SELL, EBAT, 1000, {from: user2});
     await increaseTime(1);
     await eldoradex.createLimitOrder(SIDE.BUY, EBAT, 1200, 11, {from: user1});
     await eldoradex.createMarketOrder(SIDE.SELL, EBAT, 1200, {from: user2});
     await increaseTime(1);
     await eldoradex.createLimitOrder(SIDE.BUY, EBAT, 1200, 15, {from: user1});
     await eldoradex.createMarketOrder(SIDE.SELL, EBAT, 1200, {from: user2});
     await increaseTime(1);
     await eldoradex.createLimitOrder(SIDE.BUY, EBAT, 1500, 14, {from: user1});
     await eldoradex.createMarketOrder(SIDE.SELL, EBAT, 1500, {from: user2});
     await increaseTime(1);
     await eldoradex.createLimitOrder(SIDE.BUY, EBAT, 2000, 12, {from: user1});
     await eldoradex.createMarketOrder(SIDE.SELL, EBAT, 2000, {from: user2});
   
     await eldoradex.createLimitOrder(SIDE.BUY, EGNT, 1000, 2, {from: user1});
     await eldoradex.createMarketOrder (SIDE.SELL, EGNT, 1000, {from: user2});
     await increaseTime(1);
     await eldoradex.createLimitOrder(SIDE.BUY, EGNT, 500, 4, {from: user1});
     await eldoradex.createMarketOrder(SIDE.SELL, EGNT, 500, {from: user2});
     await increaseTime(1);
     await eldoradex.createLimitOrder(SIDE.BUY, EGNT, 800, 2, {from: user1});
     await eldoradex.createMarketOrder(SIDE.SELL, EGNT, 800, {from: user2});
     await increaseTime(1);
     await eldoradex.createLimitOrder(SIDE.BUY, EGNT, 1200, 6, {from: user1});
     await eldoradex.createMarketOrder(SIDE.SELL, EGNT, 1200, {from: user2});
   
     //create orders
     await Promise.all([
       eldoradex.createLimitOrder(SIDE.BUY, EBAT, 1400, 10, {from: user1}),
       eldoradex.createLimitOrder(SIDE.BUY, EBAT, 1200, 11, {from: user2}),
       eldoradex.createLimitOrder(SIDE.BUY, EBAT, 1000, 12, {from: user2}),
   
       eldoradex.createLimitOrder(SIDE.BUY, EGNT, 3000, 4, {from: user1}),
       eldoradex.createLimitOrder(SIDE.BUY, EGNT, 2000, 5, {from: user1}),
       eldoradex.createLimitOrder(SIDE.BUY, EGNT, 500, 6, {from: user2}),
   
       eldoradex.createLimitOrder(SIDE.BUY, ELINK, 4000, 12, {from: user1}),
       eldoradex.createLimitOrder(SIDE.BUY, ELINK, 3000, 13, {from: user1}),
       eldoradex.createLimitOrder(SIDE.BUY, ELINK, 500, 14, {from: user2}),
   
       eldoradex.createLimitOrder(SIDE.SELL, EBAT, 2000, 16, {from: user3}),
       eldoradex.createLimitOrder(SIDE.SELL, EBAT, 3000, 15, {from: user4}),
       eldoradex.createLimitOrder(SIDE.SELL, EBAT, 500, 14, {from: user4}),
   
       eldoradex.createLimitOrder(SIDE.SELL, EGNT, 4000, 10, {from: user3}),
       eldoradex.createLimitOrder(SIDE.SELL, EGNT, 2000, 9, {from: user3}),
       eldoradex.createLimitOrder(SIDE.SELL, EGNT, 800, 8, {from: user4}),
   
       eldoradex.createLimitOrder(SIDE.SELL, ELINK, 1500, 23, {from: user3}),
       eldoradex.createLimitOrder(SIDE.SELL, ELINK, 1200, 22, {from: user3}),
       eldoradex.createLimitOrder(SIDE.SELL, ELINK, 900, 21, {from: user4}),

       eldoradex.createLimitOrder(SIDE.SELL, EBAT, 250, 24, {from: user5}),
       eldoradex.createLimitOrder(SIDE.SELL, EBAT, 2350, 25, {from: user6}),
       eldoradex.createLimitOrder(SIDE.SELL, EBAT, 2785, 26, {from: user6}),
   
       eldoradex.createLimitOrder(SIDE.SELL, EGNT, 4270, 4, {from: user5}),
       eldoradex.createLimitOrder(SIDE.SELL, EGNT, 685, 5, {from: user5}),
       eldoradex.createLimitOrder(SIDE.SELL, EGNT, 895, 6, {from: user6}),
   
       eldoradex.createLimitOrder(SIDE.SELL, ELINK, 2330, 31, {from: user5}),
       eldoradex.createLimitOrder(SIDE.SELL, ELINK, 4500, 32, {from: user5}),
       eldoradex.createLimitOrder(SIDE.SELL, ELINK, 350, 33, {from: user6}),
     ]);
   
}