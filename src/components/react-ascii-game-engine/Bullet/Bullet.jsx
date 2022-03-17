import GameObject from "../GameObject/GameObject";

export default class Bullet extends GameObject {
  constructor(x, y, a, sprite) {
    super(x, y);
    this.a = a;
    this.sprite = sprite;
    this.type = "bullet";

    this.dead = false;
  }

  Kill() {
    this.dead = true;
  }

  FrameProcess(map) {
    let newX = this.x + 1*Math.cos(this.a);
    let newY = this.y + 1*Math.sin(this.a);
    if (map.CheckColision(Math.floor(newX), Math.floor(newY))) {
      this.dead = true;
      return false;
    }
    this.x = newX;
    this.y = newY;
    return true;
  }
}
