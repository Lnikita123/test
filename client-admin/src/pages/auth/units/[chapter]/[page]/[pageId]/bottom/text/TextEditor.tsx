import React, { useEffect, useState } from "react";
import StylingButtons from "../StylingButtons";
import EditorStyles from "@/store/EditorStyles";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { IStyles, ITextData } from "@/store/useBottomStore";
import useTopBottomStyles from "@/store/useTopBottomStyles";
import SaveButtonTopBottom from "@/components/atoms/saveButtonTopBottom/saveButtonTopBottom";
import { Alert } from "@mui/material";
import { checkResponse } from "@/pages/api/pageTopBottomApi";

const TextEditor = () => {
  const [bottomSectionId, setBottomSectionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textData, setTextData] = useState<ITextData | undefined>();
  const headingTextZ = useTopBottomStyles((s) => s.headingText);
  const setHeadingTextZ = useTopBottomStyles((s) => s.setHeadingText);
  const headingCountZ = useTopBottomStyles((s) => s.headingCount);
  const setHeadingCountZ = useTopBottomStyles((s) => s.setHeadingCount);
  const bodyTextZ = useTopBottomStyles((s) => s.bodyText);
  const setBodyStylesZ = useTopBottomStyles((s) => s.setBodyStyles);
  const setHeadingStylesZ = useTopBottomStyles((s) => s.setHeadingStyles);
  const bodyCountZ = useTopBottomStyles((s) => s.bodyCount);
  const setBodyCountZ = useTopBottomStyles((s) => s.setBodyCount);
  const setBodyTextZ = useTopBottomStyles((s) => s.setBodyText);
  const updateHeadingStyles = useTopBottomStyles((s) => s.updateHeadingStyles);
  const updateBodyStyles = useTopBottomStyles((s) => s.updateBodyStyles);
  // getting token page and chapter ids
  const [popUp, setPopUp] = useState(false);

  const [backendData, setBackendData] = useState();

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
  const {
    headingStyles,
    bodyStyles,
    toggleStyle,
    changeFontFamily,
    changeFontSize,
    changeTextAlign,
  } = EditorStyles();
  function updateHeadingWordCount(e: React.SyntheticEvent<HTMLDivElement>) {
    const text = (e?.target as HTMLDivElement).innerText;
    setHeadingTextZ(text);
    setHeadingStylesZ(headingStyles);
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word: any) => word.length > 0).length;
    setHeadingCountZ(wordCount);
  }

  function updateBodyWordCount(e: React.SyntheticEvent<HTMLDivElement>) {
    const text = (e?.target as HTMLDivElement).innerText;
    setBodyTextZ(text);
    setBodyStylesZ(bodyStyles);
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setBodyCountZ(wordCount);
  }
  // updating the textData from get api
  useEffect(() => {
    if (textData) {
      setHeadingTextZ(textData.heading);
      setBodyTextZ(textData.body);
      updateHeadingStyles((prevState: IStyles) => ({
        ...prevState,
        ...textData.headingStyles,
      }));
      updateBodyStyles((prevState: IStyles) => ({
        ...prevState,
        ...textData.bodyStyles,
      }));
    }
  }, [textData]);

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

      const data = await response.json();
      console.log("data", data);
      setBackendData(data?.data);
      const text = data?.data[0]?.text;
      console.log("data", data?.data[0]?.text);
      const textDataObj = text;
      console.log("td", textDataObj);
      setTextData(textDataObj);
      setBottomSectionId(data?.data[0]?.id);
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
    const text = {
      heading: headingTextZ,
      body: bodyTextZ,
      headingStyles: headingStyles,
      bodyStyles: bodyStyles,
    };
    try {
      const checkData = await checkResponse(selectPageId);
      let response;
      if (checkData && checkData.length > 0) {
        // If the page exists, make a PUT request
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
              mcq: {},
              text: text,
            }),
          }
        );
      } else {
        // If the page does not exist, make a POST request
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
            text: text,
          }),
        });
      }

      const res = await response.json();

      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored
      }
      setTextData(res.data.text);
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false when the function is done
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg mb-2">Heading: {headingCountZ} words</h3>
      <StylingButtons
        isHeading={true}
        toggleStyle={toggleStyle}
        changeFontFamily={changeFontFamily}
        changeFontSize={changeFontSize}
        changeTextAlign={changeTextAlign}
        headingStyles={headingStyles}
        bodyStyles={bodyStyles}
      />
      {textData?.heading ? (
        <div
          onInput={(event) => updateHeadingWordCount(event)}
          contentEditable
          ref={(element) => {
            if (
              element &&
              textData &&
              !element.innerText &&
              element.innerText !== headingTextZ
            ) {
              element.innerText = textData.heading;
            }
          }}
          className={`w-3/4 ${textData?.headingStyles.bold ? "font-bold" : ""
            } ${textData?.headingStyles.italic ? "italic" : ""} ${textData?.headingStyles.underline ? "underline" : ""
            } ${textData?.headingStyles.strikethrough ? "line-through" : ""} ${textData?.headingStyles.fontFamily === "arial"
              ? "font-arial"
              : textData?.headingStyles.fontFamily === "times"
                ? "font-times"
                : "font-roboto"
            } ${textData?.headingStyles.fontSize} ${textData?.headingStyles.textAlign
            } border-2 border-sky-400 rounded-lg p-2 mt-2`}
        />
      ) : (
        <div
          onInput={(event) => updateHeadingWordCount(event)}
          contentEditable
          ref={(element) => {
            if (
              element &&
              textData &&
              !element.innerText &&
              element.innerText !== headingTextZ
            ) {
              element.innerText = textData.heading;
            }
          }}
          className={`w-3/4 ${headingStyles.bold ? "font-bold" : ""} ${headingStyles.italic ? "italic" : ""
            } ${headingStyles.underline ? "underline" : ""} ${headingStyles.strikethrough ? "line-through" : ""
            } ${headingStyles.fontFamily === "arial"
              ? "font-arial"
              : headingStyles.fontFamily === "times"
                ? "font-times"
                : "font-roboto"
            } ${headingStyles.fontSize} ${headingStyles.textAlign
            } border-2 border-sky-400 rounded-lg p-2 mt-2`}
        />
      )}

      <h3 className="text-lg mb-2">Body: {bodyCountZ} words</h3>
      <StylingButtons
        isHeading={false}
        toggleStyle={toggleStyle}
        changeFontFamily={changeFontFamily}
        changeFontSize={changeFontSize}
        changeTextAlign={changeTextAlign}
        headingStyles={headingStyles}
        bodyStyles={bodyStyles}
      />
      {textData?.bodyStyles ? (
        <div
          onInput={(event) => updateBodyWordCount(event)}
          contentEditable
          ref={(element) => {
            if (
              element &&
              textData &&
              !element.innerText &&
              element.innerText !== bodyTextZ
            ) {
              element.innerText = textData.body;
            }
          }}
          className={`lg:h-[10rem] 2xl:h-[20rem] lg:w-[35rem] 2xl:w-[50rem] ${textData?.bodyStyles.bold ? "font-bold" : ""
            } ${textData?.bodyStyles.italic ? "italic" : ""} ${textData?.bodyStyles.underline ? "underline" : ""
            } ${textData?.bodyStyles.strikethrough ? "line-through" : ""} ${textData?.bodyStyles.fontFamily === "arial"
              ? "font-arial"
              : textData?.bodyStyles.fontFamily === "times"
                ? "font-times"
                : "font-roboto"
            } ${textData?.bodyStyles.fontSize} ${textData?.bodyStyles.textAlign
            } border-2 border-sky-400 rounded-lg p-2 mt-2`}
        />
      ) : (
        <div
          onInput={(event) => updateBodyWordCount(event)}
          contentEditable
          ref={(element) => {
            if (
              element &&
              textData &&
              !element.innerText &&
              element.innerText !== bodyTextZ
            ) {
              element.innerText = textData.body;
            }
          }}
          className={`lg:h-[10rem] 2xl:h-[20rem] lg:w-[35rem] 2xl:w-[50rem] ${bodyStyles.bold ? "font-bold" : ""
            } ${bodyStyles.italic ? "italic" : ""} ${bodyStyles.underline ? "underline" : ""
            } ${bodyStyles.strikethrough ? "line-through" : ""} ${bodyStyles.fontFamily === "arial"
              ? "font-arial"
              : bodyStyles.fontFamily === "times"
                ? "font-times"
                : "font-roboto"
            } ${bodyStyles.fontSize} ${bodyStyles.textAlign
            } border-2 border-sky-400 rounded-lg p-2 mt-2`}
        />
      )}

      <div className="container mx-auto px-4 py-10">
        <SaveButtonTopBottom
          createPost={createPost}
          isSubmitting={isSubmitting}
        />
      </div>
      {popUp && (
        <div>
          <Alert severity="success">Data is succesfully stored!</Alert>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
