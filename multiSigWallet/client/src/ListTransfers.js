import React from 'react';

function ListTransfers({transfers, approveTransfer}) {


    return (
        <div>
            <h2> Transfers List </h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>To</th>
                        <th>Approvals</th>
                        <th>Sent</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map(transfer => (
                        <tr key={transfer.id}>
                            <td>{transfer.id}</td>
                            <td>{transfer.amount}</td>
                            <td>{transfer.to}</td>
                            <td>
                                {transfer.approvals}
                                <button onClick={() => approveTransfer(transfer.id)}>Approve</button>
                            </td>
                            <td>{transfer.is_sent ? 'yes' : 'no'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListTransfers;