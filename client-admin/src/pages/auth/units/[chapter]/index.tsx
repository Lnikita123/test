import React from "react";
import Chapter from "@/components/template/chapter/chapter";
import ChapterModal from "@/components/organism/chapter/chapterModal/chapterModal";

const ChapterDashboard = () => {
  let selectedId: any = null;
  if (typeof window !== "undefined") {
    selectedId = JSON.parse(localStorage?.getItem("selectedId") || "null");
  }
  1;
  return (
    <div>
      <Chapter />
      <ChapterModal />
    </div>
  );
};

export default ChapterDashboard;
