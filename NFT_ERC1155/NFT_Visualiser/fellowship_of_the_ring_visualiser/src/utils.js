
async function connectToMetamask() {
    try {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        const account = handleAccountSwitch(accounts);
        return account;
    }
    catch (error) {
        error.code === 4001 ? alert('Please connect to metamask or Brave browser\'s wallet and reload the page to continue') : console.log(error);
    }
}

async function handleAccountSwitch(accounts) {
    if (accounts.length === 0) {
        alert('Please connect to metamask');
    }
    else {
        //No need for watching the network change event because we're getting data from RPC provider
        window.ethereum.on('accountsChanged', () => { window.location.reload()});
        return accounts[0];
    }
}

export { connectToMetamask, handleAccountSwitch };