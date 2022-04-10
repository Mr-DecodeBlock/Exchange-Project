import React from "react";
import "./TransactionCard.css";
import Contract from "../Hooks/ExchangeContract";
import NameToAddress from "../Hooks/Addresses";

const FeatureCard = (props) => {
  const [value, setValue] = React.useState("0");
  const [text, setText] = React.useState("");
  const ExchangeContract = Contract();
  const tokenName = (event) => {
    setValue(event.target.value);
  };
  const TextChanged = (event) => {
    setText(event.target.value);
  };
  const RalaAddress = NameToAddress("RALA_Token");

  const depositAndWitdrawHandler = (event) => {
    if (props.name === "Deposit") {
      if (value === "0") {
        console.log("Deposit ETH");
        ExchangeContract.then((res) => {
          res.depositEther({ value: String(text * 10 ** 18) });
        });
      } else {
        ExchangeContract.then((res) => {
          res.depositToken(RalaAddress, String(text * 10 ** 18));
        });
      }
    } else {
      if (value === "0") {
        console.log("Withdraw ETH");
        ExchangeContract.then((res) => {
          res.withdrawEther(String(text * 10 ** 18));
        });
      } else {
        ExchangeContract.then((res) => {
          res.withdrawToken(RalaAddress, String(text * 10 ** 18));
        });
      }
    }
  };
  return (
    <div className="feature_card">
      <div className="SelectToken">
        <select name="Tokens" id="TokenNames" onChange={tokenName}>
          <option value="0">Ethereum ETH</option>
          <option value="1">Rala Token RLT</option>
        </select>
      </div>
      <div className="quantity">
        <p className="quantityLabel">Quantity</p>
        <input type="text" placeholder="0.00" onChange={TextChanged} />
      </div>
      <button
        className={"DepositButton " + props.class}
        onClick={depositAndWitdrawHandler}
      >
        {props.name}{" "}
      </button>
    </div>
  );
};

export default FeatureCard;
