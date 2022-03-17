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
      width: Math.floor(window.innerWidth / 10),
      height: Math.floor(window.innerHeight / 14),
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

    let player = new Player(this.map.width/2, 6, Math.PI/2);
    this.fired = false;

    let entities = [];
    this.state = {
      player: player,
      entities: entities,
    };
  }

  bulletTimeout() {
    this.fired = false;
    if (this.bulletTimer !== undefined) {
      clearInterval(this.bulletTimer);
    }
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
      dAngle = 1;
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

    if (!this.fired && recordedInput.hasOwnProperty("mouse_0")) {
      entities.push(
        new Bullet(
          newPlayer.x + 0.6 * Math.cos(newPlayer.a),
          newPlayer.y + 0.6 * Math.sin(newPlayer.a),
          newPlayer.a,
          new Sprite(bulletSprite)
        )
      );
      this.fired = true;
      this.bulletTimer = setInterval(this.bulletTimeout.bind(this), 500);
      update = true;
    }

    entities.map((entity1) => {
      entities.map((entity2) => {
        if (
          entity1 !== entity2 &&
          entity1.type !== entity2.type &&
          entity1.dead === false &&
          entity2.dead === false
        ) {
          if (this.engine.CheckObjColision(entity1, entity2)) {
            entity1.Kill();
            entity2.Kill();
            if (entity1.type === "enemy" || entity2.type === "enemy") {
              newPlayer.score += 100;
            }
            update = true;
          }
        }
      });
      if (entity1.type === "bullet" && this.engine.CheckObjColision(entity1, this.state.player)) {
        entity1.Kill();
        console.log("You died");
        update = true;
      }
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
