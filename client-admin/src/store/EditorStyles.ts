import { useState } from "react";
import { IStyles, headingBodyStyle } from "./useBottomStore";
const EditorStyles = () => {
  const [headingStyles, setHeadingStyles] = useState<IStyles>(headingBodyStyle);
  const [bodyStyles, setBodyStyles] = useState<IStyles>(headingBodyStyle);

  const toggleStyle = (styleType: string, isHeading: boolean) => {
    const newStyles: any = isHeading ? { ...headingStyles } : { ...bodyStyles };
    newStyles[styleType] = !newStyles[styleType];
    isHeading ? setHeadingStyles(newStyles) : setBodyStyles(newStyles);
  };

  const changeFontFamily = (fontFamily: string, isHeading: boolean) => {
    const newStyles = isHeading ? { ...headingStyles } : { ...bodyStyles };
    newStyles["fontFamily"] = fontFamily;
    isHeading ? setHeadingStyles(newStyles) : setBodyStyles(newStyles);
  };

  const changeFontSize = (fontSize: string, isHeading: boolean) => {
    const newStyles = isHeading ? { ...headingStyles } : { ...bodyStyles };
    newStyles["fontSize"] = fontSize;
    isHeading ? setHeadingStyles(newStyles) : setBodyStyles(newStyles);
  };

  const changeTextAlign = (textAlign: string, isHeading: boolean) => {
    const newStyles = isHeading ? { ...headingStyles } : { ...bodyStyles };
    newStyles["textAlign"] = textAlign;
    isHeading ? setHeadingStyles(newStyles) : setBodyStyles(newStyles);
  };
  return {
    headingStyles,
    bodyStyles,
    toggleStyle,
    changeFontFamily,
    changeFontSize,
    changeTextAlign,
  };
};
export default EditorStyles;
