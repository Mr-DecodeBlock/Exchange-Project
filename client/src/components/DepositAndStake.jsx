import React, { useState } from "react";
import Contract from "../Hooks/ExchangeContract";
import DepositandWithdraw from "./DepositandWithdraw";
import StakeandUnstake from "./StakeandUnstake";

const DepositAndStake = () => {
  return (
    <div className="deposit-card">
      <div className="deposit-card-body">
        <DepositandWithdraw />
        <StakeandUnstake />
      </div>
    </div>
  );
};

export default DepositAndStake;
