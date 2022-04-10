import React from "react";
import Card from "./card";
import ExchangeBalance from "../Hooks/ExchangeBalance";
import StakingBalance from "../Hooks/StakingBalance";
import "./component.css";

const Portfolio = () => {
  return (
    <div className="deposit-card">
      <div className="features">
        <div className="feature1">
          <Card
            name="Exchange Balance"
            balanceFunction={ExchangeBalance}
            button1Name="Deposit"
            button2Name="Withdraw"
          />
        </div>

        <div className="feature2">
          <Card
            name="Staking Balance"
            balanceFunction={StakingBalance}
            button1Name="Stake"
            button2Name="Unstake"
          />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
