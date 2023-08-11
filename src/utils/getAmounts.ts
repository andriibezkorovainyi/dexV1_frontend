import {Contract, Provider} from 'ethers';
import {
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
} from "../constants";
import {ZERO} from "../constants";

export const getEtherBalance = async (
    provider: Provider,
    address: string,
    contract: boolean = false
) => {
    try {
        if (contract) {
            return await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
        }
        return await provider.getBalance(address);
    } catch (e) {
        console.log(e);
        return ZERO;
    }
};

export const getTokenBalance = async (
    provider: Provider,
    address: string,
) => {
    try {
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
        return await tokenContract.balanceOf(address) as bigint;
    } catch (e) {
        console.log(e);
        return ZERO;
    }
};

export const getLPBalance = async (
    provider: Provider,
    address: string,
) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        return await exchangeContract.balanceOf(address) as bigint;
    } catch (e) {
        console.log(e);
        return ZERO;
    }
};

export const getTKNReserve = async (
    provider: Provider,
) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        return await exchangeContract.getReserve() as bigint;
    } catch (e) {
        console.log(e);
        return ZERO;
    }
};

export const getLPTotalSupply = async (
    provider: Provider,
) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        return await exchangeContract.totalSupply() as bigint;
    } catch (e) {
        console.log(e);
        return ZERO;
    }
};
