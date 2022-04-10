import React, { useState } from "react";
import "./TransactionCard.css";
import StakeFeatureCard from "./StakeFeatureCard";
const StakeandUnstake = () => {
  const [state, setState] = useState(true);

  return (
    <div className="TransactionCard">
      <div className="TransactionCard__header">
        <button
          onClick={() => {
            setState(true);
          }}
        >
          <p className={state ? "darker" : ""}>Stake</p>
        </button>
        <button
          onClick={() => {
            setState(false);
          }}
        >
          <p className={state ? "" : "darker"}>Unstake</p>
        </button>
      </div>
      <hr />

      <div className="TransactionCard__body">
        {state ? (
          <div className="Deposit_card">
            <StakeFeatureCard class="Deposit" name="Stake" />
          </div>
        ) : (
          <div className="Withdraw_card">
            <StakeFeatureCard class="Withdraw" name="Unstake" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StakeandUnstake;
