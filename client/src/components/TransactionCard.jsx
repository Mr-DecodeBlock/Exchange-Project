import React, { useState } from "react";
import "./TransactionCard.css";
import FeatureCard from "./FeatureCard";

const TransactionCard = (props) => {
  const [state, setState] = useState(true);

  return (
    <div className="TransactionCard">
      <div className="TransactionCard__header">
        <button
          onClick={() => {
            setState(true);
          }}
        >
          <p className={state ? "darker" : ""}>{props.name1}</p>
        </button>
        <button
          onClick={() => {
            setState(false);
          }}
        >
          <p className={state ? "" : "darker"}>{props.name2}</p>
        </button>
      </div>
      <hr />

      <div className="TransactionCard__body">
        {state ? (
          <div className="Deposit_card">
            <FeatureCard class="Deposit" name={props.name1} />
          </div>
        ) : (
          <div className="Withdraw_card">
            <FeatureCard class="Withdraw" name={props.name2} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
