import GameObject from "../GameObject/GameObject";
import { defaultConsts } from "../Constants";
export default class Player extends GameObject {
  constructor(x, y, a) {
    super(x, y);
    this.a = a;
    this.score = 0;
  }

  MovePlayer(game, dFrontBack, dSide, dAngle) {
    let update = false;
    let newA = this.a + dAngle * defaultConsts.defaultPlayerSpin;
    if (newA > 2 * Math.PI) {
      newA -= 2 * Math.PI;
    }
    if (newA < 0) {
      newA += 2 * Math.PI;
    }
    let newX =
      this.x +
      defaultConsts.defaultPlayerSpeed *
        (dFrontBack * Math.cos(this.a) - dSide * Math.sin(this.a));
    let newY =
      this.y +
      defaultConsts.defaultPlayerSpeed *
        (dFrontBack * Math.sin(this.a) + dSide * Math.cos(this.a));
    if (
      game.map.mapBuffer[Math.floor(newY)][Math.floor(newX)] ===
      game.map.options.wallChar
    ) {
      if (
        game.map.mapBuffer[Math.floor(newY)][Math.floor(this.x)] ===
        game.map.options.wallChar
      ) {
        newY = this.y;
        if (
          game.map.mapBuffer[Math.floor(this.y)][Math.floor(newX)] ===
          game.map.options.wallChar
        ) {
          newX = this.x;
        }
      } else {
        newX = this.x;
      }
    }
    if (this.x !== newX || this.y !== newY || this.a !== newA) {
      update = true;
    }
    this.x = newX;
    this.y = newY;
    this.a = newA;
    return update;
  }
}
