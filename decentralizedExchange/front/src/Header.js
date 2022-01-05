import React from'react';
import DropDown from './DropDown.js';

function Header({
    user,
    tokens,
    contracts,
    selectToken
}) {
    return (
        <header id="header" className="card">
            <div className="row">
                <div className="col-sm-3 flex">
                    <DropDown
                        items = {tokens.map(token => ({
                            label: token.ticker,
                            value: token
                        }))}
                        activeItem={{
                            label: user.selectedToken.ticker,
                            value: user.selectedToken
                        }}
                        onSelect={selectToken}
                    />
                </div>
                <div className="col-sm-9">
                    <h1 className="header-title">
                        EldoraDex - 
                        <span className="contract-address">
                            Contract Address : 
                            <span className="address">
                                {contracts.dex.options.address}
                            </span>
                        </span>
                    </h1>
                </div>
            </div>
        </header>
    )
}

export default Header;