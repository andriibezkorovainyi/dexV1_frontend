import {useContext} from "react";
import {WalletContext} from "../contexts/WalletContext";
import {FundsContext} from "../contexts/FundsContext";

export const useFundsContext = () => {
    const fundsContext = useContext(FundsContext);

    if (fundsContext === undefined) {
        throw new Error(
            'useLocalStorageContext must be used within a LocalStorageProvider',
        );
    }

    return fundsContext;
};
