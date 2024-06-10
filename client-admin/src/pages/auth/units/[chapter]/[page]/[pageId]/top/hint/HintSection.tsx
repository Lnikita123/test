import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import SaveButtonTopBottom from "@/components/atoms/saveButtonTopBottom/saveButtonTopBottom";
import { Alert } from "@mui/material";
import { checkResponseTop } from "@/pages/api/pageTopBottomApi";

const HintSection = () => {
  const [textData, setTextData] = useState<string>();
  const [topSectionId, setTopSectionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hints, setHints] = useState("");
  const [backendData, setBackendData] = useState();
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
  function handleChangeHint(value: any) {
    setHints(value);
  }
  useEffect(() => {
    if (textData) {
      setHints(textData);
      console.log("textData", textData);
    }
  }, [textData]);
  const getApi = async () => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/topSectionPage/${selectPageId}`,
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
      setBackendData(data.data);
      const hintObject = data.find((obj: any) => typeof obj.hint === "string");
      const hint = hintObject ? hintObject.hint : "";
      // const textDataObj = data[0]?.hint;
      console.log("td", hint);
      setTextData(hint);
      setTopSectionId(data?.data[0]?.id);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    getApi();
  }, []);
  const showPopUp = () => {
    setPopUp(true);
    setTimeout(() => {
      setPopUp(false);
    }, 3000); // Hide the popup after 3 seconds (3000 milliseconds)
  };

  const createPost = async () => {
    setIsSubmitting(true);
    try {
      const checkData = await checkResponseTop(selectPageId);
      let response;
      if (checkData && checkData.length > 0) {
        // PUT request
        response = await fetch(
          `https://staging.api.playalvis.com/v1/topPagesection/${selectPageId}`,
          {
            mode: "cors",
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              hint: hints,
            }),
          }
        );
      } else {
        // POST request
        response = await fetch("https://staging.api.playalvis.com/v1/topsection", {
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
            hint: hints,
          }),
        });
      }

      const res = await response.json();
      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored
      }

      console.log("res", res);
      if (backendData === null || backendData === undefined) {
        const topSectionId = res.data.id;
        setTopSectionId(topSectionId);
      }

      setTextData(res.data.hint);
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false when the function is done
    }
  };
  return (
    <div>
      <label className="font-semibold text-lg">Hint</label>
      <br />
      <br />
      <textarea
        value={hints}
        className="h-[25rem] w-[40rem] px-1 border border-1 outline-none  border-sky-400 rounded-lg "
        onChange={(e) => handleChangeHint(e?.target.value)}
      ></textarea>

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
