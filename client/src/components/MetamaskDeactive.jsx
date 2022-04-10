import React from "react";
import "./component.css";

const MetamaskDeactive = () => {
  return (
    <div className="greeting">
      <div className="greeting_body">
        <h2>Welcome to the Exchange.</h2>
        <hr />
        <p>
          # To Start Interacting with the Exchange you need to connect to
          Metamask extension.
        </p>
        <h4>
          ~ If you have Metamask, Just press <span>Connect</span> button.
        </h4>
        <h4>
          ~ If you don't have Metamask, then download it from here ---{">"}
          <a href="https://metamask.io/download/"> Metamask Extension</a>
        </h4>
      </div>
    </div>
  );
};

export default MetamaskDeactive;
