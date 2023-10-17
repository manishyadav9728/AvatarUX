import * as PIXI from "pixi.js";
import { View } from "./View";

const load = (app: PIXI.Application) => {
  return new Promise<void>((resolve) => {
    app.loader.add("spritesheetJson", "spritesheet.json").load(() => {
      resolve();
    });
  });
};

const main = async () => {
  let app = new PIXI.Application();
  globalThis.__PIXI_APP__ = app;

  await load(app);
  document.body.appendChild(app.view);

  var scene = new View(app);
};

main();
