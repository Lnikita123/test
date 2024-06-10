import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Chess from "chess.js";
import Hamburger from "@/components/atoms/hamburger/Hamburger";
import { useRouter } from "next/router";
import {
  boardStyle,
  customizedPieces2,
  darkSquareStyle,
  gridContainer,
  lightSquareStyle,
  squareStyles,
  styleShadow,
} from "@/store/useCustomizedPieces";
import { calcWidth } from "@/components/molecules/PieceMove/pieceMoveInterface";
import GoBackButton from "@/components/atoms/GoBackButton/GoBackButton";
import GoHomeButton from "@/components/atoms/GoHomeButton/GoHomeButton";
import TimerComputer from "@/components/atoms/Timer/Timer";
import { formateTimer } from "@/helpers/playComputer";
import RestartGame from "@/components/atoms/RestartGame/RestartGame";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { FaPlay } from "react-icons/fa";

const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const Stockfish = dynamic(() => import("@/integrations/PuzzleStockfish"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const ChessPuzzle = () => {
  const router = useRouter();
  const [showStart, setShowStart] = useState(true);
  const [tempPosition, setTempPosition] = useState(null);
  const [initialPly, setInitialPly] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [clock, setClock] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [resetStoreOptions, setResetStoreOptions] = useState(false);
  const [tempSolution, setTempSolution] = useState<Array<string>>([]);
  const [highlightLastSquare, setHighlightLastSquare] = useState<Array<string>>(
    []
  );
  const [response, setResponse] = useState([]);
  //const [resetGame, setResetGame] = useState(false);
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
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      setBoardSize(
        calcWidth({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
        })
      );
      const chessBoardWidth = calcWidth({ screenWidth, screenHeight });
      const cellWidth = chessBoardWidth / 8;
      const pieceWidth = cellWidth * 0.7;
      setPieceWidth(pieceWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [fen, setFen] = useState("");
  const [pgn, setPgn] = useState<Array<string>>([]);
  const [showHamburger, setShowHamburger] = useState(false);
  const [solution, setSolution] = useState<Array<string>>([]);
  useEffect(() => {
    fetchPuzzle();
  }, []);
  const pgnToFen = (pgn: string) => {
    //@ts-ignore
    const chess = new Chess(pgn);
    chess.load_pgn(pgn);
    return chess.fen();
  };
  const getSolutionData = async (fen: string) => {
    const fenArr = [];
    const solArr = [];
    let tempFen = fen;
    for (let move of tempSolution) {
      //@ts-ignore
      const tempChess = new Chess(tempFen);
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      const moveResult = tempChess.move({ from, to, promotion: "q" });

      if (moveResult === null) {
        console.log(`Invalid move: ${move}`);
        break;
      }

      solArr.push(moveResult.san);
      fenArr.push(tempChess.fen());

      const captured = moveResult.captured;
      if (captured) {
        const capturedSquares = captured.split("");
        for (let square of capturedSquares) {
          tempChess.remove(square);
        }
      }

      tempFen = tempChess.fen();
    }

    const totalSolution = [...pgn, ...solArr];
    return { totalSolution, fenArr, tempFen };
  };

  const fetchPuzzle = async () => {
    try {
      const response = await axios.get("https://lichess.org/api/puzzle/daily");
      const { game, puzzle } = response.data;
      setResponse(response.data);
      //@ts-ignore
      const chess = new Chess();
      chess.load_pgn(game.pgn);
      // Get the current position (FEN) after all the moves
      setPgn(game.pgn.split(" "));
      setSolution(puzzle.solution);
      setTempSolution(puzzle.solution);
      console.log("Solution", puzzle.solution);
      getInitialPlay(game, puzzle, chess);
    } catch (error) {
      console.error("Error fetching daily puzzle:", error);
    }
  };
  function getInitialPlay(game: any, puzzle: any, chess: any) {
    setClock(game.clock.split("+")[0]);
    setInitialPly(puzzle.initialPly);
    const currentPosition = chess.fen();
    setFen(currentPosition);
  }
  const onClickHamburger = () => {
    setShowHamburger(!showHamburger);
  };
  const onClickHome = () => {
    router.push("/auth");
  };
  function onClickStartTimer() {
    setHighlightLastSquare([]);
    setIsGameStarted(true);
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Reset the timer
    setTimer(0);

    // Start a new interval and store its ID
    const id = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer >= clock * 60) {
          // If 1 minute has passed
          setIsGameStarted(false);
          handleClickOpen(); // Open the Game Over dialog
          clearInterval(id); // Show a pop-up message
          return prevTimer;
        }
        return prevTimer + 1;
      });
    }, 1000);

    setIntervalId(id);
    setShowStart(false);
    fetchPuzzle();
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    // Set timer to 0
    setTimer(0);

    // Make sure to clear the interval
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Show the start button and hide the timer
    //setShowStart(true);
    setIsGameStarted(false);
    setOpen(false);
  };

  function stopTimer() {
    setIsGameStarted(false);
    // Clear the interval if it exists
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setResetStoreOptions(true);
  }
  function resetGame() {
    onClickStartTimer();
    setResetStoreOptions(true);
  }
  const [getWidth, setGetWidth] = useState<number>(0);
  const [getHeight, setGetHeight] = useState<number>(0);
  function getBalanceData(width: number, height: number) {
    setGetWidth(width - width * 0.1);
    console.log("cal", width);
    setGetHeight(height - height * 0.05);
  }
  useEffect(() => {
    const calculateRestSize = window.innerWidth - boardSize;
    if (calculateRestSize > 0) {
      getBalanceData(calculateRestSize, boardSize);
    }
  }, [boardSize]);
  return (
    <div id="puzzle">
      <Suspense fallback={<>Loading....</>}>
        <div className="m-5 flex justify-start relative">
          <Stockfish
            position={fen}
            setFen={setFen}
            pgn={pgn}
            setPgn={setPgn}
            setSolution={setSolution}
            solution={solution}
            fetchPuzzles={fetchPuzzle}
            initialPly={initialPly}
            clock={clock}
            isGameStarted={isGameStarted}
            highlightLastSquare={highlightLastSquare}
            tempSolution={tempSolution}
            setTempSolution={setTempSolution}
            children={({
              position,
              pgn,
              onDrop,
              onMouseOverSquare,
              onMouseOutSquare,
              onDragOverSquare,
              squareStyles,
              playerColor,
              userCheckmate,
              aiCheckmate,
              storeAnswer,
              setStoreAnswer,
              onSquareClick,
              gameOver,
              game,
            }: any) => {
              function loadPgnElement(id: number) {
                const newPgn = pgn.slice(0, id + 1);
                //@ts-ignore
                const chess = new Chess();
                chess.load_pgn(newPgn.join(" "));
                // Get the current position (FEN) after all the moves
                const currentPosition = chess.fen();
                setFen(currentPosition);
              }
              const onClickSolution = async () => {
                const fen = game.fen();
                const completeSolution = await getSolutionData(fen);
                const lastBefore = solution[solution.length - 1];
                const from = lastBefore.substring(0, 2);
                const to = lastBefore.substring(2, 4);
                const totalPgn = completeSolution.totalSolution.join(" ");
                const lastSolutionHighlight = [];
                lastSolutionHighlight.push(from);
                lastSolutionHighlight.push(to);
                setHighlightLastSquare(lastSolutionHighlight);
                const completeSol = pgnToFen(totalPgn);
                setFen(completeSolution.tempFen || completeSol);
                setOpen(true);
                DialogBoxWin();
                setShowStart(false);
              };
              useEffect(() => {
                if (gameOver) {
                  setOpen(true);
                  DialogBoxWin();
                }
              }, [gameOver]);
              useEffect(() => {
                if (aiCheckmate || userCheckmate) {
                  stopTimer();
                  handleClickOpen();
                  DialogBoxWin();
                }
              }, [aiCheckmate, userCheckmate]);
              useEffect(() => {
                if (resetStoreOptions) {
                  setStoreAnswer([]);
                }
              }, [resetStoreOptions]);
              function DialogBoxWin() {
                if (userCheckmate && !aiCheckmate) {
                  return "Congratulations! It's Checkmate";
                } else if (aiCheckmate && !userCheckmate) {
                  return "Oops! It's Checkmate";
                } else if (!userCheckmate && !aiCheckmate) {
                  return "Game Over";
                } else {
                  return "Game Over";
                }
              }
              function getAnswerMark() {
                if (Array.isArray(storeAnswer) && storeAnswer.length) {
                  return (
                    <div className="py-5 mx-2 self-start flex flex-wrap">
                      {storeAnswer.map((store, i) =>
                        store === "wrong" ? (
                          <div
                            key={i}
                            className="bg-red-400 px-2 py-1 rounded-md m-2"
                          >
                            <img src="./wrong.png" alt="wrong" />
                          </div>
                        ) : (
                          <div
                            key={i}
                            className="bg-green-400 px-2 py-1 rounded-md m-2"
                          >
                            <img src="./correct.png" alt="correct" />
                          </div>
                        )
                      )}
                    </div>
                  );
                }
              }

              return (
                <>
                  <Chessboard
                    id="stockfish"
                    transitionDuration={300}
                    position={tempPosition === null ? position : tempPosition}
                    orientation={playerColor}
                    calcWidth={() => boardSize}
                    onDrop={onDrop}
                    onMouseOverSquare={onMouseOverSquare}
                    onMouseOutSquare={onMouseOutSquare}
                    onDragOverSquare={onDragOverSquare}
                    onSquareClick={onSquareClick}
                    pieces={customizedPieces2()}
                    darkSquareStyle={darkSquareStyle}
                    lightSquareStyle={lightSquareStyle}
                    boardStyle={boardStyle}
                    squareStyles={squareStyles}
                  />
                  {
                    <>
                      <div
                        style={{
                          height: getHeight + "px",
                          width: getWidth + "px",
                          boxShadow:
                            "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                          backdropFilter: "blur(18.5px)",
                        }}
                        className="ml-5 flex flex-row justify-around bg-gradient-to-r from-[#565F8B] to-[#765188] border-2 border-[#DDDDDD] rounded-lg"
                      >
                        <div className="flex flex-col font-bold items-center justify-around relative">
                          <div className="flex justify-around items-center mt-5 mb-2 rounded-lg overflow-y-auto bg-[#fff] border-2 border-sky-400">
                            <img
                              src="/Wking.png"
                              alt="Wking"
                              className="md:h-3/4"
                            />
                            <div
                              className={`text-black text-sm self-center justify-self-center`}
                            >
                              {showStart && (
                                <p className="text-black">
                                  Play the {playerColor} It's your Turn
                                </p>
                              )}
                            </div>
                            <img
                              src="/Bking.png"
                              alt="Bking"
                              className="md:h-3/4"
                            />
                          </div>
                          {!showStart && (
                            <div
                              className="my-1"
                              onClick={() => onClickSolution()}
                            >
                              <button className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-xl">
                                <FaPlay />
                                <span className="mx-2">View Solution</span>
                              </button>
                            </div>
                          )}
                          <div className="text-white mx-6 overflow-auto h-[50vh]">
                            <div style={gridContainer}>
                              {pgn &&
                                pgn?.map((eachPgn: string, index: number) => (
                                  <div
                                    className={`${
                                      index === pgn.length - 1
                                        ? "bg-orange-500"
                                        : ""
                                    } flex justify-between hover:bg-gray-100 hover:text-black`}
                                    key={index}
                                    onClick={() => loadPgnElement(index)}
                                  >
                                    <span className={`mr-10 text-md`}>
                                      {index % 2 === 0
                                        ? Math.floor(index / 2) + 1
                                        : ""}
                                    </span>
                                    <span
                                      className={` text-white px-5 cursor-pointer text-md hover:bg-gray-100 hover:text-black`}
                                    >
                                      {eachPgn}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                          {showStart && (
                            <RestartGame
                              onClick={() => resetGame()}
                              text="Start Game"
                            />
                          )}
                          <div
                            className={`max-h-[5rem] ${
                              storeAnswer.length > 10 ? "overflow-y-auto" : ""
                            }`}
                          >
                            {getAnswerMark()}
                          </div>
                        </div>
                        <TimerComputer
                          showStart={false}
                          selectedTimer={clock * 60}
                          formateTimer={formateTimer}
                          timer={timer}
                        />
                      </div>
                    </>
                  }
                  <div>
                    <Dialog
                      open={open}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          {DialogBoxWin()}
                        </DialogContentText>
                      </DialogContent>
                      <Button onClick={() => handleClose()} color="primary">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-md ">
                          OK
                        </span>
                      </Button>
                    </Dialog>
                  </div>
                  <Hamburger
                    pages={{}}
                    currentPage={0}
                    showHamburger={showHamburger}
                    onClickHamburger={onClickHamburger}
                    onClickHome={() => onClickHome()}
                  />
                </>
              );
            }}
          />
        </div>
        <div className="mx-5 my-5">
          <GoHomeButton onClick={() => onClickHome()} showBack={true} />
        </div>
      </Suspense>
    </div>
  );
};

export default ChessPuzzle;
