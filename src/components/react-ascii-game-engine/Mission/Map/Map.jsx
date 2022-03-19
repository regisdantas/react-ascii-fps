import { defaultConsts } from "../../Constants";

export default class Map {
  constructor(mapBuffer) {
    this.SetMap(mapBuffer);
  }

  SetMap(mapBuffer) {
    this.mapBuffer = mapBuffer;
    this.options = { ...defaultConsts.defaultMapOptions };
    this.height = mapBuffer.length;
    this.width = mapBuffer[0].length;
    this.sunX = 3 * this.width;
    this.sunY = this.height / 2;
    this.sunZ = 3;
  }

  Sample(x, y) {
    return this.mapBuffer[Math.floor(y)].charAt(Math.floor(x));
  }

  FindID(id) {
    let found = [];
    for (let ey = 0; ey < this.height; ey++) {
      for (let ex = 0; ex < this.width; ex++) {
        if (this.mapBuffer[ey].charAt(ex) === id) {
          found.push({ ex, ey });
        }
      }
    }
    return found;
  }

  CheckColision(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return true;
    }
    if (
      this.mapBuffer[Math.floor(y)].charAt(Math.floor(x)) ===
      this.options.wallChar
    ) {
      return true;
    }
    return false;
  }
}
