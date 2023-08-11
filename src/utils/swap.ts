import {
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS, ZERO
} from "../constants";
import {Contract, ContractTransactionResponse, Provider, Signer, TransactionResponse} from "ethers";

export const getAmountOfTokensReceivedFromSwap = async (
    provider: Provider,
    inputAmount: bigint,
    inputReserve: bigint,
    outputReserve: bigint,
) => {
    try {
        if (inputAmount > inputReserve) throw new Error("Not enough liquidity 1");

        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        const amountOfTokens = await exchangeContract.getOutputAmountFromSwap(
                inputAmount,
                inputReserve,
                outputReserve,
            );

        if (amountOfTokens > outputReserve) throw new Error("Not enough liquidity 2");

        return amountOfTokens;
    } catch (e) {
        console.log(e);
        return ZERO;
    }
};

export const swapTokens = async (
    signer: Signer,
    swapInputAmount: bigint,
    swapOutputAmount: bigint,
    ethSelected: boolean
): Promise<ContractTransactionResponse | undefined> => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
        let tx;

        if (ethSelected) {
            tx = await exchangeContract.ethToTokenSwap(swapOutputAmount, {value: swapInputAmount});
            await tx.wait();
            console.log(tx instanceof ContractTransactionResponse, tx);
            return tx;
        } else {
            tx = await tokenContract.approve(EXCHANGE_CONTRACT_ADDRESS, String(swapInputAmount));
            await tx.wait();

            tx = await exchangeContract.tokenToEthSwap(swapInputAmount, swapOutputAmount);
            await tx.wait();
            return tx;
        }
    } catch (e) {
        console.log(e);
    }
};
