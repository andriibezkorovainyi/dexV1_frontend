import {useEffect, useRef, useState} from "react";
import Web3Modal from "web3modal";
import {BrowserProvider, Provider, Signer, toBigInt} from "ethers";
import {useFundsContext} from "./useFundsContext";

export const useWallet = () => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [signerAddress, setSignerAddress] = useState<string | null>(null);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const web3ModalRef = useRef<Web3Modal>();
    const {getAmounts} = useFundsContext();

    useEffect(() => {
        const connect = async () => {
            if (!walletConnected) {
                await connectWallet();
            }
        };
        connect();
    }, [walletConnected]);

    const connectWallet = async () => {
        try {
            await getProviderAndSigner();
        } catch (err) {
            console.error(err);
        }
    };

    const getProviderAndSigner = async () => {
        web3ModalRef.current = new Web3Modal({
            network: "sepolia",
            providerOptions: {},
            disableInjectedProvider: false,
            cacheProvider: false,
        });
        const provider = await web3ModalRef.current?.connect();
        const web3Provider = new BrowserProvider(provider);
        const {chainId} = await web3Provider.getNetwork();

        if (chainId !== toBigInt(11155111)) {
            window.alert("Wrong network");
            throw new Error("Wrong network");
        }

        const signer = await web3Provider.getSigner();
        const signerAddress = await signer.getAddress();
        await getAmounts(web3Provider, signerAddress);

        setProvider(web3Provider);
        setSigner(signer);
        setSignerAddress(signerAddress);
        setWalletConnected(true);
    };

    return {
        walletConnected,
        signerAddress,
        signer,
        provider,
        connectWallet,
    }
};
