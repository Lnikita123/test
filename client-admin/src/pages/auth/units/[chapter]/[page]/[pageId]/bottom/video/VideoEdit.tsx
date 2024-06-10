import React, { useEffect, useState } from "react";
import StylingButtons from "../StylingButtons";
import EditorStyles from "@/store/EditorStyles";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import ReactPlayer from "react-player";
import { Ivideo } from "@/store/useBottomStore";
import useTopBottomStyles from "@/store/useTopBottomStyles";
import SaveButtonTopBottom from "@/components/atoms/saveButtonTopBottom/saveButtonTopBottom";
import { Alert } from "@mui/material";
import { checkResponse } from "@/pages/api/pageTopBottomApi";
import { AiOutlineClose } from "react-icons/ai";

const VideoEdit = () => {
  const [selectedVideo, setSelectedVideo] = useState<string>();
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    console.log("video", selectedVideo);
  }, [selectedVideo]);
  const [bottomSectionId, setBottomSectionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popUp, setPopUp] = useState(false);

  const [textData, setTextData] = useState<Ivideo | undefined>();
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
  useEffect(() => {
    if (textData) {
      setHeadingTextZ(textData?.heading);
      setBodyTextZ(textData?.body);
      setSelectedVideo(textData?.video);
      updateHeadingStyles((prevState) => ({
        ...prevState,
        ...textData.headingStyles,
      }));
      updateBodyStyles((prevState) => ({
        ...prevState,
        ...textData.bodyStyles,
      }));
      setUrl(textData?.url);
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
      setBackendData(data.data);
      const videos = data?.data[0]?.videos;
      console.log("data", data?.data[0]?.videos);
      const textDataObj = videos;
      console.log("td", textDataObj);
      setTextData(textDataObj);
      setBottomSectionId(data?.data[0].id);
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
    const video = {
      heading: headingTextZ,
      body: bodyTextZ,
      headingStyles: headingStyles,
      bodyStyles: bodyStyles,
      video: selectedVideo,
      url: url,
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
              oneImage: {},
              twoImages: {},
              videos: video,
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
            videos: video,
          }),
        });
      }

      const res = await response.json();

      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored
      }
      setTextData(res.data.videos);
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false when the function is done
    }
  };
  function addExternalLink(event: any) {
    setUrl(event.target.value);
  }
  function removeTheVideo() {
    setSelectedVideo("");
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
      <div className="flex">
        <div className="mr-[2rem]">
          <p className="my-2 text-lg"> Video</p>
          <label htmlFor="video" style={{ cursor: "pointer" }}>
            {selectedVideo ? (
              <video
                width={250}
                height={400}
                src={selectedVideo}
                onClick={(e) => e.stopPropagation()}
                controls
              />
            ) : (
              <div
                className="w-48 h-32 relative border border-1 border-gray-500  flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "#FFFFFF" }}
                onClick={(e) => {
                  e.preventDefault();
                  //@ts-ignore
                  document.getElementById("video").click();
                }}
              >
                <div className="border border-1 border-[#01579B] bg-[#DDF4FF] mt-9 rounded-lg">
                  <span className="flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl bg-[#03A9F4] rounded-full w-12 h-12">
                    +
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={removeTheVideo}
              className="bg-red-400 text-white px-2 py-1 my-1 rounded-md"
            >
              <AiOutlineClose />
            </button>
            <input
              type="file"
              id="video"
              name="video"
              accept=".gif,.mp4,.avi"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const dataURL = reader.result as string;
                    setSelectedVideo(dataURL);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="mt-[2rem]">
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
              className={`h-[5rem] lg:w-[30rem] 2xl:w-[50rem] ${textData?.bodyStyles.bold ? "font-bold" : ""
                } ${textData?.bodyStyles.italic ? "italic" : ""} ${textData?.bodyStyles.underline ? "underline" : ""
                } ${textData?.bodyStyles.strikethrough ? "line-through" : ""} ${textData?.bodyStyles.fontFamily === "arial"
                  ? "font-arial"
                  : textData?.bodyStyles.fontFamily === "times"
                    ? "font-times"
                    : "font-roboto"
                } ${textData?.bodyStyles.fontSize} ${textData?.bodyStyles.textAlign
                } border-2 border-sky-400  rounded-lg p-2 mt-2`}
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
              className={`h-[5rem] lg:w-[30rem] 2xl:w-[50rem] ${bodyStyles.bold ? "font-bold" : ""
                } ${bodyStyles.italic ? "italic" : ""} ${bodyStyles.underline ? "underline" : ""
                } ${bodyStyles.strikethrough ? "line-through" : ""} ${bodyStyles.fontFamily === "arial"
                  ? "font-arial"
                  : bodyStyles.fontFamily === "times"
                    ? "font-times"
                    : "font-roboto"
                } ${bodyStyles.fontSize} ${bodyStyles.textAlign
                } border-2 border-sky-400  rounded-lg p-2 mt-2`}
            />
          )}
        </div>
      </div>
      <div className="flex mt-[2rem]">
        <div className="mr-[2rem]">
          <label className="font-semibold">Add External link</label>
          <br />
          <input
            className="outline-none px-3 w-[20rem]  border-2 border-sky-400 rounded-lg"
            onChange={addExternalLink}
            type="search"
            placeholder="Enter a url"
            value={url}
          />
        </div>
        <ReactPlayer
          url={url}
          controls={true}
          height={200}
          width={500}
          style={{ border: "2px sky rounded-lg" }}
        />
      </div>
      <div className="mx-auto px-4">
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

export default VideoEdit;
