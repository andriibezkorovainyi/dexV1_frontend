import {useFundsContext} from "../../hooks/useFundsContext";
import {useState} from "react";
import './AddLiquidity.css';
import {addLiquidity, calculateLP, calculateTKN} from "../../utils/addLiquiduty";
import {useWalletContext} from "../../hooks/useWalletContext";
import {formatEther, parseEther, Provider, Signer} from "ethers";
import {RotatingLines} from "react-loader-spinner";

export const AddLiquidity = () => {
    const {ethReserve, tknReserve, getAmounts} = useFundsContext();
    const {provider, signer, signerAddress, connectWallet} = useWalletContext();
    const [etherValue, setEtherValue] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const [lpTokensToReceive, setLpTokensToReceive] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    let isReservesEmpty = false;
    if (ethReserve.toString() === '0' && tknReserve.toString() === '0') isReservesEmpty = true;

    const onEtherValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = new RegExp('^[0-9.,]+$');

        if (value === '' && value.length === 0) {
            setEtherValue('');
            setLpTokensToReceive('');
            return;
        }

        if (regex.test(value)) {
            setEtherValue(value);

            if (!isReservesEmpty) {
                new Promise((resolve) => {
                    resolve(
                        setTimeout(async () => {
                            const [tknAmount, lpAmount] = await Promise.all([
                                calculateTKN(e.target.value, ethReserve, tknReserve),
                                calculateLP(e.target.value, ethReserve, signer as Signer),
                            ]);
                            if (tknAmount) setTokenValue(tknAmount);
                            if (lpAmount) setLpTokensToReceive(lpAmount);
                        }, 1000)
                    );
                });
            }
        }
    };

    const isButtonDisabled = (() => {
        console.log(etherValue, tokenValue);
        if (!etherValue) return true;
        if (isReservesEmpty && !tokenValue) return true;
        return false;
    })();

    const onTokenValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = new RegExp('^[0-9.,]+$');

        if (value === '' && value.length === 0) {
            setTokenValue('');
            return;
        }

        if (regex.test(e.target.value)) {
            setTokenValue(e.target.value);
        }
    };

    const onAddLiquidity = async () => {
        console.log(signer);
        if (!signer) {
            await connectWallet();
            return;
        }

        if (!etherValue || !tokenValue) return;

        setIsLoading(true);

        await addLiquidity(
            signer as Signer,
            tokenValue,
            etherValue,
        );

        await getAmounts(provider as Provider, signerAddress as string);

        setEtherValue('');
        setTokenValue('');
        setLpTokensToReceive('');
        setIsLoading(false);
    };

    return (
        <div className={"liquidity-action"}>
            {isLoading
                ? <>
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="96"
                        visible={true}
                    />
                    <p className={"liquidity-action-message"}>
                        Waiting for transaction confirmation...
                    </p>
                </>
                : <>
                    {isReservesEmpty
                        ? <p className="liquidity-action-message" style={{textAlign: 'center'}}>
                            You are the first liquidity provider.
                            <br/>
                            The ratio of tokens you add will set the price of this pool.
                        </p>
                        : <p className="liquidity-action-message" style={{textAlign: 'center'}}>
                            You will receive pool tokens representing your share of this pool.
                            <br/>
                            These tokens automatically earn fees proportional to your share.
                            <br/>
                            The needed amount of TKN will be calculated relatively to the provided ETH.
                        </p>}

                    <input
                        type="text"
                        value={etherValue}
                        onChange={onEtherValueChange}
                        placeholder={'ETH'}
                        className="liquidity-action-input"
                        size={etherValue ? etherValue.length : 3}
                    />

                    {isReservesEmpty
                        ? <input
                            type="text"
                            value={tokenValue.toString()}
                            onChange={onTokenValueChange}
                            placeholder={'TKN'}
                            className="liquidity-action-input"
                            size={tokenValue ? tokenValue.toString().length : 3}
                        />
                        :
                        <p className="liquidity-action-message">
                            {`You will send ${tokenValue || 0} TKN`}
                        </p>}

                    <p className="liquidity-action-message">
                        {`You will get ${isReservesEmpty
                            ? etherValue || 0
                            : lpTokensToReceive.toString() || 0} LP tokens`}
                    </p>
                    <button
                        disabled={isButtonDisabled}
                        onClick={onAddLiquidity}
                        className={`liquidity-action-button ${isButtonDisabled? '' : 'active'}`}>
                        {'Add Liquidity'}
                    </button>
                </>}
        </div>
    );
};
