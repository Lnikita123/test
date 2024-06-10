import { renderColumnLetter, renderRowNumber } from "@/helpers/chessboardCal";
import { getChessImageNotation, getChessImageSrc } from "@/store/ChessElements";
import { colorToTailwind } from "@/styles/Home";
import html2canvas from "html2canvas";
import React, { useRef, useState, useEffect, memo } from "react";
import imageCompression from "browser-image-compression";

let width = 0;
export const responsiveScreen = {
  height: "10vh",
  width:
    width >= 1280 && width < 1536 // lg breakpoint
      ? "6vw"
      : width >= 1536 && width < 1920 // xl breakpoint
      ? "6vw"
      : width >= 1920 // 2xl breakpoint
      ? "5.5vw"
      : "5vw", // For smaller sizes
};
type ChessboardStaticProps = {
  positions: any[];
  setPositions: React.Dispatch<React.SetStateAction<any[]>>;
  pieces: { location: string; pieceName: string }[];
  setPieces: React.Dispatch<
    React.SetStateAction<{ location: string; pieceName: string }[]>
  >;
  arrowPercentages: any[];
  setArrowPercentages: React.Dispatch<React.SetStateAction<any[]>>;
  linePercentages: any[];
  setLinePercentages: React.Dispatch<React.SetStateAction<any[]>>;
  brush: any[];
  setBrush: React.Dispatch<React.SetStateAction<any[]>>;
  screen: any[];
  setScreen: React.Dispatch<React.SetStateAction<any[]>>;
  fenString: string;
  setFenString: (fenString: string) => void;
  onChessboardCapture: (imageData: string) => void;
};

