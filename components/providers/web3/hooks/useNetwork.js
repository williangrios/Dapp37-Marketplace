import { useEffect } from "react";
import useSWR from "swr";

const NETWORKS = {
  1: "Ethereum network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance smart chain",
  137: "Polygon Mainnet",
  1337: "Ganache",
  80001: "Mumbai"
};

const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID];

export const handler = (web3) => () => {
  const { data,   ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      //const netId = await web3.eth.net.getId(); esta linha funciona, mas coloquei a de baixo pra ficar igual ao prof
      const netId = await web3.eth.getChainId()

      if(!netId){
        throw new Error("Cannot retrieve network. Please refresh the browser.")
      }

      return NETWORKS[netId];
    }
  );



  return {
    data,
    target: targetNetwork,
    isSupported: data === targetNetwork,
    ...rest,
  };
};
