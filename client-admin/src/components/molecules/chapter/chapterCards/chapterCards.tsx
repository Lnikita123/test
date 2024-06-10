import EditButton from "@/components/atoms/chapter/editButton/editButton";
import { IuseChapterStore, useChapterStore } from "@/store/useChapterStore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import DeletePopUp from "@/components/atoms/deletePopup/deletePopup";
import Image from "next/image";

const ChapterCards = () => {
  const chapters = useChapterStore((s) => s.chapters);
  const setChapter = useChapterStore((s) => s.setChapter);
  const setAllChapters = useChapterStore((s) => s.setAllChapters);
  const selectedChapterId = useChapterStore((s) => s.selectedChapterId);
  const setSelectedChapterId = useChapterStore((s) => s.setSelectedChapterId);
  const [isLoading, setIsLoading] = useState(false);
  const open = useChapterStore((S) => S.openAlert);
  const setOpen = useChapterStore((s) => s.setOpenAlert);
  const router = useRouter();
  let selectedId: any = null;
  if (typeof window !== "undefined") {
    selectedId = JSON.parse(localStorage?.getItem("selectedId") || "null");
  }
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  function handleChange(event: any, id: any) { }
  function onClickCard(id: string) {
    setIsLoading(true);
    setSelectedChapterId(id);
    localStorage?.setItem("selectChapterId", JSON.stringify(id));
    console.log("id", id);
    let selectChapterId: any = null;
    if (typeof window !== "undefined") {
      selectChapterId = JSON.parse(
        localStorage?.getItem("selectChapterId") || "null"
      );
    }
    if (selectChapterId === id) {
      setIsLoading(false);
      router.push(`/auth/units/${selectedId}/${id}/page/`);
    }
  }
  const deleteChapter = (selectedId: any) => {
    setOpen(true);
    // Set the selected unit ID to confirm deletion
    setSelectedChapterId(selectedId);
  };

  function storeChapterId(id: string) {
    setSelectedChapterId(id);
    localStorage?.setItem("selectChapterId", JSON.stringify(id));
    console.log("id", id);
  }
  const handleDeleteConfirmed = async (id: any) => {
    try {
      const chapterToDelete = chapters.find((chapter) => chapter.id === id);
      if (!chapterToDelete) {
        throw new Error(`chapter with id ${id} not found`);
      }

      // Make the DELETE request to delete the unit from the API
      const response = await fetch(`https://staging.api.playalvis.com/v1/chapters/${id}`, {
        mode: "cors",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      console.log("delete", res);

      // Remove the deleted chapter from the chapters array
      const updatedChapters: IuseChapterStore[] = chapters.filter(
        (chapter) => chapter.id !== id
      );
      // Update the units state with the updated units array
      setAllChapters(updatedChapters);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getApi = async () => {
      try {
        const response = await fetch(
          `https://staging.api.playalvis.com/v1/getchapters?unitId=${selectedId}`,
          {
            mode: "cors",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("get", data);
        if (data && data.length) {
          setChapter(data);
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    };
    getApi();
  }, []);
  return (
    <>
      {chapters
        ?.filter((chapter: any) => chapter.unitId === selectedId)
        .map((chapter: any) => {
          const eachCardImage = chapter?.image;
          return (
            <div
              className="relative h-full w-[15rem] max-w-[20rem] transition-transform duration-300 hover:scale-110 px-2 py-1 cursor-pointer capitalize font-bold flex flex-col justify-start items-center bg-[#FEF3CF] border-2 border-[#D29B01] rounded-lg"
              key={chapter?.id}
              id={chapter?.id}
              data-id={chapter?.id}
            >
              <div className="relative cursor capitalize font-bold flex flex-col items-center w-[14rem] rounded-md">
                <div className="absolute yellow-tab bg-yellow-500 w-full py-2 px-1 mx-1 rounded-lg flex flex-row justify-start gap-10 my-2">
                  <div className="flex flex-row">
                    <span
                      title={chapter?.chapterName}
                      className="pl-3 text-ellipsis w-45 text-white font-bold text-sm"
                    >
                      {chapter?.chapterName?.slice(0, 8)}
                      {chapter?.chapterName && chapter.chapterName.length > 5
                        ? "..."
                        : ""}
                      <span className="text-black mx-2">-</span>
                      {chapter?.chapterNumber}
                    </span>
                  </div>
                  <div className="flex mx-2">
                    <EditButton
                      chapter={chapter}
                      id={chapter?.id}
                      onClick={() => storeChapterId(chapter?.id)}
                    />
                  </div>
                  <div
                    title="Delete"
                    className="absolute bottom-3 right-1 mx-2"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteChapter(chapter?.id);
                    }}
                  >
                    <AiOutlineDelete />
                  </div>
                </div>
              </div>
              <div
                style={{
                  backgroundImage: eachCardImage
                    ? `url(${eachCardImage})`
                    : "none",
                  backgroundSize: "cover",
                  height: "180px",
                  width: "200px",
                  marginTop: "50px",
                }}
                onClick={() => onClickCard(chapter?.id)}
              >
                {eachCardImage === "" && (
                  <p className="absolute top-1/3" title={chapter?.chapterName}>
                    {chapter?.chapterName?.slice(0, 20)}
                    {chapter?.chapterName && chapter.chapterName.length > 20
                      ? "..."
                      : ""}
                  </p>
                )}
                {chapter?.points ? (
                  <div className="absolute top-3/4 bottom-0 left-3 ">
                    <p className="flex flex-row p-2 text-xs text-black font-bold bg-[#FFD54F] rounded-xl">
                      <Image
                        src="/points.svg"
                        alt="points"
                        width={20}
                        height={20}
                      />
                      {chapter?.points} points
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}
      <DeletePopUp
        open={open}
        onClose={() => setOpen(false)}
        onDelete={() => handleDeleteConfirmed(selectedChapterId)}
      />
    </>
  );
};

export default ChapterCards;
