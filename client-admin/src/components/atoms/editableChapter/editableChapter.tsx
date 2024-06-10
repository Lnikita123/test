import { useChapterStore } from "@/store/useChapterStore";
import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import imageCompression from "browser-image-compression";

const EditableChapter = ({
  InputChange,
  editChapter,
  editableChapter,
  timeDetails,
}: any) => {
  const setSelectedImage = useChapterStore((s) => s.setSelectedImage);
  const isEditable = useChapterStore((s) => s.isEditable);
  const setIsEditable = useChapterStore((s) => s.setIsEditable);
  const selectedImage = useChapterStore((s) => s.selectedImage);
  const selectedChapterId = useChapterStore((s) => s.selectedChapterId);
  const setAllChapters = useChapterStore((s) => s.setAllChapters);
  const setEditableChapter = useChapterStore((s) => s.setEditableChapter);
  const chapters = useChapterStore((s) => s.chapters);
  // Shared functionality extracted to a new function
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const timeInMinutes = Number(value);
    timeDetails({
      target: {
        name: "time",
        value: timeInMinutes,
      },
    });
  };
  function closeModal() {
    setIsEditable(!isEditable);
  }
  React.useEffect(() => {
    const chapter = chapters.find(
      (chapter) => chapter.id === selectedChapterId
    );
    if (chapter) {
      setEditableChapter(chapter);
      setSelectedImage(chapter.image);
    }
  }, [selectedChapterId]);

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
      {isEditable && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80"></div>
          <div className="mt-15 relative bg-gray-100 p-4 rounded-md max-w-600 min-w-300 backdrop-filter backdrop-blur-lg">
            <div className="flex flex-row justify-between">
              <div className="my-2 mr-2">
                <label className="font-bold">Chapter Number</label>
                <br />
                <input
                  type="text"
                  className=" my-1 px-2 py-1 border rounded-md border-1 border-sky-500"
                  value={editableChapter?.chapterNumber || null}
                  name="chapterNumber"
                  onChange={InputChange}
                />
                <br />
                <br />
                <label className="text-md font-bold text-black">
                  Chapter name
                </label>
                <br />
                <input
                  type="text"
                  className="truncate my-1 border border-1 border-sky-500 px-4 py-2 rounded-lg w-64 h-8 mt-2"
                  value={editableChapter?.chapterName || ""}
                  name="chapterName"
                  onChange={InputChange}
                />
              </div>
              <div>
                <div className="mb-3 ml-[5rem]">
                  <button
                    onClick={closeModal}
                    className="transition-transform duration-300 hover:scale-110 bg-red-300 rounded-md text-white px-2 py-2"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
                <p className="font-bold">Add Photo/Gif</p>
                <div className="my-2 p-2 border border-1 border-black bg-white w-auto h-auto relative flex items-center justify-center">
                  <label htmlFor="img" style={{ cursor: "pointer" }}>
                    {selectedImage ? (
                      <img
                        width={100}
                        height={100}
                        src={selectedImage || editableChapter?.image}
                        alt="selected image"
                        className="items-center "
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
              </div>
            </div>
            <br />
            <div className="flex flex-row">
              <div className="flex flex-col">
                <label className="text-md font-bold text-black">
                  Chapter description
                </label>
                <textarea
                  className="border border-1 border-sky-500 truncate p-2 mt-1 rounded-md  h-24 w-72"
                  value={editableChapter?.chapterDescription || ""}
                  name="chapterDescription"
                  onChange={InputChange}
                ></textarea>
              </div>
              <div className="my-5 ml-[3rem]">
                <label className="text-md font-bold text-black">
                  Points allocated
                </label>
                <br />
                <input
                  type="text"
                  className="my-1 px-2 py-1 rounded-md border border-1 border-sky-500"
                  value={editableChapter?.points}
                  name="points"
                  onChange={InputChange}
                />
              </div>
            </div>
            <br />
            <div className="flex flex-row justify-start">
              <div>
                <div>
                  <label className="font-bold">Estimated time (minutes)</label>
                  <br />
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="number"
                      value={editableChapter?.time || ""}
                      className="rounded-md p-2 w-[10rem] h-[2.5rem] border border-1 border-sky-500"
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={() => editChapter(selectedChapterId, editableChapter)}
                type="button"
                className="bg-blue-700 rounded-md text-white px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableChapter;
