import "./index.css";

export default class ASCIIGameEngine {
  constructor(width, height, fps) {
    this.screenBuffer = new Array(height + 2)
      .fill()
      .map((_, hidx) => new Array(width + 2).fill().map((_, widx) => " "));
    this.screenBuffer[0][0] = "┌";
    this.screenBuffer[0][width + 1] = "┐";
    this.screenBuffer[height + 1][0] = "└";
    this.screenBuffer[height + 1][width + 1] = "┘";
    for (let i = 1; i <= width; i++) {
      this.screenBuffer[0][i] = "─";
      this.screenBuffer[height + 1][i] = "─";
    }
    for (let i = 1; i <= height; i++) {
      this.screenBuffer[i][0] = "│";
      this.screenBuffer[i][width + 1] = "│";
    }
  }

  Draw(x, y, char) {
    this.screenBuffer[y + 1][x + 1] = char;
  }

  DrawMap(map, posx, posy) {
    console.log(map)
    map.forEach((line, y) => {
      line.forEach((col, x) => {
        this.Draw(x + posx, y + posy, map[y][x]);
      });
    });
  }

  render() {
    return (
      <div className="game-screen">
        <pre>
          {this.screenBuffer.map((line) => {
            return (
              <span>
                {line}
                <br />
              </span>
            );
          })}
        </pre>
      </div>
    );
  }

  static CreateGameMap(width, height, options) {
    let map = new Array(height).fill().map((_, hidx) => 
      new Array(width).fill().map((_, widx) => {
        let char = options.floorChar ? options.floorChar : ".";
        if (widx === 0 || widx === width - 1 || hidx === 0 || hidx === height - 1) {
          char = options.wallChar ? options.wallChar : "#";
        }
        return char;
      }));
    return map;
  }
}
