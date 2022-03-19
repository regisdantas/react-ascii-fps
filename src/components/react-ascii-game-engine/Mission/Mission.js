import { defaultConsts } from "../Constants";
import Map from "./Map/Map";
import Enemy from "../GameEntity/Enemy/Enemy";
import Sprite from "../Sprite/Sprite";
import GameEntity from "../GameEntity/GameEntity";

export default class Mission {
  constructor() {
    this.map = new Map(["#####", "#   #", "#   #", "#   #", "#####"]);
    this.entities = [];
  }

  async LoadMission(missionFile) {
    let file = await fetch(missionFile);
    let jsondata = await file.json();
    this.map = new Map(jsondata.map);
    this.sky = new Sprite(jsondata.sky);
    jsondata.entities.map((entDesc) => {
      const references = this.map.FindID(entDesc.id);
      references.map((ref) => {
        switch (entDesc.type) {
          case "enemy":
            this.entities.push(
              new Enemy(ref.ex, ref.ey, entDesc.id, new Sprite(entDesc.sprite))
            );
            break;
          case "object": 
            this.entities.push(
              new GameEntity(ref.ex, ref.ey, new Sprite(entDesc.sprite))
            );
            break;
          default:
            break;
        }
      });
    });
  }

  setup(player) {
    player.x = 4;
    player.y = 4;
  }

  Draw(canvas, player) {
    this.DrawMiniMap(canvas, player, 2, 2);
  }

  PlayerColide(player, actions) {
    // actions: {dFrontBack, dSide, dAngl}
    let update = false;
    let newA = player.a + actions.dAngle * defaultConsts.defaultPlayerSpin;
    if (newA > 2 * Math.PI) {
      newA -= 2 * Math.PI;
    }
    if (newA < 0) {
      newA += 2 * Math.PI;
    }
    let newX =
      player.x +
      defaultConsts.defaultPlayerSpeed *
        (actions.dFrontBack * Math.cos(player.a) -
          actions.dSide * Math.sin(player.a));
    let newY =
      player.y +
      defaultConsts.defaultPlayerSpeed *
        (actions.dFrontBack * Math.sin(player.a) +
          actions.dSide * Math.cos(player.a));
    if (this.map.CheckColision(newY, newX) === true) {
      if (this.map.CheckColision(newY, player.x) === true) {
        newY = player.y;
        if (this.map.CheckColision(player.y, newX)) {
          newX = player.x;
        }
      } else {
        newX = player.x;
      }
    }
    if (player.x !== newX || player.y !== newY || player.a !== newA) {
      update = true;
    }
    player.Update(newX, newY, newA);
    return update;
  }

  EntitiesColide(engine, player) {
    let update = false;
    this.entities.map((entity1) => {
      this.entities.map((entity2) => {
        if (
          entity1 !== entity2 &&
          entity1.type !== entity2.type &&
          entity1.dead === false &&
          entity2.dead === false
        ) {
          if (engine.CheckObjColision(entity1, entity2)) {
            entity1.Kill();
            entity2.Kill();
            if (entity1.type === "enemy" || entity2.type === "enemy") {
              player.score += 100;
            }
            update = true;
          }
        }
      });
      if (
        entity1.type === "bullet" &&
        engine.CheckObjColision(entity1, player)
      ) {
        entity1.Kill();
        update = true;
      }
    });
    return update;
  }

  EntitiesProcess() {
    let update = false;
    this.entities = this.entities.filter((entity) => {
      update |= entity.FrameProcess(this.map);
      return entity.dead !== true;
    });
    return update;
  }

  Interact(engine, player, actions) {
    return (
      this.PlayerColide(player, actions) |
      this.EntitiesProcess() |
      this.EntitiesColide(engine, player)
    );
  }

  DrawMiniMap(canvas, player, posx, posy) {
    let pointerX = Math.floor(player.x + 3 * Math.cos(player.a));
    let pointerY = Math.floor(player.y + 3 * Math.sin(player.a));

    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        if (x === Math.floor(player.x) && y === Math.floor(player.y)) {
          canvas.Draw(x + posx, y + posy, "P");
        } else if (x === pointerX && y === pointerY) {
          canvas.Draw(x + posx, y + posy, "*");
        } else {
          let char = this.map.Sample(x, y);
          if (/^[a-z0-9]+$/i.test(char)) {
            char = " ";
          }
          canvas.Draw(x + posx, y + posy, char);
        }
      }
    }
    this.entities.map((obj) => {
      if (obj.type === "enemy")
        canvas.Draw(Math.floor(posx + obj.x), Math.floor(posy + obj.y), obj.id);
    });
  }
}
