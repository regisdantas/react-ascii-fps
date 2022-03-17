import GameObject from "../GameObject/GameObject";

export default class Enemy extends GameObject {
  constructor(x, y, sprite) {
    super(x, y);
    this.a = Math.random() * 2 * Math.PI;
    this.sprite = sprite;
    this.type = "enemy";

    this.dead = false;
  }

  Kill() {
    this.dead = true;
  }

  FrameProcess(map) {
    let newX = this.x;
    let newY = this.y;
    let newA = this.a + Math.random() * 0.1 - 0.05;
    let colide = false;
    newX = this.x + 0.05 * Math.cos(this.a);
    newY = this.y + 0.05 * Math.sin(this.a);
    colide = map.CheckColision(newX, newY);
    if (colide) {
      this.a += Math.PI + Math.random() * Math.PI;
      if (this.a > 2 * Math.PI) {
        this.a -= 2 * Math.PI;
      }
    } else {
      this.x = newX;
      this.y = newY;
      this.a = newA;
    }
    return !colide;
  }
}
