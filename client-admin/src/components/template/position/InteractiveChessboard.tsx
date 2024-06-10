//@ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import ChessPiece from "@/components/molecules/position/chessPiece/chessPiece";
import ChessSquare from "@/components/molecules/position/chessSquare/chessSquare";
import { animationStyle } from "@/styles/Home";
import {
  ChessElements,
  getChessImageSrc,
  getChessNotationByObject,
  getChessObjectByNotation,
} from "@/store/ChessElements";
import { useDrop } from "react-dnd";
import Image from "next/image";
import Arrow from "../../../../public/Arrow.svg";
import Line from "../../../../public/Line.svg";
import Brush from "../../../../public/Brush.svg";
import Delete from "../../../../public/Delete.svg";
import screen from "../../../../public/screen.svg";
import {
  drawShape,
  isPointInTriangle,
  isPointNearLine,
} from "@/helpers/calculations";
import { useInteraction, ArrowLineType } from "@/store/useInteraction";
import { usePieceHistory } from "@/store/usePieceHistory";
import { Alert } from "@mui/material";

const InteractiveChessboard = () => {
  const canvasRef = useRef<any>(null);
  const chessboardWrapperRef = useRef<any>(null);
  const chessboardRef = React.useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<Array<Array<any>>>(
    Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
  );
  const setFenStringZ = usePieceHistory((s) => s.setFenString);
  const [selectedSquare, setSelectedSquare] = useState<string>();
  const { color, setColor } = useInteraction();
  const colors = ["red", "green", "yellow", "black", "pink"];
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [fenString, setFenString] = useState("");
  const [arrows, setArrows] = useState<
    Array<{
      start: { x: number; y: number };
      end: { x: number; y: number };
      color: string;
      head?:
      | {
        a: { x: number; y: number };
        b: { x: number; y: number };
        c: { x: number; y: number };
      }
      | undefined;
    }>
  >([]);
  const [isShapesClicked, setIsShapesClicked] = useState<boolean>(true);
  const [isPiecesClicked, setIsPiecesClicked] = useState<boolean>(false);
  const [togglePieces, setTogglePieces] = useState<string>("");
  const [tool, setTool] = useState<
    "arrow" | "line" | "brush" | "delete" | "screen" | null
  >(null);
  const [lines, setLines] = useState<
    Array<{
      start: { x: number; y: number };
      end: { x: number; y: number };
      color: string;
    }>
  >([]);
  const [selectedSquareArr, setSelectedSquareArr] = useState<any[]>([]);
  const [selectedScreenArr, setSelectedScreenArr] = useState<any[]>([]);
  const [arrowPerc, setArrowPerc] = useState<
    Array<{
      start: { x: number; y: number };
      end: { x: number; y: number };
      color: string;
      head?:
      | {
        a: { x: number; y: number };
        b: { x: number; y: number };
        c: { x: number; y: number };
      }
      | undefined;
    }>
  >([]);
  const [linePerc, setLinePerc] = useState<
    Array<{
      start: { x: number; y: number };
      end: { x: number; y: number };
      color: string;
    }>
  >([]);
  const [pieces, setPieces] = useState<any[]>([]);
  const positionZ = useInteraction((s) => s.positionZ);
  const setPositionZ = useInteraction((s) => s.setPositionZ);
  const [positions, setPositions] = useState<any[]>([]);
  const [fenEnabled, setFenEnabled] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [generatedFen, setGeneratedFen] = useState(false);
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
          board[rowIndex][colIndex] = getChessObjectByNotation(piece);
        }

        colIndex++;
      });
    });

    setBoard(board);
    setFenString(fen);
  }
  useEffect(() => {
    if (positions?.length > 0) {
      setPositionZ(positions);
    }
  }, [positions]);
  useEffect(() => {
    setPositions(positionZ);
  }, []);
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
  function toggleCanvasBoard(ele: string) {
    if (ele === "chessPieces") {
      setTool(null);
      setTogglePieces("chessPieces");
      setIsShapesClicked(false);
      setIsPiecesClicked(true);
    } else if (ele === "shapes") {
      setTogglePieces("shapes");
      setIsShapesClicked(true);
      setIsPiecesClicked(false);
    } else if (ele === "paint") {
      setIsShapesClicked(false);
      setIsPiecesClicked(true);
    }
  }
  function selectTool(
    selectedTool: "arrow" | "line" | "brush" | "delete" | "screen"
  ) {
    setTool(selectedTool);
  }
  useEffect(() => {
    console.log("pieces", pieces);
    console.log("arrows", arrows);
    console.log("lines", lines);
    console.log("brush", selectedSquareArr);
    console.log("screen", selectedScreenArr);

    console.log("fenstring", fenString);
  }, [pieces, arrows, lines, selectedSquareArr, selectedScreenArr, fenString]);

  // updating with empty board
  const deleteApi = async () => {
    alert("This will clear the board");
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/updatePage/${selectPageId}`,
        {
          mode: "cors",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            position: [{}],
          }),
        }
      );
      const res = await response.json();
      console.log("PUT", res);
      setPositions(res?.data?.position);
      setFenString("");
      setFenEnabled(false);
      // calling get api
      await getApi();
    } catch (error) {
      console.log(error);
    }
  };
  // updating with new position
  async function onClickSave() {
    await saveAllApi(fenString);
  }
  const saveAllApi = async (fenString: string) => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/updatePage/${selectPageId}`,
        {
          mode: "cors",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            position: {
              arrows: arrows,
              pieces: pieces,
              arrowsPercentage: arrowPerc,
              lines: lines,
              linesPercentage: linePerc,
              brush: selectedSquareArr,
              screen: selectedScreenArr,
              fenString: fenEnabled ? fenString : "",
            },
          }),
        }
      );
      const res = await response.json();
      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored
      }
      console.log("PUT", res);
      const position = res?.data?.position;
      setPositions(position);
    } catch (error) {
      console.log(error);
    }
  };
  const getApi = async () => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/getPages/${selectPageId}`,
        {
          mode: "cors",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("dp", data);
      setPositions(data?.data?.position);
      const position = data?.data?.position;
      const pieces = Array.isArray(position[0]?.pieces)
        ? position[0]?.pieces
        : [];
      const arrows = Array.isArray(position[0]?.arrows)
        ? position[0]?.arrows
        : [];
      const lines = Array.isArray(position[0]?.lines) ? position[0]?.lines : [];
      const selectedSquareArr = Array.isArray(position[0]?.brush)
        ? position[0]?.brush
        : [];
      const selectedScreenArr = Array.isArray(position[0]?.screen)
        ? position[0]?.screen
        : [];
      const arrowPerc = Array.isArray(position[0]?.arrowsPercentage)
        ? position[0]?.arrowsPercentage
        : [];
      const linePerc = Array.isArray(position[0]?.linesPercentage)
        ? position[0]?.linesPercentage
        : [];
      const fenString = position[0]?.fenString;
      const newBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const locationToIndices = (location: string) => {
        const colIndex = location.charCodeAt(0) - "a".charCodeAt(0);
        const rowIndex = 8 - parseInt(location[1], 10);
        return { rowIndex, colIndex };
      };

      pieces?.forEach(({ location, pieceName }: any) => {
        console.log("l", location, pieceName);
        const { rowIndex, colIndex } = locationToIndices(location);
        newBoard[rowIndex][colIndex] = {
          src: getChessImageSrc(pieceName),
        };
      });

      console.log("getBoard", newBoard);
      setBoard(newBoard);

      // Update useState variables here

      setPieces(pieces);
      setArrowPerc(arrowPerc);
      setLinePerc(linePerc);
      setArrows(arrows);
      setLines(lines);
      setSelectedSquareArr(selectedSquareArr);
      setSelectedScreenArr(selectedScreenArr);
      setFenString(fenString);
      if (fenString) {
        setFenEnabled(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getApi();
  }, []);
  const showPopUp = () => {
    setPopUp(true);
    setTimeout(() => {
      setPopUp(false);
    }, 3000); // Hide the popup after 3 seconds (3000 milliseconds)
  };
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    const chessboard = chessboardRef.current;
    const chessboardRect: DOMRect | undefined =
      chessboard?.getBoundingClientRect();
    if (isShapesClicked) {
      canvas.width = chessboardRect?.width;
      canvas.height = chessboardRect?.height;
    } else {
      canvas.width = 0;
      canvas.height = 0;
    }
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }
    if (!ctx) {
      return;
    }
    // Set the stroke color
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    // Draw all the arrows
    if (Array.isArray(arrows)) {
      arrows?.forEach((arrow) => {
        const arrowObject: ArrowLineType = {
          start: arrow.start,
          end: arrow.end,
          color: arrow.color, // Use the appropriate color for the arrow
        };
        drawShape(ctx, arrowObject, "arrow");
      });
    }

    // Draw all the lines
    lines?.forEach((line) => {
      const lineObject: ArrowLineType = {
        start: line.start,
        end: line.end,
        color: line.color, // Use the appropriate color for the line
      };
      drawShape(ctx, lineObject, "line");
    });
    // mouse down
    const handleMouseDown = (
      event: MouseEvent,
      rowIndex: number,
      colIndex: number
    ) => {
      const chessboardWrapper = chessboardWrapperRef?.current;
      const style = getComputedStyle(chessboardWrapper);
      const paddingLeft = parseInt(style.paddingLeft, 10);
      const paddingTop = parseInt(style.paddingTop, 10);
      const marginLeft = parseInt(style.marginLeft, 10);
      const marginTop = parseInt(style.marginTop, 10);
      const position = {
        x: event.clientX - chessboardRect?.left - (paddingLeft + marginLeft),
        y: event.clientY - chessboardRect?.top - (marginTop + paddingTop),
      };
      if ((tool === "arrow" || tool === "line") && !isDragging) {
        setIsDragging(true);
        setStartPos({
          x: event.clientX - chessboardRect?.left - (paddingLeft + marginLeft),
          y: event.clientY - chessboardRect?.top - (marginTop + paddingTop),
        });
      }
      if (tool === "delete") {
        handleDelete(position);
      }
    };
    // delete functionality for arrows and lines on clicking
    function handleDelete(position: { x: number; y: number }) {
      const ArrowTolerance = 50; // adjust as needed, the tolerance distance for detecting clicks near shapes
      const LineTolerance = 2; // adjust as needed, the tolerance distance for detecting
      const chessboard = chessboardRef.current;
      const chessboardRect = chessboard?.getBoundingClientRect();
      const boardWidth = chessboardRect?.width ?? 1;
      const boardHeight = chessboardRect?.height ?? 1;

      // Filter arrows and arrowPerc together
      let newArrows: any = [];
      let newArrowPerc: any = [];
      arrows.forEach((arrow, index) => {
        if (
          !isPointNearLine(position, arrow.start, arrow.end, ArrowTolerance) &&
          (arrow.head === undefined || !isPointInTriangle(position, arrow.head))
        ) {
          newArrows.push(arrow);
          newArrowPerc.push(arrowPerc[index]);
        }
      });
      setArrows(newArrows);
      setArrowPerc(newArrowPerc);

      // Filter lines and linePerc together
      let newLines: any = [];
      let newLinePerc: any = [];
      lines.forEach((line, index) => {
        if (!isPointNearLine(position, line.start, line.end, LineTolerance)) {
          newLines.push(line);
          newLinePerc.push(linePerc[index]);
        }
      });
      setLines(newLines);
      setLinePerc(newLinePerc);
    }

    // mousemovement functionality
    const handleMouseMove = (
      event: MouseEvent,
      rowIndex: number,
      colIndex: number
    ) => {
      if (!startPos || !isDragging) {
        return;
      }

      const chessboardWrapper = chessboardWrapperRef?.current;
      if (!chessboardWrapper) {
        return;
      }
      const chessboard = chessboardRef.current;
      const chessboardRect = chessboard?.getBoundingClientRect();
      const style = getComputedStyle(chessboardWrapper);
      const paddingLeft = parseInt(style.paddingLeft, 10);
      const paddingTop = parseInt(style.paddingTop, 10);
      const marginLeft = parseInt(style.marginLeft, 10);
      const marginTop = parseInt(style.marginTop, 10);
      const X =
        event.clientX - chessboardRect?.left - (marginLeft + paddingLeft);
      const Y = event.clientY - chessboardRect?.top - (marginTop + paddingTop);
      const endPos = { x: X, y: Y };
      const arrowLength = Math.sqrt(
        (endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2
      );

      // Define a minimum length for the arrow
      const minArrowLength = 20; // Adjust this value as needed

      // If the arrow is too short, ignore the rest of the function
      if (arrowLength < minArrowLength) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      arrows?.forEach((arrow) => {
        drawShape(ctx, arrow, "arrow");
      });

      lines?.forEach((line) => {
        drawShape(ctx, line, "line");
      });
      if (tool === "arrow" || tool === "line") {
        if (tool === "arrow" || tool === "line") {
          const shapeObject: ArrowLineType = {
            start: startPos,
            end: endPos,
            color: color,
          };
          drawShape(ctx, shapeObject, tool);
        }
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      setIsDragging(false);
      if (!startPos) {
        return;
      }

      const chessboardWrapper = chessboardWrapperRef?.current;

      if (!chessboardWrapper) {
        return;
      }
      const chessboard = chessboardRef.current;
      const chessboardRect = chessboard?.getBoundingClientRect();
      const boardWidth = chessboardRect?.width ?? 1;
      const boardHeight = chessboardRect?.height ?? 1;
      const style = getComputedStyle(chessboardWrapper);
      const paddingLeft = parseInt(style.paddingLeft, 10);
      const paddingTop = parseInt(style.paddingTop, 10);
      const marginLeft = parseInt(style.marginLeft, 10);
      const marginTop = parseInt(style.marginTop, 10);
      const X =
        event.clientX - chessboardRect?.left - (marginLeft + paddingLeft);
      const Y = event.clientY - chessboardRect?.top - (marginTop + paddingTop);
      const endPos = { x: X, y: Y };
      const arrowLength = Math.sqrt(
        (endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2
      );

      // Define a minimum length for the arrow
      const minArrowLength = 20; // Adjust this value as needed

      // If the arrow is too short, ignore the rest of the function
      if (arrowLength < minArrowLength) {
        return;
      }
      const relativeStartPos = {
        x: (startPos.x / boardWidth) * 100,
        y: (startPos.y / boardHeight) * 100,
      };
      const relativeEndPos = {
        x: (endPos.x / boardWidth) * 100,
        y: (endPos.y / boardHeight) * 100,
      };
      const convertStartPixels = {
        x: (relativeStartPos.x / 100) * boardWidth,
        y: (relativeStartPos.y / boardHeight) * 100,
      };
      const convertEndPixels = {
        x: (relativeEndPos.x / 100) * boardWidth,
        y: (relativeEndPos.y / boardHeight) * 100,
      };
      setPositions((prev: any) => {
        if (!Array.isArray(prev)) {
          return [];
        } else {
          const previousMoves = [...prev];
          const nextMoves = {
            arrows: arrows,
            lines: lines,
            arrowsPercentage: arrowPerc,
            linesPercentage: linePerc,
            brush: selectedSquareArr,
            screen: selectedScreenArr,
            pieces: pieces,
            fenString: fenString,
          };
          previousMoves.push(nextMoves);
          return previousMoves;
        }
      });
      if (tool === "arrow") {
        setArrowPerc([
          ...arrowPerc,
          { start: relativeStartPos, end: relativeEndPos, color },
        ]);
      } else if (tool === "line") {
        setLinePerc([
          ...linePerc,
          { start: relativeStartPos, end: relativeEndPos, color },
        ]);
      }
      if (tool === "arrow") {
        setArrows([...arrows, { start: startPos, end: endPos, color }]);
      } else if (tool === "line") {
        setLines([...lines, { start: startPos, end: endPos, color }]);
      }

      console.log("drawn from", startPos, "to", endPos);

      setStartPos(null);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    canvasRef,
    startPos,
    arrows,
    isShapesClicked,
    lines,
    tool,
    setArrows,
    setTool,
    setLines,
    setStartPos,
    color,
  ]);

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    setSelectedSquare(`${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`);
  };
  const handleSquareMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowIndex: number,
    colIndex: number
  ) => {
    const canvas = canvasRef.current;
    const chessboard = chessboardRef?.current;
    const chessboardWrapper = chessboardWrapperRef?.current;
    if (!canvas || !chessboard) {
      return;
    }
    const chessboardRect = chessboard?.getBoundingClientRect();
    const style = getComputedStyle(chessboardWrapper);
    const paddingLeft = parseInt(style.paddingLeft, 10);
    const paddingTop = parseInt(style.paddingTop, 10);
    const marginLeft = parseInt(style.marginLeft, 10);
    const marginTop = parseInt(style.marginTop, 10);
    const X = event.clientX - chessboardRect?.left - (marginLeft + paddingLeft);
    const Y = event.clientY - chessboardRect?.top - (marginTop + paddingTop);

    setStartPos({ x: X, y: Y });
  };

  const handleSquareMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (!startPos) {
      return;
    }
    const canvas = canvasRef.current;
    const chessboardWrapper = chessboardWrapperRef?.current;
    if (!canvas || !chessboardWrapper) {
      return;
    }
    const chessboard = chessboardRef?.current;
    const chessboardRect = chessboard?.getBoundingClientRect();
    const style = getComputedStyle(chessboardWrapper);
    const paddingLeft = parseInt(style.paddingLeft, 10);
    const paddingTop = parseInt(style.paddingTop, 10);
    const marginLeft = parseInt(style.marginLeft, 10);
    const marginTop = parseInt(style.marginTop, 10);
    // const X = event.clientX - (marginLeft + paddingLeft);
    // const Y = event.clientY - (marginTop + paddingTop);
    const X = event.clientX - chessboardRect?.left - (marginLeft + paddingLeft);
    const Y = event.clientY - chessboardRect?.top - (marginTop + paddingTop);
    const endPos = { x: X, y: Y };
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (tool === "arrow" || tool === "line") {
      const shapeObject: ArrowLineType = {
        start: startPos,
        end: endPos,
        color: color,
      };
      drawShape(ctx, shapeObject, tool);
    }
  };

  const handleSquareMouseUp = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (!startPos) {
      return;
    }
    const canvas = canvasRef.current;
    const chessboard = chessboardRef?.current;
    const chessboardWrapper = chessboardWrapperRef?.current;
    if (!canvas || !chessboard) {
      return;
    }
    const chessboardRect = chessboard?.getBoundingClientRect();
    const style = getComputedStyle(chessboardWrapper);
    const paddingLeft = parseInt(style.paddingLeft, 10);
    const paddingTop = parseInt(style.paddingTop, 10);
    const marginLeft = parseInt(style.marginLeft, 10);
    const marginTop = parseInt(style.marginTop, 10);
    // const X = event.clientX - (marginLeft + paddingLeft);
    // const Y = event.clientY - (marginTop + paddingTop);
    const X = event.clientX - chessboardRect?.left - (marginLeft + paddingLeft);
    const Y = event.clientY - chessboardRect?.top - (marginTop + paddingTop);
    const endPos = { x: X, y: Y };
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    if (tool === "arrow" || tool === "line") {
      if (tool === "arrow" || tool === "line") {
        const shapeObject: ArrowLineType = {
          start: startPos,
          end: endPos,
          color: color,
        };
        drawShape(ctx, shapeObject, tool);
      }
    }
    setStartPos(null);
  };
  const handleSquareDrop = (
    fromCol: number | undefined,
    fromRow: number | undefined,
    toRow: number,
    toCol: number,
    piece: any
  ) => {
    // Extract the original position from the piece
    // const { fromRow, fromCol } = piece;
    console.log("fromRow, fromCol", fromRow, fromCol);
    console.log("toRow, toCol", toRow, toCol);
    setBoard((prevBoard) => {
      if (!Array.isArray(prevBoard)) {
        return [];
      } else {
        const newBoard = [...prevBoard];
        newBoard[toRow] = [...newBoard[toRow]];
        newBoard[toRow][toCol] = piece; // always place the piece at the drop position

        // If fromRow and fromCol are not undefined, remove the piece from its original position
        if (fromRow !== undefined && fromCol !== undefined) {
          newBoard[fromRow] = [...newBoard[fromRow]];
          newBoard[fromRow][fromCol] = null; // or ""
        }
        console.log("newBoard", newBoard);
        return newBoard;
      }
    });
  };

  // drop pieces on board
  const [, drop] = useDrop(() => ({
    accept: "chess-piece",
    drop: (item: any, monitor) => {
      const { piece, fromRow, fromCol } = item;
      const dropResult = monitor.getDropResult();
      console.log("fromRC", fromRow, fromCol);
      if (dropResult) {
        const { rowIndex, colIndex }: any = dropResult;
        const isOutOfBounds =
          rowIndex < 0 || rowIndex >= 8 || colIndex < 0 || colIndex >= 8;

        if (isOutOfBounds) {
          const updatedBoard = [...board];
          updatedBoard[rowIndex][colIndex] = null;
          setBoard(updatedBoard);
          // Piece is being dropped outside the board boundaries, remove it from the board
          // Update your state or perform any other necessary actions
          console.log("Piece dropped out of bounds");
        }
        handleSquareDrop(fromCol, fromRow, rowIndex, colIndex, piece);
        console.log(
          "is dropped at",
          `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`,
          piece.src.src,
          piece.name
        );
        setPieces((prev: any[]) => {
          if (!Array.isArray(prev)) {
            return [];
          } else {
            const previousPieces = [...prev];

            // Convert the fromRow and fromCol to a location string
            const fromLocation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow
              }`;

            // Find the piece in the previousPieces array and remove it
            const pieceIndex = previousPieces.findIndex(
              (p) => p.location === fromLocation
            );
            if (pieceIndex !== -1) {
              previousPieces.splice(pieceIndex, 1);
            }

            // Add the moved piece to the previousPieces array
            const toLocation = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex
              }`;
            const nextPiece = {
              location: toLocation,
              pieceName: piece.name,
            };

            previousPieces.push(nextPiece);
            console.log(previousPieces);
            return previousPieces;
          }
        });
      }
    },
  }));
  const clearBoard = () => {
    const emptyBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    setBoard(emptyBoard);
  };
  useEffect(() => {
    if (fenEnabled && fenString) {
      parseFen(fenString);
    } else {
      clearBoard();
    }
  }, [fenEnabled, fenString]);
  async function generateFen(board: any) {
    let fen = "";

    for (let row = 0; row < 8; row++) {
      let emptySquares = 0;
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          if (emptySquares) {
            fen += emptySquares;
            emptySquares = 0;
          }
          fen += getChessNotationByObject(piece);
        } else {
          emptySquares++;
        }
      }
      if (emptySquares) {
        fen += emptySquares;
      }
      if (row < 7) {
        fen += "/";
      }
    }

    // Get the current FEN string from the input tag
    const currentFenString = fenString; // Replace with the actual value from your input tag

    // Split the current FEN string into its parts
    const parts = currentFenString.split(" ");
    // Append the last part of the current FEN string to the new FEN string
    if (parts.length >= 2) {
      fen += " " + parts.slice(1).join(" ");
    }
    console.log("fen", fen);
    setFenString(fen);
    setFenStringZ(fen);
    showFenPopup();
    setPieces([]);
    return fen;
  }
  const showFenPopup = () => {
    setGeneratedFen(true);
    setTimeout(() => {
      setGeneratedFen(false);
    }, 3000); // Hide the popup after 3 seconds (3000 milliseconds)
  };
  const calcWidth = () => {
    return Math.min(window.innerWidth, window.innerHeight) * 0.7;
  };
  const [boardSize, setBoardSize] = useState(calcWidth());
  useEffect(() => {
    const handleResize = () => setBoardSize(calcWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);
  const handlePieceRemove = (
    rowIndex: number,
    colIndex: number,
    location: any
  ) => {
    setPieces((prev) => {
      if (!Array.isArray(prev)) {
        return [];
      } else {
        const previousPieces = [...prev];

        // Convert the fromRow and fromCol to a location string
        const toLocation = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex
          }`;

        // Find the piece in the previousPieces array and remove it
        const pieceIndex = previousPieces.findIndex(
          (p) => p.location === toLocation
        );
        if (pieceIndex !== -1) {
          previousPieces.splice(pieceIndex, 1);
        }
        return previousPieces;
      }
    });

    const updatedChessboard = [...board];

    // Set the square at the specified row and column to null or an empty value
    updatedChessboard[rowIndex][colIndex] = null;
    // Update the chessboard state or data structure with the updated value
    setBoard(updatedChessboard);
    console.log(board);
  };

  return (
    <>
      <div className="flex justify-around items-around">
        <div
          id="positionPreview"
          ref={chessboardWrapperRef}
          className="flex relative"
        >
          <canvas
            ref={canvasRef}
            className="absolute border border-5 border-indigo-500"
          />
          <div ref={drop} className="w-max h-max">
            <div
              ref={chessboardRef}
              className="grid grid-cols-8 border border-1 border-gray-500"
            >
              {board ? (
                board.map((row, rowIndex) =>
                  row.map((piece: any, colIndex: number) => (
                    <ChessSquare
                      key={`${rowIndex}-${colIndex}`}
                      rowIndex={rowIndex}
                      colIndex={colIndex}
                      selectedSquare={selectedSquare}
                      setSelectedSquareArr={setSelectedSquareArr}
                      selectedSquareArr={selectedSquareArr}
                      setSelectedScreenArr={setSelectedScreenArr}
                      selectedScreenArr={selectedScreenArr}
                      tool={tool}
                      arrows={arrows}
                      setArrows={setArrows}
                      lines={lines}
                      setLines={setLines}
                      color={color}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      onMouseDown={(event: any) =>
                        handleSquareMouseDown(event, rowIndex, colIndex)
                      }
                      onMouseMove={(event: any) =>
                        handleSquareMouseMove(event, rowIndex, colIndex)
                      }
                      onMouseUp={(event: any) =>
                        handleSquareMouseUp(event, rowIndex, colIndex)
                      }
                    >
                      {piece && (
                        <ChessPiece
                          onPieceRemove={handlePieceRemove}
                          fenEnabled={fenEnabled}
                          piece={piece}
                          rowIndex={rowIndex}
                          colIndex={colIndex}
                        />
                      )}
                      {selectedSquare ===
                        `${String.fromCharCode(97 + colIndex)}${8 - rowIndex
                        }` && (
                          <div className="text-sm text-indigo-500 font-medium text-center">{`${String.fromCharCode(
                            97 + colIndex
                          )}${8 - rowIndex}`}</div>
                        )}
                    </ChessSquare>
                  ))
                )
              ) : (
                <p>loading....</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="mx-3 flex">
            <input
              type="checkbox"
              className="mx-2"
              checked={fenEnabled}
              onChange={(e) => {
                setFenEnabled(e.target.checked);
              }}
            />
            <input
              className="px-2 rounded-xl border border-1 border-black md:w-[20rem] xl:w-[40rem]"
              type="text"
              value={fenString}
              onChange={(e) => parseFen(e.target.value)}
              placeholder="Enter a FEN string..."
            />
          </div>
          <div>
            <button
              onClick={() => generateFen(board)}
              className="rounded-xl bg-indigo-500 my-5 xl:text-xl md:py-1 md:px-2 md:text-sm xl:px-5 xl:py-2 text-white"
            >
              Generate Fenstring
            </button>
            {generatedFen && (
              <div className="my-2">
                <Alert severity="success">
                  Fenstring generated succesfully!
                </Alert>
              </div>
            )}
          </div>
          <div
            onClick={() => toggleCanvasBoard("chessPieces")}
            className={`border border-1 border-gray-300 p-3 ${isPiecesClicked ? "opacity-100" : "opacity-50"
              }`}
          >
            <div className="grid grid-cols-4 bg-white">
              {ChessElements.map((ele: any, index: number) => (
                <>
                  <ChessPiece key={index} piece={ele} />
                </>
              ))}
            </div>
          </div>
          <br />
          <div className="flex bg-white">
            <div
              onClick={() => toggleCanvasBoard("shapes")}
              className={`flex border border-1 border-gray ${isShapesClicked ? "opacity-100" : "opacity-50"
                }`}
            >
              <div
                className={`m-4 ${animationStyle}`}
                onClick={() => selectTool("arrow")}
              >
                <Image src={Arrow} alt="arrow" className="md:h-10 md:w-10" />
              </div>
              <div
                className={`m-4 ${animationStyle}`}
                onClick={() => selectTool("line")}
              >
                <Image src={Line} alt="line" className="md:h-10 md:w-10" />
              </div>
              <div
                className={`m-4 ${animationStyle}`}
                onClick={() => selectTool("delete")}
              >
                <Image src={Delete} alt="Delete" className="md:h-10 md:w-10" />
              </div>
            </div>
            <div
              onClick={() => toggleCanvasBoard("paint")}
              className={`flex border border-1 border-gray ${!isShapesClicked ? "opacity-100" : "opacity-50"
                }`}
            >
              <div
                className={`m-4 ${animationStyle}`}
                onClick={() => selectTool("brush")}
              >
                <Image src={Brush} alt="Brush" className="md:h-10 md:w-10" />
              </div>
              <div
                className={`m-4 ${animationStyle}`}
                onClick={() => selectTool("screen")}
              >
                <Image src={screen} alt="screen" className="md:h-10 md:w-10" />
              </div>
            </div>
          </div>
          <br />
          <div className="flex flex-row bg-white p-2">
            {colors.map((color, index) => (
              <div
                className="md:w-20 h-10 transition-transform duration-300 hover:scale-105"
                key={index}
                style={{
                  backgroundColor: color,
                  border: "1px solid black",
                  //display: "flex",
                  cursor: "pointer",
                }}
                onClick={() => setColor(color)}
              />
            ))}
          </div>
          <div className="flex flex-row my-4">
            <div>
              <button
                onClick={onClickSave}
                className="rounded-xl bg-indigo-500 mx-2 px-3 py-1 text-white"
              >
                Save All
              </button>
              {popUp && (
                <div className="my-2">
                  <Alert severity="success">Data is succesfully stored!</Alert>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={deleteApi}
                className="rounded-xl bg-red-500 mx-2 px-3 py-1 text-white"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InteractiveChessboard;
