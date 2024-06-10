import { usePieceHistory } from "@/store/usePieceHistory";
import React, { useEffect } from "react";

const Fenstring = () => {
  const fenString = usePieceHistory((s) => s.fenString);
  const setFenString = usePieceHistory((s) => s.setFenString);
  const fenEnabled = usePieceHistory((s) => s.fenEnabled);
  const setFenEnabled = usePieceHistory((s) => s.setFenEnabled);
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
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
      const dataB = await response.json();
      const data = dataB.data;
      console.log("dp", data);
      const fenString = data?.position ? data?.position[0]?.fenString : "";
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
  function parseFen(fen: string) {
    setFenString(fen);
    setFenEnabled(true);
  }
  return (
    <div className="bg-[#ffffff] flex flex-row border border-1 border-gray-300">
      <input
        type="checkbox"
        className="mx-2"
        checked={fenEnabled}
        onChange={(e) => {
          if (e.target.checked) {
            if (fenString) {
              setFenEnabled(true);
            }
          } else {
            setFenEnabled(false);
          }
        }}
      />

      {fenString ? (
        <input
          className="w-full px-2"
          type="text"
          onChange={(e) => parseFen(e.target.value)}
          value={fenString}
        />
      ) : (
        <input
          className="w-full px-2"
          type="text"
          onChange={(e) => parseFen(e.target.value)}
          placeholder="Enter a FEN string..."
        />
      )}
    </div>
  );
};

export default Fenstring;
