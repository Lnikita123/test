import { Slide } from "@/pages/auth/units/[chapter]/[page]";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createRef, memo, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
interface SlidesProps {
  page: Slide[] | null;
  setPage: (page: Slide[]) => void;
  slidePreviews: { [key: string]: string } | undefined;
  selectedSlide: string | null;
  onClickSlide: (event: React.MouseEvent<HTMLDivElement>, id: string) => void;
  deletePage: (id: string) => void;
  setSlidesLoaded: (slidesLoaded: boolean) => void;
  slideRefs: any;
  loadingSlide: boolean;
}
const Slides = ({
  page,
  setPage,
  slidePreviews,
  selectedSlide,
  onClickSlide,
  deletePage,
  setSlidesLoaded,
  slideRefs,
  loadingSlide,
}: SlidesProps) => {
  const [isDragging, setIsDragging] = useState(false);
  let selectChapterId: any = null;
  if (typeof window !== "undefined") {
    selectChapterId = JSON.parse(
      localStorage?.getItem("selectChapterId") || "null"
    );
  }
  const handleDragStart = (e: any, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setIsDragging(true);
  };

  const handleDragOver = (e: any, id: string) => {
    e.preventDefault();
  };

  const handleDrop = (e: any, id: string) => {
    e.preventDefault();
    setIsDragging(false);
    const draggedId = e.dataTransfer.getData("text");
    // Here you should implement the logic to rearrange your items
    rearrangeSlides(draggedId, id);
  };
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  const rearrangeSlides = async (draggedId: string, targetId: string) => {
    if (!page) {
      return;
    }

    const draggedIndex = page.findIndex((each) => each?.id === draggedId);
    const targetIndex = page.findIndex((each) => each?.id === targetId);

    if (draggedIndex < 0 || targetIndex < 0) {
      return;
    }

    const newPage = [...page];
    const draggedSlide = newPage[draggedIndex];

    newPage.splice(draggedIndex, 1);
    newPage.splice(targetIndex, 0, draggedSlide);

    setPage(newPage);
    console.log("newPage: ", newPage);
    // send updated pages to the server
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/updateChapterPages/${selectChapterId}?first=${draggedIndex}&last=${targetIndex}`,
        {
          mode: "cors",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { data: updatedPages } = await response.json();
      console.log("Pages updated successfully in the database", updatedPages);
    } catch (error) {
      console.log("Error updating pages in the database: ", error);
    }
  };
  useEffect(() => {
    if (page) {
      setSlidesLoaded(true);
    }
  }, [page]);

  return (
    <div>
      {page
        ? page.map((each: any, index: number) => {
            slideRefs.current[each.id] = createRef();
            const slidePreview = slidePreviews ? slidePreviews[each?.id] : "";
            const particularSlide = each?.id === selectedSlide;
            console.log("set, particular", particularSlide);
            return (
              <div
                ref={slideRefs.current[each.id]}
                draggable
                onDragStart={(e) => handleDragStart(e, each?.id)}
                onDragOver={(e) => handleDragOver(e, each?.id)}
                onDrop={(e) => handleDrop(e, each?.id)}
                key={each?.id}
                data-id={each?.id}
                id={each?.id}
                style={{
                  backgroundImage: `${slidePreview}`,
                  backgroundSize: "70% auto",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  //backgroundColor: each?.id === selectedSlide ? "white" : "",
                }}
                className={`${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                } border border-1 transition-transform duration-500 hover:scale-105 m-3 h-[11rem] w-[14rem] rounded-xl ${
                  each?.id === selectedSlide
                    ? "!border-green-700 border-2 border-solid"
                    : "border-sky-700 "
                } relative`}
                onClick={(event) => onClickSlide(event, each?.id)}
              >
                {loadingSlide && (
                  <div className={`absolute top-1/2 left-1/2`}>
                    <LoadingSpinner />
                  </div>
                )}
                <h6 className="m-2">{index + 1}</h6>
                <div
                  className="absolute top-6 right-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    deletePage(each.id);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="transition-transform duration-500 hover:scale-120"
                  />
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default memo(Slides);
