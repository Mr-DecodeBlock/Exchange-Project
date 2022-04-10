import Contract from "./ExchangeContract";
import { useEthers } from "@usedapp/core";

import { formatUnits } from "@ethersproject/units";

const StakingBalance = async (TokenAddress) => {
  const { account } = useEthers();
  const exchangeContract = Contract();

  const balance = await exchangeContract.then((res) =>
    res.token_staker_amount(TokenAddress, account)
  );
  return balance ? parseFloat(formatUnits(balance, 18)) : 0;
};

export default StakingBalance;
