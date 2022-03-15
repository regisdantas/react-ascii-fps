import GameObject from "../GameObject/GameObject";

export default class Enemy extends GameObject {
  constructor(x, y, sprite) {
    super(x, y);
    this.sprite = sprite;
    this.enemy = true;
  }
}
