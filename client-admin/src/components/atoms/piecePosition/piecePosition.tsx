import { useGameStore } from "@/store/useGameStore";
import { memo, useEffect, useState } from "react";
import ConditionForm from "./ConditionFrom";
import { IConditionsStore, usePieceHistory } from "@/store/usePieceHistory";
import { isEmpty } from "lodash";
import { Alert } from "@mui/material";
const PiecePosition = () => {
  const [popUp, setPopUp] = useState(false);

  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }

  const conditionStore = usePieceHistory((s) => s.conditionStore);
  const allConditionStore = usePieceHistory((s) => s.allConditionStore);
  const setAllConditionStore = usePieceHistory((s) => s.setAllConditionStore);
  const setActiveConditionType = usePieceHistory(
    (s) => (type: keyof IConditionsStore) => {
      if (type === "user" || type === "system") {
        s.setActiveConditionType(type);
      }
    }
  );

  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
  const updateAllConditionStore = usePieceHistory(
    (s) => s.updateAllConditionStore
  );
  const reset = useGameStore((s) => s.reset);
  const setReset = useGameStore((s) => s.setReset);
  const setFenString = usePieceHistory((s) => s.setFenString);
  const addCondition = async () => {
    await updateBoard();
    updateAllConditionStore();
    setActiveConditionType("user");
    setReset(true);
    await getApi();
    setFenString(fen);
  };

  const updateBoard = async () => {
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
            pieceMove: [...allConditionStore, conditionStore],
            board: {},
            dropPieces: [],
          }),
        }
      );
      const res = await response.json();
      const result = res.data.pieceMove;
      if (result && (res.status === true || res.status === 200)) {
        showPopUp(); // Display the popup if the data is successfully stored
      }
      console.log("PUT", res);
    } catch (error) {
      console.log(error);
    }
  };
  let fen: any;
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
      const res = await response.json();
      console.log("GET", res);
      fen = res?.data?.position[0]?.fenString;
      if (fen) {
        setFenString(fen);
      }
      const pieceMove = res?.data?.pieceMove;
      console.log("PM", pieceMove);
      if (pieceMove) {
        setAllConditionStore(pieceMove); // set the state if pieceMove is defined
        localStorage?.setItem("AllPieceMoves", JSON.stringify(pieceMove)); // storing array of object as string
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
    }, 3000); // Hide the popup after 10 seconds (3000 milliseconds)
  };
  const deleteApi = async () => {
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
            pieceMove: [],
          }),
        }
      );
      const res = await response.json();
      console.log("Delete", res);
      const pieceMove = res?.data?.pieceMove;
      setAllConditionStore(pieceMove);
      setReset(true);
      await getApi();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="bg-[#03A9F4]">
        <ConditionForm conditionStore={conditionStore} />

        <button
          className="m-3 hover:scale-110 transition-transform duration-300 hover:bg-indigo-500 hover:text-white bg-white p-2 rounded-lg text-[#01579B] border border-[#01579B]"
          onClick={() => addCondition()}
        >
          Save / Add Condition
        </button>
        {popUp && (
          <div>
            <Alert severity="success">Data is succesfully stored!</Alert>
          </div>
        )}
        <button
          className="text-white px-2 py-1 bg-red-400 rounded-xl hover:scale-110 transition-transform duration-300"
          onClick={deleteApi}
        >
          Delete All
        </button>
      </div>
    </>
  );
};

export default PiecePosition;
