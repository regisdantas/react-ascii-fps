import { defaultConsts } from "../Constants";

export default class Map {
  constructor(mapBuffer, inOptions) {
    this.SetGameMap(mapBuffer, inOptions);
  }

  SetGameMap(mapBuffer, inOptions) {
    this.mapBuffer = mapBuffer;
    this.options = { ...defaultConsts.defaultMapOptions };
    this.height = mapBuffer.length;
    this.width = mapBuffer[0].length;
    this.sunX = 3*this.width;
    this.sunY = this.height / 2;
    this.sunZ = 3;
  }

  Sample(x, y){
    return this.mapBuffer[Math.floor(y)].charAt(Math.floor(x));
  }

  CheckColision(x, y) {
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
