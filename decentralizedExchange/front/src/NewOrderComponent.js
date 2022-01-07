import React, { useState } from 'react';

const ORDER_TYPE = {
    LIMIT : 'LIMIT',
    MARKET: 'MARKET'
};

const ORDER_SIDE = {
    BUY: 0,
    SELL: 1
}

function NewOrder({createLimitOrder, createMarketOrder}) {
    const [order, setOrder] = useState({
        type: ORDER_TYPE.LIMIT,
        side: ORDER_SIDE.BUY,
        amount: '',
        price: ''
    });

    const onSubmit = event => {
        event.preventDefault();
        if (order.type === ORDER_TYPE.MARKET) {
            createMarketOrder(order.side, order.amount);
        }
        else {
            createLimitOrder(order.side, order.amount, order.price);
        }
    }

    return (
        <div id="orders" className="card">
          <h2 className="card-title">New Order</h2>
          <form onSubmit={(event) => onSubmit(event)}>

            <div className="form-group row">
              <label htmlFor="type" className="col-sm-4 col-form-label">Type</label>
              <div className="col-sm-8">
                <div id="type" className="btn-group" role="group">
                  <button 
                    type="button" 
                    className={`btn btn-secondary ${order.type === ORDER_TYPE.LIMIT ? 'active' : ''}`}
                    onClick={() => setOrder(order => ({ ...order, type: ORDER_TYPE.LIMIT}))}
                  >Limit</button>
                  <button 
                    type="button" 
                    className={`btn btn-secondary ${order.type === ORDER_TYPE.MARKET ? 'active' : ''}`}
                    onClick={() => setOrder(order => ({ ...order, type: ORDER_TYPE.MARKET}))}
                  >Market</button>
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="side" className="col-sm-4 col-form-label">Side</label>
              <div className="col-sm-8">
                <div id="side" className="btn-group" role="group">
                  <button 
                    type="button" 
                    className={`btn btn-secondary ${order.side === ORDER_SIDE.BUY ? 'active' : ''}`}
                    onClick={() => setOrder(order => ({ ...order, side:  ORDER_SIDE.BUY}))}
                  >Buy</button>
                  <button 
                    type="button" 
                    className={`btn btn-secondary ${order.side === ORDER_SIDE.SELL ? 'active' : ''}`}
                    onClick={() => setOrder(order => ({ ...order, side:  ORDER_SIDE.SELL}))}
                  >Sell</button>
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="order-amount">Amount</label>
              <div className="col-sm-8">
                <input 
                  type="text" 
                  className="form-control" 
                  id="order-amount" 
                  onChange={({ target: { value }}) => setOrder(order => ({ ...order, amount: value}))}
                />
              </div>
            </div>

            {order.type === ORDER_TYPE.MARKET ? null :
              <div className="form-group row">
                <label className="col-sm-4 col-form-label" htmlFor="order-amount">Price</label>
                <div className="col-sm-8">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="order-price" 
                    onChange={({ target: { value }}) => setOrder(order => ({ ...order, price: value}))}
                  />
                </div>
              </div>
            }
            <div className="text-right">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      );
}

export default NewOrder;