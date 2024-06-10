import React, { useEffect, useState } from "react";
import SaveButtonTopBottom from "../saveButtonTopBottom/saveButtonTopBottom";
import { Alert } from "@mui/material";
import { usePieceHistory } from "@/store/usePieceHistory";

const FenstringBox = () => {
  const fenstringInteraction = usePieceHistory((s) => s.fenstringInteraction);
  const setFenstringInteraction = usePieceHistory(
    (s) => s.setFenstringInteraction
  );
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  const [popUp, setPopUp] = useState(false);
  const showPopUp = () => {
    setPopUp(true);
    setTimeout(() => {
      setPopUp(false);
    }, 3000); // Hide the popup after 3 seconds (3000 milliseconds)
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

      const data = await response.json();
      console.log("pageFenstringData", data);
      const fenstring = data.data.fenstring;
      setFenstringInteraction(fenstring);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    getApi();
  }, []);
  const onClickSave = async () => {
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
            fenstring: fenstringInteraction,
          }),
        }
      );
      const res = await response.json();
      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored
      }
      console.log("PUT", res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      Interaction Fenstring
      <div className="my-2 flex">
        <input
          className="px-2 rounded-xl border border-1 border-black w-[40rem]"
          type="text"
          value={fenstringInteraction}
          onChange={(e) => setFenstringInteraction(e.target.value)}
          placeholder="Enter a FEN string..."
        />
        <div className="mx-2">
          <SaveButtonTopBottom createPost={onClickSave} />
        </div>
      </div>
      {popUp && (
        <div>
          <Alert severity="success">Data is succesfully stored!</Alert>
        </div>
      )}
    </>
  );
};

export default FenstringBox;
