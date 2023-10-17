import * as PIXI from "pixi.js";
import { TimelineLite, gsap } from "gsap/gsap-core";
import { BetWayWin } from "./Data";
export class Win extends PIXI.Container {
  private winContainer: PIXI.Container = new PIXI.Container();
  constructor(app: PIXI.Application) {
    super();
    app.stage.addChild(this.winContainer);
  }

  public showWinAmount(betWay: BetWayWin[]): void {
    const styleAmount = new PIXI.TextStyle({
      fontFamily: "sans-serif",
      fontSize: 70,
      fontWeight: "50",
      fill: "red",
    });
    const styleWays = new PIXI.TextStyle({
      fontFamily: "sans-serif",
      fontSize: 50,
      fontWeight: "50",
      fill: "white",
    });

    for (let i: number = 0; i < betWay.length; i++) {
      const container: PIXI.Container = new PIXI.Container();
      const winAmount: PIXI.Text = new PIXI.Text(
        betWay[i].amount + "",
        styleAmount
      );
      const ways: PIXI.Text = new PIXI.Text(
        betWay[i].noOfCombination + "Way",
        styleWays
      );
      container.alpha = 0;
      winAmount.position.set(250, 100);
      ways.position.set(250, 170);
      container.addChild(winAmount, ways);
      this.winContainer.addChild(container);
    }
  }

  public playWinToggle(): void {
    const mainTl = new TimelineLite({ repeat: -1 });
    for (let i: number = 0; i < this.winContainer.children.length; i++) {
      const tl: TimelineLite = new TimelineLite();
      tl.to(this.winContainer.children[i], { alpha: 1, duration: 0.1 }, i * 1);

      tl.to(this.winContainer.children[i], { alpha: 0, duration: 0.5 }, 2);
      mainTl.add(tl);
    }
  }

  public removeWinAmount(): void {
    this.winContainer.removeChildren();
  }
}
