import React, { useState } from 'react';

function NewTransfer({createTransfer}) {
    const [transfers, setTransfers] = useState(undefined);
    const updateTransfer = (e, field) => {
        const value = e.target.value;
        setTransfers({...transfers, [field]: value});
    };

    const submit = e => {
        e.preventDefault();
        createTransfer(transfers);
    }

    return (
        <div>
            <h2>Create transfer</h2>
            <form onSubmit={(e) => submit(e)}>
                <label htmlFor="amount">Amount</label>
                <input
                id="amount"
                type="text"
                onChange={e => updateTransfer(e, 'amount')}/>
                <label htmlFor="amount">Address</label>
                <input
                id="to"
                type="text"
                onChange={e => updateTransfer(e, 'to')}/>  
                <button>Submit</button>          
            </form>
        </div>
    )
}

export default NewTransfer;