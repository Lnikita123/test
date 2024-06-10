import { killSound, playSound } from "@/helpers/playComputer";
import { squareStyles as initialStyles } from "@/store/useCustomizedPieces";
import Chess from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess not being a constructor
import { memo, useEffect, useState } from "react";

//@ts-ignore
const STOCKFISH: any = typeof window !== "undefined" ? window?.STOCKFISH : null;

function Stockfish(props: any) {
  const {
    isGameStarted,
    position,
    prevHistory,
    setTempPosition,
    setFen,
    setPgn,
    pgn,
    solution,
    initialPly,
    timer,
    highlightLastSquare,
    tempSolution,
    setTempSolution,
  } = props;
  //@ts-ignore
  let game = new Chess(position);
  const [state, setState] = useState<{ fen: string }>({
    fen: position,
  });
  const [gameHistory, setGameHistory] = useState<Array<string>>([]);
  const [squareStyles, setSquareStyles] = useState(initialStyles);
  const [pieceSquare, setPieceSquare] = useState("");
  const [currentMove, setCurrentMove] = useState(0);
  const [playerColor, setPlayerColor] = useState("black");
  const [currentAIMove, setCurrentAIMove] = useState(0);
  const [userCheckmate, setUserCheckmate] = useState<boolean>(false);
  const [aiCheckmate, setAiCheckmate] = useState(false);
  const [storeAnswer, setStoreAnswer] = useState<Array<string>>([]);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  function isCheckmate() {
    //setStoreAnswer([]);
    return game.in_checkmate();
  }
  // Add useEffect for engine's turn
  useEffect(() => {
    if (initialPly % 2 === 0) {
      game.turn("w"); // Set to white's turn
      setPlayerColor("black");
    } else {
      game.turn("b"); // Set to black's turn
      setPlayerColor("white");
    }
  }, [initialPly]);
  useEffect(() => {
    setGameHistory(pgn);
  }, [pgn]);
  useEffect(() => {
    setState({ fen: position });
    if (currentMove % 2 === 0) {
      //@ts-ignore
      engineGame().prepareMove();
    }
  }, [position]);
  useEffect(() => {
    console.log("tempsol", tempSolution);
  }, [tempSolution]);

  const onDrop = ({ sourceSquare, targetSquare }: any) => {
    if (!isGameStarted) return;
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (!move || move.from + move.to !== solution[currentMove]) {
      setWrongCount((prev) => prev + 1);
      setStoreAnswer((prev) => [...prev, "wrong"]);
    } else if (move.from + move.to === solution[currentMove]) {
      setCorrectCount((prev) => prev + 1);
      setStoreAnswer((prev) => [...prev, "correct"]);
      setTempSolution((prev: any) => {
        return prev.filter((sol: any) => sol !== move.from + move.to);
      });
    }
    if (!move) return;
    if (move.captured) {
      killSound();
    } else {
      playSound();
    }
    const pieceMove = move?.from + move?.to;
    if (pieceMove !== solution[currentMove]) {
      game.undo(); // undo the move
      return "snapback";
    }
    setGameHistory((prev) => [...prev, move?.san]);
    const newPosition = game.fen();
    setState({ fen: newPosition });
    setFen(newPosition);
    setCurrentMove(currentMove + 1);
    if (currentMove >= solution.length - 1) {
      // If solution steps are over, end the game
      game.game_over();
      setGameOver(true);
      return;
    }
    if (isCheckmate()) {
      setUserCheckmate(true);
    }
    if (currentMove % 2 === 0) {
      //@ts-ignore
      engineGame().prepareMove();
    } else {
      // If solution steps are over, end the game
      game.game_over();
      setGameOver(true);
    }
  };
  useEffect(() => {
    if (highlightLastSquare.length > 0) {
      const highlightStyle = {
        background: "yellow",
      };
      const updatedStyles: any = {};

      // Preserve the 'alignItems: center' style for all squares
      for (const square in initialStyles) {
        updatedStyles[square] = {
          ...initialStyles[square],
          ...(highlightLastSquare.includes(square) ? highlightStyle : {}),
        };
      }

      setSquareStyles(updatedStyles);
    }
  }, [highlightLastSquare]);

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
  const onSquareClick = (square: string) => {
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

  const engineGame = (options: any) => {
    options = options || {};

    /// We can load Stockfish via Web Workers or via STOCKFISH() if loaded from a <script> tag.
    let engine =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(options.stockfishjs || "stockfish.js");
    // setting difficulty level 0-20 0:easy mode 10: medium mode 20: hard mode
    let evaler =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(options.stockfishjs || "stockfish.js");
    let engineStatus: Record<string, any> = {};
    let time: Record<string, any> = {
      wtime: timer * 60,
      btime: timer * 60,
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

      // Check if the time has run out for any player
      if (time.wtime <= 0) {
        // White's time ran out
        // set time out state
        game.game_over();
        return;
      } else if (time.btime <= 0) {
        // Black's time ran out
        // set time out state
        game.game_over();
        return;
      }

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
      if (!isGameStarted || game.game_over()) return;
      let turn = game.turn() === "w" ? "white" : "black";
      if (!game.game_over()) {
        if (turn !== playerColor) {
          // AI's turn
          // Adding delay of 1 seconds before AI's move
          setTimeout(() => {
            if (currentAIMove * 2 + 1 < solution.length) {
              console.log("current AI", currentAIMove);
              console.log("usermove", currentMove);
              // Get next move from solution array
              const nextMove = solution[currentAIMove * 2 + 1];
              const from = nextMove.slice(0, 2);
              const to = nextMove.slice(2);

              // Make the move
              let moves = game.move({
                from,
                to,
                promotion: "q",
              });
              if (!moves) return;
              if (moves.captured) {
                killSound();
              } else {
                playSound();
              }
              console.log("game", moves);
              // Update position and increment currentMove
              const newPosition = game.fen();
              setState({ fen: newPosition });
              setFen(newPosition);
              setCurrentAIMove(currentAIMove + 1);
              setCurrentMove(currentMove + 2);
              setGameHistory((prev) => [...prev, moves.san]);
              setTempSolution((prev: any) => {
                return prev.filter((sol: any) => sol !== from + to);
              });
            } else {
              // If solution steps are over, end the game
              game.game_over();
              setGameOver(true);
            }
          }, 1000);
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
          game.move({ from: match[1], to: match[2], promotion: match[3] });
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
    game: game,
    playerColor: playerColor,
    userCheckmate: userCheckmate,
    aiCheckmate: aiCheckmate,
    // wrongCount: wrongCount,
    // correctCount: correctCount,
    storeAnswer: storeAnswer,
    setStoreAnswer: setStoreAnswer,
    onSquareClick: onSquareClick,
    gameOver: gameOver,
  });
}

export default memo(Stockfish);
