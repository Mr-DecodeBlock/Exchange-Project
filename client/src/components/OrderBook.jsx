import React, { useEffect, useState } from "react";
import OrdersInBook from "../Hooks/OrdersInBook";
import { utils } from "ethers";
import "./OrderBook.css";
import { useEthers } from "@usedapp/core";
import Contract from "../Hooks/ExchangeContract";

import "./component.css";

const OrderBook = () => {
  const [orderList, setOrderlist] = useState([]);
  const orderListCopy = OrdersInBook();
  const { account } = useEthers();
  const ExchangeContract = Contract();

  const SetValueToOrderList = () => {
    orderListCopy.then((res) => {
      setOrderlist(res);
    });
  };

  const cancelOrder = (orderId) => {
    ExchangeContract.then((res) => {
      res.cancelOrder(orderId);
    });
  };
  const fillOrder = (orderId) => {
    ExchangeContract.then((res) => {
      res.fillOrder(orderId);
    });
  };

  useEffect(() => {}, [orderList]);

  return (
    <div className="deposit-card">
      <button className="show-order" onClick={SetValueToOrderList}>
        Show Orders
      </button>
      <div className="order-book">
        <div className="order-book-header">
          <h3 className="one">OrderId</h3>
          <h3 className="two">Token</h3>
          <h3 className="two">Size</h3>
          <h3 className="two">Amount</h3>
          <h3 className="two">Time</h3>
          <h3 className="two">{""}</h3>
        </div>
        <div className="order-book-body">
          {orderList.map((order) => {
            var date = new Date(order[5] * 1000);
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();

            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime =
              hours + ":" + minutes.substring(-2) + ":" + seconds.substring(1);
            return (
              <div className="order-book-row" key={order[0]}>
                <div className="order-book-cell one">
                  <h3>{order[0]}</h3>
                </div>
                <div className="order-book-cell two">
                  <h3>Rala Token</h3>
                </div>
                <div className="order-book-cell two">
                  <h3>{utils.formatEther(order[3])} RLT</h3>
                </div>
                <div className="order-book-cell two">
                  <h3>{utils.formatEther(order[4])} ETH</h3>
                </div>
                <div className="order-book-cell two">
                  <h3>{formattedTime}</h3>
                </div>
                <div className="order-book-cell two">
                  {account === order[1] ? (
                    <button
                      className="red"
                      onClick={() => {
                        cancelOrder(order[0]);
                      }}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      className="green"
                      onClick={() => {
                        fillOrder(order[0]);
                      }}
                    >
                      Fill
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
