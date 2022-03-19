export default class GameEntity {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.dead = false;
  }

  Kill() {
    if (this.type !== undefined)
      console.warn("This method should be overwritten");
  }

  FrameProcess(map) {
    if (this.type !== undefined)
      console.warn("This method should be overwritten");
    return false;
  }
}
