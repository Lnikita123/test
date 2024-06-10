import { useState } from "react";
import { IStyles } from "./useBottomStore";
export enum StyleType {
  Heading = "heading",
  Body = "body",
  Body2 = "body2",
}

const TwoEditorStyles = () => {
  const initialStyles = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontFamily: "sans",
    fontSize: "text-base",
    textAlign: "text-left",
  };

  const [headingStyles, setHeadingStyles] = useState<IStyles>(initialStyles);
  const [bodyStyles, setBodyStyles] = useState<IStyles>(initialStyles);
  const [bodyStyles2, setBodyStyles2] = useState<IStyles>(initialStyles);
  const toggleStyle = (styleType: string, type: StyleType) => {
    let newStyles: any;
    if (type === StyleType.Heading) {
      newStyles = { ...headingStyles };
      setHeadingStyles({ ...newStyles, [styleType]: !newStyles[styleType] });
    } else if (type === StyleType.Body) {
      newStyles = { ...bodyStyles };
      setBodyStyles({ ...newStyles, [styleType]: !newStyles[styleType] });
    } else if (type === StyleType.Body2) {
      newStyles = { ...bodyStyles2 };
      setBodyStyles2({ ...newStyles, [styleType]: !newStyles[styleType] });
    }
  };

  const changeFontFamily = (fontFamily: string, type: StyleType) => {
    if (type === StyleType.Heading) {
      setHeadingStyles({ ...headingStyles, fontFamily });
    } else if (type === StyleType.Body) {
      setBodyStyles({ ...bodyStyles, fontFamily });
    } else if (type === StyleType.Body2) {
      setBodyStyles2({ ...bodyStyles2, fontFamily });
    }
  };

  const changeFontSize = (fontSize: string, type: StyleType) => {
    if (type === StyleType.Heading) {
      setHeadingStyles({ ...headingStyles, fontSize });
    } else if (type === StyleType.Body) {
      setBodyStyles({ ...bodyStyles, fontSize });
    } else if (type === StyleType.Body2) {
      setBodyStyles2({ ...bodyStyles2, fontSize });
    }
  };

  const changeTextAlign = (textAlign: string, type: StyleType) => {
    if (type === StyleType.Heading) {
      setHeadingStyles({ ...headingStyles, textAlign });
    } else if (type === StyleType.Body) {
      setBodyStyles({ ...bodyStyles, textAlign });
    } else if (type === StyleType.Body2) {
      setBodyStyles2({ ...bodyStyles2, textAlign });
    }
  };

  return {
    headingStyles,
    bodyStyles,
    bodyStyles2,
    toggleStyle,
    changeFontFamily,
    changeFontSize,
    changeTextAlign,
  };
};
export default TwoEditorStyles;
