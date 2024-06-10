import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import React, { useState } from "react";
import ScreenshotModal from "../screenshotModal/screenshotModal";

interface PreviewProps {
  id: string;
}

const Preview: React.FC<PreviewProps> = ({ id }) => {
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState("");

  const captureScreenshot = async (id: string) => {
    const container = document.getElementById(id);
    if (container) {
      const canvas = await html2canvas(container);
      const screenshotDataUrl = canvas.toDataURL();
      setScreenshotDataUrl(screenshotDataUrl);
      setShowScreenshotModal(true);
    }
  };

  function previewPage(id: string) {
    captureScreenshot(id);
  }

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        previewPage(id);
      }}
    >
      <button className="bg-[#ffffff] mx-5 text-[#01579B] px-10 py-2 rounded-full border border-[#C2E7FF]">
        <FontAwesomeIcon icon={faEye} className="mr-2" />
        Preview
      </button>
      <ScreenshotModal
        show={showScreenshotModal}
        onClose={() => setShowScreenshotModal(false)}
        screenshotDataUrl={screenshotDataUrl}
      />
    </div>
  );
};

export default Preview;
