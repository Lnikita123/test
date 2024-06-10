import { getSkillSet, killSound, playSound } from "@/helpers/playComputer";
import { squareStyles as initialStyles } from "@/store/useCustomizedPieces";
import { usePlayComputer } from "@/store/usePlayComputer";
import Chess from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess not being a constructor
import { memo, useEffect, useState } from "react";
//import pieceMove from "@/components/assets/move.mp3";
//@ts-ignore
const STOCKFISH: any = typeof window !== "undefined" ? window?.STOCKFISH : null;
//@ts-ignore
let game = new Chess();

function Stockfish(props: any) {
  const {
    playerColor,
    shouldRestart,
    isGameStarted,
    position,
    setShouldRestart,
    reStart,
    prevHistory,
    setTempPosition,
    selectedTimer,
  } = props;
  const [state, setState] = useState<{ fen: string }>({
    fen: position,
  });
  const [gameHistory, setGameHistory] = useState<Array<string>>([]);
  const [squareStyles, setSquareStyles] = useState(initialStyles);
  const [pieceSquare, setPieceSquare] = useState("");
  const [userCheckmate, setUserCheckmate] = useState<boolean>(false);
  const [aiCheckmate, setAiCheckmate] = useState(false);
  const [history, setHistory] = useState<Array<string>>([]);
  const label = usePlayComputer((s) => s.label);
  useEffect(() => {
    if (isGameStarted) {
      if (shouldRestart && (reStart === "black" || reStart === "white")) {
        //@ts-ignore
        game = new Chess();
        setShouldRestart(false); // Reset shouldRestart to false
      } else if (position) {
        game.load_pgn(position);
      }
      setState({ fen: game.fen() });
      //@ts-ignore
      engineGame().prepareMove();
    }
  }, [isGameStarted, shouldRestart, position]);

  function isCheckmate() {
    return game.in_checkmate();
  }
  const onDrop = async ({ sourceSquare, targetSquare }: any) => {
    if (!isGameStarted) return;
    // see if the move is legal
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    // illegal move
    if (move === null) return;
    // updating the history of user
    if (move.captured) {
      killSound();
    } else {
      playSound();
    }
    const history = game.history({ verbose: true });
    const newHistory = [...prevHistory, ...history]; // Combine the old history with the new moves
    setGameHistory(
      newHistory.map(
        (move) => move.from + move.to + (move.promotion ? move.promotion : "")
      )
    );
    // const pieceMoveSound = new Audio(pieceMove);
    // pieceMoveSound.play();
    setTempPosition(null);
    if (isCheckmate()) {
      setUserCheckmate(true);
    }
    return new Promise((resolve) => {
      setState({ fen: game.fen() });
      //@ts-ignore
      resolve();
      //@ts-ignore
    }).then(() => engineGame().prepareMove());
  };
  useEffect(() => {
    console.log("gameHistory", gameHistory);
  }, [gameHistory]);
  useEffect(() => {
    console.log("selectedTimer", selectedTimer);
  }, [selectedTimer]);
  const highlightSquare = (
    sourceSquare: string,
    squaresToHighlight: string[]
  ) => {
    const highlightStyle = {
      background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
      borderRadius: "50%",
    };
    const updatedStyles: any = {};

    // Preserve the 'alignItems: center' style for all squares
    for (const square in initialStyles) {
      updatedStyles[square] = {
        ...initialStyles[square],
        ...(squaresToHighlight.includes(square) ? highlightStyle : {}),
      };
    }

    setSquareStyles(updatedStyles);
  };

  const removeHighlightSquare = () => {
    setSquareStyles(initialStyles);
  };

  const onMouseOverSquare = (square: string) => {
    if (!isGameStarted) return;
    setPieceSquare(square);

    let moves = game.moves({
      square: square,
      verbose: true,
    });

    if (moves.length === 0) return;

    let squaresToHighlight = moves.map((move: any) => move.to);

    highlightSquare(square, squaresToHighlight);
  };

  const onMouseOutSquare = (square: string) => {
    setPieceSquare("");
    removeHighlightSquare();
  };

  const onDragOverSquare = (square: string) => {
    let moves = game.moves({
      square: pieceSquare,
      verbose: true,
    });

    if (moves.find((move: any) => move.to === square)) {
      setSquareStyles((prev) => ({
        ...prev,
        [square]: {
          ...initialStyles[square],
          backgroundColor: "cornFlowerBlue", // change to desired color
        },
      }));
    }
  };
  const engineGame = (options: any) => {
    options = options || {};

    /// We can load Stockfish via Web Workers or via STOCKFISH() if loaded from a <script> tag.
    let engine =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(options.stockfishjs || "stockfish.js");
    // setting difficulty level 0-20 0:easy mode 10: medium mode 20: hard mode

    engine.postMessage(
      `setoption name Skill Level value ${getSkillSet(label)}`
    );
    let evaler =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(options.stockfishjs || "stockfish.js");
    let engineStatus: Record<string, any> = {};
    let time: Record<string, any> = {
      wtime: selectedTimer,
      btime: selectedTimer,
      winc: 10,
      binc: 10,
    };

    let clockTimeoutID = null;
    // let isEngineRunning = false;
    let announced_game_over: boolean = false;
    // do not pick up pieces if the game is over
    // only pick up pieces for White

    setInterval(function () {
      if (announced_game_over) {
        return;
      }

      if (game.game_over()) {
        announced_game_over = true;
      }
    }, 500);

    function uciCmd(cmd: string, which?: Worker | undefined): void {
      (which || engine).postMessage(cmd);
    }

    uciCmd("uci");

    function clockTick(): void {
      let t: number =
        (time.clockColor === "white" ? time.wtime : time.btime) +
        time.startTime -
        Date.now();
      let timeToNextSecond: number = (t % 1000) + 1;
      clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
    }

    function stopClock(): void {
      let clockTimeoutID: number | null = null;
      if (clockTimeoutID !== null) {
        clearTimeout(clockTimeoutID);
        clockTimeoutID = null;
      }
      if (time.startTime > 0) {
        let elapsed: number = Date.now() - time.startTime;
        time.startTime = null;
        if (time.clockColor === "white") {
          time.wtime = Math.max(0, time.wtime - elapsed);
        } else {
          time.btime = Math.max(0, time.btime - elapsed);
        }
      }
    }

    function startClock() {
      if (game.turn() === "w") {
        time.wtime += time.winc;
        time.clockColor = "white";
      } else {
        time.btime += time.binc;
        time.clockColor = "black";
      }
      time.startTime = Date.now();
      clockTick();
    }

    function get_moves() {
      let moves = "";
      let history = game.history({ verbose: true });

      for (let i = 0; i < history.length; ++i) {
        let move = history[i];
        moves +=
          " " + move.from + move.to + (move.promotion ? move.promotion : "");
      }

      return moves;
    }
    const prepareMove = () => {
      stopClock();
      // setState({ fen: game.fen() });
      if (!isGameStarted) return;
      let turn = game.turn() === "w" ? "white" : "black";
      if (!game.game_over()) {
        // if (turn === playerColor) {
        if (turn !== playerColor) {
          // playerColor = playerColor === 'white' ? 'black' : 'white';
          uciCmd("position startpos moves" + get_moves());
          uciCmd("position startpos moves" + get_moves(), evaler);
          uciCmd("eval", evaler);

          if (time && time.wtime) {
            uciCmd(
              "go " +
                (time.depth ? "depth " + time.depth : "") +
                " wtime " +
                time.wtime +
                " winc " +
                time.winc +
                " btime " +
                time.btime +
                " binc " +
                time.binc
            );
          } else {
            uciCmd("go " + (time.depth ? "depth " + time.depth : ""));
          }
          // isEngineRunning = true;
        }
        if (game.history().length >= 2 && !time.depth && !time.nodes) {
          startClock();
        }
      }
    };

    evaler.onmessage = function (event: any) {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }
      if (
        line === "uciok" ||
        line === "readyok" ||
        line.substr(0, 11) === "option name"
      ) {
        return;
      }
    };

    engine.onmessage = async (event: any) => {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }
      // console.log('Reply: ' + line);
      if (line === "uciok") {
        engineStatus.engineLoaded = true;
      } else if (line === "readyok") {
        engineStatus.engineReady = true;
      } else {
        let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
        /// Did the AI move?
        if (match) {
          const targetSquareContentBeforeMove = game.get(match[2]);
          game.move({ from: match[1], to: match[2], promotion: match[3] });
          if (targetSquareContentBeforeMove) {
            killSound();
          } else {
            playSound();
          }
          // updating the history of system
          const history = game.history({ verbose: true });
          const newHistory = [...prevHistory, ...history]; // Combine the old history with the new moves
          setGameHistory(
            newHistory.map(
              (move) =>
                move.from + move.to + (move.promotion ? move.promotion : "")
            )
          );
          setTempPosition(null);
          setState({ fen: game.fen() });
          prepareMove();
          uciCmd("eval", evaler);
          if (isCheckmate()) {
            setAiCheckmate(true);
          }
          //uciCmd("eval");
          /// Is it sending feedback?
        } else if (
          (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))
        ) {
          engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
        }

        /// Is it sending feed back with a score?
        if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
          let score = parseInt(match[2], 10) * (game.turn() === "w" ? 1 : -1);
          /// Is it measuring in centipawns?
          if (match[1] === "cp") {
            engineStatus.score = (score / 100.0).toFixed(2);
            /// Did it find a mate?
          } else if (match[1] === "mate") {
            engineStatus.score = "Mate in " + Math.abs(score);
          }

          /// Is the score bounded?
          if ((match = line.match(/\b(upper|lower)bound\b/))) {
            engineStatus.score =
              ((match[1] === "upper") === (game.turn() === "w")
                ? "<= "
                : ">= ") + engineStatus.score;
          }
          console.log("score:", engineStatus.score);
        }
      }
      // displayStatus();
    };

    return {
      start: function () {
        uciCmd("ucinewgame");
        uciCmd("isready");
        engineStatus.engineReady = false;
        engineStatus.search = null;
        prepareMove();
        announced_game_over = false;
      },
      prepareMove: function () {
        prepareMove();
      },
    };
  };

  const { fen } = state;
  return props.children({
    position: fen,
    onDrop: onDrop,
    pgn: gameHistory,
    onMouseOverSquare: onMouseOverSquare,
    onMouseOutSquare: onMouseOutSquare,
    onDragOverSquare: onDragOverSquare,
    squareStyles: squareStyles,
    chess: game,
    userCheckmate: userCheckmate,
    aiCheckmate: aiCheckmate,
    history: history,
  });
}

export default memo(Stockfish);
