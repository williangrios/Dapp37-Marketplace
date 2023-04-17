import { useEffect } from "react";
// import { ethers } from "ethers";
import useSWR from "swr";
const adminAddresses = {
  "0x1b9996f924dda33b675dbbca5792857ce3248e679d96e6cdce2550e288fd6bf0": true,
};

export const handler = (web3) => () => {
  const { data, mutate, ...rest } = useSWR(
    () =>
      //identificador da função
      web3 ? "web3/accounts" : null,
    async () => {
      //callback function que vai rodar no background
      const accounts = await web3.send("eth_requestAccounts", []);
      return accounts[0];
    }
  );

  useEffect(() => {
    web3 &&
      web3.on("accountsChanged", (accounts) => mutate(accounts[0] ?? null));
  }, [web3]);

  return {
    data,
    //isAdmin: (data && adminAddresses[ethers.utils.keccak256(data)]) ?? false,
    isAdmin: true,
    mutate,
    ...rest,
  };
};
