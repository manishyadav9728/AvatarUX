import * as PIXI from "pixi.js";
import { BetWayWin, Data } from "./Data";
import { TimelineLite, gsap } from "gsap/gsap-core";
import { View } from "./View";
export interface WinSymbol {
  symName: string;
  symLength: number;
}
export class Reels extends PIXI.Container {
  public static reels: PIXI.Container[] = [];
  private mainContainer: PIXI.Container = new PIXI.Container();
  public static noOfReels: number = 5;
  public static noOfRows: number = 3;
  public static symbolWidth: number = 100;
  public static symbolHeight: number = 100;
  public static stepSize: number = 100;
  public spinButton: PIXI.Sprite;
  private app: PIXI.Application;
  constructor(app: PIXI.Application) {
    super();
    this.name = "Reels";
    this.app = app;
    this.app.stage.addChild(this.mainContainer);
    let mask = new PIXI.Graphics();
    mask.beginFill(0xffffb);
    mask.drawRect(0, 0, 500, 300);
    mask.beginFill();
    this.mainContainer.addChild(mask);
    this.mainContainer.mask = mask;
  }
  public createReels(): void {
    for (let reelId: number = 0; reelId < Reels.noOfReels; reelId++) {
      let reel: PIXI.Container = new PIXI.Container();
      reel.position.set(Reels.symbolWidth * reelId, 0);
      this.mainContainer.addChild(reel);
      Reels.reels.push(reel);
      this.createRows(reelId);
    }
  }

  public getSymbol(reelId: number, rowId: number): any {
    return Reels.reels[reelId].children[rowId];
  }
  public createSymbol(app: PIXI.Application, symbolName: string): PIXI.Sprite {
    return new PIXI.Sprite(
      app.loader.resources.spritesheetJson.spritesheet?.textures[
        `${symbolName}.png`
      ]
    );
  }
  public createRows(reelId: number): void {
    let data = new Data().getNoWinGameData();
    for (let rowId: number = 0; rowId < Reels.noOfRows; rowId++) {
      let symbolName: string = data.reels[reelId][rowId];
      let symbol: PIXI.Sprite = this.createSymbol(this.app, symbolName);
      symbol.scale.set(0.5);

      Reels.reels[reelId].addChild(symbol);
      symbol.position.set(0, Reels.symbolHeight * rowId);
    }
  }

  public updateReels(reelId: number): void {
    const reelData: string[][] = View.Data.gameData().reels;
    const winData = this.updateWinSymbols();
    for (let rowId: number = 0; rowId < Reels.noOfRows; rowId++) {
      let updatedSymbol = this.createSymbol(this.app, reelData[reelId][rowId]);

      let prevSymbol = this.getSymbol(reelId, rowId);
      prevSymbol.texture = updatedSymbol.texture;
    }
    for (let i: number = 0; i < winData.length; i++) {
      if (reelData[reelId].indexOf(winData[i].symName) > -1) {
        for (let rowId: number = 0; rowId < Reels.noOfRows; rowId++) {
          if (
            reelData[reelId][rowId] === winData[i].symName &&
            reelId < winData[i].symLength
          ) {
            let updatedSymbol = this.createSymbol(
              this.app,
              `${reelData[reelId][rowId]}_connect`
            );

            let prevSymbol = this.getSymbol(reelId, rowId);
            prevSymbol.texture = updatedSymbol.texture;
          }
        }
      }
    }
  }
  private updateWinSymbols(): any {
    // debugger;
    const winData: BetWayWin[] = View.Data.gameData().betWay;
    let winSymbols: WinSymbol[] = [];
    for (let i: number = 0; i < winData.length; i++) {
      let temp = {
        symName: winData[i].symbolName,
        symLength: winData[i].symLength,
      };
      winSymbols.push(temp);
    }
    return winSymbols;
  }
}
