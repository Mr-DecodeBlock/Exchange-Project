import React, { useState } from "react";
import "./TransactionCard.css";
import FeatureCard from "./FeatureCard";

const DepositandWithdraw = () => {
  const [state, setState] = useState(true);
  return (
    <div className="TransactionCard">
      <div className="TransactionCard__header">
        <button
          onClick={() => {
            setState(true);
          }}
        >
          <p className={state ? "darker" : ""}>Deposit</p>
        </button>
        <button
          onClick={() => {
            setState(false);
          }}
        >
          <p className={state ? "" : "darker"}>Withdraw</p>
        </button>
      </div>
      <hr />

      <div className="TransactionCard__body">
        {state ? (
          <div className="Deposit_card">
            <FeatureCard class="Deposit" name={"Deposit"} />
          </div>
        ) : (
          <div className="Withdraw_card">
            <FeatureCard class="Withdraw" name={"Withdraw"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositandWithdraw;
