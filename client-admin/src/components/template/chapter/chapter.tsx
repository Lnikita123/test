import React from "react";
import { useChapterStore } from "@/store/useChapterStore";
import ChapterCards from "../../molecules/chapter/chapterCards/chapterCards";
import Image from "next/image";
import LogoutButton from "@/components/atoms/logOut/logOut";
import BreadCrumbsChapter from "@/components/atoms/breadCrumbs/BreadCrumbsChapter";
const Chapter = () => {
  const { chapterModal, setChapterModal } = useChapterStore();
  const setSelectedImage = useChapterStore((s) => s.setSelectedImage);
  const toggleModal = () => {
    setChapterModal(!chapterModal);
    setSelectedImage("");
  };
  return (
    <>
      <div className="relative mx-auto pb-[55rem] flex flex-col bg-white">
        <div className="flex justify-between items-center">
          <div>
            <button className="m-8 rounded-lg text-[#969696] text-center text-xs font-bold flex items-center justify-center">
              <Image
                src="/alvis.svg"
                alt="logo"
                width={50}
                height={70}
                className="mr-2"
              />
              <BreadCrumbsChapter />
            </button>
          </div>
          <div className="flex flex-row">
            <button
              onClick={toggleModal}
              className="border border-1 border-black hover:border-green focus:ring focus:ring-sky-300 ml-10 bg-[#F4F4F4] h-[3rem] w-[7rem] mx-3 p-3 rounded-full mr-6 text-[#01579B] text-center text-xs font-bold flex items-center justify-center"
            >
              Add chapter
            </button>
            <div>
              <LogoutButton />
            </div>
          </div>
        </div>
        <div className={"m-16 flex flex-row gap-20 flex-wrap"}>
          {!chapterModal && <ChapterCards />}
        </div>
      </div>
    </>
  );
};

export default Chapter;
