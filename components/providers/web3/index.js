const {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} = require("react");
import { setupHooks } from "./hooks/setupHooks";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3"

const Web3Context = createContext(null);

export default function Web3Provider({ children }) {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks()
  });

  useEffect(() => {
    const loadProvider = async () => {
        const provider = await detectEthereumProvider();
        if (provider) {
          const web3 = new Web3(provider)

          setWeb3Api({
            provider,
            web3,
            contract: null,
            isLoading: false,
            hooks: setupHooks(web3)
          });
        } else {
          setWeb3Api(api => ({...api, isLoading: false}));
          console.log("NÃO TEM METAMASK INSTALADA MAS NÃO RETORNOOU ERRO");
        }
    };

    loadProvider();
  }, []);

  const _web3Api = useMemo(() => {
    const {web3, provider, isLoading} = web3Api
    return {
      ...web3Api,
      requireInstall: !isLoading && !provider,
      connect: provider ?
          async () => {
              try {
                console.log(web3Api);
                await provider.request({method: "eth_requestAccounts"});
                console.log('passou');
              } catch {
                console.log('Não foi possivel conectar RELOAD');
                location.reload()
              }
            } :
            () => console.log("nao foi possivel conectar, tentar recarregar browser, NÃO TEM PROVIDER")
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks(cb){
  const {hooks} = useWeb3()
  return cb(hooks)
}