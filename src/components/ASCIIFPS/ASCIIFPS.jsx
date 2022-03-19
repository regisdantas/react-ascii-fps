import PropTypes from "prop-types";
import React from "react";
import {
  Engine,
  FirsPersonCamera,
  Canvas,
  Player,
  Mission,
  Sprite,
  Bullet,
} from "../react-ascii-game-engine";

const testMission = "/examples/test-mission/test-mission.json";

const bulletSprite = [" | ", "-O-", " | "];

export default class ASCIIFPS extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    const width = Math.floor(window.innerWidth / 10);
    const height = Math.floor(window.innerHeight / 14);
    const fps = 60;

    this.engine = new Engine(fps, this.FrameProcess.bind(this));
    this.camera = new FirsPersonCamera(width);
    this.canvas = new Canvas(width, height);
    this.player = new Player(0, 0, 0);
    this.fired = false;

    this.mission = new Mission();
    this.mission.LoadMission(testMission);
    this.mission.setup(this.player);

    this.state = {
      update: false,
    };
  }

  bulletTimeout() {
    this.fired = false;
    if (this.bulletTimer !== undefined) {
      clearInterval(this.bulletTimer);
    }
  }

  FrameProcess() {
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

    update = this.mission.Interact(this.engine, this.player, {
      dFrontBack: dFrontBack,
      dSide: dSide,
      dAngle: dAngle,
    });

    if (!this.fired && recordedInput.hasOwnProperty("mouse_0")) {
      this.mission.entities.push(
        new Bullet(
          this.player.x + 0.6 * Math.cos(this.player.a),
          this.player.y + 0.6 * Math.sin(this.player.a),
          this.player.a,
          new Sprite(bulletSprite)
        )
      );
      this.fired = true;
      this.bulletTimer = setInterval(this.bulletTimeout.bind(this), 500);
      update = true;
    }

    if (update) {
      this.setState({ update: update });
    }
  }

  render() {
    this.camera.DrawView(this.canvas, this.mission, this.player);
    this.mission.entities.map((entity) => {
      this.camera.DrawObject(this.canvas, this.player, entity);
    });
    this.mission.Draw(this.canvas, this.player);

    return (
      <div
        id="game-screen"
        className="game-screen"
        onClick={() => this.engine.PointerLock()}
      >
        <span
          style={{ fontSize: "16px" }}
        >{`Score: ${this.player.score} - FPS: ${this.engine.fps}`}</span>
        <pre>{this.canvas.render()}</pre>
      </div>
    );
  }
}
