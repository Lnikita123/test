import React from "react";
import { useDrop } from "react-dnd";
const ChessSquare = ({
  board,
  rowIndex,
  colIndex,
  children,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  tool, // add the tool prop
  arrows, // add the arrows prop
  setArrows, // add the setArrows prop
  lines, // add the lines prop
  setLines, // add the setLines prop
  color,
  setSelectedSquareArr,
  selectedSquareArr,
  setSelectedScreenArr,
  selectedScreenArr,
}: any) => {
  const [{ isOver }, drop] = useDrop({
    accept: "chess-piece",
    drop: () => ({ rowIndex, colIndex }),
    // canDrop: (item) => board[rowIndex][colIndex] === null,
    canDrop: () => true,

    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  });
  const removeSelectedSquare = (selectedSquares: any[], position: string) => {
    return selectedSquares.filter((sq: any) => sq.position !== position);
  };

  const handleClick = () => {
    const newSquare = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
    if (tool === "delete") {
      // Remove arrows that start or end in the current square
      const filteredArrows = arrows.filter(
        (arrow: any) => arrow.start !== newSquare && arrow.end !== newSquare
      );
      setArrows(filteredArrows);
      // Remove lines that start or end in the current square
      const filteredLines = lines.filter(
        (line: any) => line.start !== newSquare && line.end !== newSquare
      );
      setLines(filteredLines);
    } else if (tool === "brush") {
      setSelectedSquareArr((prevSelectedSquares: any) => {
        const isSelected = prevSelectedSquares.some(
          (sq: any) => sq.position === newSquare
        );
        if (isSelected) {
          const updatedSelectedSquares = removeSelectedSquare(
            prevSelectedSquares,
            newSquare
          );
          console.log("Removing selected square:", updatedSelectedSquares);
          return updatedSelectedSquares;
        } else {
          const updatedSelectedSquares = [
            ...prevSelectedSquares,
            { position: newSquare, color },
          ];
          console.log("Adding new square:", updatedSelectedSquares);
          return updatedSelectedSquares;
        }
      });
    } else if (tool === "screen") {
      setSelectedScreenArr((prevSelectedSquares: any) => {
        const isSelected = prevSelectedSquares?.some(
          (sq: any) => sq.position === newSquare
        );
        if (isSelected) {
          return removeSelectedSquare(prevSelectedSquares, newSquare);
        } else {
          const updatedSelectedSquares = [
            ...prevSelectedSquares,
            { position: newSquare, color, animate: true },
          ];
          return updatedSelectedSquares;
        }
      });
    }
  };

  const colorToBackgroundColor: any = {
    red: "red",
    blue: "blue",
    green: "green",
    yellow: "yellow",
    black: "black",
    pink: "pink",
  };
  const selectedSquare = selectedSquareArr?.find(
    (sq: any) =>
      sq.position === `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`
  );
  const isSelected = Boolean(selectedSquare);
  const selectedScreen = selectedScreenArr?.find(
    (sq: any) =>
      sq.position === `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`
  );
  const isScreenSelected = Boolean(selectedScreen);
  const getSelectedClassName = (
    isSelected: boolean,
    isScreenSelected: boolean
  ) => {
    if (isScreenSelected) {
      return `animate-pulse border`;
    }
    if (isSelected) {
      return `border`;
    }
    return "";
  };
  const renderRowNumber = () => {
    if (colIndex === 0) {
      return (
        <div className="text-xs justify-start text-gray-600">
          {8 - rowIndex}
        </div>
      );
    }
    return null;
  };

  const renderColumnLetter = () => {
    if (rowIndex === 7) {
      return (
        <div className="text-xs text-gray-600">
          {String.fromCharCode(97 + colIndex)}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      ref={drop}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        backgroundColor: isScreenSelected
          ? colorToBackgroundColor[selectedScreen.color]
          : isSelected
          ? colorToBackgroundColor[selectedSquare.color]
          : "",
      }}
      className={`sm:w-12 sm:h-12 2xl:h-24 2xl:w-24 flex justify-center items-center ${
        (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-gray-400"
      } ${getSelectedClassName(isSelected, isScreenSelected)} `}
    >
      <div>{children}</div>
      <div className="self-end sm:self-auto">{renderRowNumber()}</div>
      <div className="self-end sm:self-auto">{renderColumnLetter()}</div>
    </div>
  );
};

export default ChessSquare;
