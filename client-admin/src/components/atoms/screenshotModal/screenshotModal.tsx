import React from "react";

interface ScreenshotModalProps {
  show: boolean;
  onClose: () => void;
  screenshotDataUrl: string;
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  show,
  onClose,
  screenshotDataUrl,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded p-4">
        <img src={screenshotDataUrl} alt="Screenshot" />
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ScreenshotModal;
