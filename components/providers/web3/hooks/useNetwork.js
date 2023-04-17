
import { useEffect } from "react";
import useSWR from "swr";

const NETWORKS = {
    1: "Ethereum network",
    3: "Ropsten Test Network",
    4: "Rinkeby Test Network",
    5: "Goerli Test Network",
    42: "Kovan Test Network",
    56: "Binance smart chain",
    1337: "Ganache",
}

const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID]

export const handler = (web3) => () => {
    const {data, error, mutate, ...rest} = useSWR(() => 
        web3 ? "web3/network" : null,
        async ()  => {
            const netId = await web3.getNetwork().then(network => network.chainId);
            return NETWORKS[netId]
        }
        
    )

    useEffect(() => {
      web3 &&  
      web3.on("chainChanged", chainId  => {mutate( NETWORKS[parseInt(chainId, 16)])
    })}, [web3])
    
    return{
        data,
        mutate,
        target: targetNetwork,
        isSupported: data === targetNetwork,
        ...rest
    }
}