const ChessboardStatic = ({
  positions,
  setPositions,
  pieces,
  setPieces,
  arrowPercentages,
  setArrowPercentages,
  linePercentages,
  setLinePercentages,
  brush,
  setBrush,
  screen,
  setScreen,
  fenString,
  setFenString,
  onChessboardCapture,
}: ChessboardStaticProps) => {
  // const [isCanvasUpdating, setIsCanvasUpdating] = useState(false);
  const isUpdatingRef = useRef(false);
  const canvasRef = useRef<any>(null);
  const chessboardWrapperRef = useRef<any>(null);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const board = Array.from({ length: 8 }, (_, rowIndex) =>
    Array(8)
      .fill({ color: "", piece: "" })
      .map((cell, colIndex) => {
        if ((rowIndex + colIndex) % 2 === 0) {
          return { ...cell, color: "bg-white", border: "border-gray-500" };
        } else {
          return { ...cell, color: "bg-gray-400", border: "border-gray-500" };
        }
      })
  );
  const [chessBoard, setChessBoard] = useState(board);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const chessboard = chessboardRef.current;
    const chessboardRect: DOMRect | undefined =
      chessboard?.getBoundingClientRect();
    canvas.width = chessboardRect?.width;
    canvas.height = chessboardRect?.height;

    arrowPercentages.forEach((arrow) => {
      const startX = (arrow.start.x * canvas.width) / 100;
      const startY = (arrow.start.y * canvas.height) / 100;
      const endX = (arrow.end.x * canvas.width) / 100;
      const endY = (arrow.end.y * canvas.height) / 100;
      const headLength = 20;
      const angle = Math.atan2(endY - startY, endX - startX);

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

    linePercentages.forEach((line) => {
      const startX = (line.start.x * canvas.width) / 100;
      const startY = (line.start.y * canvas.height) / 100;
      const endX = (line.end.x * canvas.width) / 100;
      const endY = (line.end.y * canvas.height) / 100;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 5;
      ctx.stroke();
    });
  }, [arrowPercentages, linePercentages, fenString, brush, screen, pieces]);

  useEffect(() => {
    const prepareCanvases = async () => {
      if (chessboardRef.current && canvasRef.current) {
        const chessboardCanvas = await html2canvas(chessboardRef.current, {
          logging: false, // Disable logging for performance improvement
        });

        const arrowsCanvas = document.createElement("canvas");
        arrowsCanvas.width = chessboardCanvas.width;
        arrowsCanvas.height = chessboardCanvas.height;

        const lineCanvas = document.createElement("canvas");
        lineCanvas.width = chessboardCanvas.width;
        lineCanvas.height = chessboardCanvas.height;

        const arrowsContext = arrowsCanvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        const lineContext = lineCanvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        arrowPercentages.forEach((arrow) => {
          // Draw the arrow based on the arrow coordinates
          const startX = (arrow.start.x * arrowsCanvas.width) / 100;
          const startY = (arrow.start.y * arrowsCanvas.height) / 100;
          const endX = (arrow.end.x * arrowsCanvas.width) / 100;
          const endY = (arrow.end.y * arrowsCanvas.height) / 100;
          const headLength = 10;
          const angle = Math.atan2(endY - startY, endX - startX);

          arrowsContext.beginPath();
          arrowsContext.moveTo(startX, startY);
          arrowsContext.lineTo(
            endX - headLength * Math.cos(angle),
            endY - headLength * Math.sin(angle)
          );

          arrowsContext.strokeStyle = arrow.color;
          arrowsContext.lineWidth = 5;
          arrowsContext.stroke();

          // Draw the arrowhead
          arrowsContext.save();
          arrowsContext.translate(
            endX - headLength * Math.cos(angle),
            endY - headLength * Math.sin(angle)
          );

          arrowsContext.rotate(angle);

          arrowsContext.beginPath();
          arrowsContext.moveTo(0, 0);
          arrowsContext.lineTo(-headLength, headLength / 2);

          arrowsContext.moveTo(0, 0);
          arrowsContext.lineTo(-headLength, -headLength / 2);
          arrowsContext.strokeStyle = arrow.color;

          arrowsContext.stroke();
          arrowsContext.lineWidth = 5;
          arrowsContext.restore();
        });
        // Draw lines on lineCanvas based on the linePercentages state
        linePercentages.forEach((line) => {
          // Draw the line based on the line coordinates
          lineContext.beginPath();
          lineContext.moveTo(
            (line.start.x * lineCanvas.width) / 100,
            (line.start.y * lineCanvas.height) / 100
          );
          lineContext.lineTo(
            (line.end.x * lineCanvas.width) / 100,
            (line.end.y * lineCanvas.height) / 100
          );
          lineContext.strokeStyle = line.color;
          lineContext.lineWidth = 5;
          lineContext.stroke();
        });
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve())
        );

        // Returns the prepared canvases
        return { chessboardCanvas, arrowsCanvas, lineCanvas };
      }
    };
    const captureChessboard = async () => {
      try {
        if (chessboardRef.current && canvasRef.current) {
          const { chessboardCanvas, arrowsCanvas, lineCanvas }: any =
            await prepareCanvases();
          // Combine the chessboardCanvas, arrowsCanvas, and lineCanvas
          const combinedCanvas = document.createElement("canvas");
          combinedCanvas.width = chessboardCanvas.width;
          combinedCanvas.height = chessboardCanvas.height;
          const combinedContext = combinedCanvas.getContext(
            "2d"
          ) as CanvasRenderingContext2D;
          combinedContext.drawImage(chessboardCanvas, 0, 0);
          combinedContext.drawImage(arrowsCanvas, 0, 0);
          combinedContext.drawImage(lineCanvas, 0, 0);

          // Convert the combinedCanvas to a data URL
          // Convert the combinedCanvas to a data URL
          const image = combinedCanvas.toDataURL("image/png");
          const file = await fetch(image)
            .then((res) => res.blob())
            .then(
              (blob) => new File([blob], "filename", { type: "image/png" })
            );

          // Log the original image size
          console.log(
            "Original file size:",
            (file.size / 1024).toFixed(2),
            "kB"
          );

          // Compress the image
          const options = {
            maxSizeMB: 1, // (default: Number.POSITIVE_INFINITY)
            maxWidthOrHeight: 1920, // (default: undefined)
            useWebWorker: true, // (default: true)
            maxIteration: 10, // (default: 10)
            quality: 1, // (default: 1)
            convertSize: 0, // (default: 0)
          };

          const compressedFile = await imageCompression(file, options);

          // Log the compressed image size
          console.log(
            "Compressed file size:",
            (compressedFile.size / 1024).toFixed(2),
            "kB"
          );

          // Convert the compressed file back to a data URL
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = function () {
            const base64data = reader.result;

            // Pass the captured image data URL to the parent component
            onChessboardCapture(base64data as string);
          };

          combinedContext.clearRect(
            0,
            0,
            combinedCanvas.width,
            combinedCanvas.height
          );
        }
      } catch (error) {
        console.log("Capture Chessboard error:", error);
      }
    };
    const prepareBoard = async () => {
      if (fenString) {
        await parseFen(fenString); // assuming parseFen returns a Promise
      }
      const newBoard = board.map((row, i) =>
        row.map((cell, j) => {
          const position = `${String.fromCharCode(97 + j)}${8 - i}`;
          const brushSquare = brush.find((b) => b.position === position);
          const screenSquare = screen.find((s) => s.position === position);
          const piecesSquare = pieces.find((p) => p.location === position);

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
            ...cell,
            piece: piece,
            color: colorClassName + animateClassName,
          };
        })
      );
      setChessBoard(newBoard);
      await prepareCanvases();
    };
    const updateChessboard = async () => {
      await prepareBoard();
      await captureChessboard();
    };
    if (!isUpdatingRef.current) {
      isUpdatingRef.current = true;
      updateChessboard().finally(() => {
        isUpdatingRef.current = false;
      });
    }
  }, [arrowPercentages, linePercentages, fenString, brush, screen, pieces]);
  async function parseFen(fen: string) {
    const [fenData, _] = fen?.split(" ");
    const rows = fenData.split("/");
    const pieces = rows.map((row) =>
      row.replace(/[0-9]/g, (n) => " ".repeat(parseInt(n, 10))).split("")
    );
    pieces.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        let square: { color: string; piece?: string } = {
          color: (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-gray-400",
        };

        if (piece !== " ") {
          square.piece = getChessImageNotation(piece);
        }

        board[rowIndex][colIndex] = square;
      });
    });

    setChessBoard(board);
  }
  useEffect(() => {
    console.log("set fen", fenString);
    if (fenString) {
      parseFen(fenString);
    }
  }, [fenString]);
  return (
    <div ref={chessboardWrapperRef} className="flex justify-center">
      <div className="w-max h-max relative">
        <div
          ref={chessboardRef}
          className="grid grid-cols-8 border border-1 border-gray-500"
        >
          {chessBoard.map((row, rowIndex) =>
            row.map((square, colIndex) => (
              <div
                style={responsiveScreen}
                key={`${rowIndex}-${colIndex}`}
                className={`flex items-center justify-center ${square?.color} border border-1 ${square?.border}`}
              >
                <div className="self-end sm:self-auto">
                  {renderRowNumber(rowIndex, colIndex)}
                </div>
                <div className="self-end sm:self-auto">
                  {renderColumnLetter(rowIndex, colIndex)}
                </div>
                {chessBoard[rowIndex][colIndex]?.piece && (
                  <img
                    src={chessBoard[rowIndex][colIndex]?.piece}
                    alt=""
                    className="w-1/2 h-1/2 object-cover"
                  />
                )}
              </div>
            ))
          )}
        </div>
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>
    </div>
  );
};

export default memo(ChessboardStatic);
