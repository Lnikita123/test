import { HumanVsHumanState, useGameStore } from "@/store/useGameStore";
import { HumanVsHumanProps, usePieceHistory } from "@/store/usePieceHistory";
import { Square } from "chess.js";
import Chess from "chess.js";

import React, { memo, useEffect, useRef, useState } from "react";

const INITIAL_BOARD: HumanVsHumanState = {
  fen: "start",
  dropSquareStyle: {},
  squareStyles: {},
  pieceSquare: "",
  history: [],
};
const HumanVsHuman: React.FC<HumanVsHumanProps> = (props) => {
  const activeConditionType = usePieceHistory((s) => s.activeConditionType);
  const fenString = usePieceHistory((s) => s.fenString);
  const setFenString = usePieceHistory((s) => s.setFenString);
  const fenEnabled = usePieceHistory((s) => s.fenEnabled);
  const setFenEnabled = usePieceHistory((s) => s.setFenEnabled);
  const setConditionStore = usePieceHistory((s) => s.setConditionStore);
  const reset = useGameStore((s) => s.reset);
  const setReset = useGameStore((s) => s.setReset);
  const [state, setState] = useState<HumanVsHumanState>(INITIAL_BOARD);
  // @ts-ignore
  const game = useRef(new Chess());

  useEffect(() => {
    if (fenEnabled && fenString) {
      // @ts-ignore
      const newGame = new Chess(fenString);
      game.current = newGame;
      setState({
        ...state,
        fen: fenString,
      });
    } else if (!fenEnabled) {
      game.current.reset();
      setState(INITIAL_BOARD);
    } else if (reset) {
      // @ts-ignore
      const newGame = new Chess(fenString);
      game.current = newGame;
      setState({
        ...state,
        fen: fenString,
      });
    }
  }, [fenString, fenEnabled, reset]);

  const removeHighlightSquare = () => {
    setState(({ pieceSquare, history, ...prev }) => ({
      ...prev,
      squareStyles: squareStyling({ pieceSquare, history }),
      pieceSquare,
      history,
    }));
  };

  const highlightSquare = (
    sourceSquare: string,
    squaresToHighlight: string[]
  ) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%",
            },
          },
          ...squareStyling({
            history: state?.history,
            pieceSquare: state?.pieceSquare,
          }),
        };
      },
      {}
    );

    setState(({ squareStyles, ...prev }) => ({
      ...prev,
      squareStyles: { ...squareStyles, ...highlightStyles },
    }));
  };
  type CustomMove = {
    from: Square;
    to: Square;
    promotion?: string;
  };
  const onDrop = (move: CustomMove) => {
    const { from, to } = move;
    let legalMove = game?.current.move({
      from: from,
      to: to,
      promotion: "q",
    });
    //if (legalMove === null) return;

    if (activeConditionType === "system") {
      setConditionStore({ system: legalMove });
    }
    if (activeConditionType === "user") {
      setConditionStore({ user: legalMove });
    }
    const newFenString = game.current.fen();
    setState(({ history, pieceSquare, ...prev }) => ({
      ...prev,
      fen: newFenString,
      history: game.current.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history }),
      pieceSquare: pieceSquare,
    }));
    setFenString(newFenString);
  };

  const onMouseOverSquare = (square: string) => {
    let moves = game.current.moves({
      square: square,
      verbose: true,
    });

    if (moves.length === 0) return;

    let squaresToHighlight = moves.map((move: any) => move.to);

    highlightSquare(square, squaresToHighlight);
  };

  const onMouseOutSquare = (square: string) => removeHighlightSquare();

  // central squares get diff dropSquareStyles
  const onDragOverSquare = (square: string) => {
    setState(({ ...prev }) => ({
      ...prev,
      dropSquareStyle:
        square === "e4" || square === "d4" || square === "e5" || square === "d5"
          ? { backgroundColor: "cornFlowerBlue" }
          : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" },
    }));
  };

  const onSquareClick = (square: string) => {
    // const convertedSquare: Square = square as Square;
    // setState(({ history, ...prev }: any) => ({
    //   ...prev,
    //   squareStyles: squareStyling({ pieceSquare: convertedSquare, history }),
    //   pieceSquare: convertedSquare,
    //   fen: prev.fen,
    // }));
    // let move = game.current.move({
    //   from: state?.pieceSquare,
    //   to: convertedSquare,
    //   promotion: "q", // always promote to a queen for example simplicity
    // });
    // console.log("Clickmove", move);
    // // illegal move
    // if (move === null) return;
    // setState(({ ...prev }) => ({
    //   ...prev,
    //   fen: game.current.fen(),
    //   history: game.current.history({ verbose: true }),
    //   pieceSquare: "",
    // }));
  };

  const onSquareRightClick = (square: string) =>
    setState((prev) => ({
      ...prev,
      squareStyles: { [square]: { backgroundColor: "deepPink" } },
    }));

  const { fen, dropSquareStyle, squareStyles } = state;
  type ChessBoardProps = {
    onSquareClick: (square: string) => void;
  };
  return (
    <div>
      {props.children({
        squareStyles,
        position: fen,
        onMouseOverSquare,
        onMouseOutSquare,
        onDrop,
        dropSquareStyle,
        onDragOverSquare,
        onSquareClick: onSquareClick,
        onSquareRightClick,
      })}
    </div>
  );
};
export default memo(HumanVsHuman);

const squareStyling = ({ pieceSquare, history }: any) => {
  const sourceSquare = history?.length && history[history?.length - 1].from;
  const targetSquare = history?.length && history[history?.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(history?.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)",
      },
    }),
    ...(history?.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)",
      },
    }),
  };
};
