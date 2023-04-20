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
};

const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID];

export const handler = (web3, provider) => () => {
  const { data,  mutate, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const netId = await web3.eth.net.getId();
      return NETWORKS[netId];
    }
  );

  useEffect(() => {
    provider &&
      provider.on("chainChanged", (netId) => {
        mutate(NETWORKS[parseInt(netId, 16)]);
      });
  }, [provider]);

  return {
    data,
    mutate,
    target: targetNetwork,
    isSupported: data === targetNetwork,
    ...rest,
  };
};
