import React from "react";
import { useEthers } from "@usedapp/core";
import "./component.css";
import MetamaskActive from "./MetamaskActive";
import MetamaskDeactive from "./MetamaskDeactive";
import Portfolio from "./Portfolio";
import BuyRala from "./BuyRala";
import DepositAndStake from "./DepositAndStake";
import OrderBook from "./OrderBook";
const Main = () => {
  const { account } = useEthers();
  return (
    <div className="Active_card">
      {account ? (
        <div>
          {" "}
          <div className="deposit-card">
            <MetamaskActive account={account} />{" "}
          </div>{" "}
          <div id="Portfolio" className="Slice_heading">
            <h2>Portfolio:~</h2>
          </div>
          <Portfolio />
          <div id="depositAndStake" className="Slice_heading">
            <h2>Deposit {"&"} Stake:~</h2>
          </div>
          <DepositAndStake />
          <div id="BuyRala" className="Slice_heading">
            <h2>Buy Rala Token:~</h2>
            <p>
              RALA Token is an ERC20 Standard based Token which you can trade
              using Kovan Testnet Ether.{" "}
            </p>
          </div>
          <BuyRala />
          <div id="OrderBook" className="Slice_heading">
            <h2>Order Book:~</h2>
          </div>
          <OrderBook />
        </div>
      ) : (
        <div id="Home" className="deposit-card">
          <MetamaskDeactive />
        </div>
      )}
    </div>
  );
};
export default Main;
