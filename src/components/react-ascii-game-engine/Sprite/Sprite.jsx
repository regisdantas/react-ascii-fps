export default class Sprite {
  constructor(image) {
    this.buffer = image;
    this.height = image.length;
    this.width = image[0].length;
  }
  Sample(x, y) {
    return this.buffer[y].split("")[x];
  }
}
