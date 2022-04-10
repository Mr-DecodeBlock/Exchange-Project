import React, { useState } from "react";
import "./component.css";
const Tokens = (props) => {
  return (
    <div className="Token-body">
      <div className="one">
        <h3>{props.name}</h3> {props.symbol}
      </div>
      <div className="two">
        <h3>{props.amount}</h3>
      </div>
      <div className="three">
        <h3>${(props.value * props.amount).toFixed(3)}</h3>
      </div>
    </div>
  );
};

export default Tokens;
