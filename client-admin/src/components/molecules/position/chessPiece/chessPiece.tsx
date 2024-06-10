import Image from "next/image";
import React from "react";
import { useDrag } from "react-dnd";

const ChessPiece = ({ piece, rowIndex, colIndex, onPieceRemove }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: "chess-piece",
    item: { piece, fromRow: rowIndex, fromCol: colIndex, onPieceRemove },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult == null) {
        handlePieceRemove(rowIndex, colIndex, location);
      }
    },
  });
  const handlePieceRemove = (
    rowIndex: number,
    colIndex: number,
    location: any
  ) => {
    if (onPieceRemove) {
      onPieceRemove(rowIndex, colIndex, location);
    }
  };
  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0 : 1,
      }}
      className="p-3"
    >
      <Image priority src={piece?.src} alt={"img"} height={40} width={60} />
    </div>
  );
};

export default ChessPiece;
