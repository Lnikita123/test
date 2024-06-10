import React from "react";
import StyleType from "@/store/TwoEditorStyles";
type StyleType = "heading" | "body" | "body2";
type IstyleButtons = {
  styleType: StyleType;
  toggleStyle: (styleType: string, targetStyle: StyleType) => void;
  changeFontFamily: (fontFamily: string, targetStyle: StyleType) => void;
  changeFontSize: (fontSize: string, targetStyle: StyleType) => void;
  changeTextAlign: (textAlign: string, targetStyle: StyleType) => void;
  headingStyles: any;
  bodyStyles: any;
  bodyStyles2: any;
};

const TwoImageStylingButtons: React.FC<IstyleButtons> = ({
  styleType,
  toggleStyle,
  changeFontFamily,
  changeFontSize,
  changeTextAlign,
  headingStyles,
  bodyStyles,
  bodyStyles2,
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => toggleStyle("bold", styleType)}
        className={`px-2 py-1 ${
          styleType === "heading" && headingStyles?.bold
            ? "bg-blue-200"
            : "bg-gray-200"
        } rounded`}
      >
        B
      </button>
      <button
        onClick={() => toggleStyle("italic", styleType)}
        className={`px-2 py-1 ${
          (styleType === "heading" && headingStyles?.italic) ||
          (styleType === "body" && bodyStyles?.italic)
            ? "bg-blue-200"
            : "bg-gray-200"
        } rounded`}
      >
        <i>I</i>
      </button>
      <button
        onClick={() => toggleStyle("underline", styleType)}
        className={`px-2 py-1 ${
          headingStyles?.underline ?? (false || bodyStyles?.underline) ?? false
            ? "bg-blue-200"
            : "bg-gray-200"
        } rounded`}
      >
        <u>U</u>
      </button>
      <button
        onClick={() => toggleStyle("strikethrough", styleType)}
        className={`px-2 py-1 ${
          headingStyles?.strikethrough ??
          (false || bodyStyles?.strikethrough) ??
          false
            ? "bg-blue-200"
            : "bg-gray-200"
        } rounded`}
      >
        <s>S</s>
      </button>
      <select
        onChange={(e) => changeFontFamily(e.target.value, styleType)}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        <option value="arial">Arial</option>
        <option value="times">Times New Roman</option>
        <option value="roboto">Roboto</option>
      </select>
      <select
        onChange={(e) => changeFontSize(e.target.value, styleType)}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        <option value="text-sm">Small</option>
        <option value="text-base">Normal</option>
        <option value="text-lg">Large</option>
      </select>
      <select
        onChange={(e) => changeTextAlign(e.target.value, styleType)}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        <option value="text-left">Left</option>
        <option value="text-center">Center</option>
        <option value="text-right">Right</option>
      </select>
    </div>
  );
};

export default TwoImageStylingButtons;
