import { useEffect, useState } from "react";
import "./component.css";
import Contract from "../Hooks/ExchangeContract";
import NameToAddress from "../Hooks/Addresses";
import ExchangeBalance from "../Hooks/ExchangeBalance";

import { constants } from "ethers";

const BuyRala = () => {
  const [text, setText] = useState("");
  const [etherPrice, setEtherPrice] = useState(2000);
  const [EtherBalance, setEtherBalance] = useState(0);

  const ExchangeContract = Contract();
  const RalaAddress = NameToAddress("RALA_Token");
  const EtherAddress = constants.AddressZero;
  ExchangeContract.then((res) => {
    const EtheriumPrice = res.getTokenValue(EtherAddress);
    EtheriumPrice.then((res) => {
      setEtherPrice(res[0].toNumber() / 10 ** res[1].toNumber());
    });
  });
  ExchangeBalance(EtherAddress).then((res) => setEtherBalance(res));

  const BuyRalaContractFunction = (event) => {
    event.preventDefault();
    ExchangeContract.then((res) => {
      res.makeOrder(
        RalaAddress,
        EtherAddress,
        ((text / etherPrice).toFixed(5) * 10 ** 18).toString()
      );
    }).catch((err) => {
      console.log(err);
    });
    setText(0);
  };

  const TextChanged = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {}, [text]);

  return (
    <div className="deposit-card">
      <div className="RalaCard">
        <div className="RalaCard__header">
          {" "}
          <h2> Buy RALA Token</h2> <p>RLT/ETH</p>{" "}
        </div>
        <hr />
        <div className="RalaCard__body">
          <p>Quantity</p>
          <input
            type="text"
            value={text}
            placeholder="0.00"
            onChange={TextChanged}
          />
          <p>Fee ~ 20%</p>
          <input
            value={(text / etherPrice) * 0.2 + " Ethers"}
            onChange={() => {}}
          />
          <p>Total Spent</p>
          <input
            id="totalSpent"
            value={text / etherPrice + (text / etherPrice) * 0.2 + " Ethers"}
            onChange={() => {}}
          />
          <p>Ether Balance : {EtherBalance} </p>
        </div>
        <div className="buyButton">
          <button className="DepositButton" onClick={BuyRalaContractFunction}>
            BUY
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyRala;
