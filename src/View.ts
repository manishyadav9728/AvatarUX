import { Application, Container, Sprite } from "pixi.js";

import * as PIXI from "pixi.js";
import { Data } from "./Data";
import { Reels } from "./Reels";

import { spinButton } from "./SpinButton";
import { Win } from "./Win";

export class View extends Container {
  public static Data: Data;
  public static reelView: Reels;
  public static winView: Win;

  private symbolWidth: number = 50;
  private symbolHeight: number = 100;

  constructor(app: Application) {
    super();
    this.name = "View";
    this.start(app);
  }

  private start(app: Application): void {
    View.reelView = new Reels(app);
    View.Data = new Data();
    View.winView = new Win(app);
    let button: spinButton = new spinButton();
    View.reelView.createReels();
    button.createSpinButton(app);
  }
}
