import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { getPlayersfromGame } from '../Firebase';

export class Players extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerList: {}
        }
    }

    componentDidMount() {
        getPlayersfromGame(this.props.gameId, players => {
            this.setState({
                playerList: players
            }
            )
        })
    }


    render() {

        const { playerList } = this.state
        const keys = Object.keys(playerList);
        console.log("keys===>",keys)
        console.log("playerList==>", playerList)

        return(
            <div id="lobby-waiting">
                { this.props.gameState === "ENTER_LOBBY" ?
                (
                    keys.length === 0 ? 
                    "Loading Players ...." 
                    : 
                    <div>
                    Players
                        { 
                            keys.forEach( key => {
                                return (playerList[key].name);
                            })
                        }
                    </div> 
                )
                :
                (
                    ""
                )
                }
            </div>
        )
    }
}

export default Players
