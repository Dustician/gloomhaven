import React from "react";
import {connect} from "react-redux";

import xpIcon from "./xp.svg";
import {BonusSelectors} from "../UnitTracking/BonusSelectors";
import {StatusEffectTracker} from "../UnitTracking/StatusEffectTracker";
import {HPTracker} from "../UnitTracking/HPTracker";
import {setLevelAction, toggleStatusEffectAction, setHPAction} from "../../store/players";
import {removePlayerAction} from "../../store/actions/players";
import {selectors as monstersSelectors} from "../../store/monsters";

import "./PlayerTracker.css";

class PlayerTrackerComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            xp: 0,
        };
    }

    setXP(xp) {
        if (xp < 0) {
            return;
        }
        this.setState({
            xp,
        })
    }

    render() {
        const levelSelectID = `Player-${this.props.name}-LevelSelect`;
        return (<div className="PlayerTracker--Container">
            <h5 className="PlayerTracker--Name">
                {this.props.name}
                {!this.props.hasMonstersInPlay &&
                    <button onClick={() => this.props.removePlayer()}>
                        X
                    </button>
                }
            </h5>
            <div className="PlayerTracker--Description">
                <div className="PlayerTracker--Class">{this.props.player.class}</div>
                <div className="PlayerTracker--LevelSelector">
                    <label htmlFor={levelSelectID}>Level: </label>
                    <select
                        id={levelSelectID}
                        disabled={this.props.hasMonstersInPlay}
                        value={this.props.level}
                        onChange={(event) => this.props.selectLevel(parseInt(event.target.value, 10))}
                    >
                        {new Array(9).fill().map((_, i) => {
                            const level = i + 1;
                            return (<option key={level} value={level}>{level}</option>);
                        })}
                    </select>
                </div>
            {/*
                <div>
                    <select>
                    </select>
                    <button>Summon</button>
                </div>
            */}
            </div>
            <div className="PlayerTracker">
                <div className="PlayerTracker--Stats">
                    <div className="PlayerTracker--XP">
                        <img className="PlayerTracker--XP--Icon" src={xpIcon} alt="xp" />
                        <div className="PlayerTracker--XP--Buttons">
                            <button disabled={this.state.xp === 0} onClick={() => this.setXP(this.state.xp - 1)}>-</button>
                            {this.state.xp}
                            <button onClick={() => this.setXP(this.state.xp + 1)}>+</button>
                        </div>
                    </div>
                    <BonusSelectors />
                </div>
                <StatusEffectTracker className="PlayerTracker--StatusEffectTracker"
                    statusEffects={this.props.player.statusEffects}
                    onToggle={(s) => this.props.toggleStatusEffect(s)} />
                {/* unique key on level so that when the level changes the hp gets rerendered */}
                <HPTracker
                    currentHP={this.props.player.hp}
                    maxHP={this.props.player.maxHP}
                    onHPClick={(hp) => (this.props.player.hp !== hp) && this.props.setHP(hp)}
                />
            </div>
        </div>);
    }
}

export const PlayerTracker = connect(
    (state, ownProps) => {
        return {
            player: state.players.players[ownProps.name],
            hasMonstersInPlay: monstersSelectors.hasMonstersInPlay(state),
        };
    },
    (dispatch, ownProps) => {
        return {
            selectLevel: (level) => dispatch(setLevelAction(ownProps.name, level)),
            removePlayer: () => dispatch(removePlayerAction(ownProps.name)),
            toggleStatusEffect: (statusEffect) => dispatch(toggleStatusEffectAction(ownProps.name, statusEffect)),
            setHP: (hp) => dispatch(setHPAction(ownProps.name, hp)),
        };
    },
)(PlayerTrackerComponent);