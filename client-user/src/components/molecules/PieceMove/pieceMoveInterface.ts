import { MutableRefObject } from "react";
import Chess from "chess.js";
export type TPieceMove = {
  calculateWidth: (width: number, height: number) => void;
  fenString: string;
  pieceMove: GameData[];
  showResult: boolean;
  setCorrect: (value: boolean) => void;
  setWrong: (value: boolean) => void;
  setProceedInteraction: (value: boolean) => void;
  setHint: (value: boolean) => void;
  reveal: boolean;
  setReveal: (reveal: boolean) => void;
  onClickReveal: () => void;
  pageId: string;
};
export type ChessInstanceRef = MutableRefObject<Chess.ChessInstance | null>;
export type Move = {
  color: "w" | "b";
  piece: "b" | "r" | "n" | "k" | "q" | "p";
  from: string;
  to: string;
  flags: string;
  san: string;
};

export type GameData = {
  user: Move;
  system: Move;
  _id: string;
};
// export const calcWidth = ({ screenWidth, screenHeight }: any) => {
//   if (screenWidth < 1024) {
//     return Math.max(screenHeight, screenWidth) / 2;
//   } else if (screenWidth >= 1024 && screenWidth < 1280) {
//     return screenWidth / 2;
//   } else if (screenWidth >= 1280 && screenWidth < 1350) {
//     return screenWidth / 2;
//   } else if (screenWidth >= 1350 && screenWidth < 1700) {
//     return screenWidth / 2.5;
//   } else if (screenWidth >= 1700) {
//     return screenWidth / 2;
//   } else {
//     return screenWidth / 2;
//   }
// };
export const calcWidth = ({ screenWidth, screenHeight }: any) => {
  let size = screenWidth / 2;

  if (size > screenHeight) {
    size = screenHeight - screenHeight * 0.125;
  }

  return size;
};
