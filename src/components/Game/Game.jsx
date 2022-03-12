import PropTypes from "prop-types";
import React, { Component } from "react";
import { ASCIIGameEngine, Player } from "../react-ascii-game-engine";
// import structuredClone from "@ungap/structured-clone";
const usedKeys = ["a", "s", "d", "w"];

export default class Game extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);

    const gameOptions = {
      width: 200,
      height: 100,
      fps: 60,
      mapWidth: 32,
      mapHeight: 32,
      FrameProcess: this.FrameProcess.bind(this),
    };

    this.state = {
      player: new Player(
        gameOptions.mapWidth / 2,
        gameOptions.mapHeight / 2,
        0
      ),
    };

    this.engine = new ASCIIGameEngine(gameOptions);
    this.map = ASCIIGameEngine.CreateGameMap(
      gameOptions.mapWidth,
      gameOptions.mapHeight,
      {
        foorChar: " ",
      }
    );
  }

  FrameProcess() {
    let dFrontBack = 0;
    let dSide = 0;
    let dAngle = 0;

    let pressedKeys = this.engine.GetPressedKeys();

    if (pressedKeys["w"]) {
      dFrontBack = 1;
    }
    if (pressedKeys["s"]) {
      dFrontBack = -1;
    }
    if (pressedKeys["a"]) {
      dAngle = -1;
    }
    if (pressedKeys["d"]) {
      dAngle = 1;
    }

    const newPlayer = this.engine.MovePlayer(
      this.state.player,
      dFrontBack,
      dSide,
      dAngle
    );
    this.setState({ player: newPlayer });
  }

  render() {
    return this.engine.render(this.state.player, this.map);
  }
}
