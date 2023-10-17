import { TimelineLite, gsap } from "gsap/gsap-core";
import { View } from "./View";
import { Reels } from "./Reels";
export interface BetWayWin {
  symbolName: string;
  reelWinPosition: boolean[][];
  amount: number;
  noOfCombination: number;
  symLength: number;
}

export class Data {
  public static stop: boolean[] = [false, false, false, false, false];
  public data: any = this.gameData();
  private newReel: string[][];
  private newWinPosition: any;
  private static REELS: string[] = [
    "9",
    "J",
    "A",
    "M1",
    "M2",
    "M3",
    "M4",
    "M5",
    "K",
    "Q",
    "10",
    "M6",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
  ];

  private static symbolValues = {
    "9": { 3: 1, 4: 2, 5: 3 },
    "10": { 3: 2, 4: 3, 5: 4 },
    J: { 3: 5, 4: 6, 5: 7 },
    Q: { 3: 8, 4: 8, 5: 30 },
    K: { 3: 9, 4: 21, 5: 31 },
    A: { 3: 10, 4: 22, 5: 32 },
    H1: { 3: 11, 4: 23, 5: 33 },
    H2: { 3: 12, 4: 24, 5: 34 },
    H3: { 3: 13, 4: 25, 5: 35 },
    H4: { 3: 14, 4: 26, 5: 36 },
    H5: { 3: 14, 4: 27, 5: 37 },
    M1: { 3: 15, 4: 28, 5: 38 },
    M2: { 3: 16, 4: 29, 5: 39 },
    M3: { 3: 17, 4: 25, 5: 30 },
    M4: { 3: 18, 4: 30, 5: 40 },
    M5: { 3: 19, 4: 31, 5: 41 },
    M6: { 3: 20, 4: 32, 5: 42 },
  };

  constructor() {}

  public getNoWinGameData(): any {
    return {
      reels: [
        ["9", "J", "A"],
        ["H1", "H2", "H3"],
        ["M1", "M2", "M3"],
        ["A", "K", "10"],
        ["M6", "Q", "M1"],
      ],
    };
  }
  private getAmount(
    symbolName: string,
    winLength: number,
    noOfCombination: number
  ): number {
    return Data.symbolValues[symbolName][winLength] * noOfCombination;
  }
  public hitServer(): void {
    this.newReel = this.getReels();
    this.newWinPosition = this.winPositions();
  }

  public stopReel(reelId: number): boolean {
    const tl: TimelineLite = new TimelineLite();
    tl.add(() => {
      Data.stop[reelId] = true;
    }, 1);
    tl.add(() => {
      Data.stop[reelId] = false;
    }, 1.1);
    return Data.stop[reelId];
  }

  public gameData(): any {
    return {
      reels: this.newReel,
      betWay: this.newWinPosition,
    };
  }
  private getReels(): string[][] {
    let reels: string[][] = [];
    for (let reelId: number = 0; reelId < 5; reelId++) {
      reels.push(this.getReelData());
    }
    // reels = [
    //   ["A", "J", "A"],
    //   ["A", "J", "H1"],
    //   ["A", "J", "Q"],
    //   ["9", "10", "K"],
    //   ["A", "M5", "M4"],
    // ];

    return reels;
  }
  private getReelData(): string[] {
    let reel: string[] = [];
    for (let rowId: number = 0; rowId < 3; rowId++) {
      reel.push(this.getSymbolName());
    }
    return reel;
  }

  private getSymbolName(): string {
    const randomIndex: number = Math.floor(Math.random() * 16);
    return Data.REELS[randomIndex];
  }

  private calculateWinLength(): any {
    let winData: number[] = [];
    const reels: string[][] = this.newReel;
    for (let rowId: number = 0; rowId < 3; rowId++) {
      let winLength: number = 1;
      for (let reelId: number = 1; reelId < 5; reelId++) {
        if (reels[reelId].indexOf(reels[0][rowId]) > -1) {
          winLength++;
        } else {
          break;
        }
      }

      winData.push(winLength);
    }
    return winData;
  }

  private winPositions(): any {
    const winLength: number[] = this.calculateWinLength();
    const reelData: string[][] = this.newReel;
    let betWayWinData: BetWayWin[] = [];
    for (let rowId: number = 0; rowId < winLength.length; rowId++) {
      if (winLength[rowId] > 2) {
        if (rowId === 1) {
          if (reelData[0][rowId] !== reelData[0][0]) {
            const combination: number = this.calculateCombination(
              reelData,
              reelData[0][rowId],
              winLength[rowId]
            );
            let temp = {
              symbolName: reelData[0][rowId],
              reelWinPosition: this.calculateWinPositions(
                reelData[0][rowId],
                winLength[rowId]
              ),
              amount: this.getAmount(
                reelData[0][rowId],
                winLength[rowId],
                combination
              ),
              noOfCombination: combination,
              symLength: winLength[rowId],
            };
            betWayWinData.push(temp);
          }
        } else if (rowId === 2) {
          if (
            reelData[0][rowId] !== reelData[0][0] &&
            reelData[0][rowId] !== reelData[0][1]
          ) {
            const combination: number = this.calculateCombination(
              reelData,
              reelData[0][rowId],
              winLength[rowId]
            );
            let temp = {
              symbolName: reelData[0][rowId],
              reelWinPosition: this.calculateWinPositions(
                reelData[0][rowId],
                winLength[rowId]
              ),
              amount: this.getAmount(
                reelData[0][rowId],
                winLength[rowId],
                combination
              ),
              noOfCombination: combination,
              symLength: winLength[rowId],
            };
            betWayWinData.push(temp);
          }
        } else {
          const combination: number = this.calculateCombination(
            reelData,
            reelData[0][rowId],
            winLength[rowId]
          );
          let temp = {
            symbolName: reelData[0][rowId],
            reelWinPosition: this.calculateWinPositions(
              reelData[0][rowId],
              winLength[rowId]
            ),
            amount: this.getAmount(
              reelData[0][rowId],
              winLength[rowId],
              combination
            ),
            noOfCombination: combination,
            symLength: winLength[rowId],
          };
          betWayWinData.push(temp);
        }
      }
    }
    return betWayWinData;
  }

  private calculateWinPositions(
    symbolName: string,
    winLength: number
  ): boolean[][] {
    let winPos: boolean[][] = [];
    const reelData: string[][] = this.newReel;

    for (let reelId: number = 0; reelId < Reels.noOfReels; reelId++) {
      winPos.push([]);
      for (let rowId: number = 0; rowId < Reels.noOfRows; rowId++) {
        if (reelId < winLength) {
          if (reelData[reelId][rowId] === symbolName) {
            winPos[reelId].push(true);
          } else {
            winPos[reelId].push(false);
          }
        } else {
          winPos[reelId].push(false);
        }
      }
    }
    return winPos;
  }

  private calculateCombination(
    reelData: string[][],
    symbolName: string,
    length: number
  ): number {
    let combination: number = 1;
    for (let reelId: number = 0; reelId < length; reelId++) {
      let count: number = 0;
      for (let rowId: number = 0; rowId < Reels.noOfRows; rowId++) {
        if (reelData[reelId][rowId] === symbolName) {
          count++;
        }
      }
      combination = combination * count;
    }
    return combination;
  }
}
