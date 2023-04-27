import { useEffect } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0x1b9996f924dda33b675dbbca5792857ce3248e679d96e6cdce2550e288fd6bf0": true,
  //o admin é a conta 0x909efca230d4faa7a985f953e911003e3a4395b9
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      //const accounts = await web3.send("eth_requestAccounts", []); //olhar esta linha



      const account = accounts[0];
      if (!account){
        throw new Error("Cannot retrieve an account. Please refresh the browser.")
      }
      return account;
    }
  );

  useEffect(() => {

      const mutator = accounts => mutate(accounts[0] ?? null)
      
      provider?.on("accountsChanged", mutator)

      return () => {
        provider?.removeListener("accountsChanged", mutator)
      }
      //provider && 
      //provider.on("accountsChanged", (accounts) => mutate(accounts[0] ));
      //provider.on("accountsChanged", (accounts) => mutate(accounts[0] ?? null)); // do prof esta assim 
  }, [provider]);

  return {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};
