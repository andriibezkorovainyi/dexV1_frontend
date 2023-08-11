import {useContext} from "react";
import {WalletContext} from "../contexts/WalletContext";

export const useWalletContext = () => {
    const walletContext = useContext(WalletContext);

    if (walletContext === undefined) {
        throw new Error(
            'useLocalStorageContext must be used within a LocalStorageProvider',
        );
    }

    return walletContext;
};
