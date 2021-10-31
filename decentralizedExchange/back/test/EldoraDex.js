const EBat = artifacts.require('EldoraBAT.sol');
const EDai = artifacts.require('EldoraDAI.sol');
const EGolem = artifacts.require('EldoraGOLEM.sol');
const ELink = artifacts.require('EldoraLINK.sol');
const EldoraDex = artifacts.require('EldoraDex.sol');
const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

const SIDE = {
    BUY: 0,
    SELL: 1
};

contract('EldoraDex', (accounts) => {
    let dex, ebat, edai, egolem, elink;
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

        dex = await EldoraDex.new();
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
        }

        await Promise.all([ebat, edai, egnt, elink].map(
                token =>  seedTokensBalances(token, user1)
            )
        );
        await Promise.all([ebat, edai, egnt, elink].map(
                token => seedTokensBalances(token, user2)
            )
        );
    });

    it('should deposit tokens', async () => {
        const amount = web3.utils.toWei('100');

        await dex.depositTokens(amount, EDAI, {from : user1});

        const balance = await dex.traderBalances(user1, EDAI);
        assert(balance.toString() === amount);
    });

    it('should NOT deposit tokens', async () => {
        await expectRevert(
            dex.depositTokens(
                web3.utils.toWei('100'),
                web3.utils.fromAscii('DOES_NOT_EXIST'),
                { from : user1 }
            ),
            'Token must be tradable on EldoraDEX'
        );
    });

    it('should withdraw tokens', async () => {
        const amount = web3.utils.toWei('100');

        await dex.depositTokens(amount, EDAI, {from : user1});
        await dex.withdrawTokens(amount, EDAI, {from : user1});

        const dexBalance = await dex.traderBalances(user1, EDAI);
        const user1EDAIBalance = await edai.balanceOf(user1);
        assert(dexBalance.isZero());
        assert(user1EDAIBalance.toString() === web3.utils.toWei('1000'),)
    });

    it('should NOT withdraw tokens if it does not exist', async () => {
        await expectRevert(
            dex.withdrawTokens(
                web3.utils.toWei('100'),
                web3.utils.fromAscii('DOEST_NOT_EXIST'),
                { from : user1 }
            ),
            'Token must be tradable on EldoraDEX'
        );
    });

    it('should NOT withdraw tokens if balance is too low', async () => {
        const amount = web3.utils.toWei('100');

        await dex.depositTokens(amount, EDAI, {from : user1});
        await expectRevert(
            dex.withdrawTokens(
                web3.utils.toWei('500'),
                EDAI,
                { from : user1 }
            ),
            "Account's balance is too low"
        );
    });

    it('should create several LIMIT orders ordered in the right way depending on the side of the book.', async () => {
        let amount = web3.utils.toWei('500');

        await dex.depositTokens(amount, EDAI, {from : user1});
        await dex.createLimitOrder(SIDE.BUY, EBAT, web3.utils.toWei('10'), 30, {from : user1});

        let buyOrdersList = await dex.getOrders(SIDE.BUY, EBAT);
        let sellOrdersList = await dex.getOrders(SIDE.SELL, EBAT);

        assert(buyOrdersList.length === 1);
        assert(buyOrdersList[0].trader === user1);
        assert(buyOrdersList[0].ticker === web3.utils.padRight(EBAT, 64));
        assert(buyOrdersList[0].price === '30');
        assert(buyOrdersList[0].amount === web3.utils.toWei('10'));
        assert(sellOrdersList.length === 0);

        amount = web3.utils.toWei('500');

        await dex.depositTokens(amount, EDAI, {from : user2});
        await dex.createLimitOrder(SIDE.BUY, EBAT, web3.utils.toWei('10'), 31, {from : user2});

        buyOrdersList = await dex.getOrders(SIDE.BUY, EBAT);
        sellOrdersList = await dex.getOrders(SIDE.SELL, EBAT);
        assert(buyOrdersList.length === 2);
        assert(buyOrdersList[0].trader === user2);
        assert(buyOrdersList[1].trader === user1);
        assert(sellOrdersList.length === 0);

        await dex.createLimitOrder(SIDE.BUY, EBAT, web3.utils.toWei('10'), 29, {from : user2});

        buyOrdersList = await dex.getOrders(SIDE.BUY, EBAT);
        sellOrdersList = await dex.getOrders(SIDE.SELL, EBAT);
        assert(buyOrdersList.length === 3);
        assert(buyOrdersList[0].trader === user2);
        assert(buyOrdersList[1].trader === user1);
        assert(buyOrdersList[2].trader === user2);
        assert(buyOrdersList[0].price === '31');
        assert(buyOrdersList[2].price === '29');
        assert(sellOrdersList.length === 0);
    });

    it('should NOT create LIMIT BUY order if the token does not exist', async() => {
        await expectRevert(
            dex.createLimitOrder(SIDE.BUY, 
                web3.utils.fromAscii('DOES_NOT_EXIST'),
                web3.utils.toWei('10'), 
                30, 
                {from : user1}),
            'Token must be tradable on EldoraDEX'
        );
    });

    it('should NOT create LIMIT BUY order if token is EDAI', async() => {
        await expectRevert(
            dex.createLimitOrder(SIDE.BUY, 
                EDAI,
                web3.utils.toWei('10'), 
                30, 
                {from : user1}),
            'EDAI is not allowed to be traded'
        );
    });

    it('should NOT create LIMIT SELL order if token balance is too low', async() => {
        const amount = web3.utils.toWei('500');

        await dex.depositTokens(amount, EBAT, {from : user1});

        await expectRevert(
            dex.createLimitOrder(SIDE.SELL, EBAT, web3.utils.toWei('501'), 1, {from : user1}),
            'Token balance is too low'
        );
    });

    it('should NOT create LIMIT BUY order if EDAI balance is too low', async() => {
        
        const amount = web3.utils.toWei('500');

        await dex.depositTokens(amount, EDAI, {from : user1});
        await expectRevert(
            dex.createLimitOrder(SIDE.BUY, EBAT, web3.utils.toWei('501'), 1, {from : user1}),
            'EDAI balance is too low'
        );
    });

    it('Should create a market order and match it with a limit order', async() => {
        const amount = web3.utils.toWei('500');

        await dex.depositTokens(amount, EDAI, {from : user1});
        await dex.createLimitOrder(SIDE.BUY, EGNT, web3.utils.toWei('100'), 1, {from : user1});
        await dex.depositTokens(amount, EGNT, {from : user2});
        await dex.createMarketOrder(SIDE.SELL, EGNT, web3.utils.toWei('75'), {from : user2});

        const balances = await Promise.all([
            dex.traderBalances(user1, EGNT),
            dex.traderBalances(user2, EGNT),
            dex.traderBalances(user1, EDAI),
            dex.traderBalances(user2, EDAI)
        ])

        const orders = await dex.getOrders(SIDE.BUY, EGNT);
        assert(balances[0].toString() === web3.utils.toWei('75'));
        assert(balances[1].toString() === web3.utils.toWei('425'));
        assert(balances[2].toString() === web3.utils.toWei('425'));
        assert(balances[3].toString() === web3.utils.toWei('75'));
        assert(orders[0].filled === web3.utils.toWei('75'));
    });

    it('should NOT create MARKET order if the token does not exist', async() => {
        await expectRevert(
            dex.createMarketOrder(SIDE.BUY, 
                web3.utils.fromAscii('DOES_NOT_EXIST'),
                web3.utils.toWei('10'),
                {from : user1}),
            'Token must be tradable on EldoraDEX'
        );
    });

    it('should NOT create MARKET order if token is EDAI', async() => {
        await expectRevert(
            dex.createMarketOrder(SIDE.BUY, 
                EDAI,
                web3.utils.toWei('10'),
                {from : user1}),
            'EDAI is not allowed to be traded'
        );
    });

    it('should NOT create MARKET SELL order if token balance is too low', async() => {
        const amount = web3.utils.toWei('500');

        await dex.depositTokens(amount, EBAT, {from : user1});

        await expectRevert(
            dex.createMarketOrder(SIDE.SELL, EBAT, web3.utils.toWei('501'), {from : user1}),
            'Token balance is too low'
        );
    });

    it('should NOT create MARKET BUY order if EDAI balance is too low', async() => {
        
        const amount = web3.utils.toWei('500');

        await dex.depositTokens(amount, EBAT, {from : user2});
        await dex.createLimitOrder(SIDE.SELL, EBAT, web3.utils.toWei('100'), 1, {from : user2});

        await expectRevert(
            dex.createMarketOrder(SIDE.BUY, EBAT, web3.utils.toWei('100'), {from : user1}),
            'EDAI balance is too low'
        );
    });
});