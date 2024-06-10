import React from "react";
type IstyleButtons = {
  isHeading: boolean;
  toggleStyle: (styleType: string, isHeading: boolean) => void;
  changeFontFamily: (fontFamily: string, isHeading: boolean) => void;
  changeFontSize: (fontSize: string, isHeading: boolean) => void;
  changeTextAlign: (textAlign: string, isHeading: boolean) => void;
  headingStyles: any;
  bodyStyles: any;
};
const StylingButtons: React.FC<IstyleButtons> = ({
  isHeading,
  toggleStyle,
  changeFontFamily,
  changeFontSize,
  changeTextAlign,
  headingStyles,
  bodyStyles,
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => toggleStyle("bold", isHeading)}
        className={`px-2 py-1 ${
          (isHeading && headingStyles?.bold) || (!isHeading && bodyStyles?.bold)
            ? "bg-blue-200"
            : "bg-gray-200"
        } rounded`}
      >
        B
      </button>
      <button
        onClick={() => toggleStyle("italic", isHeading)}
        className={`px-2 py-1 ${
          (isHeading && headingStyles?.italic) ||
          (!isHeading && bodyStyles?.italic)
            ? "bg-blue-200"
            : "bg-gray-200"
        } rounded`}
      >
        <i>I</i>
      </button>
      <button
        onClick={() => toggleStyle("underline", isHeading)}
        className={`px-2 py-1 ${
          (isHeading && headingStyles?.underline) ||
          (!isHeading && bodyStyles?.underline)
            ? "bg-blue-200"
            : "bg-gray-200"
        } rounded`}
      >
        <u>U</u>
      </button>
      <button
        onClick={() => toggleStyle("strikethrough", isHeading)}
        className={`px-2 py-1 ${
          (isHeading && headingStyles?.strikethrough) ||
          (!isHeading && bodyStyles?.strikethrough)
            ? "bg-blue-200"
            : "bg-gray-200"
        } rounded`}
      >
        <s>S</s>
      </button>
      <select
        onChange={(e) => changeFontFamily(e.target.value, isHeading)}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        <option value="arial">Arial</option>
        <option value="times">Times New Roman</option>
        <option value="roboto">Roboto</option>
      </select>
      <select
        onChange={(e) => changeFontSize(e.target.value, isHeading)}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        <option value="text-sm">Small</option>
        <option value="text-base">Normal</option>
        <option value="text-lg">Large</option>
      </select>
      <select
        onChange={(e) => changeTextAlign(e.target.value, isHeading)}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        <option value="text-left">Left</option>
        <option value="text-center">Center</option>
        <option value="text-right">Right</option>
      </select>
    </div>
  );
};

export default StylingButtons;
