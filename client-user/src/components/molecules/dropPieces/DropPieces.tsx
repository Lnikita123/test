import React, { useEffect, useRef, useState } from "react";
import ChessSquare from "./ChessSquare";
import ChessPiece from "./ChessPieces";
import { styleShadow } from "@/store/useCustomizedPieces";
import { calcWidth } from "../PieceMove/pieceMoveInterface";
import { correctSound, incorrectSound } from "@/helpers/playComputer";
import { getChessImageSrcDrop } from "@/store/ChessElements";
const DropPieces = ({
  calculateWidth,
  dropPieces,
  setProceedInteraction,
  setCorrect,
  setWrong,
  showResult,
  setHint,
  proceedTrigger,
  reveal,
}: {
  calculateWidth: (width: number, height: number) => void;
  dropPieces: any;
  setProceedInteraction: (value: boolean) => void;
  setCorrect: (value: boolean) => void;
  setWrong: (value: boolean) => void;
  showResult: boolean;
  setHint: (value: boolean) => void;
  proceedTrigger: () => void;
  reveal: boolean;
}) => {
  const chessboardRef = useRef<HTMLDivElement | null>(null);
  function proceedActivate() {
    proceedTrigger();
  }
  console.log("drop", dropPieces);
  const [board, setBoard] = useState<Array<Array<any>>>(
    Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
  );
  const handlePieceDrop = ({ toRow, toCol, item }: any) => {
    const dropPiece = dropPieces.find(
      (piece: any) =>
        piece.location === `${String.fromCharCode(97 + toCol)}${8 - toRow}`
    );
    const { fromRow, fromCol } = item;

    if (dropPiece && dropPiece?.isChecked) {
      // Correctly placed piece
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[toRow][toCol] = {
          ...item.piece,
          backgroundColor: "#4CAF50",
        };
        return newBoard;
      });
      setCorrect(true);
      correctSound();
      setWrong(false);
      setHint(false);
      setProceedInteraction(true);
      proceedActivate();
    } else {
      incorrectSound();
      setCorrect(false);
      setWrong(true);
      setHint(false);
      setProceedInteraction(false);
      // Incorrectly placed piece
      // Revert the piece back to the dragged zone with transition
      if (fromRow !== undefined && board[fromRow]) {
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          newBoard[fromRow][fromCol] = {
            ...item.piece,
            //transition: "all 0.3s ease-in-out", // Add transition class
          };
          return newBoard;
        });
        // Delay clearing the dragged piece to allow the transition effect to complete
        setTimeout(() => {
          setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            newBoard[fromRow][fromCol] = null;
            return newBoard;
          });
        }, 300);
      }
    }
  };
  useEffect(() => {
    if (reveal) {
      // Copy the current board state
      const newBoard = [...board];

      // Iterate over dropPieces
      dropPieces?.forEach((dropPiece: any) => {
        if (dropPiece?.isChecked) {
          // Convert the location to row and col indices
          const toCol = dropPiece.location.charCodeAt(0) - "a".charCodeAt(0);
          const toRow = 8 - parseInt(dropPiece.location[1]);

          // Place the piece in the correct location with transition
          newBoard[toRow][toCol] = {
            ...getChessImageSrcDrop(dropPiece.imageName),
            backgroundColor: "#4CAF50",
            //transition: "all 0.3s ease-in-out",
          };
        }
      });
      // Update the board state
      setBoard(newBoard);
    }
  }, [reveal]);

  const [boardSize, setBoardSize] = useState<number>(0);
  const [responsiveScreen, setResponsiveScreen] = useState({
    height: "0",
    width: "0",
  });
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const chessBoardWidth = calcWidth({ screenWidth, screenHeight });

      setBoardSize(chessBoardWidth);

      const cellWidth = chessBoardWidth / 8;
      const cellSize = `${cellWidth}px`;

      setResponsiveScreen({ height: cellSize, width: cellSize });
      const rectWidth = chessboardRef.current?.getBoundingClientRect().width;
      let calculateRestSize: number = 0;
      if (chessBoardWidth) {
        calculateRestSize = window.innerWidth - chessBoardWidth;
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
  return (
    <>
      <div className="m-3 w-max h-max flex">
        <div
          ref={chessboardRef}
          className="grid grid-cols-8 border border-1 border-black shadow-xl"
          style={styleShadow}
        >
          {board ? (
            board.map((row, rowIndex) =>
              row.map((piece: any, colIndex: number) => (
                <ChessSquare
                  responsiveScreen={responsiveScreen}
                  key={`${rowIndex}-${colIndex}`}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  onPieceDrop={handlePieceDrop}
                  board={board}
                  reveal={reveal}
                >
                  {piece && (
                    <ChessPiece
                      piece={piece}
                      rowIndex={rowIndex}
                      colIndex={colIndex}
                    />
                  )}
                </ChessSquare>
              ))
            )
          ) : (
            <p>loading....</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DropPieces;
