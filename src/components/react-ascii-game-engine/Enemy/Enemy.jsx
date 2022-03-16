import GameObject from "../GameObject/GameObject";

export default class Enemy extends GameObject {
  constructor(x, y, sprite) {
    super(x, y);
    this.a = Math.random() * 2 * Math.PI;
    this.sprite = sprite;
    this.type = "enemy";

    this.dead = false;
  }

  CopyUpdate(x, y, a) {
    let newEnemy = new Enemy(x, y, this.sprite);
    newEnemy.a = a;
    newEnemy.dead = this.dead;
    return newEnemy;
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
    }
    if (!colide)
      return { entity: this.CopyUpdate(newX, newY, newA), update: true };
    else return { entity: this, update: false };
  }
}
