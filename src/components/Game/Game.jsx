import PropTypes from "prop-types";
import React, { Component } from "react";
import { ASCIIGameEngine, Player } from "../react-ascii-game-engine";
// import structuredClone from "@ungap/structured-clone";

export default class Game extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);

    this.state = {
      player: new Player(15, 5, 0),
    };

    const gameOptions = {
      width: 134,
      height: 80,
      fps: 60,
      mapLines: 20,
      mapCols: 20,
      onKeyPress: this.onKeyPress.bind(this),
    };

    this.engine = new ASCIIGameEngine(gameOptions);
    this.map = ASCIIGameEngine.CreateGameMap(
      gameOptions.mapCols,
      gameOptions.mapLines,
      {
        foorChar: " ",
      }
    );
  }

  onKeyPress(event) {
    let newPlayer = this.state.player;
    if (event.key === "w") {
      newPlayer = this.engine.MovePlayer(this.state.player, 1, 0, 0);
    } else if (event.key === "s") {
      newPlayer = this.engine.MovePlayer(this.state.player, -1, 0, 0);
    } else if (event.key === "a") {
      newPlayer = this.engine.MovePlayer(this.state.player, 0, 0, -1);
    } else if (event.key === "d") {
      newPlayer = this.engine.MovePlayer(this.state.player, 0, 0, 1);
    } else {
      return;
    }
    this.setState({ player: newPlayer });
  }

  render() {
    return this.engine.render(this.state.player, this.map);
  }
}
