import { create } from "zustand";
import { ChessInstance } from "chess.js";
import React from "react";
type Square = string;
type HumanVsHumanState = {
  fen: string;
  dropSquareStyle: Record<string, any>;
  squareStyles: Record<string, any>;
  pieceSquare: Square | string | any;
  history: any[];
};
type HumanVsHumanRest = {
  gameRef: React.MutableRefObject<ChessInstance | null>;
  setGameRef: (gameRef: React.MutableRefObject<ChessInstance | null>) => void;
  reset: boolean;
  setReset: (reset: boolean) => void;
  resetState: () => void;
  setBoardState: (state: HumanVsHumanState) => void;
};
type HumanVsHumanStore = HumanVsHumanState & HumanVsHumanRest;

const useGameStore = create<HumanVsHumanStore>((set) => ({
  fen: "start",
  dropSquareStyle: {},
  squareStyles: {},
  pieceSquare: "",
  history: [],
  gameRef: React.createRef<ChessInstance>(),
  setGameRef: (gameRef) => set(() => ({ gameRef })),
  reset: false,
  setReset: (reset: boolean) => set((state) => ({ ...state, reset })),
  resetState: () =>
    set(() => ({
      fen: "start",
      dropSquareStyle: {},
      squareStyles: {},
      pieceSquare: "",
      history: [],
      reset: false,
    })),
  setBoardState: (state: HumanVsHumanState) =>
    set(() => ({ ...state, reset: false })),
}));
export type { HumanVsHumanState, HumanVsHumanStore };
export { useGameStore };
