import PropTypes from "prop-types";
import React, { Component } from "react";
import { ASCIIGameEngine, Player } from "../react-ascii-game-engine";
// import structuredClone from "@ungap/structured-clone";

export default class Game extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    const gameOptions = {
      width: 134,
      height: 80,
      fps: 60,
      mapLines: 20,
      mapCols: 20,
      updatePlayer: this.updatePlayer.bind(this),
    };

    this.engine = new ASCIIGameEngine(gameOptions);
    this.map = ASCIIGameEngine.CreateGameMap(
      gameOptions.mapCols,
      gameOptions.mapLines,
      {
        foorChar: " ",
      }
    );
    this.state = {
      player: new Player(15, 5, 0),
    };
  }

  updatePlayer (dx, dy, da) {
    let newPlayer = new Player(this.state.player.x+dx, this.state.player.y+dy, this.state.player.a+da);
    this.setState({
      player: newPlayer
    });
  }

  render() {
    return this.engine.render(this.state.player, this.map);
  }
}
