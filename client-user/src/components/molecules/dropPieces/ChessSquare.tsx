import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
const ChessSquare = ({
  responsiveScreen,
  rowIndex,
  colIndex,
  children,
  onPieceDrop,
  board,
  reveal,
}: any) => {
  const { width, height } = responsiveScreen;
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "chess-piece",
    drop: (item) => {
      onPieceDrop({ toRow: rowIndex, toCol: colIndex, item });
      return item;
    },
    canDrop: (item) => board[rowIndex][colIndex] === null,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });
  const renderRowNumber = () => {
    if (colIndex === 0) {
      return (
        <div
          style={{ margin: "2px" }}
          className="text-xs absolute top-0 left-0"
        >
          {8 - rowIndex}
        </div>
      );
    }
    return null;
  };

  const renderColumnLetter = () => {
    if (rowIndex === 7) {
      return (
        <div
          style={{ margin: "2px" }}
          className="text-xs absolute bottom-0 right-0"
        >
          {String.fromCharCode(97 + colIndex)}
        </div>
      );
    }
    return null;
  };
  const defaultColor = (rowIndex + colIndex) % 2 === 0 ? "white" : "#C4BEE9";
  const recolor = board[rowIndex][colIndex]?.backgroundColor;
  const [squareStyle, setSquareStyle] = useState({});

  useEffect(() => {
    const newStyle = recolor ? { backgroundColor: recolor } : {};
    setSquareStyle(newStyle);
  }, [reveal, recolor]);

  const defaultStyle = {
    backgroundColor: defaultColor,
    width: width,
    height: height,
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div
      ref={drop}
      style={{ ...defaultStyle, ...squareStyle }}
      className={`${
        isOver
          ? "bg-yellow-500"
          : (rowIndex + colIndex) % 2 === 0
          ? "bg-white"
          : "bg-[#C4BEE9]"
      } relative flex flex-row justify-center items-center border border-1 ${
        (rowIndex + colIndex) % 2 === 0 ? "text-black" : "text-white"
      }`}
    >
      <div>
        {children}
        {renderRowNumber()}
        {renderColumnLetter()}
      </div>
    </div>
  );
};

export default ChessSquare;
