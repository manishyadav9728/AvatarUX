import { Reels } from "./Reels";
import * as PIXI from "pixi.js";
import { TimelineLite, gsap } from "gsap/gsap-core";
import { Data } from "./Data";
import { View } from "./View";

export class spinButton extends PIXI.Container {
  private reels: Reels = View.reelView;
  private data: Data = new Data();
  private button: PIXI.Text;
  private nextSpin: boolean = false;
  constructor() {
    super();
  }

  public createSpinButton(app: PIXI.Application): void {
    const style = new PIXI.TextStyle({
      fontFamily: ["Helvetica", "Arial", "sans-serif"],
      fontSize: 100,
      fill: "green",
      stroke: "#272020",
      strokeThickness: 7,
    });
    this.button = new PIXI.Text("SPIN", style);
    this.button.interactive = true;
    this.button.scale.set(0.5);
    this.button.anchor.set(0.5);
    this.button.position.set(250, 350);
    this.button.on("pointerdown", this.spin);
    app.stage.addChild(this.button);
  }

  public spin = () => {
    View.Data.hitServer();
    this.button.interactive = false;
    if (this.nextSpin) {
      this.nextSpin = false;
      View.winView.removeWinAmount();
    }
    const tl: TimelineLite = new TimelineLite();
    for (let reel: number = 0; reel < Reels.noOfReels; reel++) {
      tl.add(() => {
        this.spinReels(Reels.reels[reel], reel);
      }, reel * 0.1);
    }
    tl.add(() => {
      if (View.Data.gameData().betWay.length > 0) {
        View.winView.showWinAmount(View.Data.gameData().betWay);
        View.winView.playWinToggle();
      }
      this.button.interactive = true;
      this.nextSpin = true;
    }, 2.5);
  };

  private spinReels = (reel: PIXI.Container, reelId: number) => {
    const tl: TimelineLite = new TimelineLite();

    for (let rowId: number = 2; rowId >= 0; rowId--) {
      tl.to(
        reel.children[rowId],
        {
          y: reel.children[rowId].y + Reels.stepSize,
          duration: 0.08,
        },
        0
      );
    }
    for (let rowId: number = 2; rowId >= 0; rowId--) {
      tl.add(() => {
        if (reel.children[rowId].y === 300) {
          reel.children[rowId].y = 0;
        }
      });
    }
    tl.add(() => {
      if (this.data.stopReel(reelId)) {
        this.reels.updateReels(reelId);
      } else {
        this.spinReels(reel, reelId);
      }
    });
  };
}
