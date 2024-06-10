import Image from "next/image";
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
  };
  return bodyStylesObject;
}

export const responsiveStyle =
  "sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl";
export function getTopText(topText: any) {
  const headingStylesObject = getHeadingStyles(topText?.headingStyles);
  const bodyStylesObject = getBodyStyles(topText?.bodyStyles);
  return (
    <>
      <div>
        <h1
          style={{ ...headingStylesObject, fontFamily: "Sans" }}
          title={topText?.heading}
          className={responsiveStyle}
        >
          {topText?.heading}
        </h1>
        <p style={{ ...bodyStylesObject, fontFamily: "Sans" }} title={topText?.body} className="text-2xl">
          {topText?.body}
        </p>
      </div>
    </>
  );
}
export function getTopOneImage(topOneImage: any) {
  const headingStylesObject = getHeadingStyles(topOneImage?.headingStyles);
  const bodyStylesObject = getBodyStyles(topOneImage?.bodyStyles);
  return (
    <div className="flex flex-col">
      <h1 style={{ ...headingStylesObject, fontFamily: "Sans" }} className={`${responsiveStyle} m-2`}>
        {topOneImage?.heading}
      </h1>
      {/* <Image
        priority
        height={30}
        width={50}
        src={topOneImage?.image}
        alt="oneImage"
      /> */}
      <p style={{ ...bodyStylesObject, fontFamily: "Sans" }} className={`${responsiveStyle} m-2`}>
        {topOneImage?.body}
      </p>
    </div>
  );
}
export function getTopTwoImages(topTwoImage: any) {
  const headingStylesObject = getHeadingStyles(topTwoImage?.headingStyles);
  const bodyStylesObject = getBodyStyles(topTwoImage?.bodyStyles);
  return (
    <div className="flex flex-col">
      <h1 style={{ ...headingStylesObject, fontFamily: "Sans" }} className={`${responsiveStyle} m-2`}>
        {topTwoImage?.heading}
      </h1>
      <Image
        priority
        height={70}
        width={50}
        src={topTwoImage?.image1}
        alt="oneImage"
      />
      <p style={{ ...bodyStylesObject, fontFamily: "Sans" }} className={`${responsiveStyle} m-2`}>
        {topTwoImage?.body1}
      </p>
      <Image
        priority
        height={70}
        width={50}
        src={topTwoImage?.image2}
        alt="twoImage"
      />

      <p style={{ ...bodyStylesObject, fontFamily: "Sans" }} className={`${responsiveStyle} m-2`}>
        {topTwoImage?.body2}
      </p>
    </div>
  );
}
export function getTopVideo(topVideo: any) {
  const headingStylesObject = getHeadingStyles(topVideo?.headingStyles);
  const bodyStylesObject = getBodyStyles(topVideo?.bodyStyles);
  return (
    <div className="flex flex-col">
      <h1 className={`${responsiveStyle} m-2`} style={{ ...headingStylesObject, fontFamily: "Sans" }}>
        {topVideo?.heading}
      </h1>
      {topVideo?.url === "" ? (
        ""
      ) : (
        <video
          width={250}
          height={400}
          src={topVideo?.url}
          onClick={(e) => e.stopPropagation()}
          controls
        />
      )}
      <p className={`${responsiveStyle} m-2`} style={{ ...bodyStylesObject, fontFamily: "Sans" }}>
        {topVideo?.body}
      </p>
    </div>
  );
}
