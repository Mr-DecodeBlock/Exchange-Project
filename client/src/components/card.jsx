import React, { useState } from "react";
import { constants } from "ethers";
import NameToAddress from "../Hooks/Addresses";
import Tokens from "./Tokens";
import Contract from "../Hooks/ExchangeContract";
import "./component.css";

const Card = (props) => {
  const [EtherBalance, setEtherBalance] = useState(0);
  const [TokenBalance, setTokenBalance] = useState(0);
  const [EtherPrice, setEtherPrice] = useState(0);
  const ExchangeContract = Contract();
  const addressZero = constants.AddressZero;
  const RalaTokenAddress = NameToAddress("RALA_Token");
  ExchangeContract.then((res) => {
    const EtheriumPrice = res.getTokenValue(addressZero);
    EtheriumPrice.then((res) => {
      setEtherPrice(res[0].toNumber() / 10 ** res[1].toNumber());
    });
  });

  const balanceFunction = props.balanceFunction;
  balanceFunction(addressZero).then((res) => setEtherBalance(res));
  balanceFunction(RalaTokenAddress).then((res) => setTokenBalance(res));

  const TotalBalance = (EtherBalance * EtherPrice + TokenBalance).toFixed(3);

  return (
    <div className="card-body">
      <h2> {props.name}</h2>
      <p> ${TotalBalance}</p>

      <div className="Tokens">
        <div className="Token-labels">
          <h3>Name</h3>
          <h3>Amount</h3>
          <h3>Value</h3>
        </div>
        <Tokens
          name="Etherium "
          symbol="ETH"
          amount={EtherBalance}
          value={EtherPrice}
        />
        <Tokens
          name="Rala Token "
          symbol="RLT"
          amount={TokenBalance}
          value={1}
        />
      </div>
      <div className="card-buttons">
        <a className="connect_button depositGreen" href="#depositAndStake">
          {" "}
          {props.button1Name}
        </a>
        <a className="connect_button withdrawRed" href="#depositAndStake">
          {props.button2Name}
        </a>
      </div>
    </div>
  );
};

export default Card;
