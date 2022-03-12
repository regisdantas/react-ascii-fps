import "./index.css";

export default class ASCIIGameEngine {
  constructor(lines, cols, fps) {
    this.screenBuffer = new Array(lines).fill(
        new Array(cols).fill('').map((_, idx) => `X`)
      );
  }

  Draw(x, y, char) {
    this.screenBuffer[y][x] = char;
  }

  render() {
    return (
      <div className="game-screen">
        <p>
          {this.screenBuffer.map((line) => {
            return <span>{line}<br/></span>
          })}
        </p>
      </div>
    );
  }
}
