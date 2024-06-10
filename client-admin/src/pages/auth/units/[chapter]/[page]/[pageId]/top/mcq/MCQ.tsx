import React, { useEffect, useRef, useState } from "react";
import StylingButtons from "../StylingButtons";
import EditorStyles from "@/store/EditorStyles";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import useTopBottomStyles from "@/store/useTopBottomStyles";
import { IMCQ, Option } from "@/store/useBottomStore";
import { Alert } from "@mui/material";
import SaveButtonTopBottom from "@/components/atoms/saveButtonTopBottom/saveButtonTopBottom";
import { checkResponseTop } from "@/pages/api/pageTopBottomApi";
const MCQ = () => {
  const headingTextZ = useTopBottomStyles((s) => s.headingText);
  const setHeadingTextZ = useTopBottomStyles((s) => s.setHeadingText);
  const headingCountZ = useTopBottomStyles((s) => s.headingCount);
  const setHeadingCountZ = useTopBottomStyles((s) => s.setHeadingCount);
  const setHeadingStylesZ = useTopBottomStyles((s) => s.setHeadingStyles);
  const updateHeadingStyles = useTopBottomStyles((s) => s.updateHeadingStyles);
  const [backendData, setBackendData] = useState();
  const contentEditableRef = useRef<any>(null);
  const [popUp, setPopUp] = useState(false);
  const [options, setOptions] = useState<Option[]>([
    {
      id: 1,
      value: "",
      isChecked: false,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addOption = () => {
    setOptions((prevOptions) => [
      ...prevOptions,
      { id: prevOptions.length + 1, value: "", isChecked: false },
    ]);
  };

  const renderOptions = () => {
    const handleInputChange = (id: number, value: string) => {
      setOptions((prevOptions: Option[]) =>
        prevOptions?.map((option) =>
          option.id === id ? { ...option, value } : option
        )
      );
    };

    const handleCheckboxChange = (id: number, isChecked: boolean) => {
      setOptions((prevOptions: Option[]) =>
        prevOptions.map((option) =>
          option.id === id ? { ...option, isChecked } : option
        )
      );
    };

    return options.map((option) => (
      <div key={option?.id}>
        <label className="font-semibold">Option {option?.id}</label>
        <br />
        <div className="flex flex-row">
          <input
            type="text"
            value={option?.value}
            className="mr-5  outline-none border-2 border-sky-400  rounded-lg w-full"
            onChange={(e) => handleInputChange(option.id, e.target.value)}
          />
          <input
            type="checkbox"
            checked={option?.isChecked}
            className="w-10 h-8 my-1"
            onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
          />
        </div>
      </div>
    ));
  };
  const [textData, setTextData] = useState<IMCQ | undefined>();
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
  useEffect(() => {
    if (textData) {
      setOptions(textData?.options?.filter(isValidOption) || []);
      setHeadingTextZ(textData.heading);
      updateHeadingStyles((prevState) => ({
        ...prevState,
        ...textData.headingStyles,
      }));
    }
  }, [textData]);

  function isValidOption(obj: any): obj is Option {
    return (
      obj &&
      typeof obj.id === "number" &&
      typeof obj.value === "string" &&
      typeof obj.isChecked === "boolean"
    );
  }

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
      const mcq = data?.data[0]?.mcq;
      console.log("data", data?.data[0]?.mcq);
      const textDataObj = mcq;
      console.log("td", textDataObj);
      setTextData(textDataObj);
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
    const mcq = {
      heading: headingTextZ,
      headingStyles: headingStyles,
      options: options,
    };

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
              mcq: mcq,
              text: {},
              oneImage: {},
              twoImages: {},
              videos: {},
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
            mcq: mcq,
          }),
        });
      }

      const res = await response.json();

      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored
      }
      setTextData(res.data.mcq);
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
            } border-2 border-sky-400  rounded-lg p-2 mt-2`}
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
            } border-2 border-sky-400  rounded-lg p-2 mt-2`}
        />
      )}

      <br />
      <div className="border-t border-black w-full"></div>
      <div className="mt-2">
        {renderOptions()}
        <br />
        <button
          className="bg-green-500 text-white rounded-xl px-5 py-3 my-1"
          onClick={addOption}
        >
          Add+
        </button>
      </div>
      <div className="mt-10">
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

export default MCQ;
