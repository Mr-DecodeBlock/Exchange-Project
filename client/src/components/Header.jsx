import React from "react";
import { useEthers } from "@usedapp/core";
import Logo from "../images/Logo.png";
import "./components.css";

const Header = () => {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  return (
    <div className="navbar">
      <div className="header__logo">
        <img src={Logo} alt="Exchange" />
      </div>

      <div className="navlinks">
        <a href="/">Home</a>
        <a href="/">Deposit</a>
        <a href="/">WithDraw</a>
        <a href="/">Stake</a>
        <a href="/">Help</a>
      </div>

      <div className="connect_button_div">
        {!account && (
          <button
            className="connect_button"
            role="button"
            onClick={() => activateBrowserWallet()}
          >
            Connect
          </button>
        )}
        {account && (
          <button
            className="connect_button"
            role="button"
            onClick={() => deactivate()}
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
