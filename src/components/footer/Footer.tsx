import './Footer.css'
import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {useFundsContext} from "../../hooks/useFundsContext";

const urlPrices = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=387d9dfc3e7f018b200b2abe2a59e05b6fd199f3b7ffc0f2cd53d4e3ebaa88c1';
const getEthPrice = async (): Promise<number> => {
    try {
        const { data }: AxiosResponse = await axios.get(urlPrices);
        const { USD }: Price = data;
        return USD;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

interface Price {
    USD: number;
}

export const Footer = () => {
    const {ethReserve, tknReserve} = useFundsContext();
    const [tknPrice, setTknPrice] = useState('0');
    const [ethPrice, setEthPrice] = useState<number>(0);

    useEffect(() => {
        getEthPrice().then((price) => {
            setEthPrice(price);
        });

        const timerId = setInterval(async () => {
            const ethPrice = await getEthPrice();
            setEthPrice(ethPrice);
        }, 15_000);

        return () => {
            clearInterval(timerId);
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (ethPrice > 0 && ethReserve && tknReserve) {
                const ethToTkn = Number(ethReserve) / Number(tknReserve);
                const calculatedTknPrice = (ethPrice * Number(ethToTkn)).toFixed(2);
                setTknPrice(calculatedTknPrice);
            }
        }, 2000);
    }, [ethPrice]);

    return (
        tknPrice !== '0'
            ? (<div className={"info"}>
                <div className={"info-token-price"}>
                    <p className={"token-name"}>TKN</p>
                    <p className={"token-price"}>${tknPrice}</p>
                </div>
             </div>)
            : null
    );
};
