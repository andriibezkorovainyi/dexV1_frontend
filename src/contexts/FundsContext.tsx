import {createContext} from "react";
import {useFunds} from "../hooks/useFunds";
import {Provider, Signer} from "ethers";

interface Value {
    getAmounts: (
        provider: Provider,
        address: string,
    ) => Promise<void>;
    ethBalance: bigint;
    tknBalance: bigint;
    lpBalance: bigint;
    ethReserve: bigint;
    tknReserve: bigint;
    lpTotalSupply: bigint;
}

export const FundsContext = createContext<Value | undefined>(undefined);

export const FundsContextProvider = ({children}: {children: React.ReactNode}) => {
    const value = {
        ...useFunds(),
    };

    return (
        <FundsContext.Provider value={value}>
            {children}
        </FundsContext.Provider>
    );
};
