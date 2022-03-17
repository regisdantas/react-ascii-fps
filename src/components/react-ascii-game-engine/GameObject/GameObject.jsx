export default class GameObject {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.dead = false;
  }

  Kill() {
    
  }

  FrameProcess(map) {
    return false;
  }
}
