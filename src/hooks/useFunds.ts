import {useEffect, useState} from "react";
import {Provider, Signer, toBigInt} from "ethers";
import {getEtherBalance, getTokenBalance, getLPBalance, getTKNReserve, getLPTotalSupply} from "../utils/getAmounts";
import {ZERO} from "../constants";

export const useFunds = () => {
    const [ethBalance, setEtherBalance] = useState(ZERO);
    const [tknBalance, setTknBalance] = useState(ZERO);
    const [lpBalance, setLpBalance] = useState(ZERO);
    const [ethReserve, setEthReserve] = useState(ZERO);
    const [tknReserve, setTknReserve] = useState(ZERO);
    const [lpTotalSupply, setLpTotalSupply] = useState(ZERO);

    const getAmounts = async (
        provider: Provider,
        address: string
    ) => {
        try {
            const _ethBalance = await getEtherBalance(provider, address);
            const _tknBalance =  await getTokenBalance(provider, address);
            const _lpBalance = await getLPBalance(provider, address);
            const _tknReserve =  await getTKNReserve(provider);
            const _ethReserve =  await getEtherBalance(provider, '', true);
            const _lpTotalSupply = await getLPTotalSupply(provider);

            setEtherBalance(_ethBalance);
            setTknBalance(_tknBalance);
            setLpBalance(_lpBalance);
            setEthReserve(_ethReserve);
            setTknReserve(_tknReserve);
            setLpTotalSupply(_lpTotalSupply);
        } catch (e) {
            console.log(e);
        }
    };

    return {
        getAmounts,
        ethBalance,
        tknBalance,
        lpBalance,
        ethReserve,
        tknReserve,
        lpTotalSupply,
    };
};
