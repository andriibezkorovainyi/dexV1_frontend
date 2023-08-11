import {EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS} from "../constants";
import {Contract, formatEther, parseEther, Provider, Signer} from "ethers";
import BN from "bn.js";

export const removeLiquidity = async (
    signer: Signer,
    removeLPAmountWei: bigint
) => {
    try {
      const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);
      let tx = await exchangeContract.removeLiquidity(removeLPAmountWei);
      await tx.wait();
    } catch (e) {
        console.log(e);
    }
};

export const calculateAmountsAfterRemove = (
    removeLPTokens: string,
    lpTotalSupply: bigint,
    ethReserve: bigint,
    tokenReserve: bigint,
) => {
    try {
        console.log('removeLPTokens', removeLPTokens, 'lpTotalSupply', lpTotalSupply, 'ethReserve', ethReserve, 'tokenReserve', tokenReserve);
        const ethToReturn = (parseEther(removeLPTokens) * ethReserve) / lpTotalSupply;
        const tokenToReturn = (parseEther(removeLPTokens) * tokenReserve) / lpTotalSupply;
        return [formatEther(ethToReturn), formatEther(tokenToReturn)];
    } catch (e) {
        console.log(e);
    }
};
