import React from "react";
import "./component.css";

const MetamaskActive = (props) => {
  return (
    <div className="greeting ">
      <div className="greeting_body">
        <h2>Welcome , </h2>
        <p>{props.account}</p>
      </div>
      <hr />
      <div className="Exchange_Overview">
        <h3>
          ---{">"} This is an Prototype of an Cryto Exchange and It can work on
          Kovan testnet Ether.{" "}
        </h3>
        <h3> # Features :</h3>
        <ol>
          <li>You can Stake Ethers or Rala Token.</li>
          <li>You can Unstake Ethers or Rala Token.</li>
          <li>You can Deposit Ethers or Rala Token.</li>
          <li>You can Withdraw Ethers or Rala Token.</li>
          <li>You can Buy Rala using Ethers.</li>
        </ol>
      </div>
      <h2>
        Start Your Journey by depositing some Kovan test ethers to your wallet.
      </h2>
    </div>
  );
};

export default MetamaskActive;
