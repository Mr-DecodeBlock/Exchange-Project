import React from "react";
import "./TransactionCard.css";
import NameToAddress from "../Hooks/Addresses";
import { constants } from "ethers";
import Contract from "../Hooks/ExchangeContract";

const StakeFeatureCard = (props) => {
  const [value, setValue] = React.useState("0");
  const [text, setText] = React.useState("");
  const RalaAddress = NameToAddress("RALA_Token");
  const EtherAddress = constants.AddressZero;
  const ExchangeContract = Contract();

  const tokenName = (event) => {
    setValue(event.target.value);
  };
  const TextChanged = (event) => {
    setText(event.target.value);
  };

  const stakeAndUnstakeHandler = (event) => {
    const address = value === "1" ? RalaAddress : EtherAddress;

    if (props.name === "Stake") {
      console.log("Stake ");
      ExchangeContract.then((res) => {
        res.stake(address, (text * 10 ** 18).toString());
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log("Unstake ");
      ExchangeContract.then((res) => {
        res.unstakeTokens(address);
      });
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
      {props.name === "Stake" ? (
        <div className="quantity">
          <p className="quantityLabel">Quantity</p>
          <input type="number" placeholder="0.00" onChange={TextChanged} />
        </div>
      ) : (
        <div> Unstake The whole Amount</div>
      )}
      <button
        className={"DepositButton " + props.class}
        onClick={stakeAndUnstakeHandler}
      >
        {props.name}
      </button>
    </div>
  );
};

export default StakeFeatureCard;
