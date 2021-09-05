const MultiSigWallet = artifacts.require('./multiSigWallet');
const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

contract('multiSigWallet', (accounts) => {
    let multiSigWallet;
    beforeEach(async () => {
        multiSigWallet = await MultiSigWallet.new([accounts[0], accounts[1], accounts[2], accounts[3]], 2);
        await web3.eth.sendTransaction({from : accounts[0], to: multiSigWallet.address, value: 1000});
    });

    it('should have correct quorum and approvers addresses', async () => {
        const quorum = await multiSigWallet.quorum();
        const approvers_addresses = await multiSigWallet.getApprovers();

        assert(approvers_addresses.length === 4)
        assert(approvers_addresses[0] = accounts[0]);
        assert(approvers_addresses[1] = accounts[1]);
        assert(approvers_addresses[2] = accounts[2]);
        assert(approvers_addresses[3] = accounts[3]);
        assert(quorum.toNumber() === 2);
    })

    it('should create a transfer', async() => {
        await multiSigWallet.transferEther(accounts[7], 300);
        const transfers = await multiSigWallet.getTransfers();

        assert(transfers.length === 1);
        assert(transfers[0].id === '0');
        assert(transfers[0].amount === '300');
        assert(transfers[0].to === accounts[7]);
        assert(transfers[0].approvals === '0');
        assert(transfers[0].is_sent === false);
    })

    it('should add a new approval', async() => {
        await multiSigWallet.transferEther(accounts[7], 200, {from: accounts[0]});
        await multiSigWallet.approveTransfer(0);
        const transfers = await multiSigWallet.getTransfers();
        const balance = await web3.eth.getBalance(multiSigWallet.address);

        assert(transfers[0].approvals === '1');
        assert(transfers[0].is_sent === false);
        assert(balance === '1000');
    })

    it('should send a transfer if the quorum has been met', async() => {
        const account_7_balance = web3.utils.toBN(await web3.eth.getBalance(accounts[7]));
        await multiSigWallet.transferEther(accounts[7], 200, {from: accounts[0]});
        await multiSigWallet.approveTransfer(0, {from: accounts[0]});
        await multiSigWallet.approveTransfer(0, {from: accounts[1]});
        await multiSigWallet.approveTransfer(0, {from: accounts[2]});
        const account_7_balance_after_transfer = web3.utils.toBN(await web3.eth.getBalance(accounts[7]));

        assert(account_7_balance_after_transfer.sub(account_7_balance).toNumber() === 200);
    })

    it('should REFUSE to create a transfer from an address that is not approved', async() => {
        await expectRevert(multiSigWallet.transferEther(accounts[6], 300, { from: accounts[4] })
        , 'Only approvers addresses allowed');
    })

    it('should REFUSE to approve a transfer if the sender is not approved', async() => {
        await multiSigWallet.transferEther(accounts[7], 200, {from: accounts[0]});
        await expectRevert(
            multiSigWallet.approveTransfer(0, {from: accounts[5]}),
            'Only approvers addresses allowed'
        );
    })

    it('should REFUSE to send a transfer if it is already sent', async() => {
        await multiSigWallet.transferEther(accounts[7], 200, {from: accounts[0]});
        await multiSigWallet.approveTransfer(0, {from: accounts[0]});
        await multiSigWallet.approveTransfer(0, {from: accounts[1]});
        await multiSigWallet.approveTransfer(0, {from: accounts[2]});

        await expectRevert(
            multiSigWallet.approveTransfer(0, {from: accounts[3]}),
            'transfer already sent'
        );
    })

    it('should REFUSE to approve transfer twice from the same approver', async() => {
        await multiSigWallet.transferEther(accounts[7], 200, {from: accounts[0]});
        await multiSigWallet.approveTransfer(0, {from: accounts[0]});

        await expectRevert(
            multiSigWallet.approveTransfer(0, {from: accounts[0]}),
            'transfer already approved'
        );
    })
});
