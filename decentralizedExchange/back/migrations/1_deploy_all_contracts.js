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

module.exports = async function(deployer, _network, accounts) {
    
    const [user1, user2, user3, user4, user5, user6, user7, user8, user9, _] = accounts
    
    await Promise.all(
        [EBat, EDai, EGolem, ELink, EldoraDex].map(contract => deployer.deploy(contract, {gas: 2000000}))
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

    const seedAmount = web3.utils.toWei('1000');
    const seedTokensBalances = async(token, user) => {
        await token.faucet(user, seedAmount);
        await token.approve(
            dex.address,
            seedAmount,
            {from : user}
        );
        const ticker = await token.name();
        await dex.depositTokens(seedAmount,
            web3.utils.fromAscii(ticker),
            {from : user}
        );
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
    await Promise.all([ebat, edai, egnt, elink].map(
        token => seedTokensBalances(token, user8)
    )
    );
    await Promise.all([ebat, edai, egnt, elink].map(
        token => seedTokensBalances(token, user9)
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
     await dex.createLimitOrder(SIDE.BUY, EBAT, 1000, 10, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EBAT, 1000, {from: user2,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, EBAT, 1200, 11, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EBAT, 1200, {from: user2,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, EBAT, 1200, 15, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EBAT, 1200, {from: user2,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, EBAT, 1500, 14, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EBAT, 1500, {from: user2,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, EBAT, 2000, 12, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EBAT, 2000, {from: user2,  gas : 1000000});
   
     await dex.createLimitOrder(SIDE.BUY, EGNT, 1000, 2, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EGNT, 1000, {from: user2,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, EGNT, 500, 4, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EGNT, 500, {from: user2,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, EGNT, 800, 2, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EGNT, 800, {from: user2,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, EGNT, 1200, 6, {from: user1,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, EGNT, 1200, {from: user2,  gas : 1000000});

     await dex.createLimitOrder(SIDE.BUY, ELINK, 1000, 2, {from: user5,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, ELINK, 1000, {from: user6,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, ELINK, 500, 4, {from: user5,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, ELINK, 500, {from: user6,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, ELINK, 800, 2, {from: user5,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, ELINK, 800, {from: user6,  gas : 1000000});
     await increaseTime(1);
     await dex.createLimitOrder(SIDE.BUY, ELINK, 1200, 6, {from: user5,  gas : 1000000});
     await dex.createMarketOrder(SIDE.SELL, ELINK, 1200, {from: user6,  gas : 1000000});
     //create orders
     await Promise.all([
       dex.createLimitOrder(SIDE.BUY, EBAT, 1400, 10, {from: user1,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, EBAT, 1200, 11, {from: user2,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, EBAT, 1000, 12, {from: user2,  gas : 1000000}),
   
       dex.createLimitOrder(SIDE.BUY, EGNT, 3000, 4, {from: user1,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, EGNT, 2000, 5, {from: user1,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, EGNT, 500, 6, {from: user2,  gas : 1000000}),
   
       dex.createLimitOrder(SIDE.BUY, ELINK, 4000, 12, {from: user1,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, ELINK, 3000, 13, {from: user1,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, ELINK, 500, 14, {from: user2,  gas : 1000000}),

       dex.createLimitOrder(SIDE.BUY, EBAT, 1500, 8, {from: user1,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, EBAT, 1300, 14, {from: user2,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, EBAT, 1000, 15, {from: user2,  gas : 1000000}),
   
       dex.createLimitOrder(SIDE.BUY, EGNT, 2500, 4, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, EGNT, 1800, 5, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, EGNT, 750, 6, {from: user8,  gas : 1000000}),
   
       dex.createLimitOrder(SIDE.BUY, ELINK, 3500, 12, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, ELINK, 3200, 13, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.BUY, ELINK, 850, 14, {from: user8,  gas : 1000000}),

       dex.createLimitOrder(SIDE.SELL, EBAT, 2000, 16, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, EBAT, 3000, 15, {from: user8,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, EBAT, 500, 14, {from: user8,  gas : 1000000}),
   
       dex.createLimitOrder(SIDE.SELL, EGNT, 4000, 10, {from: user3,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, EGNT, 2000, 9, {from: user3,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, EGNT, 800, 8, {from: user4,  gas : 1000000}),
   
       dex.createLimitOrder(SIDE.SELL, ELINK, 1500, 23, {from: user3,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, ELINK, 1200, 22, {from: user3,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, ELINK, 900, 21, {from: user4,  gas : 1000000}),

       dex.createLimitOrder(SIDE.SELL, EBAT, 2100, 16, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, EBAT, 2800, 15, {from: user8,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, EBAT, 700, 14, {from: user8,  gas : 1000000}),
   
       dex.createLimitOrder(SIDE.SELL, EGNT, 4000, 10, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, EGNT, 2000, 9, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, EGNT, 800, 8, {from: user8,  gas : 1000000}),
   
       dex.createLimitOrder(SIDE.SELL, ELINK, 1500, 23, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, ELINK, 1200, 22, {from: user7,  gas : 1000000}),
       dex.createLimitOrder(SIDE.SELL, ELINK, 900, 21, {from: user8,  gas : 1000000}),
     ]);
}