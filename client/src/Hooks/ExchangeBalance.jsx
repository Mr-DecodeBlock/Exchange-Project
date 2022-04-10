import Contract from "./ExchangeContract";
import { useEthers } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";

const ExchangeBalance = async (TokenAddress) => {
  const { chainId, account } = useEthers();

  const exchangeContract = Contract();

  const balance = await exchangeContract.then((res) =>
    res.balanceOf(TokenAddress, account)
  );
  return balance ? parseFloat(formatUnits(balance, 18)) : 0;
};

export default ExchangeBalance;
