import React from "react";
import "./index.css";

const defaultConsts = {
  defaultPlayerSpeed: 0.05,
  defaultPlayerSpin: 0.04,
  defaultFieldOfView: Math.PI / 4,
  defaultRayStepSize: 1,

  defaultRenderOptions: {
    ceilingChar: "-",
    wallChar: ["█", "▓", "▒", "░"],
    floorChar: [".", ";", "@"],
  },

  defaultMapOptions: {
    wallChar: "#",
    floorChar: " ",
  },
};
export class ASCIIGameEngine {
  constructor(gameOptions) {
    this.gameOptions = gameOptions;
    this.pressedKeys = {};
    this.fOV = defaultConsts.defaultFieldOfView;
    this.mousePosition = {
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
    };

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

    document.onmousemove = this.OnMouseMove.bind(this);
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

  onKeyPress(event) {
    this.pressedKeys[event.key] = true;
  }

  onKeyUp(event) {
    delete this.pressedKeys[event.key];
  }

  FrameTrigger() {
    this.gameOptions.FrameProcess();
  }

  GetPressedKeys() {
    return this.pressedKeys;
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

  MovePlayer(player, map, dFrontBack, dSide, dAngle) {
    let newA = player.a + dAngle * defaultConsts.defaultPlayerSpin;
    let newX =
      player.x +
      defaultConsts.defaultPlayerSpeed *
        (dFrontBack * Math.cos(player.a) - dSide * Math.sin(player.a));
    let newY =
      player.y +
      defaultConsts.defaultPlayerSpeed *
        (dFrontBack * Math.sin(player.a) + dSide * Math.cos(player.a));
    if (
      map.mapBuffer[Math.floor(newY)][Math.floor(newX)] === map.options.wallChar
    ) {
      if (
        map.mapBuffer[Math.floor(newY)][Math.floor(player.x)] ===
        map.options.wallChar
      ) {
        newY = player.y;
        if (
          map.mapBuffer[Math.floor(player.y)][Math.floor(newX)] ===
          map.options.wallChar
        ) {
          newX = player.x;
        }
      } else {
        newX = player.x;
      }
    }
    return { ...player, x: newX, y: newY, a: newA };
  }

  Draw(x, y, char) {
    this.screenBuffer[y + 1][x + 1] = char;
  }

  DrawMap(map, player, posx, posy) {
    let pointerX = Math.floor(player.x + 3 * Math.cos(player.a));
    let pointerY = Math.floor(player.y + 3 * Math.sin(player.a));

    map.mapBuffer.forEach((line, y) => {
      line.forEach((col, x) => {
        if (x === Math.floor(player.x) && y === Math.floor(player.y)) {
          this.Draw(x + posx, y + posy, "P");
        } else if (x === pointerX && y === pointerY) {
          this.Draw(x + posx, y + posy, "*");
        } else {
          this.Draw(x + posx, y + posy, map.mapBuffer[y][x]);
        }
      });
    });
  }

  DrawView(player, map) {
    for (let x = 0; x < this.gameOptions.width; x++) {
      let rayAngle =
        player.a - this.fOV / 2 + (x * this.fOV) / this.gameOptions.width;
      let rayX = Math.cos(rayAngle);
      let rayY = Math.sin(rayAngle);
      let distanceToWall = 0;
      let hitWall = false;
      let isBoundary = false;
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
          let corners = [];
          for (let tx = 0; tx < 2; tx++) {
            for (let ty = 0; ty < 2; ty++) {
              let cornerX = testX + tx - player.x;
              let cornerY = testY + ty - player.y;
              let cornerDistance = Math.sqrt(
                cornerX * cornerX + cornerY * cornerY
              );
              let dot = (rayX * cornerX + rayY * cornerY) / cornerDistance;
              corners.push({ distance: cornerDistance, dot: dot });
            }
          }
          corners.sort((a, b) => (a.distance < b.distance ? 1 : -1));
          let testAgle = 0.002;
          if (Math.acos(corners[0].dot) < testAgle) {
            isBoundary = true;
          }
          if (Math.acos(corners[1].dot) < testAgle) {
            isBoundary = true;
          }
        }
      }
      let ceilingSize =
        this.gameOptions.height / 2 - this.gameOptions.height / distanceToWall;
      let floorSize = this.gameOptions.height - ceilingSize;

      let wallShade = Math.floor(
        (distanceToWall / (map.width + 1)) *
          defaultConsts.defaultRenderOptions.wallChar.length
      );

      for (let y = 0; y < this.gameOptions.height; y++) {
        if (y < ceilingSize) {
          this.Draw(x, y, defaultConsts.defaultRenderOptions.ceilingChar);
        } else if (y > ceilingSize && y < floorSize) {
          if (isBoundary) {
            this.Draw(x, y, " ");
          } else {
            this.Draw(
              x,
              y,
              defaultConsts.defaultRenderOptions.wallChar[wallShade]
            );
          }
        } else if (y > floorSize) {
          let floorShade = Math.floor(
            ((y - floorSize) / (ceilingSize + 1)) *
              defaultConsts.defaultRenderOptions.floorChar.length
          );

          this.Draw(
            x,
            y,
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
    this.Draw(centerX - 1, centerY, "|");
    this.Draw(centerX + 1, centerY, "|");
  }

  render(player, map) {
    let currentColor = "black";
    this.DrawView(player, map);
    this.DrawMap(map, player, 2, 2);

    return (
      <div
        id="game-screen"
        className="game-screen"
        onClick={() => this.PointerLock()}
      >
        <pre>
          {/* {this.screenBuffer.map((line, lidx) => {
            let printLine = [];
            line.map((char, cidx) => {
              if (defaultConsts.defaultRenderOptions.wallChar.includes(char) && currentColor !== "black") {
                printLine.push(<font color='black'>{char}</font>);
                currentColor = "black";
              } else if (defaultConsts.defaultRenderOptions.floorChar.includes(char) && currentColor !== "green") {
                printLine.push(<font color='green'>{char}</font>);
                currentColor = "green";
              } else if (defaultConsts.defaultRenderOptions.ceilingChar.includes(char) && currentColor !== "red") {
                printLine.push(<font color='red'>{char}</font>);
                currentColor = "red";
              } else {
                printLine.push(char);
              }
            });
            printLine.push("\n");
            return <span>
              {printLine.map(line => line)}
            </span>;
          })} */}
          {this.screenBuffer.map((line, idx) => {
            return <span>{`${line.join("")}\n`}</span>;
          })}
        </pre>
      </div>
    );
  }

  static SetGameMap(mapBuffer, inOptions) {
    let options = { ...defaultConsts.defaultMapOptions };
    const height = mapBuffer.length;
    const width = mapBuffer[0].length;
    return {
      mapBuffer: mapBuffer,
      width: width,
      height: height,
      options: options,
    };
  }

  static CreateGameMap(width, height, inOptions) {
    let options = { ...defaultConsts.defaultMapOptions };
    let mapBuffer = new Array(height + 2).fill().map((_, hidx) =>
      new Array(width + 2).fill().map((_, widx) => {
        let char = options.floorChar;
        if (
          widx === 0 ||
          widx === width + 1 ||
          hidx === 0 ||
          hidx === height + 1
        ) {
          char = options.wallChar;
        }
        // // To test
        // if (
        //   widx === width / 2 &&
        //   (hidx > height / 2 + 4 || hidx < height / 2 - 4)
        // ) {
        //   char = options.wallChar;
        // }
        // if (
        //   (widx > width / 2 + 4 || widx < width / 2 - 4) &&
        //   hidx === height / 2
        // ) {
        //   char = options.wallChar;
        // }
        return char;
      })
    );
    return {
      mapBuffer: mapBuffer,
      width: width + 2,
      height: height + 2,
      options: options,
    };
  }
}

export class Player {
  constructor(x, y, a) {
    this.x = x + 1;
    this.y = y + 1;
    this.a = a;
  }

  render() {
    return <></>;
  }
}
