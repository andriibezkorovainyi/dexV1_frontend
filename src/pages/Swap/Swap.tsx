import './Swap.css'
import Select from "react-select";
import {tokens, ZERO} from "../../constants";
import {useEffect, useState} from "react";
import {useWalletContext} from "../../hooks/useWalletContext";
import {useFundsContext} from "../../hooks/useFundsContext";
import {formatEther, parseEther, Provider, Signer} from "ethers";
import {getAmountOfTokensReceivedFromSwap, swapTokens} from "../../utils/swap";
import {RotatingLines} from "react-loader-spinner";
import {containerCSS} from "react-select/dist/declarations/src/components/containers";

const options = tokens.map(token => {
    return {
        value: token.symbol,
        label: <div className={"token-credentials"}>
            <img className={"token-icon"} src={token.icon} alt={'Token Icon'} />
            <p className={'token-symbol'}>{token.symbol}</p>
        </div>
    }
});

export const Swap = () => {
    const {
        signer,
        provider,
        signerAddress,
        connectWallet,
    } = useWalletContext();
    const {
        getAmounts,
        ethReserve,
        tknReserve,
    } = useFundsContext();

    const [tokenA, setTokenA] = useState(options[1]);
    const [tokenB, setTokenB] = useState(options[0]);
    const [tokenAValue, setTokenAValue] = useState('');
    const [tokenBValue, setTokenBValue] = useState(ZERO);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (tokenB && tokenB.value === tokenA.value) setTokenB(options[tokenB.value === 'ETH' ? 1 : 0])
    }, [tokenA, tokenB]);

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        const debounceCalculate = async () => {
            setIsLoading(true);


                const calculetedTokenBValue = tokenAValue && tokenAValue !== '0' && provider
                    ? await getAmountOfTokensReceivedFromSwap(
                        provider as Provider,
                        parseEther(tokenAValue),
                        tokenA.value === 'ETH' ? ethReserve : tknReserve,
                        tokenA.value === 'ETH' ? tknReserve : ethReserve,
                    ) : ZERO;

                setTokenBValue(calculetedTokenBValue);


            setIsLoading(false);
        };
        if (tokenAValue !== '') {
            timerId = setTimeout(debounceCalculate, 1000);
        }

        return () => {
            clearTimeout(timerId);
        }
    }, [tokenAValue]);

    const onTokenAValueChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = new RegExp('^[0-9.,]+$');

        if (value.length === 0 && value === '') {
            setTokenAValue('');
            setTokenBValue(ZERO);
            return;
        }

        if (regex.test(value)) {
            setTokenAValue(value);
        }
    };

    const swap = async (isEthSelected: boolean) => {
        try {
            const swapInputAmountWei = parseEther(tokenAValue);
            const swapOutputAmountWei = tokenBValue;
            if (swapInputAmountWei != ZERO) {
                setIsLoading(true);
                if (signer) {
                    await swapTokens(signer, swapInputAmountWei, swapOutputAmountWei, isEthSelected);
                    setTokenAValue('');
                    setTokenBValue(ZERO);
                }
                setIsLoading(false);
                if (provider && signerAddress) await getAmounts(provider, signerAddress);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onSwap = async () => {
        if (!signer) {
            await connectWallet();
            return;
        }

        await swap(tokenA.value === 'ETH');
    };

    return (
        <section className={"swap"}>
            <div className={"swap-container"}>

                {isLoading
                    ? <div className="loader-container">
                        <RotatingLines
                            strokeColor="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="40"
                            visible={true}
                        />
                    </div>
                    : null}

                <div className={"swap-items-container-1"}>
                    <h2 className={"swap-title"}>Swap</h2>
                </div>

                <p className={"swap-description"}>Easy way to trade your tokens</p>

                <div className={"swap-token"}>
                    <p className={"swap-token-destination"}>From</p>

                    <div className={"token-container-2"}>
                        <input
                            value={tokenAValue}
                            onChange={onTokenAValueChange}
                            className={"token-value"}
                            type={"text"}
                            placeholder={'0'}
                        />

                        <Select
                            defaultValue={tokenA}
                            onChange={(value) => {
                                if (value !== null) {
                                    setTokenAValue('');
                                    setTokenBValue(ZERO);
                                    setTokenA(value)
                                };
                            }}
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: 'max content',
                                    border: 'var(--shadow-color) 1px solid',
                                    backgroundColor: 'transparent',
                                }),
                            }}
                            options={tokens.map(token => {
                                return {
                                    value: token.symbol,
                                    label: <div className={"token-credentials"}>
                                        <img className={"token-icon"} src={token.icon} alt={'Token Icon'} />
                                        <p className={'token-symbol'}>{token.symbol}</p>
                                    </div>
                                }
                        })} />
                    </div>
                </div>

                <div className={"swap-toArrow"}>
                    <img src={"/toArrow.svg"} alt={'To Arrow'} />
                </div>

                <div className={"swap-token"}>
                    <p className={"swap-token-destination"}>To</p>

                    <div className={"token-container-2"}>
                        <p className={"tokenB-value"}>{`${tokenBValue ? formatEther(tokenBValue) : 0}`}</p>

                        <Select
                            className={'swap-select'}
                            value={tokenB}
                            onChange={(value) => { if(value) setTokenB(value) }}
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: 'max content',
                                    border: 'var(--shadow-color) 1px solid',
                                    backgroundColor: 'transparent',
                                }),
                            }}
                            options={options.filter(token =>
                                token.value !== tokenA.value
                            )} />
                    </div>
                </div>

                <button
                    onClick={onSwap}
                    className={`swap-button ${tokenBValue !== ZERO ? 'active' : ''}`}
                    disabled={tokenBValue === ZERO}
                >
                    Swap
                </button>
            </div>
        </section>
    );
}
