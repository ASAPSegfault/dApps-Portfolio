import React, { useEffect, useState } from 'react';
import { getWeb3, getMultiSigWalletContractInstance } from './utils.js'
import Header from './Header.js';
import NewTransfer from './NewTransfer.js';
import ListTransfers from './ListTransfers.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);
  const [error, setErrors] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      console.log(web3);
      const accounts = await web3.eth.getAccounts();
      //Handle the fact that metamask is not connected to the right network
      // or that it can't get a contract instance from web3 provider
      const wallet = await getMultiSigWalletContractInstance(web3);
      console.log(wallet);
      if (!wallet) {
        setErrors(<div> This Metamask wallet is probably not connected to the right network. </div>)
        return ;
      }
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      const transfers = await wallet.methods.getTransfers().call();

      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
      setTransfers(transfers);
    }
    init();
  }, []);

  const createTransfer = transfer => {
    wallet.methods.transferEther(transfer.to, transfer.amount).send({from: accounts[0], gas:3000000});
    setTransfers(transfers => [...transfers, transfer]);
  }

  const approveTransfer = transferId => {
    wallet.methods.approveTransfer(transferId).send({from: accounts[0], gas:3000000});
  }

  if (error) {
    return error;
  }

  if (typeof web3 === 'undefined' || typeof accounts === 'undefined' || typeof wallet === 'undefined'
    || typeof approvers === 'undefined' || typeof quorum === 'undefined') {
    return <div> Loading components ...</div>
  }

  return (
    <div className="App">
      MultisigWallet
      <Header approvers = {approvers} quorum = {quorum}/>
      <NewTransfer createTransfer={createTransfer}/>
      <ListTransfers transfers={transfers} approveTransfer={approveTransfer}/>
    </div>
  );
}

export default App;
