import "./index.css";

const defaultConsts = {
  defaultPlayerSpeed: 0.2,
  defaultPlayerSpin: 0.02,
  defaultFieldOfView: Math.PI / 4,
  defaultRayStepSize: 1,

  defaultRenderOptions: {
    ceilingChar: " ",
    wallChar: ["█", "▓", "▒", "░"],
    floorChar: ["@", ";", "."],
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

  MovePlayer(player, map, dFrontBack, dSide, dAngle) {
    let newA = player.a + dAngle * defaultConsts.defaultPlayerSpin;
    let newX =
      player.x +
      defaultConsts.defaultPlayerSpeed *
        (dFrontBack * Math.cos(player.a) + dSide * Math.sin(player.a));
    let newY =
      player.y +
      defaultConsts.defaultPlayerSpeed *
        (dFrontBack * Math.sin(player.a) + dSide * Math.cos(player.a));
    if (
      map.mapBuffer[Math.floor(newY)][Math.floor(newX)] === map.options.wallChar
    ) {
      newX = player.x;
      newY = player.y;
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
      let ceilingSize =
        this.gameOptions.height / 2 - this.gameOptions.height / distanceToWall;
      let floorSize = this.gameOptions.height - ceilingSize;

      for (let y = 0; y < this.gameOptions.height; y++) {
        if (y < ceilingSize) {
          this.Draw(x, y, defaultConsts.defaultRenderOptions.ceilingChar);
        } else if (y > ceilingSize && y < floorSize) {
          let wallShade = Math.floor(
            (distanceToWall / (map.width + 1)) *
              defaultConsts.defaultRenderOptions.wallChar.length
          );
          this.Draw(
            x,
            y,
            defaultConsts.defaultRenderOptions.wallChar[wallShade]
          );
        } else {
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
  }

  render(player, map) {
    this.DrawView(player, map);
    this.DrawMap(map, player, 2, 2);
    return (
      <div className="game-screen">
        <pre>
          {this.screenBuffer.map((line, idx) => {
            return <span>{`${line.join("")}\n`}</span>;
          })}
        </pre>
      </div>
    );
  }

  static CreateGameMap(width, height, inOptions) {
    let options = { ...defaultConsts.defaultMapOptions };
    let mapBuffer = new Array(height).fill().map((_, hidx) =>
      new Array(width).fill().map((_, widx) => {
        let char = options.floorChar;
        if (
          widx === 0 ||
          widx === width - 1 ||
          hidx === 0 ||
          hidx === height - 1
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
      width: width,
      height: height,
      options: options,
    };
  }
}

export class Player {
  constructor(x, y, a) {
    this.x = x;
    this.y = y;
    this.a = a;
  }

  render() {
    return <></>;
  }
}