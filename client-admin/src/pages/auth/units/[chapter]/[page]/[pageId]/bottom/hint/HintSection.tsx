import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SaveButtonTopBottom from "@/components/atoms/saveButtonTopBottom/saveButtonTopBottom";
import { Alert } from "@mui/material";
import { checkResponse } from "@/pages/api/pageTopBottomApi";

const HintSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hint, setHint] = useState<string>("");
  const [wrong, setWrong] = useState<string>("");
  const [popUp, setPopUp] = useState(false);
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
  let selectChapterId: any = null;
  if (typeof window !== "undefined") {
    selectChapterId = JSON.parse(
      localStorage?.getItem("selectChapterId") || "null"
    );
  }
  let selectedId: any = null;
  if (typeof window !== "undefined") {
    selectedId = JSON.parse(localStorage?.getItem("selectedId") || "null");
  }
  let data: any;
  const getApi = async () => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/bottomPagesection/${selectPageId}`,
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
      data = dataB.data;
      console.log("data", data);
      if (data && data.length > 0) {
        // Check if the array is not empty
        const hintObject = data.find(
          (obj: any) => typeof obj.hint === "string"
        );
        const hint = hintObject ? hintObject.hint : "";
        const wrongObject = data.find(
          (obj: any) => typeof obj.wrong === "string"
        );
        const wrong = wrongObject ? wrongObject.wrong : "";
        // const hintDataObj = data[0]?.hint;
        console.log("hint wrong", hint, wrong);
        setHint(hint || "");
        setWrong(wrong || "");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  useEffect(() => {
    setHint(hint);
    setWrong(wrong);
  }, [hint, wrong]);

  function handleChangeHint(value: any) {
    setHint(value);
  }
  function handleChangeWrong(value: string) {
    setWrong(value);
  }

  const showPopUp = () => {
    setPopUp(true);
    setTimeout(() => {
      setPopUp(false);
    }, 3000); // Hide the popup after 3 seconds (3000 milliseconds)
  };

  const createPost = async () => {
    setIsSubmitting(true);
    try {
      const checkData = await checkResponse(selectPageId);
      let response;
      if (checkData && checkData.length > 0) {
        // POST request
        response = await fetch(
          `https://staging.api.playalvis.com/v1/bottomPagesection/${selectPageId}`,
          {
            mode: "cors",
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              hint: hint,
              wrong: wrong,
            }),
          }
        );
      } else {
        // PUT request
        response = await fetch("https://staging.api.playalvis.com/v1/bottomsection", {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: uuidv4(),
            pageId: selectPageId,
            chapterId: selectChapterId,
            unitId: selectedId,
            hint: hint,
            wrong: wrong,
          }),
        });
      }
      const res = await response.json();
      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored.
      }
      console.log("res", res);
      setHint(res.data.hint);
      setWrong(res.data.wrong);
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false when the function is done
    }
  };
  return (
    <div>
      <div className="flex">
        <div className="mx-2">
          <h6 className="font-semibold">Hint:</h6>
          <textarea
            value={hint}
            className="my-2 p-3 h-60 w-80 outline-none border-2 border-sky-400 rounded-lg"
            onChange={(e) => handleChangeHint(e?.target.value)}
          ></textarea>
        </div>
        <div>
          <h6 className="font-semibold">Wrong Answer:</h6>
          <textarea
            value={wrong}
            className="my-2 p-3 h-60 w-80 outline-none border-2 border-sky-400 rounded-lg"
            onChange={(e) => handleChangeWrong(e?.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="my-3">
        <SaveButtonTopBottom
          createPost={createPost}
          isSubmitting={isSubmitting}
        />
        {popUp && (
          <div>
            <Alert severity="success">Data is succesfully stored!</Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default HintSection;
