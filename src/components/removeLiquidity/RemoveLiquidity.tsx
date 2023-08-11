import {useFundsContext} from "../../hooks/useFundsContext";
import {formatEther, parseEther} from "ethers";
import {useState} from "react";
import {calculateAmountsAfterRemove, removeLiquidity} from "../../utils/removeLiquidity";
import {RotatingLines} from "react-loader-spinner";
import {useWalletContext} from "../../hooks/useWalletContext";

export const RemoveLiquidity = () => {
    const {signer, provider, signerAddress} = useWalletContext();
    const {lpBalance, lpTotalSupply, ethReserve, tknReserve, getAmounts} = useFundsContext();
    const [lpValue, setLpValue] = useState('');
    const [ethToReturn, setEthToReturn] = useState('');
    const [tknToReturn, setTknToReturn] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onLpValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = new RegExp('^[0-9.,]+$');

        if (value.length === 0 && value === '') {
            setLpValue('');
            setEthToReturn('');
            setTknToReturn('');
            return;
        }

        if (regex.test(value)) {
            setLpValue(value);
            new Promise((resolve) => {
                resolve(setTimeout(async () => {
                    const amounts = calculateAmountsAfterRemove(value, lpTotalSupply, ethReserve, tknReserve);
                    if (amounts) {
                        setEthToReturn(amounts[0]);
                        setTknToReturn(amounts[1]);
                    }
                }, 1000));
            });
        }
    };

    const onRemoveLiquidity = async () => {
        if (lpValue === '' || lpValue > formatEther(lpBalance)) return;
        setIsLoading(true);
        if (signer) await removeLiquidity(signer, parseEther(lpValue));
        setEthToReturn('');
        setTknToReturn('');
        setLpValue('');
        setIsLoading(false);
        if (provider && signerAddress) await getAmounts(provider, signerAddress);
    };

    return (
        <div className={"liquidity-action"}>
            {isLoading
                ? <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
                : <>
                    <p className="liquidity-action-message" style={{textAlign: 'center'}}>
                        You have: {formatEther(lpBalance)} LP
                        <br/>
                        Enter the amount of LP you want to exchange for ETH and TKN
                    </p>

                    <input
                        type="text"
                        value={lpValue}
                        onChange={onLpValueChange}
                        placeholder={'LP tokens'}
                        className="liquidity-action-input"
                        size={lpValue ? lpValue.length : 10}
                    />

                    <p className="liquidity-action-message">
                        {`You will get ${ethToReturn || 0} ETH and ${tknToReturn || 0} TKN`}
                    </p>
                    <button onClick={onRemoveLiquidity} className="liquidity-action-button">
                        {'Remove liquidity'}
                    </button>
                </>}
        </div>
    );
};
