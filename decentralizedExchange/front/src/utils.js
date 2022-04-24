import Web3 from 'web3';
import EldoraDex from './contracts/EldoraDex.json';
import ERC20Abi from './ERC20Abi.json';
import EldoraBAT from './contracts/EldoraBAT.json'
import EldoraDAI from './contracts/EldoraDAI.json'
import EldoraGOLEM from './contracts/EldoraGOLEM.json'
import EldoraLINK from './contracts/EldoraLINK.json'

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // Request account access if needed
            console.log("Resolving classic web3")
            await window.ethereum.enable();
            // Acccounts now exposed
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          // Use Mist/MetaMask's provider.
          const web3 = window.web3;
          console.log("Injected web3 detected.");
          resolve(web3);
        }
        // Fallback to localhost; use dev console port by default...
        else {
          const provider = new Web3.providers.HttpProvider(
            "http://localhost:9545"
          );
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3.");
          resolve(web3);
        }
      });
    });
  };

  const getContractsInstances = async web3 => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = EldoraDex.networks[networkId];
    const tokenContractsMap = new Map();
    const tokenContractsNetworkMap = new Map();

    tokenContractsMap.set('EBAT', EldoraBAT.abi);
    tokenContractsMap.set('EDAI', EldoraBAT.abi);
    tokenContractsMap.set('EGNT', EldoraBAT.abi);
    tokenContractsMap.set('ELINK', EldoraBAT.abi);

    tokenContractsNetworkMap.set('EBAT', EldoraBAT.networks[networkId])
    tokenContractsNetworkMap.set('EDAI', EldoraDAI.networks[networkId])
    tokenContractsNetworkMap.set('EGNT', EldoraGOLEM.networks[networkId])
    tokenContractsNetworkMap.set('ELINK', EldoraLINK.networks[networkId])

    const dex = new web3.eth.Contract(
        EldoraDex.abi,
        deployedNetwork && deployedNetwork.address,
    );

    const tokens = await dex.methods.getTokens().call();
    const tokenContracts = tokens.reduce((accumulator, token) => ({
        ...accumulator, [web3.utils.hexToUtf8(token.ticker)]: new web3.eth.Contract(
            tokenContractsMap.get(web3.utils.hexToUtf8(token.ticker)),
            tokenContractsNetworkMap.get(web3.utils.hexToUtf8(token.ticker)).address
        )
    }), {});

    return {dex, ...tokenContracts};
}

export { getWeb3, getContractsInstances }
