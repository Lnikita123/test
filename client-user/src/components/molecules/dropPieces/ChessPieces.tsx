import Image from "next/image";
import React, { memo, useEffect, useState } from "react";
import { useDrag } from "react-dnd";

const ChessPiece = ({
  piece,
  rowIndex,
  colIndex,
  onPieceRemove,
  initial,
}: any) => {
  const [responsiveScreen, setResponsiveScreen] = useState({
    height: "0",
    width: "0",
  });
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      setWindowWidth(screenWidth);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);
    handleResize();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, [windowWidth]);

  let imageSize;
  if (windowWidth >= 1536) {
    imageSize = 80;
  } else if (windowWidth >= 1280) {
    imageSize = 60;
  } else {
    imageSize = 40;
  }
  const [{ isDragging }, drag] = useDrag({
    type: "chess-piece",
    item: { piece, fromRow: rowIndex, fromCol: colIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop() && !initial) {
        onPieceRemove({ fromRow: rowIndex, fromCol: colIndex });
      }
    },
  });

  return (
    <div ref={drag}>
      <Image
        src={piece?.src}
        alt={"img"}
        width={imageSize}
        height={imageSize}
      />
    </div>
  );
};

export default memo(ChessPiece);
