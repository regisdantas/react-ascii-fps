export default class Player {
  constructor(x, y, a) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.score = 0;
    this.dead = false;
  }

  Kill() {
    this.dead = true;
  }

  Update(newX, newY, newA) {
    this.x = newX;
    this.y = newY;
    this.a = newA;
  }
}
