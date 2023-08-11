import './Header.css';
import {Link, NavLink} from "react-router-dom";
import {useWalletContext} from "../../hooks/useWalletContext";

export const Header = () => {
    const {
        walletConnected,
        signerAddress,
        connectWallet,
    } = useWalletContext();

    return (
        <div className={"header"}>
            <div className={"header-container"}>
                <div className={"header-logo"}>
                    <a href={"/"}>
                        <img src={"/logo.svg"} alt={"logo"} />
                    </a>
                </div>

                <ul className={"header-menu"}>
                    <li className={"header-menu-item"}>
                        <NavLink
                            to='swap'
                            className={
                            ({isActive}) =>
                                `header-menu-link ${isActive ? 'header-menu-link-active' : ''}`
                            }
                        >
                            Swap
                        </NavLink>
                    </li>
                    <li className={"header-menu-item"}>
                        <NavLink
                            to='liquidity'
                            className={
                            ({isActive}) =>
                                `header-menu-link ${isActive ? 'header-menu-link-active' : ''}`
                        }>
                            Liquidity
                        </NavLink>
                    </li>
                </ul>

                {!walletConnected
                    ? <button onClick={connectWallet} className={"header-connect-button"}>Connect</button>
                    : (
                        <div className={"header-wallet"}>
                            <p className={"header-wallet-address"}>{signerAddress?.slice(0, 5) + '...' + signerAddress?.slice(-3)}</p>
                        </div>
                    )}
            </div>
        </div>
    );
}