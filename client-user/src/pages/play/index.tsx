import Hamburger from "@/components/atoms/hamburger/Hamburger";
import { calcWidth } from "@/components/molecules/PieceMove/pieceMoveInterface";
import {
  boardStyle,
  customizedPieces2,
  darkSquareStyle,
  gridContainer,
  lightSquareStyle,
} from "@/store/useCustomizedPieces";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import dynamic from "next/dynamic";
import React, { memo, Suspense, useEffect, useState } from "react";
import Chess from "chess.js";
import { responsiveStyle } from "@/components/molecules/pageboard/topSection";
import DiscreteSliderValues from "@/components/atoms/LevelsChess/SlideLevels";
import { formateTimer } from "@/helpers/playComputer";
import TimerComputer from "@/components/atoms/Timer/Timer";
import useStudent from "@/store/useStudent";
import { getStudentApi } from "../api/pageApi";
import ColorButton from "@/components/atoms/ColorButton/ColorButton";
import PlayButton from "@/components/atoms/playButton/PlayButton";
import RestartGame from "@/components/atoms/RestartGame/RestartGame";
import GoHomeButton from "@/components/atoms/GoHomeButton/GoHomeButton";
import { useRouter } from "next/router";
import GoBackButton from "@/components/atoms/GoBackButton/GoBackButton";
import TimersPlay from "@/components/atoms/TimersPlay/TimersPlay";
const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const Stockfish = dynamic(() => import("@/integrations/Stockfish"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
function Play() {
  const router = useRouter();
  let black: string =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  let white: string =
    "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr b KQkq - 0 1";

  const avatar = useStudent((s) => s.avatar);
  const setAvatar = useStudent((s) => s.setAvatar);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [pgn, setPgn] = useState<Array<string>>([]);
  const [fen, setFen] = useState<string>(black);
  const [tempPosition, setTempPosition] = useState(null);
  const [playerColor, setPlayerColor] = useState<string>("white");
  const [reStart, setRestart] = useState<string>("");
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [shouldRestart, setShouldRestart] = useState(false);
  const [prevHistory, setPreviousHistory] = useState<Array<any>>([]);
  const [random, setRandom] = useState("");
  const [onClickPlay, setOnClickPlay] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [selectedT, setSelectedT] = useState<string>("Blitz");
  const [selectedTimer, setSelectedTimer] = useState<number>(60);
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

  const handleClickOpen = () => {
    setOpen(true);
    setShowBack(true);
  };

  const handleClose = () => {
    setOnClickPlay(true);
    // Set timer to 0
    setTimer(0);

    // Make sure to clear the interval
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Show the start button and hide the timer
    setShowStart(true);
    setOpen(false);
    if (playerColor === "black") {
      setFen(white);
    } else {
      setFen(black);
    }
    setIsGameStarted(false);
    setRestart("");
  };
  function onClickStartTimer() {
    setOnClickPlay(true);
    setShouldRestart(true);
    setIsGameStarted(true);
    if (playerColor === "black") {
      setRestart(black);
    } else {
      setRestart(white);
    }
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Reset the timer
    setTimer(0);

    // Start a new interval and store its ID
    const id = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer >= selectedTimer) {
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
  }
  function stopTimer() {
    setIsGameStarted(false);
    // Clear the interval if it exists
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }

  const handlePlayerColorToggle = (color: string) => {
    setRandom("");
    setRestart(Math.random().toString());
    setPgn([]);
    setPlayerColor(color);
  };
  const onClickTimer = (number: number, text: string) => {
    setSelectedTimer(number);
    setSelectedT(text);
  };
  const handleRandomChoice = () => {
    setRandom("questionMark");
    const randomChoiceArr = ["white", "black"];
    const index = Math.floor(Math.random() * randomChoiceArr.length);
    setPlayerColor(randomChoiceArr[index]);
  };
  const onClickHamburger = () => {
    setShowHamburger(!showHamburger);
  };
  const onClickBack = () => {
    setOnClickPlay(false);
    setShouldRestart(true);
    setIsGameStarted(true);
    if (playerColor === "black") {
      setRestart(black);
    } else {
      setRestart(white);
    }
  };

  let studentId: any = null;
  if (typeof window !== "undefined" && studentId !== undefined) {
    studentId = JSON.parse(localStorage?.getItem("studentId") || "null");
  }
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getStudentApi(studentId);
        if (response && response.avatar) {
          setAvatar(response.avatar);
        }
      } catch (error) {
        console.error("Error getting student data:", error);
      }
    };
    fetchStudentData();
  }, [studentId]);
  const onClickHome = () => {
    router.push("/auth");
  };
  const [getWidth, setGetWidth] = useState<number>(0);
  const [getHeight, setGetHeight] = useState<number>(0);
  function getBalanceData(data: number) {
    setGetWidth(data - data * 0.1);
  }
  useEffect(() => {
    const calculateRestSize = window.innerWidth - boardSize;
    if (calculateRestSize > 0) {
      console.log(calculateRestSize);
      getBalanceData(calculateRestSize);
    }
  }, [boardSize]);
  useEffect(() => {
    setGetHeight(boardSize);
  }, [boardSize]);
  return (
    <>
      <Suspense fallback={<>Loading....</>}>
        <div className="m-5 flex justify-start relative">
          <Stockfish
            shouldRestart={shouldRestart}
            setShouldRestart={setShouldRestart}
            playerColor={playerColor}
            isGameStarted={isGameStarted}
            position={fen}
            reStart={reStart}
            prevHistory={prevHistory}
            setTempPosition={setTempPosition}
            selectedTimer={selectedTimer}
            children={({
              position,
              onDrop,
              pgn,
              onMouseOverSquare,
              onMouseOutSquare,
              onDragOverSquare,
              squareStyles,
              chess,
              aiCheckmate,
              userCheckmate,
              history,
            }: any) => {
              useEffect(() => {
                if (aiCheckmate || userCheckmate) {
                  stopTimer();
                  handleClickOpen();
                }
              }, [aiCheckmate, userCheckmate]);
              function loadPgnElement(id: number, chess: any) {
                const moves = chess.pgn().split(" ");
                //@ts-ignore
                const tempGame = new Chess();
                for (let i = 0; i < id + 1; i++) {
                  tempGame.move(moves[i]);
                }
                setTempPosition(tempGame.fen());
              }
              return (
                <>
                  <Chessboard
                    id="stockfish"
                    position={tempPosition === null ? position : tempPosition}
                    calcWidth={() => boardSize}
                    onDrop={onDrop}
                    onMouseOverSquare={onMouseOverSquare}
                    onMouseOutSquare={onMouseOutSquare}
                    onDragOverSquare={onDragOverSquare}
                    orientation={playerColor === "white" ? "white" : "black"}
                    pieces={customizedPieces2()}
                    darkSquareStyle={darkSquareStyle}
                    lightSquareStyle={lightSquareStyle}
                    boardStyle={boardStyle}
                    squareStyles={squareStyles}
                  />
                  {
                    <>
                      {onClickPlay && (
                        <div
                          style={{
                            height: getHeight + "px",
                            width: getWidth + "px",
                            boxShadow:
                              "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(18.5px)",
                          }}
                          className="ml-5 flex flex-row justify-around bg-gradient-to-r from-[#565F8B] to-[#765188] border-2 border-[#DDDDDD] rounded-lg w-[10rem] "
                        >
                          <div className="flex flex-col font-bold items-center relative">
                            <div className="flex justify-around mx-10 my-6 min-h-20 lg:w-96 rounded-lg mt-6 overflow-y-auto  bg-[#fff] border-2 border-sky-400">
                              <img src="/Wking.png" alt="Wking" />
                              {pgn && pgn.length === 0 && (
                                <div
                                  className={`text-black text-sm self-center justify-self-center`}
                                >
                                  {playerColor === "white" && (
                                    <p>Play the {playerColor} It's your Turn</p>
                                  )}
                                </div>
                              )}
                              <img src="/Bking.png" alt="Bking" />
                            </div>
                            <div className="text-white mx-6 overflow-auto h-[50vh]">
                              <div style={gridContainer}>
                                {pgn &&
                                  pgn.map((eachPgn: string, index: number) => (
                                    <div
                                      className={`${
                                        index === pgn.length - 1
                                          ? "bg-orange-500"
                                          : ""
                                      } flex justify-around hover:bg-gray-100 hover:text-black`}
                                      key={index}
                                      onClick={() =>
                                        loadPgnElement(index, chess)
                                      }
                                    >
                                      <span className={`mr-10 text-md `}>
                                        {index % 2 === 0
                                          ? Math.floor(index / 2) + 1
                                          : ""}{" "}
                                      </span>
                                      <p
                                        className={` text-white px-5 cursor-pointer text-md hover:bg-gray-100 hover:text-black`}
                                      >
                                        <span>{eachPgn}</span>
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            {showStart && (
                              <RestartGame
                                onClick={() => onClickStartTimer()}
                                text="Restart Game"
                              />
                            )}
                          </div>
                          <TimerComputer
                            showStart={showStart}
                            selectedTimer={selectedTimer}
                            formateTimer={formateTimer}
                            timer={timer}
                          />
                        </div>
                      )}
                      {!onClickPlay && (
                        <div
                          style={{
                            height: getHeight + "px",
                            width: getWidth + "px",
                            boxShadow:
                              "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(18.5px)",
                          }}
                          className="ml-5 flex flex-row justify-around bg-gradient-to-r from-[#565F8B] to-[#765188] border-2 border-[#DDDDDD] rounded-lg w-[10rem] "
                        >
                          <div className="flex flex-col font-bold items-center justify-around">
                            <label
                              className={`text-white mx-2 my-2 ${responsiveStyle}`}
                            >
                              Play VS
                            </label>
                            <DiscreteSliderValues avatar={avatar} />
                            <div className="flex">
                              <ColorButton
                                onClick={() => handlePlayerColorToggle("white")}
                                selected={
                                  random !== "questionMark" &&
                                  playerColor === "white"
                                }
                                imageSrc="/Wking.png"
                                altText="Wking"
                              />
                              <button
                                onClick={() => handleRandomChoice()}
                                className={`bg-gray-400  text-[#765188] m-5 2xl:mx-10 px-5 py-1 rounded-md my-2 ${
                                  random === "questionMark"
                                    ? "border border-1 border-yellow-200"
                                    : ""
                                }`}
                              >
                                <img
                                  src="/questionMark.png"
                                  alt="questionMark"
                                />
                              </button>
                              <ColorButton
                                onClick={() => handlePlayerColorToggle("black")}
                                selected={
                                  random !== "questionMark" &&
                                  playerColor === "black"
                                }
                                imageSrc="/Bking.png"
                                altText="Bking"
                              />
                            </div>
                            <div className="flex justify-around">
                              <TimersPlay
                                text="Bullet"
                                image="Ammo"
                                onClick={() => onClickTimer(60, "Bullet")}
                                selected={selectedT}
                              />
                              <TimersPlay
                                text="Blitz"
                                image="Bolt"
                                onClick={() => onClickTimer(180, "Blitz")}
                                selected={selectedT}
                              />
                              <TimersPlay
                                text="Rapid"
                                image="Time"
                                onClick={() => onClickTimer(600, "Rapid")}
                                selected={selectedT}
                              />
                            </div>
                            <PlayButton onClick={() => onClickStartTimer()} />
                          </div>
                        </div>
                      )}
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
                          {aiCheckmate || userCheckmate
                            ? "CheckMate GameOver!!"
                            : "Game over"}
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
          {onClickPlay && (
            <GoBackButton onClick={() => onClickBack()} showBack={showBack} />
          )}
          {!onClickPlay && (
            <GoHomeButton onClick={() => onClickHome()} showBack={showBack} />
          )}
        </div>
      </Suspense>
    </>
  );
}
export default memo(Play);
