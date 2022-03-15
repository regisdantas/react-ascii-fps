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
  Bullet,
} from "../react-ascii-game-engine";
import { testMap } from "./TestMap.js";
import { enemySprite } from "./resources/enemy";

const bulletSprite = [" | ", "-O-", " | "];

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
    this.game = new Game(this.engine, this.map, []);

    let player = new Player(2, 2, 0);
    let entities = [];
    for (let i = 0; i < 10; ) {
      let x = Math.floor(Math.random() * gameOptions.mapWidth);
      let y = Math.floor(Math.random() * gameOptions.mapHeight);
      if (!this.map.CheckColision(x, y)) {
        entities.push(new Enemy(x, y, new Sprite(enemySprite)));
        i++;
      }
    }

    this.state = {
      player: player,
      entities: entities,
    };
  }

  FrameProcess() {
    let newPlayer = this.state.player;
    let update = false;
    let dFrontBack = 0;
    let dSide = 0;
    let dAngle = 0;

    let recordedInput = this.engine.GetInput();
    if (recordedInput.hasOwnProperty("w")) {
      dFrontBack = 1;
    }
    if (recordedInput.hasOwnProperty("s")) {
      dFrontBack = -1;
    }
    if (recordedInput.hasOwnProperty("a")) {
      dSide = -1;
    }
    if (recordedInput.hasOwnProperty("d")) {
      dSide = 1;
    }
    if (recordedInput.hasOwnProperty("ArrowLeft")) {
      dAngle = -1;
    }
    if (recordedInput.hasOwnProperty("ArrowRight")) {
      dAngle = +1;
    }
    let mouseMoves = this.engine.GetMouseMoves();
    if (mouseMoves.dx > 1) {
      dAngle = 1;
    } else if (mouseMoves.dx < -1) {
      dAngle = -1;
    }

    if (dFrontBack !== 0 || dSide !== 0 || dAngle !== 0) {
      newPlayer = this.state.player.MovePlayer(
        this.game,
        dFrontBack,
        dSide,
        dAngle
      );
      update = true;
    }

    let entities = [];
    this.state.entities.map((entity) => {
      let { update: newUpdate, entity: newEntity } = entity.FrameProcess(
        this.map
      );
      if (!newEntity.dead) {
        entities.push(newEntity);
      }
      update = update || newUpdate;
    });

    if (recordedInput.hasOwnProperty("mouse_0")) {
      entities.push(
        new Bullet(
          newPlayer.x,
          newPlayer.y,
          newPlayer.a,
          new Sprite(bulletSprite)
        )
      );
      update = true;
    }

    entities.map((entity1) => {
      entities.map((entity2) => {
        if (entity1 !== entity2 && entity1.type !== entity2.type) {
          if (this.engine.CheckObjColision(entity1, entity2)) {
            entity1.Kill();
            entity2.Kill();
            update = true;
          }
        }
      });
    });

    if (update) {
      let state = { ...this.state };
      state.player = newPlayer;
      state.entities = entities;
      this.setState(state);
    }
  }

  render() {
    return this.engine.render(
      this.game,
      this.state.player,
      this.state.entities
    );
  }
}
