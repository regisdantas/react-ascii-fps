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
  }
}
