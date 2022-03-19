import Camera from "../Camera";
import { defaultConsts } from "../../Constants";

export default class FirsPersonCamera extends Camera {
  constructor(width) {
    super();
    this.depthBuffer = new Array(width).fill(0);
  }

  DrawView(canvas, mission, player) {
    for (let w = 0; w < canvas.width; w++) {
      let rayAngle =
        player.a -
        defaultConsts.defaultFieldOfView / 2 +
        (w * defaultConsts.defaultFieldOfView) / canvas.width;
      let rayX = Math.cos(rayAngle);
      let rayY = Math.sin(rayAngle);
      let distanceToWall = 0;
      let hitWall = false;
      while (!hitWall && distanceToWall < mission.map.width) {
        distanceToWall += defaultConsts.defaultRayStepSize;
        let testX = Math.round(player.x + rayX * distanceToWall);
        let testY = Math.round(player.y + rayY * distanceToWall);
        if (
          testX < 0 ||
          testX >= mission.map.width ||
          testY < 0 ||
          testY >= mission.map.height
        ) {
          hitWall = true;
        } else if (
          mission.map.mapBuffer[testY][testX] === mission.map.options.wallChar
        ) {
          hitWall = true;
        }
      }
      let skySize = canvas.height / 2 - canvas.height / distanceToWall;
      let floorSize = canvas.height - skySize;

      let wallShade = Math.min(
        Math.floor(
          (distanceToWall / 20) *
            defaultConsts.defaultRenderOptions.wallChar.length
        ),
        defaultConsts.defaultRenderOptions.wallChar.length - 1
      );

      this.depthBuffer[w] = distanceToWall;

      for (let h = 0; h < canvas.height; h++) {
        if (h < skySize) {
          let FX = w/(canvas.width*2*Math.PI/defaultConsts.defaultFieldOfView) + player.a/(2*Math.PI);
          FX = FX%1;
          let FY = 2*h/canvas.height;
          const char = mission.sky.SampleFloat(FX,FY);
          canvas.Draw(
            w,
            h,
            char
          );
        } else if (h > skySize && h < floorSize) {
          canvas.Draw(
            w,
            h,
            defaultConsts.defaultRenderOptions.wallChar[wallShade]
          );
        } else if (h > floorSize) {
          let floorShade = Math.min(
            Math.floor(
              ((h - floorSize) / skySize) *
                defaultConsts.defaultRenderOptions.floorChar.length
            ),
            defaultConsts.defaultRenderOptions.floorChar.length - 1
          );

          canvas.Draw(
            w,
            h,
            defaultConsts.defaultRenderOptions.floorChar[floorShade]
          );
        }
      }
    }
    //Draw Aim
    let centerX = Math.floor(canvas.width / 2) - 1;
    let centerY = Math.floor(canvas.height / 2) - 1;
    canvas.Draw(centerX, centerY - 1, "|");
    canvas.Draw(centerX, centerY + 1, "|");
    canvas.Draw(centerX - 1, centerY, "─");
    canvas.Draw(centerX + 1, centerY, "─");
  }

  DrawObject(canvas, player, object) {
    let vecX = object.x - player.x;
    let vecY = object.y - player.y;
    let distToPlayer = Math.sqrt(vecX * vecX + vecY * vecY);

    let objA = Math.atan2(vecY, vecX) - player.a;
    if (objA < -Math.PI) {
      objA += Math.PI * 2;
    }
    if (objA > Math.PI) {
      objA -= Math.PI * 2;
    }

    let isInView = Math.abs(objA) < defaultConsts.defaultFieldOfView / 2;
    if (isInView && distToPlayer >= 1 && distToPlayer < canvas.width) {
      let objSky = Math.floor(
        canvas.height / 2.0 - canvas.height / distToPlayer
      );
      let objFloor = canvas.height - objSky;
      let objHeight = (objFloor - objSky) * 0.8;
      let objAspectRatio = object.sprite.height / object.sprite.width;
      let objWidth = objHeight / objAspectRatio;
      let objMiddle =
        (0.5 * (objA / (defaultConsts.defaultFieldOfView / 2)) + 0.5) *
        canvas.width;

      for (let lx = 0; lx < objWidth; lx++) {
        for (let ly = 0; ly < objHeight; ly++) {
          let sampleX = Math.floor((lx / objWidth) * object.sprite.width);
          let sampleY = Math.floor((ly / objHeight) * object.sprite.height);
          let c = object.sprite.Sample(sampleX, sampleY);
          let objColumn = Math.floor(objMiddle + lx - objWidth / 2);
          if (
            objColumn >= 0 &&
            objColumn < canvas.width &&
            objSky + ly >= 0 &&
            objSky + ly < canvas.height
          ) {
            if (c !== " " && this.depthBuffer[objColumn] >= distToPlayer) {
              canvas.Draw(objColumn, objSky + ly, c);
              this.depthBuffer[objColumn] = distToPlayer;
            }
          }
        }
      }
    }
  }
}
