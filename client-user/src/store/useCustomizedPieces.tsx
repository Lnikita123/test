import Image from "next/image";
import Wpawn from "@/components/assets/Wpawn.svg";
import Bpawn from "@/components/assets/Bpawn.svg";
import Wrook from "@/components/assets/Wrook.svg";
import Brook from "@/components/assets/Brook.svg";
import Wknight from "@/components/assets/Wknight.svg";
import Bknight from "@/components/assets/Bknight.svg";
import Wbishop from "@/components/assets/Wbishop.svg";
import Bbishop from "@/components/assets/Bbishop.svg";
import Wqueen from "@/components/assets/Wqueen.svg";
import Bqueen from "@/components/assets/Bqueen.svg";
import Wking from "@/components/assets/Wking.svg";
import Bking from "@/components/assets/Bking.svg";
import { useEffect, useState } from "react";
import { calcWidth } from "@/components/molecules/PieceMove/pieceMoveInterface";

export const customizedPieces = {
  wK: () => <Image src={Wking} alt={"Wking"} height={60} width={60} />,
  bK: () => <Image src={Bking} alt={"Bking"} height={60} width={60} />,
  wR: () => <Image src={Wrook} alt={"Wrook"} height={60} width={60} />,
  bR: () => <Image src={Brook} alt={"Brook"} height={60} width={60} />,
  wN: () => <Image src={Wknight} alt={"Wknight"} height={60} width={60} />,
  bN: () => <Image src={Bknight} alt={"Bknight"} height={60} width={60} />,
  wP: () => <Image src={Wpawn} alt={"Wpawn"} height={60} width={60} />,
  bP: () => <Image src={Bpawn} alt={"Bpawn"} height={60} width={60} />,
  wQ: () => <Image src={Wqueen} alt={"Wqueen"} height={60} width={60} />,
  bQ: () => <Image src={Bqueen} alt={"Bqueen"} height={60} width={60} />,
  wB: () => <Image src={Wbishop} alt={"Wbishop"} height={60} width={60} />,
  bB: () => <Image src={Bbishop} alt={"Bbishop"} height={60} width={60} />,
};
//using png

export const customizedPieces2 = () => {
  let initialWidth = 0;
  let initialHeight = 0;
  if (typeof window !== "undefined") {
    initialWidth = window.innerWidth;
    initialHeight = window.innerHeight;
  }
  const [boardSize, setBoardSize] = useState(
    calcWidth({ screenWidth: initialWidth, screenHeight: initialHeight })
  );
  const [pieceWidth, setPieceWidth] = useState<number>(() =>
    parseFloat(window.sessionStorage.getItem("pieceWidth") || "0")
  );
  useEffect(() => {
    const handleResize = () => {
      setBoardSize(
        calcWidth({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
        })
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const cellWidth = boardSize / 8;
    const newPieceWidth = cellWidth * 0.7;
    setPieceWidth(newPieceWidth);
    window.sessionStorage.setItem("pieceWidth", newPieceWidth.toString());
  }, [boardSize]);

  return {
    wK: () => (
      <img
        src="/Wking.png"
        alt={"Wking"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    bK: () => (
      <img
        src="/Bking.png"
        alt={"Bking"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    wR: () => (
      <img
        src="/Wrook.png"
        alt={"Wrook"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    bR: () => (
      <img
        src="/Brook.png"
        alt={"Brook"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    wN: () => (
      <img
        src="/Wknight.png"
        alt={"Wknight"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    bN: () => (
      <img
        src="/Bknight.png"
        alt={"Bknight"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    wP: () => (
      <img
        src="/Wpawn.png"
        alt={"Wpawn"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    bP: () => (
      <img
        src="/Bpawn.png"
        alt={"Bpawn"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    wQ: () => (
      <img
        src="/Wqueen.png"
        alt={"Wqueen"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    bQ: () => (
      <img
        src="/Bqueen.png"
        alt={"Bqueen"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    wB: () => (
      <img
        src="/Wbishop.png"
        alt={"Wbishop"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
    bB: () => (
      <img
        src="/Bbishop.png"
        alt={"Bbishop"}
        height={pieceWidth}
        width={pieceWidth}
      />
    ),
  };
};
export const darkSquareStyle = {
  backgroundColor: "#C4BEE9",
  border: "1px solid white",
  fontSize: "1px",
};
export const lightSquareStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid white",
  fontSize: "1px",
};
export const styleShadow = {
  boxShadow:
    "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(18.5px)",
};
export type ISquareStyle = {
  [cell: string]: React.CSSProperties;
};
export const squareStyles: ISquareStyle = {};
const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

files.forEach((file) => {
  ranks.forEach((rank) => {
    const cell = `${file}${rank}`;
    squareStyles[cell] = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "black",
    };
  });
});
export const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  placeContent: "center",
  color: "black",
};
export const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  rowGap: "10px",
  columnGap: "50px",
  justifyContent: "space-between",
};
