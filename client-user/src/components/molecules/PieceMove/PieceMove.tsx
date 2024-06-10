import React, { useEffect, useRef, useState } from "react";
let Chess: any;
if (typeof window !== "undefined") {
  Chess = require("chess.js");
}
import dynamic from "next/dynamic";
import {
  ChessInstanceRef,
  GameData,
  TPieceMove,
  calcWidth,
} from "./pieceMoveInterface";
import {
  boardStyle,
  customizedPieces,
  customizedPieces2,
  darkSquareStyle,
  lightSquareStyle,
  styleShadow,
  squareStyles as squareStylesBack,
} from "@/store/useCustomizedPieces";
import {
  correctSound,
  incorrectSound,
  killSound,
  playSound,
} from "@/helpers/playComputer";

const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const PieceMove = ({
  calculateWidth,
  fenString,
  pieceMove,
  showResult,
  setCorrect,
  setWrong,
  setProceedInteraction,
  setHint,
  reveal,
  setReveal,
  onClickReveal,
  pageId,
}: TPieceMove) => {
  // mentioning width and height calcwidth
  let initialWidth = 0;
  let initialHeight = 0;
  if (typeof window !== "undefined") {
    initialWidth = window.innerWidth;
    initialHeight = window.innerHeight;
  }

  const [boardSize, setBoardSize] = useState(
    calcWidth({ screenWidth: initialWidth, screenHeight: initialHeight })
  );
  const [pieceWidth, setPieceWidth] = useState<number>(0);
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
  const [squareStyles, setSquareStyles] = useState<any>({});
  const game = useRef(Chess ? Chess() : null);
  const [gameData, setGameData] = useState<GameData[]>(pieceMove);
  const [currentFenString, setCurrentFenString] = useState(fenString);
  const [highlightSquare, setHighlightSquare] = useState("");

  useEffect(() => {
    const calculateRestSize = window.innerWidth - boardSize;
    if (calculateRestSize > 0) {
      calculateWidth(calculateRestSize, boardSize);
    }
  }, [boardSize]);

  useEffect(() => {
    setSquareStyles(squareStylesBack);
  }, [squareStylesBack]);
  useEffect(() => {
    if (pieceMove.length === 0) return;
    if (fenString === "") return;
    game.current = Chess ? Chess() : null;
    if (game.current) {
      game.current.load(fenString);
    }
    setCurrentFenString(fenString);
    setSquareStyles((prevStyles: any) => ({
      ...prevStyles,
      [highlightSquare]: {
        backgroundColor: "",
        alignItems: "center",
        justifyContent: "center",
      },
    }));
    setGameData(pieceMove);
  }, [pageId]);

  const onDrop = async (moveData: {
    sourceSquare: string;
    targetSquare: string;
  }) => {
    try {
      const { sourceSquare, targetSquare } = moveData;
      // Check if the move made by user exists in the gameData
      const userMoveData = gameData.find(
        (data) =>
          data.user.from === sourceSquare && data.user.to === targetSquare
      );
      console.log("set user", userMoveData);
      if (userMoveData) {
        // Make a move for the user
        const promotionPiece =
          userMoveData.user.to.charAt(1) === "8" ||
          userMoveData.user.to.charAt(1) === "1"
            ? "q"
            : undefined;

        let result = game.current.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: promotionPiece,
        });
        // Check if the move was unsuccessful
        if (result === null) {
          console.log("This move is not valid!");
          return;
        }
        setHighlightSquare(targetSquare);
        // Update the fenString and gameData
        setCurrentFenString(game.current.fen());
        const updatedGameData = gameData.filter(
          (data) => data._id !== userMoveData?._id
        );
        setGameData(updatedGameData);
        correctSound();
        setCorrect(true);
        setWrong(false);
        setHint(false);
        setProceedInteraction(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // If successful, proceed with system move
        if (userMoveData?.system) {
          const systemResult = game.current.move({
            from: userMoveData.system.from,
            to: userMoveData.system.to,
            promotion: "q",
          });
          // Check if the system move was successful
          if (systemResult === null) {
            console.error("Invalid system move");
          }

          const capturedPiece = systemResult?.captured;
          if (capturedPiece) {
            killSound();
          } else {
            playSound();
          }
        }
        // Update the fenString and gameData
        setCurrentFenString(game.current.fen());
      } else {
        incorrectSound();
        setWrong(true);
        setCorrect(false);
        setHint(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const isCorrectMove = gameData.some(
      (data) => data?.user?.to === highlightSquare
    );
    if (isCorrectMove) {
      setProceedInteraction(true);
    }
    setSquareStyles((prevStyles: any) => ({
      ...prevStyles,
      [highlightSquare]: {
        backgroundColor: "#4CAF50",
        alignItems: "center",
        justifyContent: "center",
      },
    }));
  }, [highlightSquare]);
  useEffect(() => {
    if (reveal) {
      const promotionPiece =
        pieceMove[0].user.to.charAt(1) === "8" ||
        pieceMove[0].user.to.charAt(1) === "1"
          ? "q"
          : undefined;

      setTimeout(() => {
        const userResult = game.current.move({
          from: pieceMove[0]?.user?.from,
          to: pieceMove[0]?.user?.to,
          promotion: promotionPiece,
        });

        // Check if the user move was successful
        if (userResult === null) {
          console.error("Invalid user move");
          return;
        }
        if (userResult.captured) {
          killSound();
        } else {
          playSound();
        }
        setSquareStyles((prevStyles: any) => ({
          ...prevStyles,
          [pieceMove[0]?.user?.to]: {
            backgroundColor: "#4CAF50",
            alignItems: "center",
            justifyContent: "center",
          },
        }));
        // Update the fenString after user move
        setCurrentFenString(game.current.fen());

        setTimeout(() => {
          const systemResult = game.current.move({
            from: pieceMove[0]?.system?.from,
            to: pieceMove[0]?.system?.to,
            promotion: "q",
          });

          // Check if the system move was successful
          if (systemResult === null) {
            console.error("Invalid system move");
            return;
          }
          if (systemResult.captured) {
            killSound();
          } else {
            playSound();
          }
          setSquareStyles((prevStyles: any) => ({
            ...prevStyles,
            [pieceMove[0]?.system?.to]: {
              backgroundColor: "#4CAF50",
              alignItems: "center",
              justifyContent: "center",
            },
          }));
          // Update the fenString and gameData after system move
          setCurrentFenString(game.current.fen());

          // Assuming pieceMove[0] contains the user and system moves you want to reveal
          const updatedGameData = gameData.filter(
            (data) => data._id !== pieceMove[0]?._id
          );
          setGameData(updatedGameData);

          console.log("userResult", userResult, systemResult, pieceMove);
        }, 500);
      }, 500);
    }
  }, [reveal]);

  return (
    <div className="m-3 border border-1 border-black" style={styleShadow}>
      <Chessboard
        position={currentFenString}
        onDrop={reveal ? undefined : onDrop}
        calcWidth={() => boardSize}
        transitionDuration={400}
        darkSquareStyle={darkSquareStyle}
        lightSquareStyle={lightSquareStyle}
        dropOffBoard={"snapback"}
        pieces={customizedPieces2()}
        boardStyle={boardStyle}
        squareStyles={squareStyles}
      />
    </div>
  );
};

export default PieceMove;
