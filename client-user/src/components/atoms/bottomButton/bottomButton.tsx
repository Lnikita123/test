import React, { useRef } from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosRefresh,
  IoIosBulb,
} from "react-icons/io";
type BottomButtonProps = {
  onClickNextButton: () => void;
  onClickBackButton: () => void;
  onClickHintButton: () => void;
  onClickPositionHintButton: () => void;
  onClickReadyButton: () => void;
  onClickOkayButton: () => void;
  onClickRedoButton: () => void;
  onClickRevealButton: () => void;
  interactionHint: boolean;
  highlightSquares: string[];
  bottomMcq: () => void;
  ready: boolean;
  reveal: boolean;
  hint: boolean;
  type: string;
  redo: boolean;
  proceed: boolean;
  proceedInteraction: boolean;
  displayhint: boolean;
  toggleReady: boolean;
  redoVisible: boolean;
  pages: any;
  currentPage: number;
  displayReveal: boolean;
};
const BottomButton = ({
  onClickNextButton,
  onClickBackButton,
  onClickHintButton,
  onClickPositionHintButton,
  onClickReadyButton,
  onClickOkayButton,
  onClickRedoButton,
  onClickRevealButton,
  interactionHint,
  highlightSquares,
  bottomMcq,
  ready,
  reveal,
  hint,
  type,
  redo,
  proceed,
  proceedInteraction,
  displayhint,
  toggleReady,
  redoVisible,
  pages,
  currentPage,
  displayReveal,
}: BottomButtonProps) => {
  return (
    <>
      <div className="font-bold flex justify-between justify-items-stretch items-center">
        <div onClick={() => onClickBackButton()}>
          <button className="ml-5 justify-self-start transition-transform duration-300 hover:scale-110 bg-[#583469] text-[#FFFFFF] px-5 py-2 rounded-full flex items-center">
            <IoIosArrowBack className="text-[#fff]" />
            <span className="text-[#fff]">Back</span>
          </button>
        </div>
        {redoVisible && type === "board" && (
          <div onClick={onClickRedoButton}>
            <button className="mx-5 transition-transform duration-300 hover:scale-110 bg-[#583469] text-[#FFFFFF] px-5 py-2 rounded-full flex items-center">
              <IoIosRefresh className="text-[#fff]" />
              <span className="text-[#fff]">Redo</span>
            </button>
          </div>
        )}
        {(type === "pieceMove" || type === "board" || type === "drop") && (
          <div
            onClick={onClickRevealButton}
            className={`mx-5 ${
              displayReveal
                ? "bg-[#583469] text-[#FFFFFF] rounded-full pointer-events-auto"
                : "border-[#583469] bg-white rounded-full border border-1 text-[#583469] pointer-events-none"
            }`}
          >
            <button className="transition-transform duration-300 hover:scale-110 px-5 py-2 flex items-center">
              <IoIosBulb
                className={`${
                  displayReveal ? "text-[#fff]" : "text-[#583469]"
                }`}
              />
              <span>Reveal</span>
            </button>
          </div>
        )}
        {/* <div> */}
        {displayhint && type === "position" && (
          <button
            className="mx-5 transition-transform duration-300 hover:scale-110 bg-[#583469] text-[#FFFFFF] px-5 py-2 rounded-full flex items-center"
            onClick={() => onClickPositionHintButton()}
          >
            <IoIosBulb className="text-[#fff]" />
            <span className="text-[#fff]">Hint</span>
          </button>
        )}
        {interactionHint && type !== "position" && (
          <button
            className="mx-5 transition-transform duration-300 hover:scale-110 bg-[#583469] text-[#FFFFFF] px-5 py-2 rounded-full flex items-center"
            onClick={() => onClickHintButton()}
          >
            <IoIosBulb className="text-[#fff]" />
            <span className="text-[#fff]">Hint</span>
          </button>
        )}
        {/* </div> */}
        {!ready ? (
          <>
            <div
              onClick={onClickReadyButton}
              className={`mr-5 px-2 justify-self-end transition-transform duration-300 hover:scale-110 ${
                proceed || proceedInteraction
                  ? "bg-[#583469] text-[#FFFFFF] pointer-events-auto rounded-full"
                  : "border border-1 border-[#583469] rounded-full bg-white text-[#583469] pointer-events-none"
              }`}
            >
              <button className={`flex items-center`}>
                <span className="px-3 py-2">
                  {toggleReady ? "Ready" : "Next"}
                </span>
                <IoIosArrowForward className="text-[#bbb]" />
              </button>
            </div>
          </>
        ) : (
          <>
            {highlightSquares &&
              highlightSquares.length > 0 &&
              type !== "pieceMove" &&
              type !== "drop" &&
              type !== "position" &&
              !reveal && (
                <div onClick={onClickOkayButton}>
                  <button className="transition-transform duration-300 hover:scale-110 bg-[#583469] text-[#FFFFFF] rounded-full flex items-center">
                    <span className="px-7 py-2 text-[#fff]">Ok</span>
                  </button>
                </div>
              )}
            <div
              onClick={onClickNextButton}
              className={`mr-5 justify-self-end ${
                proceedInteraction
                  ? "bg-[#583469] text-[#FFFFFF] rounded-full pointer-events-auto"
                  : "border-[#583469] bg-white rounded-full border border-1 text-[#583469] pointer-events-none"
              }`}
            >
              <button className="transition-transform duration-300 hover:scale-110 px-5 py-2 flex items-center">
                <span>Next</span>
                <IoIosArrowForward />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BottomButton;
