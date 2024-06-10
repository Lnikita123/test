import React, { useEffect, useState } from "react";
import StylingButtons from "../StylingButtons";
import EditorStyles from "@/store/EditorStyles";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Option, IMCQ } from "@/store/useBottomStore";
import useTopBottomStyles from "@/store/useTopBottomStyles";
import SaveButtonTopBottom from "@/components/atoms/saveButtonTopBottom/saveButtonTopBottom";
import { Alert } from "@mui/material";
import { checkResponse } from "@/pages/api/pageTopBottomApi";
import { AiOutlineClose } from "react-icons/ai";
const MCQ = () => {
  const [hint, setHint] = useState("");
  const [wrong, setWrong] = useState("");
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
  const [bottomSectionId, setBottomSectionId] = useState<string>("");
  const [options, setOptions] = useState<Option[]>([
    {
      id: 1,
      value: "",
      isChecked: false,
    },
  ]);
  const headingTextZ = useTopBottomStyles((s) => s.headingText);
  const setHeadingTextZ = useTopBottomStyles((s) => s.setHeadingText);
  const headingCountZ = useTopBottomStyles((s) => s.headingCount);
  const setHeadingCountZ = useTopBottomStyles((s) => s.setHeadingCount);
  const setHeadingStylesZ = useTopBottomStyles((s) => s.setHeadingStyles);
  const updateHeadingStyles = useTopBottomStyles((s) => s.updateHeadingStyles);
  const [textData, setTextData] = useState<IMCQ>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendData, setBackendData] = useState();
  const [popUp, setPopUp] = useState(false);
  function updateHeadingWordCount(e: React.SyntheticEvent<HTMLDivElement>) {
    if (headingStyles) {
      const text = (e?.target as HTMLDivElement).innerText;
      setHeadingTextZ(text);
      setHeadingStylesZ(headingStyles);
      const wordCount = text
        .trim()
        .split(/\s+/)
        .filter((word: any) => word.length > 0).length;
      setHeadingCountZ(wordCount);
    }
  }
  const addOption = () => {
    setOptions((prevOptions) => [
      ...prevOptions,
      { id: prevOptions.length + 1, value: "", isChecked: false },
    ]);
  };
  const removeOption = (id: number) => {
    setOptions((prevOptions: Option[]) => {
      const filteredOptions = prevOptions.filter((option) => option.id !== id);
      // Reassign ids to remaining options
      const reassignedOptions = filteredOptions.map((option, index) => ({
        ...option,
        id: index + 1,
      }));
      return reassignedOptions;
    });
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

    return options?.map((option) => (
      <div key={option?.id}>
        <label className="font-semibold">Option {option?.id}</label>
        <br />
        <div className="flex flex-row">
          <input
            type="text"
            value={option?.value}
            className="mr-5  outline-none border-2 border-sky-400  rounded-lg p-2 w-full"
            onChange={(e) => handleInputChange(option.id, e.target.value)}
          />
          <input
            type="checkbox"
            checked={option?.isChecked}
            className="w-10 h-8 my-1"
            onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
          />
          <button
            type="button"
            onClick={(e) => removeOption(option.id)}
            className="bg-red-400 px-3 py-2 my-1 rounded-xl mx-2 text-white hover:scale-110 transition-transform duration-300"
          >
            <AiOutlineClose />
          </button>
        </div>
      </div>
    ));
  };

  const {
    headingStyles,
    bodyStyles,
    toggleStyle,
    changeFontFamily,
    changeFontSize,
    changeTextAlign,
  } = EditorStyles();

  useEffect(() => {
    if (textData) {
      setOptions(textData?.options?.filter(isValidOption) || []);
      setHeadingTextZ(textData.heading);
      updateHeadingStyles((prevState: any) => ({
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
    console.log("sssp", selectPageId);
    try {
      const response = await fetch(`https://staging.api.playalvis.com/v1/bottomPagesection/${selectPageId}`, {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const backendData = Array.isArray(data.data) ? data.data : [data.data];
      setBackendData(backendData);
      const mcq = backendData[0]?.mcq;
      console.log("data", data?.data[0]?.mcq);
      const textDataObj = mcq;
      console.log("td", textDataObj);
      setTextData(textDataObj);
      setHint(textDataObj?.hint || "");
      setWrong(textDataObj?.wrong || "");
      setBottomSectionId(backendData[0]?.id);
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
    }, 3000); // Hide the popup after 3 seconds
  };

  const createPost = async () => {
    setIsSubmitting(true);
    const mcq = {
      heading: headingTextZ,
      headingStyles: headingStyles,
      options: options,
      hint: hint,
      wrong: wrong,
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
              mcq: mcq,
              text: {},
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
  function handleChangeHint(value: any) {
    setHint(value);
  }
  function handleChangeWrong(value: string) {
    setWrong(value);
  }
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
              element.innerText = textData?.heading || "";
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
              element.innerText = textData?.heading || "";
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
      <div className="border-t border-2 border-sky-400  rounded-lg w-full"></div>
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
      <br />
      <div className="flex">
        <div className="mx-2">
          <h6 className="font-semibold">Hint:</h6>
          <textarea
            value={hint}
            className="my-2 p-3 h-40 w-80 outline-none border-2 border-sky-400 rounded-lg"
            onChange={(e) => handleChangeHint(e?.target.value)}
          ></textarea>
        </div>

        <div>
          <h6 className="font-semibold">Wrong Answer:</h6>
          <textarea
            value={wrong}
            className="my-2 p-3 h-40 w-80 outline-none border-2 border-sky-400 rounded-lg"
            onChange={(e) => handleChangeWrong(e?.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="mt-4">
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
//exporting
export default MCQ;
