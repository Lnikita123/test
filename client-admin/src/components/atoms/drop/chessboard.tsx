import {
  getChessImageNotation,
  getChessObjectByNotation,
} from "@/store/ChessElements";
import useDrop from "@/store/useDrop";
import { usePieceHistory } from "@/store/usePieceHistory";
import React, { useEffect, useState } from "react";

const calcWidth = () => {
  return Math.min(window.innerWidth, window.innerHeight) * 0.7;
};
interface ChessboardProps {
  fen: string;
}

const Chessboard: React.FC<ChessboardProps> = ({ fen }: ChessboardProps) => {
  const fenStringZ = usePieceHistory((s) => s.fenString);
  const setFenStringZ = usePieceHistory((s) => s.setFenString);
  const fenEnabled = usePieceHistory((s) => s.fenEnabled);
  const setFenEnabled = usePieceHistory((s) => s.setFenEnabled);
  const selectedSquare = useDrop((s) => s.selectedSquare);
  const setSelectedSquare = useDrop((s) => s.setSelectedSquare);
  const [pieces, setPieces] = useState([]);
  const board = Array(8).fill(Array(8).fill(null));
  const [boardSize, setBoardSize] = useState(calcWidth());
  const [chessBoard, setChessBoard] = useState(board);

  useEffect(() => {
    const handleResize = () => setBoardSize(calcWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);
  const handleSquareClick = (rowIndex: number, colIndex: number, e: any) => {
    setSelectedSquare(`${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`);
    localStorage?.setItem("selectDropSquare", JSON.stringify(selectedSquare));
  };
  useEffect(() => {
    console.log("stage", fen);
    if (fen) {
      console.log("stage2", fen);
      setFenEnabled(true);
      setFenStringZ(fen);
      parseFen(fen);
    }
  }, [fen]);
  const squareSize = boardSize / 8;
  function parseFen(fen: string) {
    const [fenData, _] = fen.split(" ");
    const rows = fenData.split("/");
    const pieces = rows.map((row) =>
      row.replace(/[0-9]/g, (n) => " ".repeat(parseInt(n, 10))).split("")
    );

    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    pieces.forEach((row, rowIndex) => {
      let colIndex = 0;

      row.forEach((piece) => {
        if (piece !== " ") {
          board[rowIndex][colIndex] = getChessImageNotation(piece);
        }
        colIndex++;
      });
    });
    setFenStringZ(fen);
    setFenEnabled(true);
    setChessBoard(board);
  }
  return (
    <>
      <div className="grid grid-cols-8 gap-0">
        {board.map((row, rowIndex) =>
          row.map((_: any, colIndex: any) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`h-16 w-16 relative flex items-center justify-center ${
                (rowIndex + colIndex) % 2 === 0 ? "bg-gray-400" : "bg-white"
              } ${
                selectedSquare ===
                `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`
                  ? "border-2 border-blue-500"
                  : ""
              }`}
              onClick={(e) => handleSquareClick(rowIndex, colIndex, e)}
              style={{ width: squareSize, height: squareSize }}
            >
              {colIndex === 0 && rowIndex !== 7 && (
                <div className="absolute top-0 left-0 ml-1 mt-1">
                  {8 - rowIndex}
                </div>
              )}{" "}
              {/* Row numbers */}
              {rowIndex === 7 && (
                <div className="absolute bottom-0 right-0 mr-1 mb-1">
                  {String.fromCharCode(96 + colIndex + 1)}
                </div>
              )}{" "}
              {/* Column letters */}
              {selectedSquare ===
                `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}` && (
                <div className="text-sm text-indigo-500 font-medium text-center my-5">{`${String.fromCharCode(
                  97 + colIndex
                )}${8 - rowIndex}`}</div>
              )}
              {chessBoard[rowIndex][colIndex] && (
                <img
                  src={chessBoard[rowIndex][colIndex]}
                  alt=""
                  className="w-1/2 h-100 object-cover"
                />
              )}
            </div>
          ))
        )}
      </div>
      <div className="bg-[#ffffff] flex flex-row border border-1 border-gray-300 my-2">
        <input
          type="checkbox"
          className="mx-2"
          checked={fenEnabled}
          onChange={(e) => {
            if (e.target.checked) {
              if (fenStringZ) {
                setFenEnabled(true);
              }
            } else {
              setFenEnabled(false);
            }
          }}
        />

        {fenStringZ ? (
          <input
            className="w-full px-2"
            type="text"
            onChange={(e) => parseFen(e.target.value)}
            value={fenStringZ}
          />
        ) : (
          <input
            className="w-full px-2"
            type="text"
            onChange={(e) => parseFen(e.target.value)}
            placeholder="Enter a FEN string..."
          />
        )}
      </div>
    </>
  );
};

export default Chessboard;
