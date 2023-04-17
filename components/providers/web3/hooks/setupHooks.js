import { handler as createAccountHook } from "./useAccount";
import { handler as createNetworkHook } from "./useNetwork";

export const setupHooks = (web3) => {
    return{
        useAccount: createAccountHook(web3),
        useNetwork: createNetworkHook(web3)
    }
}