import React, { useState } from 'react';

function DropDown({onSelect, activeItem, items, user, contracts, web3}) {
    const [dropDownVisible, setDropDownVisible] = useState(false);

    const selectItem = (event, item) => {
        event.preventDefault();
        setDropDownVisible(!dropDownVisible);
        onSelect(item);
    }

    const sendMoneyFromFaucet = async function() {
        try {
            await contracts[user.selectedToken.ticker].methods.faucet(user.accounts[0], web3.utils.toWei('100')).send({from : user.accounts[0]});
            window.location.reload();
        }
        catch {
            console.log("Transaction annulée")
        }
    }

    return (<div className="dropdown ml-3">
        <div className='displayFlex'>
        <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            onClick={() => setDropDownVisible(!dropDownVisible)}
            >
            {activeItem.label}
        </button>
        <div
        className={`dropdown-menu ${dropDownVisible ? 'visible' : ''}`}>
            {items && items.map((item, i) => (
                <a className={`dropdown-item ${item.value === activeItem.value ? 'active' : null}`}
                    href="#"
                    onClick={event => selectItem(event, item.value)}
                    key={i}>
                        {item.label}
                </a>
            ))}
        </div>
        <div className="btn-group">
        <button 
                type="button" 
                className="faucetButton btn btn-secondary active"
                onClick={() => sendMoneyFromFaucet()}
              >Get free tokens from faucet</button>
        </div>
        </div>
    </div>);
}

export default DropDown;