import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IuseChapterStore, IuseUnitStore } from "@/store/useInterfaceStore";
import { useRouter } from "next/router";
import { AiOutlinePlayCircle } from "react-icons/ai";
import Image from "next/image";
import { isEmpty } from "lodash";
import { getApi, getChPages, getChapterApi } from "@/pages/api/pageApi";
import { FcPrevious, FcNext } from "react-icons/fc";

export default function AccordionUnits() {
  const [selectedAccordion, setSelectedAccordion] = useState<String | null>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [units, setUnits] = useState<IuseUnitStore[]>([]);
  const [chapters, setChapters] = useState<IuseChapterStore[]>([]);
  const router = useRouter();

  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  // open and close accordion window
  const handleAccordionClick = async (accordionId: string, unitId: string) => {
    if (selectedAccordion === accordionId) {
      // If the accordion is already selected, close it
      setSelectedAccordion(null);
      setSelectedUnitId(null);
    } else {
      // Otherwise, set the selected accordion and unit ID
      setSelectedAccordion(accordionId);
      setSelectedUnitId(unitId);
      const data = await getChapterApi(unitId); // fetch chapters when an accordion is clicked
      const reOrderedData = data.sort((a: any, b: any) => {
        const chapterNumberA = a.chapterNumber;
        const chapterNumberB = b.chapterNumber;
        return chapterNumberA - chapterNumberB;
      });
      setChapters(reOrderedData);
    }
  };

  async function handleChapterCardClick(selectedUnitId: string, id: string) {
    localStorage?.setItem("selectedId", JSON.stringify(selectedUnitId));
    localStorage?.setItem("selectChapterId", JSON.stringify(id));

    const data = await getChPages(id);
    if (!isEmpty(data)) {
      router.push(`/auth/pageBoard`);
    }
  }

  async function getApis() {
    const data = await getApi();
    setUnits(data);
  }
  useEffect(() => {
    getApis();
  }, []);
  const [visibleChapters, setVisibleChapters] = useState<IuseChapterStore[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  let [itemsPerPage, setItemsPerPage] = useState<number>(3);

  // no of pagination wrt to screen size
  useEffect(() => {
    function updateItemsPerPage() {
      const width = window.innerWidth;
      if (width >= 1920) setItemsPerPage(6); // 2xl
      else if (width >= 1280) setItemsPerPage(4); // xl
      else setItemsPerPage(3); // default
    }

    window.addEventListener("resize", updateItemsPerPage);
    updateItemsPerPage();

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // calculating the pagination
  useEffect(() => {
    const start: any = currentIndex * itemsPerPage;
    const end: any = start + itemsPerPage;
    setVisibleChapters(chapters?.slice(start, end));
  }, [chapters, currentIndex, itemsPerPage]);

  function createChapterCards() {
    return (
      <div className="flex flex-row flex-nowrap overflow-x-auto">
        <button
          onClick={() => setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <FcPrevious size={24} />
        </button>
        {visibleChapters.map((chapter: any) => {
          const eachCardImage = chapter?.image;
          return (
            <div
              className="lg:m-5 xl:m-5 relative h-[12rem] w-[15rem] transition-transform duration-300 hover:scale-110 px-2 py-1 cursor-pointer capitalize font-bold flex flex-col justify-center items-center border-2 border-[#583469] rounded-lg"
              key={chapter?.id}
              id={chapter?.id}
              data-id={chapter?.id}
              onClick={() =>
                selectedUnitId !== null
                  ? handleChapterCardClick(selectedUnitId, chapter?.id)
                  : null
              }
            >
              <div className="relative cursor capitalize font-bold flex flex-col items-center w-[14rem] rounded-md">
                <div className="absolute bg-[#583469] w-full py-2 px-1 mx-1 rounded-lg flex flex-row justify-between my-2">
                  <span className="text-ellipsis text-white font-bold">
                    <span className="mx-2">{chapter?.chapterNumber}</span>
                    <span className="text-md" title={chapter?.chapterName}>
                      <span className="capitalize">
                        {chapter?.chapterName?.slice(0, 8)}
                      </span>
                      <span className="capitalize">
                        {chapter?.chapterName && chapter.chapterName.length > 5
                          ? "..."
                          : ""}
                      </span>
                    </span>
                  </span>
                  <div>
                    <AiOutlinePlayCircle size={24} color="#fff" />
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
                  width: "180px",
                  marginTop: "50px",
                }}
              >
                {chapter?.points ? (
                  <div className="absolute top-3/4 bottom-0 left-3 ">
                    <p className="flex flex-row p-2 text-xs text-[#583469] font-bold bg-[#ffffff] border border-1 border-[#583469] rounded-xl">
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
        <button
          onClick={() => setCurrentIndex(currentIndex + 1)}
          disabled={(currentIndex + 1) * itemsPerPage >= chapters.length}
        >
          <FcNext size={24} />
        </button>
      </div>
    );
  }
  function createUnitDashboard() {
    if (Array.isArray(units)) {
      return units
        .filter((unit) => unit?.isPublished)
        .sort((a, b) => {
          const unitNumberA = a?.unitNumber || 0;
          const unitNumberB = b?.unitNumber || 0;
          return unitNumberA - unitNumberB;
        })
        .map((unit, index) => (
          <div className="m-8" key={unit?.id}>
            <Accordion
              key={unit?.id}
              expanded={selectedAccordion === `accordion-${index}`}
              onChange={() =>
                handleAccordionClick(`accordion-${index}`, unit?.id)
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#583469" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography component="div">
                  <>
                    <div className="font-bold text-xl text-[#583469] capitalize">
                      {`UNIT-${unit?.unitNumber}: ${unit?.unitName}`}
                    </div>
                    {selectedAccordion && (
                      <div className="border-b-[#583469] mx-2"></div>
                    )}
                  </>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <span>
                  {selectedAccordion === `accordion-${index}` &&
                    createChapterCards()}
                </span>
              </AccordionDetails>
            </Accordion>
          </div>
        ));
    }
    return null;
  }

  return <div>{createUnitDashboard()}</div>;
}
