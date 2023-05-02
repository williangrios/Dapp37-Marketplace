import { useHooks, useWeb3 } from "@components/providers/web3";
import { useRouter } from "next/router";
import { useEffect } from "react";

const _isEmpty = (data) => {
  return (
    data == null ||
    data === "" ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  );
};

const enhanceHook = (swrRes) => {
  const { data, error } = swrRes;
  const hasInitialResponse = !!(data || error);
  const isEmpty = hasInitialResponse && _isEmpty(data);

  return {
    ...swrRes,
    isEmpty,
    hasInitialResponse,
  };
};

export const useAccount = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useAccount)());
  return {
    account: swrRes,
  };
};

export const useAdmin = ({ redirectTo }) => {
  const { account } = useAccount();
  const router = useRouter();
  const { requireInstall } = useWeb3();
  useEffect(() => {
    if (
      requireInstall ||
      (account.hasInitialResponse && !account.isAdmin) ||
      account.isEmpty
    ) {
      router.push(redirectTo);
    }
  }, [account]);
  return {account}
};

export const useNetwork = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useNetwork)());
  return {
    network: swrRes,
  };
};

export const useOwnedCourses = (...args) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourses)(...args)
  );
  return {
    ownedCourses: swrRes,
  };
};

export const useOwnedCourse = (...args) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourse)(...args)
  );
  return {
    ownedCourse: swrRes,
  };
};

export const useManagedCourses = (...args) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useManagedCourses)(...args)
  );
  return {
    managedCourses: swrRes,
  };
};

export const useWalletInfo = () => {
  const { account } = useAccount();
  const { network } = useNetwork();

  const isConnecting = !account.hasInitialResponse && !network.hasInitialResponse

  const hasConnectedWallet = !!(account.data && network.isSupported);
  return { account, network, hasConnectedWallet, isConnecting };
};
