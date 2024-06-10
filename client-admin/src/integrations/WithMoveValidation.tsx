import ConditionForm from "@/components/atoms/piecePosition/ConditionFrom";
import PiecePosition from "@/components/atoms/piecePosition/piecePosition";
import { usePieceHistory } from "@/store/usePieceHistory";
import Chessboard from "chessboardjsx";
import { memo } from "react";
import HumanVsHuman from "./HumanVsHuman";
import { Square } from "chess.js";
import { calcWidth } from "@/helpers/chessboardCal";

function WithMoveValidation() {
  const fenString = usePieceHistory((s) => s.fenString);
  const fenEnabled = usePieceHistory((s) => s.fenEnabled);
  const allConditionStore = usePieceHistory((s) => s.allConditionStore);
  return (
    <div className="flex">
      <HumanVsHuman>
        {({
          position,
          onDrop,
          onMouseOverSquare,
          onMouseOutSquare,
          squareStyles,
          dropSquareStyle,
          onDragOverSquare,
          onSquareClick,
          onSquareRightClick,
        }) => (
          <Chessboard
            id="humanVsHuman"
            position={fenEnabled && fenString ? fenString : position}
            onDrop={(obj: { sourceSquare: Square; targetSquare: Square }) =>
              onDrop({
                from: obj.sourceSquare,
                to: obj.targetSquare,
              })
            }
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
            }}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDragOverSquare={onDragOverSquare}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            darkSquareStyle={{ backgroundColor: "#3498DB" }}
            lightSquareStyle={{ backgroundColor: "#ffffff" }}
            calcWidth={calcWidth}
          />
        )}
      </HumanVsHuman>

      <div className="flex min-w-[20rem] max-w-[36rem] flex-row overflow-x-scroll border border-1 border-gray-500 bg-[#F5FCFD] mx-2 rounded-md">
        {allConditionStore.map((conditionStore: any, key) => (
          <ConditionForm key={key} conditionStore={conditionStore} />
        ))}

        <PiecePosition />
      </div>
    </div>
  );
}
export default memo(WithMoveValidation);
