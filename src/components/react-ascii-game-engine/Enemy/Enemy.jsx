import GameObject from "../GameObject/GameObject";

export default class Enemy extends GameObject {
  constructor(x, y, sprite) {
    super(x, y);
    this.sprite = sprite;
    this.type = "enemy";
    this.dirX = 1;
    this.dirY = 1;
    this.dead = false;
  }

  CopyUpdate(x, y) {
    let newEnemy = new Enemy(x, y, this.sprite);
    newEnemy.dirX = this.dirX;
    newEnemy.dirY = this.dirY;
    newEnemy.dead = this.dead;
    return newEnemy;
  }

  Kill() {
    this.dead = true;
  }

  FrameProcess(map) {
    let newX = this.x;
    let newY = this.y;
    let colide = false;
    newX = this.x + 0.05 * this.dirX * Math.random();
    newY = this.y + 0.05 * this.dirY * Math.random();
    colide = map.CheckColision(newX, newY);
    if (colide) {
      this.dirX = 2 * Math.random() - 1;
      this.dirY = 2 * Math.random() - 1;
    }
    if (!colide) return { entity: this.CopyUpdate(newX, newY), update: true };
    else return { entity: this, update: false };
  }
}
