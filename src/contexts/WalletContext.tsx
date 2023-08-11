import React, {createContext} from "react";
import {useWallet} from "../hooks/useWallet";
import {Provider, Signer} from "ethers";

interface Value {
    signer: Signer | null;
    provider: Provider | null;
    signerAddress: string | null;
    walletConnected: boolean;
    connectWallet: () => Promise<void>;
    networkError: boolean;
}

export const WalletContext = createContext<Value | undefined>(undefined);

export const WalletContextProvider = ({children}: {children: React.ReactNode}) => {

    const value = {
        ...useWallet(),
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};
