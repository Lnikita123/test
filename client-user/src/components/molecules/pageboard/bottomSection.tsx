import Image from "next/image";
import { useEffect, useState } from "react";
import { responsiveStyle } from "./topSection";
import ReactPlayer from "react-player/lazy";
import { correctSound, incorrectSound } from "@/helpers/playComputer";
function getHeadingStyles(headingStyles: any) {
  const headingStylesObject: React.CSSProperties = {
    fontWeight: headingStyles?.bold ? "bold" : "normal",
    fontStyle: headingStyles?.italic ? "italic" : "normal",
    textDecoration: headingStyles?.underline
      ? "underline"
      : headingStyles?.strikethrough
      ? "line-through"
      : "none",

    fontFamily: "Sans",
    fontSize: headingStyles?.fontSize,
    textAlign: headingStyles?.textAlign === "text-left" ? "left" : "right",
    color: "#283272",
  };
  return headingStylesObject;
}

function getBodyStyles(bodyStyles: any) {
  const bodyStylesObject: React.CSSProperties = {
    fontWeight: bodyStyles?.bold ? "bold" : "normal",
    fontStyle: bodyStyles?.italic ? "italic" : "normal",
    textDecoration: bodyStyles?.underline
      ? "underline"
      : bodyStyles?.strikethrough
      ? "line-through"
      : "none",

    fontFamily: "Sans",
    fontSize: bodyStyles?.fontSize,
    textAlign: bodyStyles?.textAlign === "text-left" ? "left" : "right",
    color: "#283272",
  };
  return bodyStylesObject;
}

export function getBottomText(bottomText: any) {
  const headingStylesObject = getHeadingStyles(bottomText?.headingStyles);
  const bodyStylesObject = getBodyStyles(bottomText?.bodyStyles);
  return (
    <>
      <div>
        <h1
          style={{
            ...headingStylesObject,
            fontFamily: "Sans",
            color: "#283272",
          }}
          title={bottomText?.heading}
          className={`${responsiveStyle} m-2`}
        >
          {bottomText?.heading}
        </h1>

        <p
          style={{ ...bodyStylesObject, fontFamily: "Sans", color: "#283272" }}
          title={bottomText?.body}
          className={`${responsiveStyle} m-2`}
        >
          {bottomText?.body}
        </p>
      </div>
    </>
  );
}
export function getBottomOneImage(bottomOneImage: any) {
  const headingStylesObject = getHeadingStyles(bottomOneImage?.headingStyles);
  const bodyStylesObject = getBodyStyles(bottomOneImage?.bodyStyles);
  return (
    <div className="flex flex-col m-4">
      <h1
        style={{ ...headingStylesObject, fontFamily: "Sans", color: "#283272" }}
        className={`${responsiveStyle} m-2`}
      >
        {bottomOneImage?.heading}
      </h1>
      <p
        style={{ ...bodyStylesObject, fontFamily: "Sans", color: "#283272" }}
        className={`${responsiveStyle} m-2`}
      >
        {bottomOneImage?.body}
      </p>
      <div className="self-center">
        <Image
          height={100}
          width={100}
          src={bottomOneImage?.image}
          alt="oneImage"
        />
      </div>
    </div>
  );
}
export function getBottomTwoImages(bottomTwoImage: any) {
  const headingStylesObject = getHeadingStyles(bottomTwoImage?.headingStyles);
  const bodyStylesObject = getBodyStyles(bottomTwoImage?.bodyStyles);
  return (
    <div className="flex flex-col">
      <h1
        style={{ ...headingStylesObject, fontFamily: "Sans", color: "#283272" }}
        className={`${responsiveStyle} m-2`}
      >
        {bottomTwoImage?.heading}
      </h1>
      <div className="self-center">
        <Image
          priority
          height={70}
          width={50}
          src={bottomTwoImage?.image1}
          alt="oneImage"
        />
      </div>

      <p
        style={{ ...bodyStylesObject, fontFamily: "Sans", color: "#283272" }}
        className={`${responsiveStyle} m-2`}
      >
        {bottomTwoImage?.body1}
      </p>
      <div className="self-center">
        <Image
          priority
          height={70}
          width={50}
          src={bottomTwoImage?.image2}
          alt="twoImage"
        />
      </div>

      <p
        style={{ ...bodyStylesObject, fontFamily: "Sans", color: "#283272" }}
        className={`${responsiveStyle} m-2`}
      >
        {bottomTwoImage?.body2}
      </p>
    </div>
  );
}
export function getBottomVideo(bottomVideo: any) {
  const headingStylesObject = getHeadingStyles(bottomVideo?.headingStyles);
  const bodyStylesObject = getBodyStyles(bottomVideo?.bodyStyles);
  return (
    <div className="flex flex-col">
      <h1
        className={`${responsiveStyle} m-2`}
        style={{ ...headingStylesObject, fontFamily: "Sans", color: "#283272" }}
      >
        {bottomVideo?.heading}
      </h1>
      <div className="self-center">
        <ReactPlayer
          url={bottomVideo?.video || bottomVideo?.url}
          controls={true}
          height={250}
          width={500}
          style={{ border: "2px sky rounded-lg" }}
        />
      </div>

      <p
        className={`${responsiveStyle} m-2`}
        style={{ ...bodyStylesObject, fontFamily: "Sans", color: "#283272" }}
      >
        {bottomVideo?.body}
      </p>
    </div>
  );
}
// bottom Mcq
export function BottomMcq({
  setProceed,
  bottomMcq,
  initialCorrect,
  initialWrong,
  onCorrect,
  onWrong,
  setHint,
}: any) {
  if (!bottomMcq) {
    return null;
  }
  const headingStylesObject = getHeadingStyles(bottomMcq?.headingStyles);
  const [correct, setCorrect] = useState(initialCorrect);
  const [wrong, setWrong] = useState(initialWrong);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  useEffect(() => {
    setCorrect(initialCorrect);
    setWrong(initialWrong);
    setHint(false);
  }, [initialCorrect, initialWrong]);
  function checkTheCorrectOption(option: any) {
    if (option?.isChecked) {
      setProceed(true);
      setCorrect(true);
      setWrong(false);
      onCorrect(true);
      setHint(false);
      onWrong(false);
      correctSound();
    } else {
      setProceed(false);
      setWrong(true);
      setCorrect(false);
      onWrong(true);
      onCorrect(false);
      setHint(false);
      incorrectSound();
    }
    setSelectedOptionId(option?.id);
  }
  return (
    <div className="flex flex-col">
      <h1
        className={`${responsiveStyle} m-4`}
        style={{ ...headingStylesObject, fontFamily: "Sans", color: "#283272" }}
      >
        {bottomMcq?.heading}
      </h1>
      {bottomMcq?.options.map((option: any, index: number) => (
        <p
          style={{ ...bottomMcq, fontFamily: "Sans", color: "#283272" }}
          key={index}
          onClick={() => checkTheCorrectOption(option)}
          className={`cursor-pointer ${
            correct && option?.isChecked && selectedOptionId === option?.id
              ? "bg-green-400"
              : "bg-gray-300"
          } ${
            wrong && !option?.isChecked && selectedOptionId === option?.id
              ? "bg-red-400"
              : "bg-gray-300"
          } hover:bg-indigo-300 hover:text-white w-100 h-[3rem] mt-2 mx-[2rem] px-3 rounded-md md:text-md xl:text-xl 2xl:text-2xl`}
        >
          {option?.id}. {option?.value}
        </p>
      ))}
    </div>
  );
}
