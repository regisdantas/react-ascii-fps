export default class Sprite {
  constructor(image) {
    this.buffer = image;
    this.height = image.length;
    this.width = image[0].length;
  }
  Sample(x, y) {
    x = Math.round(x);
    y = Math.round(y);
    return this.buffer[y].split("")[x];
  }
  SampleFloat (fx, fy) {
    return this.Sample(this.width*fx, this.height*fy);
  }
}
