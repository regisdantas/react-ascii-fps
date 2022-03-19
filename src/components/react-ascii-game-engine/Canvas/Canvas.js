export default class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
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

  render() {
    return this.screenBuffer.map((line, idx) => {
      return <span>{`${line.join("")}\n`}</span>;
    });
  }
}
