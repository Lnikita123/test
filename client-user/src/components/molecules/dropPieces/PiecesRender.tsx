import { ChessElements } from "@/store/ChessElements";
import React, { useEffect, useState } from "react";
import ChessPiece from "./ChessPieces";

const PiecesRender = ({ dropPieces }: any) => {
  console.log("dropPieces", dropPieces);
  const [isMatch, setIsMatch] = useState(false);
  useEffect(() => {
    const match = dropPieces?.some((dropPiece: any) =>
      ChessElements.some((ele) => dropPiece.imageName === ele.name)
    );
    setIsMatch(!!match);
  }, [dropPieces, ChessElements]);
  return (
    <>
      <div className="grid grid-cols-4 gap-10 justify-items-center place-items-center">
        {ChessElements.map((ele: any, index: number) => {
          if (
            isMatch
              ? dropPieces?.some(
                  (dropPiece: any) => dropPiece.imageName === ele.name
                )
              : true
          ) {
            return <ChessPiece key={index} piece={ele} initial />;
          }
        })}
      </div>
    </>
  );
};

export default PiecesRender;
