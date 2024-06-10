import { IuseChapterStore, useChapterStore } from "@/store/useChapterStore";
import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import NoChapters from "../../../atoms/chapter/noChapters/noChapters";
import CreateButton from "../../../atoms/createButton/createButton";
import EstimatedTime from "../../../atoms/chapter/estimatedTime/estimatedTime";
import PointsChapter from "../../../atoms/chapter/pointsChapter/pointsChapter";
import ChapterDescription from "../../../atoms/chapter/chapterDescription/chapterDescription";
import ChapterNumber from "../../../atoms/chapter/chapterNumber/chapterNumber";
import ChapterName from "../../../atoms/chapter/chapterName/chapterName";
import ChapterImage from "../../../atoms/chapter/chapterImage/chapterImage";
import EditableChapter from "@/components/atoms/editableChapter/editableChapter";
import { AiOutlineClose } from "react-icons/ai";
import { getChapterApi } from "@/pages/api/pageTopBottomApi";

function ChapterModal() {
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  const editableChapter = useChapterStore((state) => state.editableChapter);
  const chapterModal = useChapterStore((s) => s.chapterModal);
  const setChapterModal = useChapterStore((s) => s.setChapterModal);
  const chapters = useChapterStore((s) => s.chapters);
  const setChapter = useChapterStore((s) => s.setChapter);
  const selectedImage = useChapterStore((s) => s.selectedImage);
  const setSelectedImage = useChapterStore((s) => s.setSelectedImage);
  const isEditable = useChapterStore((s) => s.isEditable);
  const setIsEditable = useChapterStore((s) => s.setIsEditable);
  const [selectedFile, setSelectedFile] = useState<File>();
  const setEditableChapter = useChapterStore((s) => s.setEditableChapter);
  const updateEditableChapter = useChapterStore(
    (state) => state.updateEditableChapter
  );

  let selectedId: any = null;
  if (typeof window !== "undefined") {
    selectedId = JSON.parse(localStorage?.getItem("selectedId") || "null");
  }
  const createPost = async () => {
    try {
      const response = await fetch("https://staging.api.playalvis.com/v1/chapter", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newChapter),
      });

      const res = await response.json();
      console.log("post", res);
      if (

        res.message.includes(
          "chapter Number already exists."
        )
      ) {
        alert(res.message);
        const data = await getChapterApi();
        setChapter(data);
      }
    } catch (error) {
      alert(error);
      //console.log(error);
    }
  };

  const updateChapter = async (
    selectChapterId: string,
    editableChapter: IuseChapterStore
  ) => {
    try {
      const chapterToUpdate = useChapterStore
        .getState()
        .chapters.find((chapter) => chapter.id === selectChapterId);
      console.log("updateChapter", chapterToUpdate);
      if (!chapterToUpdate) {
        throw new Error(`chapter with id ${selectChapterId} not found`);
      }

      // Update chapterToUpdate with new values
      const updatedChapter = {
        unitId: selectedId,
        id: selectChapterId,
        chapterName: editableChapter.chapterName,
        chapterNumber: editableChapter.chapterNumber,
        chapterDescription: editableChapter.chapterDescription,
        time: editableChapter.time,
        image: editableChapter.image,
        points: editableChapter.points,
      };
      const updatedChapters = Array.isArray(chapters)
        ? chapters.map((chapter) =>
          chapter.id === selectChapterId ? updatedChapter : chapter
        )
        : [];
      setChapter(updatedChapters);
      // Make the PUT request to update the API with the updated unit
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/chapters/${selectChapterId}`,
        {
          mode: "cors",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedChapter),
        }
      );
      const res = await response.json();
      console.log("put", res);
      if (
        res &&
        res.message.includes(
          "chapter Number already exists."
        )
      ) {
        alert(res.message);
        const data = await getChapterApi();
        setChapter(data);
      }
    } catch (error) {
      //alert("Please check the Size of the image Try to put it less than 200kb");
    }
  };
  const editChapter = async (
    selectChapterId: any,
    editableChapter: IuseChapterStore
  ) => {
    await updateChapter(selectChapterId, editableChapter);
    toggleEditModal();
    console.log("editableChapter", editableChapter);
    useChapterStore
      .getState()
      .updateChapterById(selectChapterId, editableChapter);
    localStorage?.setItem("selectChapterId", JSON.stringify(selectChapterId));
    setChapter(useChapterStore.getState().chapters);
  };
  const [newChapter, setNewChapter] = React.useState<IuseChapterStore>({
    unitId: selectedId,
    id: uuidv4(),
    chapterName: "",
    chapterNumber: null,
    chapterDescription: "",
    time: "",
    image: "",
    points: null,
  });

  const NewChapterInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name } = event.target;
    if (name === "image") {
      const file = event?.target?.files![0];
      if (!file) {
        return;
      }
      setSelectedFile(file);
      console.log("file", file);
      // Compress the selected image file
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        console.log("Compressed file size kb:", compressedFile.size / 1024);
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result as string;
          setSelectedImage(dataURL);
          setNewChapter((prev) => ({ ...prev, [name]: dataURL }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log(error);
      }
    } else {
      const { value } = event.target;
      setNewChapter((prev) => ({ ...prev, [name]: value }));
    }
  };

  // For existing/ editable chapter
  const EditableChapterInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, name } = event.target;
    if (name === "image") {
      const file = event?.target?.files![0];
      if (!file) {
        return;
      }
      setSelectedFile(file);

      // Compress the selected image file
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        console.log("Compressed file size kb:", compressedFile.size / 1024);
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result as string;
          setSelectedImage(dataURL);
          updateEditableChapter(name, dataURL);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log(error);
      }
    } else {
      const { value } = event.target;
      updateEditableChapter(name, value);
    }
  };

  // Shared functionality extracted to a new function
  function timeDetails(e: any): void {
    const { value, name } = e.target;
    setNewChapter((prev) => ({ ...prev, [name]: value }));
  }
  function timeEditDetails(e: any): void {
    const { value, name } = e.target;
    updateEditableChapter(name, value);
  }
  useEffect(() => {
    setNewChapter((state) => ({
      ...state,
      unitId: selectedId ?? undefined,
    }));
  }, [selectedId]);

  const createChapter = async () => {
    await createPost();
    setSelectedImage("");
    setEditableChapter(newChapter);
    useChapterStore.getState().addChapter(newChapter);
    toggleChapterModal();
    setNewChapter({
      unitId: selectedId ? selectedId : undefined,
      id: uuidv4(),
      chapterName: "",
      chapterNumber: null,
      chapterDescription: "",
      time: "",
      image: "",
      points: null,
    });
  };

  const toggleChapterModal = () => {
    setChapterModal(!chapterModal);
  };
  useEffect(() => {
    console.log("get", chapters);
  }, []);
  const toggleEditModal = () => {
    setIsEditable(!isEditable);
  };
  function closeModal() {
    setChapterModal(!chapterModal);
  }

  return (
    <>
      {chapterModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            onClick={toggleChapterModal}
            className="xl:min-w-[40rem] xl:min-h-[35rem] md:min-w-[40rem] md:max-w-[40rem] md:min-h-[35rem] md:max-h-[35rem] w-full h-full  bg-opacity-80 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="shadow-xl p-4 rounded-md max-w-600 min-w-300 bg-[#DDF4FF]"
            >
              <div className="flex flex-row justify-between">
                <div className="mr-2">
                  <ChapterNumber
                    newChapter={newChapter}
                    InputChange={NewChapterInputChange}
                  />
                  <ChapterName
                    newChapter={newChapter}
                    InputChange={NewChapterInputChange}
                  />
                </div>
                <div className="ml-5">
                  <ChapterImage
                    newChapter={newChapter}
                    InputChange={NewChapterInputChange}
                    selectedImage={selectedImage}
                  />
                </div>
                <div>
                  <button
                    onClick={closeModal}
                    className="justify-self-end transition-transform duration-300 hover:scale-110 bg-red-300 rounded-md text-white px-2 py-2"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
              <br />
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <ChapterDescription
                    newChapter={newChapter}
                    InputChange={NewChapterInputChange}
                  />
                </div>
                <div className="ml-[3rem]">
                  <PointsChapter
                    newChapter={newChapter}
                    InputChange={NewChapterInputChange}
                  />
                </div>
              </div>
              <br />
              <div className="flex flex-row justify-start">
                <div>
                  <EstimatedTime
                    newChapter={newChapter}
                    timeDetails={timeDetails}
                  />
                </div>
              </div>
              <div className="my-2">
                <CreateButton create={createChapter} />
              </div>
            </div>
          </div>
        </div>
      )}
      <EditableChapter
        InputChange={EditableChapterInputChange}
        editChapter={editChapter}
        editableChapter={editableChapter}
        timeDetails={timeEditDetails}
      />
      <NoChapters chapters={chapters} chapterModal={chapterModal} />
    </>
  );
}

export default ChapterModal;