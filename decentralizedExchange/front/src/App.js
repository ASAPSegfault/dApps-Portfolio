import React, { useEffect, useState } from "react";
import Header from './Header.js';
import Footer from './Footer.js';
import Wallet from './WalletComponent.js';

function App({web3, accounts, contracts}) {
  
  const [user, setUser] = useState({
    accounts: [],
    selectedToken: undefined,
    tokenBalances: {
      tokenEldoraDex: 0,
      tokenWallet: 0
    }
  });
  const [tokens, setTokens] = useState([]);

  const selectToken = token => {
    setUser({...user, selectedToken: token})
  }

  const getTokensBalances = async (account, token) => {
    const tokenEldoraDex = await contracts.dex.methods
      .traderBalances(account, web3.utils.fromAscii(token.ticker))
      .call();

    const tokenWallet = await contracts[token.ticker].methods
      .balanceOf(account)
      .call();

    return { tokenEldoraDex, tokenWallet }
  }

  const withdraw = async amount => {
    await contracts.dex.methods
      .withdrawTokens(amount, web3.utils.fromAscii(user.selectedToken.ticker))
      .send({from: user.accounts[0]});
    const tokenBalances = await getTokensBalances(
      user.accounts[0],
      user.selectedToken
    );
    setUser(user => ({...user, tokenBalances}));
  }

  const deposit = async amount => {
    await contracts[user.selectedToken.ticker].methods.approve(
      contracts.dex.options.address, amount)
      .send({from: user.accounts[0]});
    await contracts.dex.methods
      .depositTokens(amount, web3.utils.fromAscii(user.selectedToken.ticker))
      .send({from: user.accounts[0]});
    const tokenBalances = await getTokensBalances(
      user.accounts[0],
      user.selectedToken
    );
    setUser(user => ({...user, tokenBalances}));
  }

  useEffect(() => {
    const init = async() => {
      const nonReadableTokens = await contracts.dex.methods.getTokens().call();
      const tokens = nonReadableTokens.map(token => ({
        ...token,
        ticker: web3.utils.hexToUtf8(token.ticker)
      }));
      console.log("Here")
      console.log(tokens[0])
      const tokenBalances = await getTokensBalances(accounts[0], tokens[0]);

      setTokens(tokens);
      setUser({accounts, selectedToken: tokens[0], tokenBalances});
    }
    init();
  }, []);

  if (typeof user.selectedToken === 'undefined') {
    return <div>Loading...</div>;
  }
  
console.log(user)

  return (
    <div id="app">
      <Header
        user = {user}
        tokens = {tokens}
        contracts = {contracts}
        selectToken = {selectToken}
      />
      <main className="container-fluid">
        <div className="row">
          <div className="col-sm-4 first-col">
            <Wallet
              user = {user}
              deposit = {deposit}
              withdraw = {withdraw}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
