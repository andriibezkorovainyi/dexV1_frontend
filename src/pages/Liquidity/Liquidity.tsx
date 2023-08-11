import './Liquidity.css'
import {useState} from "react";
import {AddLiquidity} from "../../components/addLiquidity/AddLiquidity";
import {RemoveLiquidity} from "../../components/removeLiquidity/RemoveLiquidity";

enum ActionType {
    ADD = 'add',
    REMOVE = 'remove'
}

export const Liquidity = () => {
    const [action, setAction] = useState(ActionType.ADD);

    return (
        <section className={"liquidity"}>
            <div className="liquidity-container">
                <div className="pairs-container">
                    <h1 className="liquidity-pairs-title">Pairs</h1>
                    <ul className="liquidity-pairs-list">
                        <li className="liquidity-pairs-item active">
                            ETH/TKN
                        </li>
                    </ul>
                </div>

                <div className="actions-buttons-container">
                    <button
                        className={`liquidity-action-button ${action === ActionType.ADD ? 'active' : ''}`}
                        onClick={() => setAction(ActionType.ADD)}
                    >
                        Add Liquidity
                    </button>
                    <button
                        className={`liquidity-action-button ${action === ActionType.REMOVE ? 'active' : ''}`}
                        onClick={() => setAction(ActionType.REMOVE)}
                    >
                        Remove Liquidity
                    </button>

                </div>

                {(function () {
                    switch (action) {
                        case ActionType.ADD: return <AddLiquidity />;
                        case ActionType.REMOVE: return <RemoveLiquidity />;
                    }
                })()}
            </div>
        </section>
    );
};
