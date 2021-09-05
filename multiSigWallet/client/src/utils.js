import MultiSigWallet from './contracts/multiSigWallet.json'
import Web3 from 'web3';

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    resolve(web3);   
                } catch (error) {
                    reject(error);
                }
            }
            else if (window.web3) {
                resolve(window.web3);
            }
            else {
                reject("Must install Metamask before using our Wallet !")
            }
        });
    });
}

const getMultiSigWalletContractInstance = async web3 => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = MultiSigWallet.networks[networkId];
    
    if (!deployedNetwork) {
        return false;
    }

    return new web3.eth.Contract(
        MultiSigWallet.abi,
        deployedNetwork.address
    );
}

export { getWeb3, getMultiSigWalletContractInstance }