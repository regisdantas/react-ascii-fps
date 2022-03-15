import PropTypes from "prop-types";
import React from "react";
import structuredClone from "@ungap/structured-clone";
import {
  Engine,
  Player,
  Map,
  Game,
  Enemy,
  Sprite,
} from "../react-ascii-game-engine";
import { testMap } from "./TestMap.js";
import { enemySprite } from "./resources/enemy";

export default class ASCIIFPS extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);

    const gameOptions = {
      width: Math.floor(window.innerWidth / 5),
      height: Math.floor(window.innerHeight / 6),
      fps: 60,
      mapWidth: testMap[0].length,
      mapHeight: testMap.length,
      FrameProcess: this.FrameProcess.bind(this),
    };

    this.engine = new Engine(gameOptions);
    this.map = new Map(testMap, {
      foorChar: " ",
    });
    let player = new Player(2, 2, 0);
    this.game = new Game(this.engine, this.map, [
      new Enemy(10, 2, new Sprite(enemySprite)),
    ]);

    this.state = {
      player: player,
      characters: [],
    };
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

    if (dFrontBack !== 0 || dSide !== 0 || dAngle !== 0) {
      let newPlayer = this.state.player.MovePlayer(
        this.game,
        dFrontBack,
        dSide,
        dAngle
      );
      let state = structuredClone(this.state);
      state.player = newPlayer;
      this.setState(state);
    }
  }

  render() {
    return this.engine.render(
      this.game,
      this.state.player,
      this.state.characters
    );
  }
}
