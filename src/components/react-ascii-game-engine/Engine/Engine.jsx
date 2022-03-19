import React from "react";
import "./Engine.css";

export default class Engine {
  constructor(fps, onFrameProcess) {
    this.onFrameProcess = onFrameProcess;
    this.fps = 0;
    this.totalFrames = 0;
    this.recordedInput = {};
    this.mousePosition = {
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
    };

    document.addEventListener("keydown", this.onKeyPress.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    setInterval(this.FrameTrigger.bind(this), 1000 / fps);
    setInterval(this.MeasureFPS.bind(this), 1000);

    document.onmousemove = this.OnMouseMove.bind(this);
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  PointerLock() {
    let canvas = document.getElementById("game-screen");
    canvas.requestPointerLock =
      canvas.requestPointerLock ||
      canvas.mozRequestPointerLock ||
      canvas.webkitRequestPointerLock;
    canvas.requestPointerLock();
  }

  PointerUnlock() {
    let canvas = document.getElementById("game-screen");
    canvas.requestPointerUnlock();
  }

  OnMouseMove(event) {
    this.mousePosition.x = event.x;
    this.mousePosition.y = event.y;
    this.mousePosition.offsetX += event.movementX;
    this.mousePosition.offsetY += event.movementY;
  }

  onMouseDown(event) {
    this.recordedInput[`mouse_${event.button}`] = true;
  }

  onMouseUp(event) {
    delete this.recordedInput[`mouse_${event.button}`];
  }

  onKeyPress(event) {
    this.recordedInput[event.key] = true;
  }

  onKeyUp(event) {
    delete this.recordedInput[event.key];
  }

  MeasureFPS() {
    this.fps = this.totalFrames;
    this.totalFrames = 0;
  }

  FrameTrigger() {
    this.totalFrames++;
    this.onFrameProcess();
  }

  GetInput() {
    return this.recordedInput;
  }

  CheckObjColision(obj1, obj2) {
    const vecX = obj1.x - obj2.x;
    const vecY = obj1.y - obj2.y;
    const distSquare = vecX * vecX + vecY * vecY;

    if (distSquare < 0.3) {
      return true;
    }
    return false;
  }

  GetMouseMoves() {
    let moves = {
      x: this.mousePosition.x,
      y: this.mousePosition.y,
      dx: this.mousePosition.offsetX,
      dy: this.mousePosition.offsetY,
    };

    this.mousePosition.offsetX = 0;
    this.mousePosition.offsetY = 0;
    return moves;
  }
}
