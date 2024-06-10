import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "@mui/material";
import StylingButtons from "../StylingButtons";
import EditorStyles from "@/store/EditorStyles";
import { ITwoImage } from "@/store/useBottomStore";
import useTopBottomStyles from "@/store/useTopBottomStyles";
import SaveButtonTopBottom from "@/components/atoms/saveButtonTopBottom/saveButtonTopBottom";
import { AiOutlineClose } from "react-icons/ai";
import { checkResponseTop } from "@/pages/api/pageTopBottomApi";
import { useImageUpload } from "@/helpers/imageCompression";
const TwoImageEditor = () => {
  const { handleImageUpload, handleImageUpload2 } = useImageUpload();
  const selectedImage1 = useTopBottomStyles((s) => s.selectedImage);
  const setSelectedImage1 = useTopBottomStyles((s) => s.setSelectedImage);
  const selectedImage2 = useTopBottomStyles((s) => s.selectedImage2);
  const setSelectedImage2 = useTopBottomStyles((s) => s.setSelectedImage2);
  const headingTextZ = useTopBottomStyles((s) => s.headingText);
  const setHeadingTextZ = useTopBottomStyles((s) => s.setHeadingText);
  const headingCountZ = useTopBottomStyles((s) => s.headingCount);
  const setHeadingCountZ = useTopBottomStyles((s) => s.setHeadingCount);
  const bodyTextZ = useTopBottomStyles((s) => s.bodyText);
  const bodyText2Z = useTopBottomStyles((s) => s.bodyText2);
  const setBodyStylesZ = useTopBottomStyles((s) => s.setBodyStyles);
  const bodyStyles2Z = useTopBottomStyles((s) => s.bodyStyles2);
  const setBodyStyles2Z = useTopBottomStyles((s) => s.setBodyStyles2);
  const setHeadingStylesZ = useTopBottomStyles((s) => s.setHeadingStyles);
  const bodyCountZ = useTopBottomStyles((s) => s.bodyCount);
  const setBodyCountZ = useTopBottomStyles((s) => s.setBodyCount);
  const bodyCount2Z = useTopBottomStyles((s) => s.bodyCount2);
  const setBodyCount2Z = useTopBottomStyles((s) => s.setBodyCount2);
  const setBodyTextZ = useTopBottomStyles((s) => s.setBodyText);
  const setBodyText2Z = useTopBottomStyles((s) => s.setBodyText2);
  const updateHeadingStyles = useTopBottomStyles((s) => s.updateHeadingStyles);
  const updateBodyStyles = useTopBottomStyles((s) => s.updateBodyStyles);
  const updateBodyStyles2 = useTopBottomStyles((s) => s.updateBodyStyles2);
  const [popUp, setPopUp] = useState(false);
  useEffect(() => {
    console.log("image", selectedImage1, selectedImage2);
  }, [selectedImage1, selectedImage2]);
  const [topSectionId, setTopSectionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textData, setTextData] = useState<ITwoImage | undefined>();
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

  function updateBodyWordCount2(e: React.SyntheticEvent<HTMLDivElement>) {
    const text = (e?.target as HTMLDivElement).innerText;
    setBodyText2Z(text);
    setBodyStyles2Z(bodyStyles2Z);
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setBodyCount2Z(wordCount);
  }
  useEffect(() => {
    if (textData) {
      setHeadingTextZ(textData.heading);
      setBodyTextZ(textData.body1);
      setSelectedImage1(textData?.image1);
      setBodyText2Z(textData.body2);
      setSelectedImage2(textData?.image2);
      updateHeadingStyles((prevState) => ({
        ...prevState,
        ...textData.headingStyles,
      }));
      updateBodyStyles((prevState) => ({
        ...prevState,
        ...textData.bodyStyles1,
      }));
      updateBodyStyles2((prevState) => ({
        ...prevState,
        ...textData.bodyStyles2,
      }));
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
      console.log("data", data.data[0]);
      const textDataObj = data.data[0].twoImages;
      console.log("td", textDataObj);
      setTextData(textDataObj);
      setTopSectionId(data.data[0].id);
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
    const twoImage = {
      heading: headingTextZ,
      body1: bodyTextZ,
      body2: bodyText2Z,
      headingStyles: headingStyles,
      bodyStyles1: bodyStyles,
      bodyStyles2: bodyStyles,
      image1: selectedImage1,
      image2: selectedImage2,
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
              twoImages: twoImage,
              text: {},
              oneImage: {},
              mcq: {},
              videos: {},
            }),
          }
        );
      } else {
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
            twoImages: twoImage,
          }),
        });
      }

      const res = await response.json();
      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored
      }
      console.log("res", res);
      if (isEmpty(textData)) {
        const topSectionId = res.data.id;
        setTopSectionId(topSectionId);
      }

      setTextData(res.data.twoImages);
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false when the function is done
    }
  };
  function removeTheImage1() {
    setSelectedImage1("");
  }

  function removeTheImage2() {
    setSelectedImage2("");
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
            } border-2 border-sky-400  rounded-lg  p-2 mt-2`}
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
            } border-2 border-sky-400  rounded-lg  p-2 mt-2`}
        />
      )}
      <div className="flex">
        <div className="mt-[2rem]">
          <p className="text-lg"> Image</p>
          <label
            htmlFor="img"
            style={{ cursor: "pointer" }}
            className="p-4 flex flex-col items-center"
          >
            {selectedImage1 ? (
              <img
                width={100}
                height={100}
                src={selectedImage1}
                alt="selected image"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="w-32 h-24 relative  flex items-center justify-center cursor-pointer border-2 border-sky-400 rounded-lg"
                style={{ backgroundColor: "#FFFFFF" }}
                onClick={(e) => {
                  e.preventDefault();
                  //@ts-ignore
                  document.getElementById("img").click();
                }}
              >
                <div className="border-2 border-sky-400  mt-9 rounded-lg">
                  <span className="flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl bg-[#03A9F4] rounded-full w-12 h-12">
                    +
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={removeTheImage1}
              className="bg-red-400 text-white px-2 py-1 my-1 rounded-md"
            >
              <AiOutlineClose />
            </button>
            <input
              type="file"
              id="img"
              name="image"
              accept=".jpg,.jpeg,.png,.svg"
              onChange={(e) => handleImageUpload(e)}
              onClick={(e) => e.stopPropagation()}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="m-[2rem]">
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
          {textData?.bodyStyles1 ? (
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
                  element.innerText = textData.body1;
                }
              }}
              className={`h-[5rem] w-[50rem] ${textData?.bodyStyles1.bold ? "font-bold" : ""
                } ${textData?.bodyStyles1.italic ? "italic" : ""} ${textData?.bodyStyles1.underline ? "underline" : ""
                } ${textData?.bodyStyles1.strikethrough ? "line-through" : ""} ${textData?.bodyStyles1.fontFamily === "arial"
                  ? "font-arial"
                  : textData?.bodyStyles1.fontFamily === "times"
                    ? "font-times"
                    : "font-roboto"
                } ${textData?.bodyStyles1.fontSize} ${textData?.bodyStyles1.textAlign
                } border-2 border-sky-400  rounded-lg  p-2 mt-2`}
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
                  element.innerText = textData.body1;
                }
              }}
              className={`h-[5rem] w-[50rem] ${bodyStyles.bold ? "font-bold" : ""
                } ${bodyStyles.italic ? "italic" : ""} ${bodyStyles.underline ? "underline" : ""
                } ${bodyStyles.strikethrough ? "line-through" : ""} ${bodyStyles.fontFamily === "arial"
                  ? "font-arial"
                  : bodyStyles.fontFamily === "times"
                    ? "font-times"
                    : "font-roboto"
                } ${bodyStyles.fontSize} ${bodyStyles.textAlign
                } border-2 border-sky-400  rounded-lg  p-2 mt-2`}
            />
          )}
        </div>
      </div>
      <div className="flex">
        <div className="mt-[2rem]">
          <p className="my-2 text-lg"> Image</p>
          <label
            htmlFor="img2"
            style={{ cursor: "pointer" }}
            className="p-4 flex flex-col items-center"
          >
            {selectedImage2 ? (
              <img
                width={100}
                height={100}
                src={selectedImage2}
                alt="selected image"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="w-32 h-24 relative  flex items-center justify-center cursor-pointer border-2 border-sky-400 rounded-lg"
                style={{ backgroundColor: "#FFFFFF" }}
                onClick={(e) => {
                  e.preventDefault();
                  //@ts-ignore
                  document.getElementById("img2").click();
                }}
              >
                <div className="border border-1 border-[#01579B] mt-9 rounded-lg">
                  <span className="flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl bg-[#03A9F4] rounded-full w-12 h-12">
                    +
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={removeTheImage2}
              className="bg-red-400 text-white px-2 py-1 my-1 rounded-md"
            >
              <AiOutlineClose />
            </button>
            <input
              type="file"
              id="img2"
              name="image"
              accept=".jpg,.jpeg,.png,.svg"
              onChange={(e) => handleImageUpload2(e)}
              onClick={(e) => e.stopPropagation()}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="m-[2rem]">
          <h3 className="text-lg m-2">Body: {bodyCount2Z} words</h3>
          <StylingButtons
            isHeading={false}
            toggleStyle={toggleStyle}
            changeFontFamily={changeFontFamily}
            changeFontSize={changeFontSize}
            changeTextAlign={changeTextAlign}
            headingStyles={headingStyles}
            bodyStyles={bodyStyles}
          />
          {textData?.bodyStyles2 ? (
            <div
              onInput={(event) => updateBodyWordCount2(event)}
              contentEditable
              ref={(element) => {
                if (
                  element &&
                  textData &&
                  !element.innerText &&
                  element.innerText !== bodyTextZ
                ) {
                  element.innerText = textData.body2;
                }
              }}
              className={`h-[5rem] w-[50rem] ${textData?.bodyStyles2.bold ? "font-bold" : ""
                } ${textData?.bodyStyles2.italic ? "italic" : ""} ${textData?.bodyStyles2.underline ? "underline" : ""
                } ${textData?.bodyStyles2.strikethrough ? "line-through" : ""} ${textData?.bodyStyles2.fontFamily === "arial"
                  ? "font-arial"
                  : textData?.bodyStyles2.fontFamily === "times"
                    ? "font-times"
                    : "font-roboto"
                } ${textData?.bodyStyles2.fontSize} ${textData?.bodyStyles2.textAlign
                } border-2 border-sky-400  rounded-lg  p-2 mt-2`}
            />
          ) : (
            <div
              onInput={(event) => updateBodyWordCount2(event)}
              contentEditable
              ref={(element) => {
                if (
                  element &&
                  textData &&
                  !element.innerText &&
                  element.innerText !== bodyTextZ
                ) {
                  element.innerText = textData.body2;
                }
              }}
              className={`h-[5rem] w-[50rem] ${bodyStyles.bold ? "font-bold" : ""
                } ${bodyStyles.italic ? "italic" : ""} ${bodyStyles.underline ? "underline" : ""
                } ${bodyStyles.strikethrough ? "line-through" : ""} ${bodyStyles.fontFamily === "arial"
                  ? "font-arial"
                  : bodyStyles.fontFamily === "times"
                    ? "font-times"
                    : "font-roboto"
                } ${bodyStyles.fontSize} ${bodyStyles.textAlign
                } border-2 border-sky-400  rounded-lg  p-2 mt-2`}
            />
          )}
        </div>
      </div>
      <div className="px-4 py-10">
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

export default TwoImageEditor;