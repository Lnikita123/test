// chessStore.ts
import { create } from "zustand";

export type ToolType = "arrow" | "line" | "brush" | "delete" | "screen" | null;

export type ArrowLineType = {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  head?:
    | {
        a: { x: number; y: number };
        b: { x: number; y: number };
        c: { x: number; y: number };
      }
    | undefined;
};
export type Iposition = {
  position: [
    {
      pieces: [
        {
          location: { type: String };
          pieceName: { type: String };
        }
      ];
      arrows: [
        {
          start: { type: Object };
          end: { type: Object };
          color: { type: String };
        }
      ];
      lines: [
        {
          start: { type: Object };
          end: { type: Object };
          color: { type: String };
        }
      ];
      brush: [
        {
          position: { type: String };
          color: { type: String };
        }
      ];
      screen: [
        {
          position: { type: String };
          color: { type: String };
          animate: { type: Boolean };
        }
      ];
    }
  ];
};
export type ChessStore = {
  selectedSquare: string;
  board: Array<Array<any>>;
  startPos: { x: number; y: number } | null;
  fenString: string;
  arrows: Array<ArrowLineType>;
  isShapesClicked: boolean;
  isPiecesClicked: boolean;
  togglePieces: string;
  tool: ToolType;
  lines: Array<ArrowLineType>;
  color: string;
  positionZ: Iposition[];
  setPositionZ: (position: Iposition[]) => void;
  setColor: (value: string) => void;
  setSelectedSquare: (value: string) => void;
  setBoard: (value: Array<Array<any>>) => void;
  setStartPos: (value: { x: number; y: number } | null) => void;
  setFenString: (value: string) => void;
  setArrows: (value: Array<ArrowLineType>) => void;
  setIsShapesClicked: (value: boolean) => void;
  setIsPiecesClicked: (value: boolean) => void;
  setTogglePieces: (value: string) => void;
  setTool: (value: ToolType) => void;
  setLines: (value: Array<ArrowLineType>) => void;
};

export const useInteraction = create<ChessStore>((set) => ({
  positionZ: [],
  setPositionZ: (positionZ: Iposition[]) => set({ positionZ }),
  selectedSquare: "",
  board: Array(8)
    .fill(null)
    .map(() => Array(8).fill(null)),
  startPos: null,
  fenString: "",
  arrows: [],
  isShapesClicked: false,
  isPiecesClicked: true,
  togglePieces: "",
  tool: null,
  lines: [],
  color: "black",
  setColor: (value) => set({ color: value }),
  setSelectedSquare: (value) => set({ selectedSquare: value }),
  setBoard: (value) => set({ board: value }),
  setStartPos: (value) => set({ startPos: value }),
  setFenString: (value) => set({ fenString: value }),
  setArrows: (value) => set({ arrows: value }),
  setIsShapesClicked: (value) => set({ isShapesClicked: value }),
  setIsPiecesClicked: (value) => set({ isPiecesClicked: value }),
  setTogglePieces: (value) => set({ togglePieces: value }),
  setTool: (value) => set({ tool: value }),
  setLines: (value) => set({ lines: value }),
}));
