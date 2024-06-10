import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { calcWidth } from "@/helpers/chessboardCal";
import { useBoardStore } from "@/store/useBoardStore";
import { usePieceHistory } from "@/store/usePieceHistory";
import Fenstring from "../piecePosition/Fenstring";
import { Alert } from "@mui/material";

const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
function BoardMovement() {
  const [popUp, setPopUp] = useState(false);
  const selectedSquare = useBoardStore((s) => s.selectedSquare);
  const setSelectedSquare = useBoardStore((s) => s.setSelectedSquare);
  const boardMoves = useBoardStore((s) => s.boardMoves);
  const setBoardMoves = useBoardStore((s) => s.setBoardMoves);
  const [isBoardclick, setIsBoardClick] = useState<boolean>(false);
  const [hideInputField, setHideInputField] = useState<boolean>(false);
  const [onClickAdd, setOnClickAdd] = useState<boolean>(true);
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
  async function addNow() {
    const moves = Array.from(new Set(selectedSquare));
    setBoardMoves(moves); // Convert selectedSquare to a Set to remove duplicates, and convert back to array
    setHideInputField(!hideInputField);
    await updateBoard(moves);
  }

  const getSelectedSquareStyles = () => {
    const styles: any = {};
    selectedSquare.forEach((square) => {
      styles[square] = {
        backgroundColor: "#03A9F4",
        border: "1px solid white",
      };
    });
    return styles;
  };
  // const editBoardMovements = () => {
  //   setSelectedSquare(boardMoves);
  //   setIsBoardClick(!isBoardclick);
  //   setOnClickAdd(true);
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSelectedSquare([]);
    } else {
      const squares = value.split(",");
      const uniqueSquares = squares.filter(
        (square) => !selectedSquare.includes(square)
      );
      setSelectedSquare([...selectedSquare, ...uniqueSquares]);
    }
    const deletedSquares = selectedSquare.filter(
      (square) => !value.includes(square)
    );
    if (deletedSquares.length > 0) {
      const updatedSquares = selectedSquare.filter(
        (square) => !deletedSquares.includes(square)
      );
      setSelectedSquare(updatedSquares);
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
      let dataB = await response.json();
      let data = dataB.data;
      const board = data.board.AddedBlocks;
      setBoardMoves(board);
      setSelectedSquare(board);
      console.log("boar", board);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getApi();
  }, [selectPageId]);
  const updateBoard = useCallback(
    async (moves: string[]) => {
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
              board: { AddedBlocks: moves },
              pieceMove: [],
              dropPieces: [],
            }),
          }
        );

        const res = await response.json();
        if (res.status === 200 || res.status === true) {
          showPopUp(); // Display the popup if the data is successfully stored
        }
        console.log("PUT", res);
        const board = res.data.board;
        let boardMovesData = board.AddedBlocks;
        setSelectedSquare(boardMovesData);
      } catch (error) {
        console.log(error);
      }
    },
    [boardMoves, selectPageId]
  );

  const fenString = usePieceHistory((s) => s.fenString);
  const fenEnabled = usePieceHistory((s) => s.fenEnabled);
  const showPopUp = () => {
    setPopUp(true);
    setTimeout(() => {
      setPopUp(false);
    }, 3000); // Hide the popup after 3 seconds (3000 milliseconds)
  };
  return (
    <div className="flex flex-row">
      <div id="boardPreview">
        <Chessboard
          position={fenEnabled && fenString ? fenString : "start"}
          calcWidth={calcWidth}
          onSquareClick={(square) => {
            if (selectedSquare.includes(square)) {
              // If the square is already selected, remove it from the array
              setSelectedSquare(selectedSquare.filter((s) => s !== square));
            } else {
              // If the square is not selected, add it to the array
              setSelectedSquare([...selectedSquare, square]);
            }
          }}
          squareStyles={getSelectedSquareStyles()}
          darkSquareStyle={{ backgroundColor: "#A8A8A8" }}
          lightSquareStyle={{ backgroundColor: "#ffffff" }}
        />
        <div className={`my-5`}>{<Fenstring />}</div>
      </div>

      <div className="bg-[#C2E7FF] py-3 mx-2 px-[5rem] text-right flex justify-center ">
        <div className="border-black-700">
          <br />
          {onClickAdd && (
            <>
              <p
                className="my-4"
                style={{
                  fontSize: "20px",
                  fontWeight: "medium",
                  textAlign: "center",
                }}
              >
                Select square in board
              </p>
              <label htmlFor="selectBoard"></label>
              <input
                id="selectBoard"
                type="text"
                value={selectedSquare.join(",")}
                className="px-3 py-1 bg-[#FFFFFF] rounded-lg shadow-lg w-80 "
                onChange={handleInputChange}
              />
              <br />
              <div className="flex justify-col transition-transform duration-300 hover:scale-105">
                <button
                  onClick={addNow}
                  className="bg-[#FFFFFF] mx-2 my-4 text-[#01579B] px-6 py-1 rounded-full"
                >
                  Add blocks
                </button>

                <br />
              </div>

              {popUp && (
                <div>
                  <Alert severity="success">Data is succesfully stored!</Alert>
                </div>
              )}
            </>
          )}
          <br />
          <div className="flex flex-row items-center justify-center ">
            <div className="flex flex-col">
              <div>
                {!onClickAdd && (
                  <p className="font-semibold text-2xl my-3">AddedBlocks</p>
                )}
              </div>
              <div className="grid grid-flow-row-dense grid-cols-5">
                {boardMoves?.map((move, index) => (
                  <p key={index} className="mx-2 my-2 text-md font-semibold">
                    {move}
                  </p>
                ))}
              </div>
              {/* <button
                className="mx-2 bg-red-500 px-5 rounded-xl text-white transition-transform duration-300 hover:scale-110"
                type="button"
                onClick={() => editBoardMovements()}
              >
                edit
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardMovement;
