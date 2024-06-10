import Wpawn from "../components/assets/Wpawn.svg";
import Bpawn from "../components/assets/Bpawn.svg";
import Wrook from "../components/assets/Wrook.svg";
import Brook from "../components/assets/Brook.svg";
import Wknight from "../components/assets/Wknight.svg";
import Bknight from "../components/assets/Bknight.svg";
import Wbishop from "../components/assets/Wbishop.svg";
import Bbishop from "../components/assets/Bbishop.svg";
import Wqueen from "../components/assets/Wqueen.svg";
import Bqueen from "../components/assets/Bqueen.svg";
import Wking from "../components/assets/Wking.svg";
import Bking from "../components/assets/Bking.svg";
import { StaticImageData } from "next/image";
export interface ImageData {
  id: number;
  src: StaticImageData;
  name: string;
  notation?: string;
}

export const ChessElements: ImageData[] = [
  {
    id: 1,
    src: Wpawn,
    name: "White Pawn",
    notation: "P",
  },
  {
    id: 2,
    src: Bpawn,
    name: "Black Pawn",
    notation: "p",
  },
  {
    id: 3,
    src: Wrook,
    name: "White Rook",
    notation: "R",
  },
  {
    id: 4,
    src: Brook,
    name: "Black Rook",
    notation: "r",
  },

  {
    id: 5,
    src: Wknight,
    name: "White Knight",
    notation: "N",
  },

  {
    id: 6,
    src: Bknight,
    name: "Black Knight",
    notation: "n",
  },

  {
    id: 7,
    src: Wbishop,
    name: "White Bishop",
    notation: "B",
  },

  {
    id: 8,
    src: Bbishop,
    name: "Black Bishop",
    notation: "b",
  },

  {
    id: 9,
    src: Wqueen,
    name: "White Queen",
    notation: "Q",
  },

  {
    id: 10,
    src: Bqueen,
    name: "Black Queen",
    notation: "q",
  },

  {
    id: 11,
    src: Wking,
    name: "White King",
    notation: "K",
  },

  {
    id: 12,
    src: Bking,
    name: "Black King",
    notation: "k",
  },
];
export const getChessImageSrc = (name: string) => {
  return ChessElements?.filter((e) => e.name === name)?.[0]?.src.src || "";
};
export const getChessImageSrcDrop = (name: string) => {
  return ChessElements?.filter((e) => e.name === name)?.[0]?.src || "";
};

export const getChessNotation = (name: string) => {
  return ChessElements?.filter((e) => e.name === name)?.[0]?.notation || "";
};
export const getChessImageNotation = (notation: string) => {
  return (
    ChessElements?.filter((e) => e.notation === notation)?.[0]?.src.src || ""
  );
};
export const getNameFromNotation = (notation: string) => {
  return ChessElements?.filter((e) => e.notation === notation)?.[0]?.name || "";
};
export const getChessObjectByNotation = (
  notation: string
): ImageData | undefined => {
  return ChessElements.find((e) => e.notation === notation);
};
export function getChessNotationByObject(piece: ImageData | null): string {
  if (!piece) {
    return "";
  }

  const { name } = piece;

  return getChessNotation(name);
}
