import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import LoadingSpinner from "@/components/atoms/LoadingSpinner/LoadingSpinner";
import { usePageStore } from "@/store/usePageStore";
import Image from "next/image";
import DeletePopUp from "@/components/atoms/deletePopup/deletePopup";
import ChessboardStatic from "@/components/atoms/slides/chessboardStatic";
import { useSelectedSlide } from "@/store/useSelectedSlide";
import html2canvas from "html2canvas";
import Slides from "@/components/atoms/slides/Slides";
import dynamic from "next/dynamic";
import { calcWidth } from "@/helpers/chessboardCal";
import { usePersistSelectedSlide } from "@/store/usePersistSelectedSlide";

const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
export interface Slide {
  dropPieces: any;
  hint: any;
  pieceMove: any;
  position: any;
  isDeleted: boolean;
  board: any;
  id: string;
  data: any;
}
const Page = () => {
  const [topText, setTopText] = useState<any>(null);
  const [topOneImage, setTopOneImage] = useState<any>(null);
  const [topTwoImage, setTopTwoImage] = useState<any>(null);
  const [topVideo, setTopVideo] = useState<any>(null);
  const [topMcq, setTopMcq] = useState<any>(null);
  const [topHint, setTopHint] = useState<any>(null);
  const [bottomText, setBottomText] = useState<any>(null);
  const [bottomOneImage, setBottomOneImage] = useState<any>(null);
  const [bottomTwoImage, setBottomTwoImage] = useState<any>(null);
  const [bottomVideo, setBottomVideo] = useState<any>(null);
  const [bottomMcq, setBottomMcq] = useState<any>(null);
  const [bottomHint, setBottomHint] = useState<any>(null);
  const [topData, setTopData] = useState<any>(null);
  const [bottomData, setBottomData] = useState<any>(null);
  const selectedSlide = usePersistSelectedSlide((S) => S.selectedSlide);
  const setSelectedSlide = usePersistSelectedSlide((s) => s.setSelectedSlide);
  const [isLoading, setIsLoading] = useState(false);
  const open = usePageStore((S) => S.openAlert);
  const setOpen = usePageStore((s) => s.setOpenAlert);
  const pageIdStore = usePageStore((s) => s.pageId);
  const setPageIdStore = usePageStore((s) => s.setPageId);
  const [fenString, setFenString] = useState("");
  const [slide, setSlide] = useState<any>([]);
  const slidePreviews = useSelectedSlide((s) => s.slidePreviews);
  const setSlidePreviews = useSelectedSlide((s) => s.setSlidePreviews);
  const [imageDatas, setImageDatas] = useState<string>("");
  const [loadingSlide, setLoadingSlide] = useState<boolean>(false);
  useEffect(() => {
    const getSlidePreviews = async () => {
      try {
        const response = await fetch(`https://staging.api.playalvis.com/v1/getpreview`, {
          mode: "cors",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!data) return;
        setSlidePreviews(data[0].preview);
      } catch (error) {
        console.log(error);
      }
    };
    getSlidePreviews();
  }, []);

  const [brush, setBrush] = useState<
    Array<{
      position: string;
      color: string;
      _id?: string;
    }>
  >([]);
  const [screen, setScreen] = useState<
    Array<{
      position: string;
      color: string;
      animate: boolean;
      _id?: string;
    }>
  >([]);
  const [arrowPercentages, setArrowPercentages] = useState<
    Array<{
      start: { x: number; y: number };
      end: { x: number; y: number };
      color: string;
      _id?: string;
    }>
  >([]);
  const [linePercentages, setLinePercentages] = useState<
    Array<{
      start: { x: number; y: number };
      end: { x: number; y: number };
      color: string;
      _id?: string;
    }>
  >([]);
  const [pieces, setPieces] = useState<
    Array<{
      location: string;
      pieceName: string;
    }>
  >([]);
  const [positions, setPositions] = useState<any[]>([]);
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }

  let selectedId: any = null;
  if (typeof window !== "undefined") {
    selectedId = JSON.parse(localStorage?.getItem("selectedId") || "null");
  }
  let selectChapterId: any = null;
  if (typeof window !== "undefined") {
    selectChapterId = JSON.parse(
      localStorage?.getItem("selectChapterId") || "null"
    );
  }
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
  useEffect(() => {
    const slideString = localStorage.getItem("Slide");
    if (slideString) {
      const slide = JSON.parse(slideString);
      const selectedSlide = slide.state.selectedSlide;
      if (!selectedSlide) return;
      setSelectedSlide(selectedSlide);
      getSlideData(selectedSlide);
      getApiPage(selectedSlide);
    }
  }, []);
  const getSlideData = async (selectedSlide: string) => {
    console.log("setPageId", selectedSlide);
    localStorage?.setItem("selectPageId", JSON.stringify(selectedSlide));
    activateLoading();
    setSelectedSlide(selectedSlide);

    try {
      await Promise.all([
        getApiPage(selectedSlide),
        getTopSectionApi(selectedSlide),
        getBottomSectionApi(selectedSlide),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoadingSlide(false);
      setIsLoading(false);
    }
  };
  const getApiPage = async (id: any) => {
    try {
      const response = await fetch(`https://staging.api.playalvis.com/v1/getPages/${id}`, {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("dp", data);
      setPositions(data?.data?.position);
      const interactionFenstring = data?.data.fenstring;
      setFenString(interactionFenstring);
      console.log("interactionFenstring: " + interactionFenstring);
      if (data?.data?.position && data?.data?.position.length > 0) {
        const position = data.data.position[0];
        const pieces = Array.isArray(position.pieces) ? position.pieces : [];
        const selectedSquareArr = Array.isArray(position.brush)
          ? position.brush
          : [];
        const selectedScreenArr = Array.isArray(position.screen)
          ? position.screen
          : [];
        const arrowPerc = Array.isArray(position.arrowsPercentage)
          ? position.arrowsPercentage
          : [];
        const linePerc = Array.isArray(position.linesPercentage)
          ? position.linesPercentage
          : [];
        const fenString = position.fenString;
        // Update useState variables here
        setPieces(pieces);
        setArrowPercentages(arrowPerc);
        setLinePercentages(linePerc);
        setBrush(selectedSquareArr);
        setScreen(selectedScreenArr);
        setFenString(fenString || interactionFenstring);
      } else {
        // Slide has no data
        // Update the state variables with empty values
        const positionData = data?.data?.position;
        if (positionData && positionData.length === 0) {
          setPositions([]);
          setPieces([]);
          setArrowPercentages([]);
          setLinePercentages([]);
          setBrush([]);
          setScreen([]);
          setFenString(interactionFenstring);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  const [count, setCount] = useState(1);
  const [page, setPage] = useState<Slide[] | null>(null);
  const [data, setData] = useState();
  const [isAddNewClicked, setIsAddNewClicked] = useState(false);
  const addNew = async () => {
    setCount((prev) => prev + 1);
    try {
      const response = await fetch("https://staging.api.playalvis.com/v1/pages", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unitId: selectedId,
          chapterId: selectChapterId,
          id: uuidv4(),
        }),
      });

      const res = await response.json();
      const id = res.data.id;
      setIsLoading(true);
      localStorage?.setItem("selectPageId", JSON.stringify(id));
      setSelectedSlide(id);
      await getApiPage(id);
      await getTopSectionApi(id);
      await getBottomSectionApi(id);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
    await getApi();
  };

  function activateLoading() {
    setIsLoading(true);
    setLoadingSlide(true);
  }
  // Update your onClickSlide function
  async function onClickSlide(event: any, id: any) {
    console.log("setPageId", id);
    localStorage?.setItem("selectPageId", JSON.stringify(event.target.id));
    activateLoading();
    setSelectedSlide(id);
    await getSlideData(id);
    setLoadingSlide(false);
  }
  const updatePreviewSlide = async (
    selectedId: string,
    selectChapterId: string,
    selectedSlide: string
  ) => {
    if (selectedSlide === "" && imageDatas === "") return;
    if (!isAddNewClicked) return;
    try {
      // Always use the POST request to either create a new preview or update an existing one
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/preview/${selectedId}/${selectChapterId}/${selectedSlide}`,
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            preview: imageDatas,
          }),
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        console.log("Data updated successfully", data);
        const previewData = data.data;
        setSlidePreviews(previewData[0].preview);
        setLoadingSlide(false);
      } else if (response.status === 201) {
        console.log("Data created successfully", data);
        const previewData = data.data;
        setSlidePreviews(previewData[0].preview);
        setLoadingSlide(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectedSlide) {
      router.push(
        `/auth/units/${selectedId}/${selectChapterId}/${selectedSlide}`
      );
    }
  }, [selectedSlide]);
  // Mapping the preview mode
  function getTopText(topText: any) {
    return (
      <>
        <div>
          <h1 title={topText?.heading} className="text-3xl">
            {topText?.heading?.slice(0, 10)}
            {topText?.heading && topText.heading.length > 10 ? "..." : ""}
          </h1>

          <p title={topText?.body} className="text-2xl">
            {topText?.body?.slice(0, 15)}
            {topText?.body && topText.body.length > 15 ? "..." : ""}
          </p>
        </div>
      </>
    );
  }
  function getTopOneImage(topOneImage: any) {
    return (
      <div className="flex flex-col items-center">
        <h1 title={topOneImage?.heading} className="text-3xl my-2">
          {topOneImage?.heading?.slice(0, 10)}
          {topOneImage?.heading && topOneImage.heading.length > 10 ? "..." : ""}
        </h1>
        <Image
          priority
          height={70}
          width={50}
          src={topOneImage?.image}
          alt="oneImage"
        />

        <p title={topOneImage?.body} className="text-2xl my-2">
          {topOneImage?.body?.slice(0, 15)}
          {topOneImage?.body && topOneImage.body.length > 15 ? "..." : ""}
        </p>
      </div>
    );
  }
  function getTopTwoImages(topTwoImage: any) {
    return (
      <div className="flex flex-col items-center">
        <h1 title={topTwoImage?.heading} className="text-2xl my-2">
          {topTwoImage?.heading?.slice(0, 10)}
          {topTwoImage?.heading && topTwoImage.heading.length > 15 ? "..." : ""}
        </h1>
        <Image
          priority
          height={70}
          width={50}
          src={topTwoImage?.image1}
          alt="oneImage"
        />
        <p title={topTwoImage?.body1} className="text-2xl my-2">
          {topTwoImage?.body1?.slice(0, 15)}
          {topTwoImage?.body1 && topTwoImage.body1.length > 15 ? "..." : ""}
        </p>
        <Image
          priority
          height={70}
          width={50}
          src={topTwoImage?.image2}
          alt="twoImage"
        />
        <p title={topTwoImage?.body2} className="text-2xl my-2">
          {topTwoImage?.body2?.slice(0, 15)}
          {topTwoImage?.body2 && topTwoImage.body2.length > 15 ? "..." : ""}
        </p>
      </div>
    );
  }
  function getTopVideo(topVideo: any) {
    return (
      <div className="flex flex-col items-center">
        <h1 title={topVideo?.heading} className="text-3xl my-2">
          {topVideo?.heading?.slice(0, 10)}
          {topVideo?.heading && topVideo.heading.length > 10 ? "..." : ""}
        </h1>
        <video
          width={250}
          height={400}
          src={topVideo?.video}
          onClick={(e) => e.stopPropagation()}
          controls
        />
        <p title={topVideo?.body} className="text-2xl my-2">
          {topVideo?.body?.slice(0, 15)}
          {topVideo?.body && topVideo.body.length > 15 ? "..." : ""}
        </p>
      </div>
    );
  }
  function getTopMcq(topMcq: any) {
    return (
      <div className="flex flex-col items-center">
        <h1 title={topMcq?.heading} className="text-3xl my-2">
          {topMcq?.heading?.slice(0, 5)}
          {topMcq?.heading && topMcq.heading.length > 5 ? "..." : ""}
        </h1>
        {topMcq?.options.map((each: any) => (
          <p className="text-2xl my-2">{each?.value?.slice(0, 5)}</p>
        ))}
      </div>
    );
  }

  function getBottomText(bottomText: any) {
    return (
      <>
        <div>
          <h1 title={bottomText?.heading} className="text-3xl">
            {bottomText?.heading?.slice(0, 10)}
            {bottomText?.heading && bottomText.heading.length > 10 ? "..." : ""}
          </h1>

          <p title={bottomText?.body} className="text-2xl">
            {bottomText?.body?.slice(0, 15)}
            {bottomText?.body && bottomText.body.length > 15 ? "..." : ""}
          </p>
        </div>
      </>
    );
  }
  function getBottomOneImage(bottomOneImage: any) {
    return (
      <div className="flex flex-col items-center">
        <h1 title={bottomOneImage?.heading} className="text-3xl my-2">
          {bottomOneImage?.heading?.slice(0, 10)}
          {bottomOneImage?.heading && bottomOneImage.heading.length > 10
            ? "..."
            : ""}
        </h1>

        <Image
          priority
          height={70}
          width={50}
          src={bottomOneImage?.image}
          alt="oneImage"
        />
        <p title={bottomOneImage?.body} className="text-2xl my-2">
          {bottomOneImage?.body?.slice(0, 10)}
          {bottomOneImage?.body && bottomOneImage.body.length > 10 ? "..." : ""}
        </p>
      </div>
    );
  }
  function getBottomTwoImages(bottomTwoImage: any) {
    return (
      <div className="flex flex-col items-center">
        <h1 title={bottomTwoImage?.heading} className="text-3xl my-2">
          {bottomTwoImage?.heading?.slice(0, 10)}
          {bottomTwoImage?.heading && bottomTwoImage.heading.length > 10
            ? "..."
            : ""}
        </h1>
        <Image
          priority
          height={70}
          width={50}
          src={bottomTwoImage?.image1}
          alt="oneImage"
        />
        <p title={bottomTwoImage?.body1} className="text-2xl my-2">
          {bottomTwoImage?.body1?.slice(0, 10)}
          {bottomTwoImage?.body1 && bottomTwoImage.body1.length > 10
            ? "..."
            : ""}
        </p>
        <Image
          priority
          height={70}
          width={50}
          src={bottomTwoImage?.image2}
          alt="twoImage"
        />

        <p title={bottomTwoImage?.body2} className="text-2xl my-2">
          {bottomTwoImage?.body2?.slice(0, 10)}
          {bottomTwoImage?.body2 && bottomTwoImage.body2.length > 10
            ? "..."
            : ""}
        </p>
      </div>
    );
  }
  function getBottomVideo(bottomVideo: any) {
    return (
      <div className="flex flex-col items-center">
        <h1 title={bottomVideo?.heading} className="text-3xl my-2">
          {bottomVideo?.heading?.slice(0, 15)}
          {bottomVideo?.heading && bottomVideo.heading.length > 15 ? "..." : ""}
        </h1>
        <video
          width={250}
          height={400}
          src={bottomVideo?.video}
          onClick={(e) => e.stopPropagation()}
          controls
        />
        <p title={bottomVideo?.body} className="text-2xl my-2">
          {bottomVideo?.body?.slice(0, 15)}
          {bottomVideo?.body && bottomVideo.body.length > 15 ? "..." : ""}
        </p>
      </div>
    );
  }
  function getBottomMcq(bottomMcq: any) {
    return (
      <div className="flex flex-col items-center">
        <h1 title={bottomMcq?.heading} className="text-3xl my-2">
          {bottomMcq?.heading?.slice(0, 10)}
          {bottomMcq?.heading && bottomMcq.heading.length > 10 ? "..." : ""}
        </h1>
        {bottomMcq?.options.map((each: any, index: number) => (
          <p key={index} className="text-2xl my-2">
            {each?.value?.slice(0, 10)}
          </p>
        ))}
      </div>
    );
  }
  // calling API for top and bottom sections
  const getTopSectionApi = async (id: string) => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/topSectionPage/${selectPageId}`,
        {
          mode: "cors",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataB = await response.json();
      const data = dataB.data[0];
      console.log("getTop", dataB.data[0]);
      setTopText(data?.text);
      setTopOneImage(data?.oneImage);
      setTopTwoImage(data?.twoImages);
      setTopVideo(data?.videos);
      setTopMcq(data?.mcq);
      setTopHint(data?.hint);
      setTopData(data);
      if (topText) {
        getTopText(topText);
      } else if (topOneImage) {
        getTopOneImage(topOneImage);
      } else if (topTwoImage) {
        getTopTwoImages(topTwoImage);
      } else if (topVideo) {
        getTopVideo(topVideo);
      } else if (topMcq) {
        getTopMcq(topMcq);
      }
    } catch (error) {
      console.log("No Top section");
    }
  };
  const getBottomSectionApi = async (id: string) => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/bottomPagesection/${selectPageId}`,
        {
          mode: "cors",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataB = await response.json();
      const data = dataB.data[0];
      console.log("getBottom", dataB.data[0]);
      setBottomText(data?.text);
      setBottomOneImage(data?.oneImage);
      setBottomTwoImage(data?.twoImages);
      setBottomVideo(data?.videos);
      setBottomMcq(data?.mcq);
      setBottomHint(data?.hint);
      setBottomData(data);
      if (bottomText) {
        getBottomText(bottomText);
      } else if (bottomOneImage) {
        getBottomOneImage(bottomOneImage);
      } else if (bottomTwoImage) {
        getBottomTwoImages(bottomTwoImage);
      } else if (bottomVideo) {
        getBottomVideo(bottomVideo);
      } else if (bottomMcq) {
        getBottomMcq(bottomMcq);
      }
    } catch (error) {
      console.log("No bottom section");
    }
  };
  // calling pages w.r.t chapterId
  const getApi = async () => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/getChPages/${selectChapterId}`,
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
      console.log("getPages", data.data);
      if (data && data.data.length > 0) {
        setIsAddNewClicked(true);
      }
      setPage(data.data);
    } catch (error) {
      console.log("No Add the pages");
    }
  };
  useEffect(() => {
    getApi();
  }, []);
  const deletePage = async (id: string) => {
    setOpen(true);
    setPageIdStore(id);
  };
  // delete api clearing off the page
  const handleDeleteConfirmed = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/PageTopBottom/${id}`,
        {
          mode: "cors",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await response.json();
      await deletePreviewApi(id);
      const updatedPages: any = page?.filter((p) => p.id !== id);
      setPage(updatedPages);
      console.log("up", updatedPages);
      if (id === selectedSlide) {
        setSelectedSlide("");
      }
    } catch (error) {
      console.log(error);
    }
    if (router.asPath.includes(id)) {
      router.back();
      localStorage?.setItem("selectPageId", "");
    }
    setOpen(false);
    setIsLoading(false);
    await getApi();
  };
  // page number based on the Index
  let pageNumber: any;
  if (page && selectedSlide) {
    pageNumber = page.findIndex((each) => each.id === selectedSlide) + 1;
    if (pageNumber && selectedSlide && typeof window !== "undefined") {
      localStorage?.setItem("pageNumber", pageNumber);
    }
  } else if (selectedSlide === null && typeof window !== "undefined") {
    localStorage?.removeItem("pageNumber");
  }
  // duplicating the slide/page
  const addCopy = async () => {
    if (page && page?.length > 0) {
      // Fetch data from the last slide in the `page` array
      let selectedSlideIndex = page.findIndex(
        (slide) => slide.id === selectPageId
      );
      console.log(selectedSlideIndex);
      const lastSlide = page[selectedSlideIndex];
      console.log("lslide", lastSlide);
      // Create a new slide with the fetched data
      try {
        const response = await fetch("https://staging.api.playalvis.com/v1/pages", {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chapterId: selectChapterId,
            id: uuidv4(),
            unitId: selectedId,
            board: lastSlide?.board,
            dropPieces: lastSlide?.dropPieces,
            hint: lastSlide?.hint,
            pieceMove: lastSlide?.pieceMove,
            position: lastSlide?.position,
            isDeleted: lastSlide?.isDeleted,
          }),
        });

        const res = await response.json();
        setData(res);
        const newSlideId = res?.data?.id;
        setIsLoading(true);
        localStorage?.setItem("selectPageId", JSON.stringify(newSlideId));
        setSelectedSlide(newSlideId);
        await getApiPage(newSlideId);
        await getTopSectionApi(newSlideId);
        await getBottomSectionApi(newSlideId);
        const topSectionResponse = await fetch(
          "https://staging.api.playalvis.com/v1/topsection",
          {
            mode: "cors",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: uuidv4(),
              pageId: newSlideId,
              chapterId: selectChapterId,
              unitId: selectedId,
              text: topData?.text,
              oneImage: topData?.oneImage,
              twoImages: topData?.twoImages,
              videos: topData?.videos,
              mcq: topData?.mcq,
            }),
          }
        );
        const bottomSectionResponse = await fetch(
          "https://staging.api.playalvis.com/v1/bottomsection",
          {
            mode: "cors",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: uuidv4(),
              pageId: newSlideId,
              chapterId: selectChapterId,
              unitId: selectedId,
              text: bottomData?.text,
              oneImage: bottomData?.oneImage,
              twoImages: bottomData?.twoImages,
              videos: bottomData?.videos,
              mcq: bottomData?.mcq,
            }),
          }
        );
        await topSectionResponse.json();
        await bottomSectionResponse.json();
        await getApi();
        setIsLoading(false);
      } catch (error) {
        alert(error);
      }
    }
  };
  // routing for board top and bottom sections
  function goToBoard() {
    if (selectedSlide && selectPageId) {
      router.push(
        `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/position`
      );
    } else {
      return;
    }
  }
  function goToTop() {
    if (selectedSlide && selectPageId) {
      router.push(
        `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/top/text/`
      );
    } else {
      return;
    }
  }
  function goToBottom() {
    if (selectedSlide && selectPageId) {
      router.push(
        `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/bottom/text/`
      );
    } else {
      return;
    }
  }
  // Preview for the slides using html2canvas
  useEffect(() => {
    const generateSlidePreview = async (slideId: string) => {
      const slideElement = document.getElementById(slideId);
      if (slideElement) {
        try {
          const canvas = await html2canvas(slideElement);
          const preview = canvas.toDataURL();
          setImageDatas(preview);
          setSlidePreviews({
            [slideId]: preview,
          });
        } catch (error) {
          console.error("Error generating slide preview:", error);
        }
      }
    };

    slide.forEach((s: any) => {
      generateSlidePreview(s.id);
    });
  }, [slide]);

  const handleChessboardCapture = useCallback(
    async (imageData: string) => {
      if (selectedSlide) {
        setImageDatas(`url(${imageData})`);
        setSlidePreviews({
          [selectedSlide]: `url(${imageData})`,
        });
      }
    },
    [selectedSlide]
  );

  // generating preview
  useEffect(() => {
    setLoadingSlide(true);
    const timer = setTimeout(() => {
      updatePreviewSlide(selectedId, selectChapterId, selectedSlide);
    }, 4000);
    return () => clearTimeout(timer);
  }, [imageDatas]);
  const deletePreviewApi = async (id: string) => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/deletePreview/${selectChapterId}/${id}`,
        {
          mode: "cors",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("deletedPreviews", data);
    } catch (error) {
      console.log(error);
    }
  };
  const [slidesLoaded, setSlidesLoaded] = useState(false);

  const slideRefs: any = useRef({});

  useEffect(() => {
    slideRefs.current[selectedSlide]?.current?.scrollIntoView();
  }, [selectedSlide, slidesLoaded]);
  return (
    <Suspense fallback={<>Loading.........</>}>
      <div
        className="bg-[#C2E7FF] bg-cover bg-repeat overflow-x-hidden"
        style={{ height: "100%" }}
      >
        <NavBarPage />
        <hr />
        <div className="flex flex-row justify-start">
          <div className={`flex flex-row cursor-pointer`}>
            <div className="h-screen min-w-[15rem] max-w-[20rem] border border-s-1 border-sky-700 overflow-y-auto pb-5">
              <div>
                <Slides
                  page={page}
                  setPage={setPage}
                  slidePreviews={slidePreviews}
                  selectedSlide={selectedSlide}
                  onClickSlide={onClickSlide}
                  deletePage={deletePage}
                  setSlidesLoaded={setSlidesLoaded}
                  slideRefs={slideRefs}
                  loadingSlide={loadingSlide}
                />
              </div>
              {isLoading && (
                <div className="mx-5">
                  <LoadingSpinner />
                </div>
              )}
              <div className="sticky bottom-10 flex justify-center">
                <button
                  onClick={() => addNew()}
                  className="transition-transform duration-500 hover:scale-110 px-2 py-1 mx-2 my-2 bg-[#01579B] text-white rounded-full"
                >
                  Add new
                </button>
                {(page?.length ?? 0) >= 1 && (
                  <button
                    onClick={() => addCopy()}
                    className="transition-transform duration-500 hover:scale-110 px-2 py-1 mx-2 my-2 bg-[#01579B] text-white rounded-full"
                  >
                    Duplicate
                  </button>
                )}
              </div>
            </div>
          </div>
          <div
            onClick={goToBoard}
            data-te-toggle="tooltip"
            data-te-placement="top"
            data-te-ripple-init
            data-te-ripple-color="light"
            title={selectedSlide === null ? "Please select page" : ""}
            className={`${
              selectedSlide ? `opacity-100` : "opactiy-0"
            } m-5 border-sky-700 cursor-pointer`}
          >
            <div style={{ position: "relative" }}>
              {!selectedSlide && (
                <Chessboard
                  calcWidth={calcWidth}
                  position={selectedSlide ? fenString : ""}
                  darkSquareStyle={{ backgroundColor: "#0D99FF" }}
                  lightSquareStyle={{ backgroundColor: "#FFFFFF" }}
                />
              )}
              {selectedSlide && !isLoading && (
                <ChessboardStatic
                  positions={positions}
                  setPositions={setPositions}
                  pieces={pieces}
                  setPieces={setPieces}
                  arrowPercentages={arrowPercentages}
                  setArrowPercentages={setArrowPercentages}
                  linePercentages={linePercentages}
                  setLinePercentages={setLinePercentages}
                  brush={brush}
                  setBrush={setBrush}
                  screen={screen}
                  setScreen={setScreen}
                  fenString={fenString}
                  setFenString={setFenString}
                  onChessboardCapture={handleChessboardCapture}
                />
              )}
              {!selectedSlide && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white color
                  }}
                >
                  <p className="font-bold text-3xl">Please select a page</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row md:justify-center md:items-start md:mt-4 2xl:justify-around 2xl:items-start">
            <DeletePopUp
              open={open}
              onClose={() => setOpen(false)}
              onDelete={() => handleDeleteConfirmed(pageIdStore)}
            />
            <div className="cursor-pointer">
              <div
                onClick={goToTop}
                data-te-toggle="tooltip"
                data-te-placement="top"
                data-te-ripple-init
                data-te-ripple-color="light"
                title={selectedSlide === null ? "Please select page " : ""}
                className={`${
                  selectedSlide ? `opacity-100` : "opactiy-0"
                } border rounded-xl bg-[#F5FCFD] border-1 xl:min-w-[20rem] xl:min-h-[18rem] md:min-w-[15rem] md:max-w-[15rem] md:min-h-[15rem] md:max-h-[17rem]  border-sky-700 flex justify-center items-center`}
              >
                {topText || topOneImage || topTwoImage || topVideo || topMcq ? (
                  <>
                    {topText && getTopText(topText)}
                    {topOneImage && getTopOneImage(topOneImage)}
                    {topTwoImage && getTopTwoImages(topTwoImage)}
                    {topVideo && getTopVideo(topVideo)}
                    {topMcq && getTopMcq(topMcq)}
                  </>
                ) : (
                  <h5 className="text-center text-2xl font-bold">
                    Click to add <br />
                    Top Section
                  </h5>
                )}
              </div>
              <div
                onClick={goToBottom}
                data-te-toggle="tooltip"
                data-te-placement="top"
                data-te-ripple-init
                data-te-ripple-color="light"
                title={selectedSlide === null ? "Please select page " : ""}
                className={`${
                  selectedSlide ? `opacity-100` : "opactiy-0"
                } border rounded-xl mt-2 bg-[#F5FCFD] border-1 xl:min-w-[20rem] xl:min-h-[18rem] md:min-w-[15rem] md:max-w-[15rem] md:min-h-[15rem] md:max-h-[17rem]  border-sky-700 flex justify-center items-center`}
              >
                {bottomText ||
                bottomOneImage ||
                bottomTwoImage ||
                bottomVideo ||
                bottomMcq ? (
                  <>
                    {bottomText && getBottomText(bottomText)}
                    {bottomOneImage && getBottomOneImage(bottomOneImage)}
                    {bottomTwoImage && getBottomTwoImages(bottomTwoImage)}
                    {bottomVideo && getBottomVideo(bottomVideo)}
                    {bottomMcq && getBottomMcq(bottomMcq)}
                  </>
                ) : (
                  <h5 className="text-center text-2xl font-bold">
                    Click to add <br />
                    Bottom Section
                  </h5>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default Page;
