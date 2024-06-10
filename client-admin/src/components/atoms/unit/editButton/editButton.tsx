import { useUnitStore } from "@/store/useUnitStore";
import React from "react";
import { RiEditLine } from "react-icons/ri";

const EditButton = ({ unit }: any) => {
  const isEditable = useUnitStore((s) => s.isEditable);
  const setIsEditable = useUnitStore((s) => s.setIsEditable);
  const setSelectedId = useUnitStore((s) => s.setSelectedId);
  function onClickEdit(id: any) {
    setSelectedId(id);
    localStorage?.setItem("selectedId", JSON.stringify(id));
    console.log("ele", id);
    setIsEditable(!isEditable);
  }
  return (
    <>
      <div
        className="mx-2"
        title="Edit"
        onClick={() => onClickEdit(unit?.id)}
        key={unit?.id}
        id={unit?.id}
      >
        <RiEditLine />
      </div>
    </>
  );
};

export default EditButton;
