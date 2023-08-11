import ExchangeSol from './artifacts/contracts/Exchange.sol/Exchange.json';
import TokenSol from './artifacts/contracts/Token.sol/Token.json';
import {toBigInt} from "ethers";

export interface Token {
    symbol: string;
    icon: string;
}

export const TOKEN_CONTRACT_ABI = TokenSol.abi;
export const TOKEN_CONTRACT_ADDRESS = '0xC38Bd5A9f1FDa8F93cbC17d1E167cbd23aF161a8';
export const EXCHANGE_CONTRACT_ABI = ExchangeSol.abi;
export const EXCHANGE_CONTRACT_ADDRESS = '0x872C100E7C6F502c7a76d76A823C637787978a5e';

export const tokens: Token[] = [
    {
        symbol: 'ETH',
        icon: '/ETH.svg',
    },
    {
        symbol: 'TKN',
        icon: '/TKN.svg',
    }
];

export const ZERO = toBigInt(0);
