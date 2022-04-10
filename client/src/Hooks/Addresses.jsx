import networkMapping from "../artifacts/deployments/map.json";
import { useEthers } from "@usedapp/core";
import { constants } from "ethers";

const NameToAddress = (name) => {
  const { chainId } = useEthers();

  return chainId ? networkMapping[chainId][name][0] : constants.AddressZero;
};

export default NameToAddress;
