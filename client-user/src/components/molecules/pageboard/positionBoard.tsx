import { getChessImageNotation, getChessImageSrc } from "@/store/ChessElements";
import React, { useRef, useState, useEffect } from "react";
import { responsiveStyle } from "./topSection";
import Image from "next/image";
import { styleShadow } from "@/store/useCustomizedPieces";
import { calcWidth } from "../PieceMove/pieceMoveInterface";

let width = 0;
export const responsiveScreen = {
  height: "10vh",
  width:
    width >= 1280 && width < 1536 // lg breakpoint
      ? "5.3vw"
      : width >= 1536 && width < 1920 // xl breakpoint
      ? "5.25vw"
      : width >= 1920 // 2xl breakpoint
      ? "5.25vw"
      : "5.3vw", // For smaller sizes
};
type PositionBoardProps = {
  calculateWidth: (width: number, height: number) => void;
  positions: {};
  pieces: { location: string; pieceName: string }[];
  arrowPercentages: any[];
  linePercentages: any[];
  brush: any[];
  screen: any[];
  fenString: string;
};

const PositionBoard = ({
  calculateWidth,
  pieces,
  arrowPercentages,
  linePercentages,
  brush,
  screen,
  fenString,
}: PositionBoardProps) => {
  const canvasRef = useRef<any>(null);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const lightSquareColor = "bg-white";
  const darkSquareColor = "bg-[#C4BEE9]";
  // const lightBorderColor = "border-gray-500";
  // const darkBorderColor = "border-gray-500 opacity-50";
  const lightBorderColor = "";
  const darkBorderColor = "";
  const [boardSize, setBoardSize] = useState<number>(0);
  const [responsiveScreen, setResponsiveScreen] = useState({
    height: "0",
    width: "0",
  });
  const [pieceWidth, setPieceWidth] = useState<number>(0);
  const textColor = "text-black";
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const chessBoardWidth = calcWidth({ screenWidth, screenHeight });

      setBoardSize(chessBoardWidth);
      const cellWidth = chessBoardWidth / 8;
      const pieceWidth = cellWidth * 0.7;
      setPieceWidth(pieceWidth);
      const cellSize = `${cellWidth}px`;

      setResponsiveScreen({ height: cellSize, width: cellSize });

      const rectWidth = chessboardRef.current?.getBoundingClientRect().width;
      let calculateRestSize: number = 0;
      if (rectWidth) {
        calculateRestSize = window.innerWidth - rectWidth;
      }
      if (calculateRestSize > 0) {
        calculateWidth(calculateRestSize, chessBoardWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);
    handleResize();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, [boardSize]);

  const board = Array.from({ length: 8 }, (_, rowIndex) =>
    Array(8)
      .fill({ color: "", piece: "" })
      .map((cell, colIndex) => {
        if ((rowIndex + colIndex) % 2 === 0) {
          return {
            ...cell,
            color: lightSquareColor,
            border: lightBorderColor,
          };
        } else {
          return {
            ...cell,
            color: darkSquareColor,
            border: darkBorderColor,
          };
        }
      })
  );
  const [chessBoard, setChessBoard] = useState(board);
  const colorToTailwind: any = {
    red: "bg-[#F44336]",
    blue: "bg-blue-700",
    green: "bg-[#4CAF50]",
    yellow: "bg-[#F1D070]",
    black: "bg-black",
    pink: "bg-pink-300",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const chessboard = chessboardRef.current;
    const chessboardRect: DOMRect | undefined =
      chessboard?.getBoundingClientRect();
    canvas.width = chessboardRect?.width;
    canvas.height = chessboardRect?.height;

    arrowPercentages?.forEach((arrow) => {
      const startX = (arrow.start.x * canvas.width) / 100;
      const startY = (arrow.start.y * canvas.height) / 100;
      const endX = (arrow.end.x * canvas.width) / 100;
      const endY = (arrow.end.y * canvas.height) / 100;
      const headLength = 20;
      const angle = Math.atan2(endY - startY, endX - startX);

      // Calculate the coordinates of the arrowhead at the end of the line
      // const arrowEnd = {
      //   x: endX,
      //   y: endY,
      // };

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        endX - headLength * Math.cos(angle),
        endY - headLength * Math.sin(angle)
      );
      ctx.strokeStyle = arrow.color;
      ctx.lineWidth = 5;
      ctx.stroke();

      // Draw the arrowhead
      ctx.save();
      ctx.translate(
        endX - headLength * Math.cos(angle),
        endY - headLength * Math.sin(angle)
      );
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-headLength, headLength / 2);
      ctx.moveTo(0, 0);
      ctx.lineTo(-headLength, -headLength / 2);
      ctx.strokeStyle = arrow.color;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();
    });

    linePercentages?.forEach((line) => {
      const startX = (line.start.x * canvas.width) / 100;
      const startY = (line.start.y * canvas.height) / 100;
      const endX = (line.end.x * canvas.width) / 100;
      const endY = (line.end.y * canvas.height) / 100;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [arrowPercentages, linePercentages, fenString, brush, screen, pieces]);
  const renderRowNumber = (rowIndex: number, colIndex: number) => {
    if (colIndex === 0) {
      return (
        <div
          style={{ margin: "3px" }}
          className={`font-serif text-sm absolute top-0 left-0 ${textColor} `}
        >
          {8 - rowIndex}
        </div>
      );
    }
    return null;
  };

  const renderColumnLetter = (rowIndex: number, colIndex: number) => {
    if (rowIndex === 7) {
      return (
        <div
          style={{ margin: "3px" }}
          className={`font-serif text-sm absolute bottom-0 right-0 ${textColor} `}
        >
          {String.fromCharCode(97 + colIndex)}
        </div>
      );
    }
    return null;
  };
  useEffect(() => {
    prepareBoard();
  }, [fenString, brush, screen, pieces]);
  const prepareBoard = async () => {
    let updatedBoard = [...board];

    if (fenString) {
      updatedBoard = await parseFen(fenString); // assuming parseFen now returns the updated board
    }

    const newBoard = updatedBoard.map((row, i) =>
      row.map((cell, j) => {
        const position = `${String.fromCharCode(97 + j)}${8 - i}`;
        const brushSquare = brush?.find((b) => b.position === position);
        const screenSquare = screen?.find((s) => s.position === position);
        const piecesSquare = pieces?.find((p) => p.location === position);

        let colorClassName;
        let animateClassName = "";

        if (brushSquare) {
          colorClassName = colorToTailwind[brushSquare.color];
        } else if (screenSquare) {
          colorClassName = colorToTailwind[screenSquare.color];
          animateClassName = screenSquare.animate ? " animate-pulse" : "";
        } else {
          colorClassName = cell?.color;
        }
        let piece;
        if (!fenString) {
          const piecesSquare = pieces?.find((p) => p.location === position);
          piece = piecesSquare
            ? getChessImageSrc(piecesSquare.pieceName)
            : cell?.piece;
        } else {
          piece = cell?.piece;
        }

        return {
          piece: piece,
          color: colorClassName + animateClassName,
        };
      })
    );
    setChessBoard(newBoard);
  };

  async function parseFen(fen: string) {
    const [fenData, _] = fen?.split(" ");
    const rows = fenData.split("/");
    const pieces = rows.map((row) =>
      row.replace(/[0-9]/g, (n) => " ".repeat(parseInt(n, 10))).split("")
    );

    const newBoard = [...board];

    pieces.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        let square: { color: string; piece?: string } = {
          color: (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-[#C4BEE9]",
        };

        if (piece !== " ") {
          square.piece = getChessImageNotation(piece);
        }

        newBoard[rowIndex][colIndex] = square;
      });
    });

    return newBoard;
  }

  return (
    <>
      <div className="flex justify-between m-3">
        <div className="w-max h-max relative">
          <div
            ref={chessboardRef}
            className="grid grid-cols-8 border border-1 border-black"
            style={styleShadow}
          >
            {chessBoard.map((row, rowIndex) =>
              row.map((square, colIndex) => (
                <div
                  style={responsiveScreen}
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative flex items-center justify-center ${square?.color}`}
                >
                  {renderRowNumber(rowIndex, colIndex)}
                  {renderColumnLetter(rowIndex, colIndex)}
                  {chessBoard[rowIndex][colIndex]?.piece && (
                    <Image
                      src={chessBoard[rowIndex][colIndex]?.piece}
                      alt=""
                      width={pieceWidth}
                      height={pieceWidth}
                      //className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))
            )}
          </div>
          <canvas ref={canvasRef} className="absolute top-0 left-0" />
        </div>
      </div>
    </>
  );
};

export default PositionBoard;
