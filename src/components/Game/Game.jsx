import PropTypes from "prop-types";
import React from "react";
import { ASCIIGameEngine, Player } from "../react-ascii-game-engine";
// import structuredClone from "@ungap/structured-clone";
const usedKeys = ["a", "s", "d", "w"];

export default class Game extends React.Component {
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

  componentDidMount() {

  }

  FrameProcess() {
    let dFrontBack = 0;
    let dSide = 0;
    let dAngle = 0;

    let pressedKeys = this.engine.GetPressedKeys();
    if (pressedKeys.hasOwnProperty("w")) {
      dFrontBack = 1;
    }
    if (pressedKeys.hasOwnProperty("s")) {
      dFrontBack = -1;
    }
    if (pressedKeys.hasOwnProperty("a")) {
      dSide = -1;
    }
    if (pressedKeys.hasOwnProperty("d")) {
      dSide = 1;
    }
    if (pressedKeys.hasOwnProperty("ArrowLeft")) {
      dAngle = -1;
    }
    if (pressedKeys.hasOwnProperty("ArrowRight")) {
      dAngle = +1;
    }
    let mouseMoves = this.engine.GetMouseMoves();
    if (mouseMoves.dx > 1) {
      dAngle = 1;
    } else if (mouseMoves.dx < -1) {
      dAngle = -1;
    }

    const newPlayer = this.engine.MovePlayer(
      this.state.player,
      this.map,
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
