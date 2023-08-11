import {Contract, formatEther, parseEther, Provider, Signer, toBigInt} from "ethers";
import {TOKEN_CONTRACT_ABI, TOKEN_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI} from "../constants";

export const addLiquidity = async (
    signer: Signer,
    addTKNAmount: string,
    addETHAmount: string,
) => {
    try {
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);

        const addTKNAmountWei =  parseEther(addTKNAmount);
        const addETHAmountWei = parseEther(addETHAmount);
        let tx = await tokenContract.approve(EXCHANGE_CONTRACT_ADDRESS, String(addTKNAmountWei));
        await tx.wait();

        tx = await exchangeContract.addLiquidity(addTKNAmountWei, {
            value: addETHAmountWei,
        });
        await tx.wait();
        console.log(tx);
        return tx;
    } catch (e) {
        console.log(e);
    }
};

export const calculateTKN = async (
    _addETH: string = '0',
    etherReserve: bigint,
    tokenReserve: bigint,
) => {
    try {
        const addETHWei = parseEther(_addETH);
        console.log(addETHWei, _addETH);
        return formatEther((addETHWei * tokenReserve) / etherReserve);
    } catch (e) {
        console.log(e);
    }
};

export const calculateLP = async (
    _addETH: string = '0',
    etherReserve: bigint,
    signer: Signer,
) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);
        const lpBalanceContract: bigint = await exchangeContract.totalSupply();
        const addETHWei = parseEther(_addETH);
        return formatEther((addETHWei * lpBalanceContract) / etherReserve);
    } catch (e) {
        console.log(e);
    }
};
