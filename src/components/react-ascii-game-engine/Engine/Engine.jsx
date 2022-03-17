import React from "react";
import { defaultConsts } from "../Constants";
import "./Engine.css";

export default class Engine {
  constructor(gameOptions) {
    this.fps = 0;
    this.totalFrames = 0;
    this.gameOptions = gameOptions;
    this.recordedInput = {};
    this.fOV = defaultConsts.defaultFieldOfView;
    this.mousePosition = {
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
    };
    this.depthBuffer = new Array(gameOptions.width).fill(0);

    this.screenBuffer = new Array(gameOptions.height + 2)
      .fill()
      .map((_, hidx) =>
        new Array(gameOptions.width + 2).fill().map((_, widx) => " ")
      );
    this.screenBuffer[0][0] = "┌";
    this.screenBuffer[0][gameOptions.width + 1] = "┐";
    this.screenBuffer[gameOptions.height + 1][0] = "└";
    this.screenBuffer[gameOptions.height + 1][gameOptions.width + 1] = "┘";
    for (let i = 1; i <= gameOptions.width; i++) {
      this.screenBuffer[0][i] = "─";
      this.screenBuffer[gameOptions.height + 1][i] = "─";
    }
    for (let i = 1; i <= gameOptions.height; i++) {
      this.screenBuffer[i][0] = "│";
      this.screenBuffer[i][gameOptions.width + 1] = "│";
    }

    document.addEventListener("keydown", this.onKeyPress.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    setInterval(this.FrameTrigger.bind(this), 1000 / gameOptions.fps);
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
    this.gameOptions.FrameProcess();
  }

  GetInput() {
    return this.recordedInput;
  }

  CheckObjColision(obj1, obj2) {
    const vecX = obj1.x - obj2.x;
    const vecY = obj1.y - obj2.y;
    const distSquare = vecX * vecX + vecY * vecY;

    if (distSquare < 0.4) {
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

  Draw(x, y, char) {
    this.screenBuffer[y + 1][x + 1] = char;
  }

  DrawMap(map, player, objects, posx, posy) {
    let pointerX = Math.floor(player.x + 3 * Math.cos(player.a));
    let pointerY = Math.floor(player.y + 3 * Math.sin(player.a));

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (x === Math.floor(player.x) && y === Math.floor(player.y)) {
          this.Draw(x + posx, y + posy, "P");
        } else if (x === pointerX && y === pointerY) {
          this.Draw(x + posx, y + posy, "*");
        } else {
          this.Draw(x + posx, y + posy, map.Sample(x, y));
        }
      }
    }
    objects.map((obj) => {
      if (obj.type === "enemy")
        this.Draw(Math.floor(posx + obj.x), Math.floor(posy + obj.y), "E");
    });
  }

  DrawView(player, map) {
    for (let w = 0; w < this.gameOptions.width; w++) {
      let rayAngle =
        player.a - this.fOV / 2 + (w * this.fOV) / this.gameOptions.width;
      let rayX = Math.cos(rayAngle);
      let rayY = Math.sin(rayAngle);
      let distanceToWall = 0;
      let hitWall = false;
      while (!hitWall && distanceToWall < map.width) {
        distanceToWall += defaultConsts.defaultRayStepSize;
        let testX = Math.round(player.x + rayX * distanceToWall);
        let testY = Math.round(player.y + rayY * distanceToWall);
        if (
          testX < 0 ||
          testX >= map.width ||
          testY < 0 ||
          testY >= map.height
        ) {
          hitWall = true;
        } else if (map.mapBuffer[testY][testX] === map.options.wallChar) {
          hitWall = true;
        }
      }
      let skySize =
        this.gameOptions.height / 2 - this.gameOptions.height / distanceToWall;
      let floorSize = this.gameOptions.height - skySize;

      let wallShade = Math.min(
        Math.floor(
          (distanceToWall / 20) *
            defaultConsts.defaultRenderOptions.wallChar.length
        ),
        defaultConsts.defaultRenderOptions.wallChar.length - 1
      );

      this.depthBuffer[w] = distanceToWall;

      for (let h = 0; h < this.gameOptions.height; h++) {
        if (h < skySize) {
          let sunScaledX = this.gameOptions.width/2;
          let sunScaledY = this.gameOptions.height/2;
          let sunScaledZ = this.gameOptions.height;
          let sunW = sunScaledY*Math.sin(player.a) - sunScaledX*Math.cos(player.a) + this.gameOptions.width/2;
          let sunH = this.gameOptions.height - sunScaledZ;

          let vecW = sunW - w;
          let vecH = sunH - h;

          let skyA = Math.atan2(vecH, vecW);
          if (skyA < -Math.PI) {
            skyA += Math.PI * 2;
          }
          if (skyA > Math.PI) {
            skyA -= Math.PI * 2;
          }

          skyA = Math.PI + skyA;

          let skyShade = Math.max(
            Math.min(
              Math.floor(
                (skyA / Math.PI) *
                  defaultConsts.defaultRenderOptions.skyChar.length
              ),
              defaultConsts.defaultRenderOptions.skyChar.length - 1
            ),
            0
          );
          this.Draw(w, h, defaultConsts.defaultRenderOptions.skyChar[skyShade]);
        } else if (h > skySize && h < floorSize) {
          this.Draw(
            w,
            h,
            defaultConsts.defaultRenderOptions.wallChar[wallShade]
          );
        } else if (h > floorSize) {
          let floorShade = Math.min(
            Math.floor(
              ((h - floorSize) / skySize) *
                defaultConsts.defaultRenderOptions.floorChar.length
            ),
            defaultConsts.defaultRenderOptions.floorChar.length - 1
          );

          this.Draw(
            w,
            h,
            defaultConsts.defaultRenderOptions.floorChar[floorShade]
          );
        }
      }
    }
    //Draw Aim
    let centerX = Math.floor(this.gameOptions.width / 2) - 1;
    let centerY = Math.floor(this.gameOptions.height / 2) - 1;
    this.Draw(centerX, centerY - 1, "|");
    this.Draw(centerX, centerY + 1, "|");
    this.Draw(centerX - 1, centerY, "─");
    this.Draw(centerX + 1, centerY, "─");
  }

  DrawObject(obj, player) {
    let vecX = obj.x - player.x;
    let vecY = obj.y - player.y;
    let distToPlayer = Math.sqrt(vecX * vecX + vecY * vecY);

    let objA = Math.atan2(vecY, vecX) - player.a;
    if (objA < -Math.PI) {
      objA += Math.PI * 2;
    }
    if (objA > Math.PI) {
      objA -= Math.PI * 2;
    }

    let isInView = Math.abs(objA) < this.fOV / 2;
    if (
      isInView &&
      distToPlayer >= 1 &&
      distToPlayer < this.gameOptions.width
    ) {
      let objSky = Math.floor(
        this.gameOptions.height / 2.0 - this.gameOptions.height / distToPlayer
      );
      let objFloor = this.gameOptions.height - objSky;
      let objHeight = (objFloor - objSky) * 0.8;
      let objAspectRatio = obj.sprite.height / obj.sprite.width;
      let objWidth = objHeight / objAspectRatio;
      let objMiddle =
        (0.5 * (objA / (this.fOV / 2)) + 0.5) * this.gameOptions.width;

      for (let lx = 0; lx < objWidth; lx++) {
        for (let ly = 0; ly < objHeight; ly++) {
          let sampleX = Math.floor((lx / objWidth) * obj.sprite.width);
          let sampleY = Math.floor((ly / objHeight) * obj.sprite.height);
          let c = obj.sprite.Sample(sampleX, sampleY);
          let objColumn = Math.floor(objMiddle + lx - objWidth / 2);
          if (
            objColumn >= 0 &&
            objColumn < this.gameOptions.width &&
            objSky + ly >= 0 &&
            objSky + ly < this.gameOptions.height
          ) {
            if (c !== " " && this.depthBuffer[objColumn] >= distToPlayer) {
              this.Draw(objColumn, objSky + ly, c);
              this.depthBuffer[objColumn] = distToPlayer;
            }
          }
        }
      }
    }
  }

  render(game, player, entities) {
    this.score = player.score;
    this.DrawView(player, game.map);
    game.objects.map((obj) => {
      this.DrawObject(obj, player);
    });
    entities.map((entity) => {
      this.DrawObject(entity, player);
    });
    this.DrawMap(game.map, player, entities, 2, 2);

    return (
      <div
        id="game-screen"
        className="game-screen"
        onClick={() => this.PointerLock()}
      >
        <span
          style={{ fontSize: "16px" }}
        >{`Score: ${this.score} - FPS: ${this.fps}`}</span>
        <pre>
          {this.screenBuffer.map((line, idx) => {
            return <span>{`${line.join("")}\n`}</span>;
          })}
        </pre>
      </div>
    );
  }
}
