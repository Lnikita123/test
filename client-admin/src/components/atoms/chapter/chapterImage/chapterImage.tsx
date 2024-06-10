import { useChapterStore } from "@/store/useChapterStore";
import React, { useEffect } from "react";
import imageCompression from "browser-image-compression";

const ChapterImage = ({ newChapter, InputChange, selectedImage }: any) => {
  const setSelectedImage = useChapterStore((s) => s.setSelectedImage);
  useEffect(() => {
    return () => {
      setSelectedImage("");
    };
  }, []);

  async function handleImageUpload(event: any) {
    InputChange(event);
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: false,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result as string;
        setSelectedImage(dataURL);
        const compressedFileSizeKB = Math.floor(compressedFile.size / 1024);
        if (compressedFileSizeKB > 100) {
          alert("The compressed file exceeds the size limit of 100KB.");
          return;
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <p className="font-bold">Add Photo/Gif</p>
      <div className="my-2 p-2 border border-1 border-black bg-white w-auto h-auto relative flex items-center justify-center">
        <label htmlFor="img" style={{ cursor: "pointer" }}>
          {selectedImage ? (
            <img
              width={100}
              height={100}
              src={selectedImage || newChapter?.image}
              alt="Add Image"
              onClick={(e) => e.stopPropagation()}
              className="items-center object-cover"
              style={{ fontSize: "16px", color: "black" }}
            />
          ) : (
            <div
              className="border border-1 border-sky-500 w-32 h-32 flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "#FFFFFF" }}
              onClick={(e) => {
                e.preventDefault();
                //@ts-ignore
                document.getElementById("img").click();
              }}
            >
              <div className="relative w-24 h-24">
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl bg-[#03A9F4] rounded-full w-12 h-12 flex items-center justify-center">
                  +
                </span>
              </div>
            </div>
          )}
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
    </>
  );
};

export default ChapterImage;
