import React from "react";
import { useEthers } from "@usedapp/core";
import Logo from "../images/Logo.png";
import "./component.css";

const Header = () => {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  return (
    <div className="navbar">
      <div className="header__logo">
        <img src={Logo} alt="Exchange" />
      </div>

      <div className="navlinks">
        <a href="#Home">Home</a>
        <a href="#depositAndStake">Deposit & Stake</a>
        <a href="#BuyRala">Buy Rala</a>
        <a href="#Portfolio">Portfolio</a>
        <a href="#OrderBook">Order Book</a>
      </div>

      <div className="connect_button_div">
        {!account && (
          <button
            className="connect_button"
            onClick={() => activateBrowserWallet()}
          >
            Connect
          </button>
        )}
        {account && (
          <button className="connect_button" onClick={() => deactivate()}>
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
