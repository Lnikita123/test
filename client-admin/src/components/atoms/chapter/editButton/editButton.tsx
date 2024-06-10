import { useChapterStore } from "@/store/useChapterStore";
import React from "react";
import { RiEditLine } from "react-icons/ri";

const EditButton = ({ id, chapter }: any) => {
  const isEditable = useChapterStore((s) => s.isEditable);
  const setIsEditable = useChapterStore((s) => s.setIsEditable);
  const setSelectedChapterId = useChapterStore((s) => s.setSelectedChapterId);
  const chapterId = useChapterStore((s) => s.chapterId);
  function onClickEdit(id: any) {
    const element = document.getElementById(id);
    localStorage?.setItem("selectChapterId", JSON.stringify(id));
    setSelectedChapterId(id);
    console.log("ele", element?.id);
    setIsEditable(!isEditable);
  }
  return (
    <>
      <div
        title="Edit"
        className="mx-2"
        onClick={() => onClickEdit(id)}
        key={chapter?.id}
        id={chapter?.id}
      >
        <RiEditLine />
      </div>
    </>
  );
};

export default EditButton;
