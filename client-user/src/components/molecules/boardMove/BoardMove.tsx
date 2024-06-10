import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { calcWidth } from "../PieceMove/pieceMoveInterface";
import {
  boardStyle,
  customizedPieces,
  customizedPieces2,
  darkSquareStyle,
  lightSquareStyle,
  squareStyles as squareStylesBack,
  styleShadow,
} from "@/store/useCustomizedPieces";
import { correctSound, incorrectSound } from "@/helpers/playComputer";
const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const BoardMove = ({
  onClickReveal,
  reveal,
  setReveal,
  calculateWidth,
  fenString,
  board,
  showResult,
  setCorrect,
  setWrong,
  proceedTrigger,
  redo,
  setHighlightSquares,
  highlightSquares,
  setRedoVisible,
  setHint,
  setShowResult,
}: {
  reveal: boolean;
  setReveal: (reveal: boolean) => void;
  onClickReveal: () => void;
  calculateWidth: (width: number, height: number) => void;
  fenString: string;
  board: string[];
  showResult: boolean;
  setCorrect: (value: boolean) => void;
  setWrong: (value: boolean) => void;
  proceedTrigger: () => void;
  setHighlightSquares: (highlightSquares: string[]) => void;
  highlightSquares: string[];
  redo: boolean;
  setRedoVisible: (value: boolean) => void;
  setHint: (hint: boolean) => void;
  setShowResult: (showResult: boolean) => void;
}) => {
  // mentioning width and height calcwidth
  const [fen, setFen] = useState("");

  useEffect(() => {
    setFen(fenString);
    console.log("fen", fenString);
  }, [fenString]);
  let initialWidth = 0;
  let initialHeight = 0;
  if (typeof window !== "undefined") {
    initialWidth = window.innerWidth;
    initialHeight = window.innerHeight;
  }

  const [boardSize, setBoardSize] = useState(
    calcWidth({ screenWidth: initialWidth, screenHeight: initialHeight })
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
    const calculateRestSize = window.innerWidth - boardSize;
    if (calculateRestSize > 0) {
      calculateWidth(calculateRestSize, boardSize);
    }
  }, [boardSize]);
  function proceedActivate() {
    proceedTrigger();
  }
  useEffect(() => {
    if (redo) {
      setHighlightSquares([]);
    }
  }, [redo]);
  const handleSquareClick = (square: string) => {
    if (showResult === false) {
      if (highlightSquares.includes(square)) {
        // Deselect the square if it is already selected
        const updatedSquares = highlightSquares.filter((s) => s !== square);
        setHighlightSquares(updatedSquares);

        // Also remove the square style of the deselected square
        setSquareStyles((prev) => {
          const newStyles: any = { ...prev };
          newStyles[square] = { alignItems: "center" };
          //delete newStyles[square];
          return newStyles;
        });
      } else {
        // Select the square if it is not already selected
        const updatedSquares = [...highlightSquares, square];
        setHighlightSquares(updatedSquares);
      }
    }
  };
  const [squareStyles, setSquareStyles] = useState({});
  const [originalSquareStyles, setOriginalSquareStyles] = useState({});
  const [answerSquares, setAnswerSquares] = useState<string[]>([]);
  useEffect(() => {
    if (redo) {
      // setHighlightSquares([]);
      //setShowResult(false);
      setWrong(false);
      setCorrect(false);
      setHint(false);
      setSquareStyles(originalSquareStyles);
    }
  }, [redo]);
  useEffect(() => {
    setAnswerSquares(board);
    if (reveal) {
      setHighlightSquares(answerSquares);
    }
  }, [reveal]);
  useEffect(() => {
    setOriginalSquareStyles(squareStylesBack);
    setSquareStyles(squareStylesBack);
  }, [squareStylesBack]);
  useEffect(() => {
    if (redo && highlightSquares.length === 0) {
      setSquareStyles(squareStylesBack);
    }
  }, [highlightSquares, redo]);
  useEffect(() => {
    console.log("set squ", highlightSquares);
  }, [highlightSquares]);
  useEffect(() => {
    const newSquareStyles = {
      ...(showResult || reveal
        ? highlightSquares.reduce(
            (styles, square) => ({
              ...styles,
              [square]: {
                backgroundColor: board.includes(square) ? "#4CAF50" : "#F44336",
                alignItems: "center",
              },
            }),
            {}
          )
        : redo &&
          highlightSquares.reduce(
            (styles, square) => ({
              ...styles,
              [square]: {
                backgroundColor: "#F1D070",
                alignItems: "center",
              },
            }),
            {}
          )),
    };
    setSquareStyles((prevSquareStyles) => ({
      ...prevSquareStyles,
      ...newSquareStyles,
    }));
    if (showResult) {
      const allCorrect = highlightSquares.every((square) =>
        board.includes(square)
      );
      const someCorrect = highlightSquares.some((square) =>
        board.includes(square)
      );
      const selectedCorrect = highlightSquares.length === board.length;
      if (allCorrect && selectedCorrect) {
        correctSound();
        setCorrect(true);
        proceedActivate();
        setWrong(false);
        setRedoVisible(false);
      } else if (someCorrect) {
        setRedoVisible(true);
        incorrectSound();
        setCorrect(false);
        setWrong(true);
      }
    }
  }, [showResult, highlightSquares, board, redo]);

  return (
    <div
      className="m-3 border border-1 border-black cursor-pointer"
      style={styleShadow}
    >
      <Chessboard
        position={fen}
        calcWidth={() => boardSize}
        darkSquareStyle={darkSquareStyle}
        lightSquareStyle={lightSquareStyle}
        onSquareClick={handleSquareClick}
        squareStyles={squareStyles}
        dropOffBoard={"snapback"}
        pieces={customizedPieces2()}
        boardStyle={boardStyle}
      />
    </div>
  );
};

export default BoardMove;
