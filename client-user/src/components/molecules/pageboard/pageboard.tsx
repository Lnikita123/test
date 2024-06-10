import BottomButton from "@/components/atoms/bottomButton/bottomButton";
import React, { useEffect, useState } from "react";
import PositionBoard from "./positionBoard";
import {
  getChPages,
  getBottomApi,
  getTopApi,
  getUnitChapterNames,
  getChapterPoints,
  getStudentApi,
} from "@/pages/api/pageApi";
import {
  getTopText,
  getTopOneImage,
  getTopTwoImages,
  getTopVideo,
  responsiveStyle,
} from "@/components/molecules/pageboard/topSection";
import {
  getBottomText,
  getBottomOneImage,
  getBottomTwoImages,
  getBottomVideo,
  BottomMcq,
} from "@/components/molecules/pageboard/bottomSection";
import PieceMove from "../PieceMove/PieceMove";
import DropPieces from "../dropPieces/DropPieces";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PiecesRender from "../dropPieces/PiecesRender";
import {
  ArrowPercentage,
  Brush,
  LinePercentage,
  Piece,
  ScreenZ,
} from "./usePageInteraction";
import { GameData } from "../PieceMove/pieceMoveInterface";
import BoardMove from "../boardMove/BoardMove";
import ScoreBoard from "@/components/atoms/scoreBoard/scoreBoard";
import { getContainerStyle, getbackroundImage } from "./useTopBGStyles";
import Title from "@/components/atoms/Title/Title";
import { useRouter } from "next/router";
import Hamburger from "@/components/atoms/hamburger/Hamburger";
import { API_BASE_URL } from "@/config";
import { IStudent } from "@/store/useInterfaceStore";
import usePaginationStore from "@/store/usePaginationStore";
import { revealSound, scoreboardSound } from "@/helpers/playComputer";
import HintCorrectWrong from "@/components/atoms/HintCorrectWrong/HintCorrectWrong";

const Pageboard = () => {
  const [initialCorrect, setInitialCorrect] = useState(false);
  const [initialWrong, setInitialWrong] = useState(false);
  let firstPageId: string;
  let points: number;
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<IStudent>({
    id: "",
    email: "",
    uid: "",
    password: "",
    name: "",
    Progress: {},
  });
  const [type, setType] = useState("position");
  const [userAction, setUserAction] = useState("none");
  const [showHint, setShowHint] = useState(false);
  const [topText, setTopText] = useState<any>(null);
  const [topOneImage, setTopOneImage] = useState<any>(null);
  const [topTwoImage, setTopTwoImage] = useState<any>(null);
  const [topVideo, setTopVideo] = useState<any>(null);
  const [bottomText, setBottomText] = useState<any>(null);
  const [bottomOneImage, setBottomOneImage] = useState<any>(null);
  const [bottomTwoImage, setBottomTwoImage] = useState<any>(null);
  const [bottomVideo, setBottomVideo] = useState<any>(null);
  const [bottomMcq, setBottomMcq] = useState<any>(null);
  const [bottomHint, setBottomHint] = useState<any>(null);
  const [bottomInteractionHint, setBottomInteractionHint] = useState<any>(null);
  const [bottomInteractionWrong, setBottomInteractionWrong] =
    useState<any>(null);
  // wrong for interactions
  const [bottomWrong, setBottomWrong] = useState<any>(null);
  const [showBottomPage, setShowBottomPage] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [pages, setPages] = useState<any[] | null>(null);
  const [fenString, setFenString] = useState<string>("");
  const [topSectionData, setTopSectionData] = useState<any[] | null>(null);
  const [bottomSectionData, setBottomSectionData] = useState<any[] | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(0);
  // const currentPage = usePaginationStore((s) => s.currentPage);
  // const setCurrentPage = usePaginationStore((s) => s.setCurrentPage);
  // const readyPage = usePaginationStore((s) => s.readyPage);
  // const setReadyPage = usePaginationStore((s) => s.setReadyPage);
  const [highlightSquares, setHighlightSquares] = useState<string[]>([]);
  const [brush, setBrush] = useState<Brush[]>([]);
  const [screen, setScreen] = useState<ScreenZ[]>([]);
  const [arrowPercentages, setArrowPercentages] = useState<ArrowPercentage[]>(
    []
  );
  const [linePercentages, setLinePercentages] = useState<LinePercentage[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [positions, setPositions] = useState<Object>({});
  const [dropPieces, setDropPieces] = useState<Array<Record<string, any>>>([]);
  const [board, setBoard] = useState<string[]>([]);
  const [pieceMove, setPieceMove] = useState<GameData[]>([]);
  const [ready, setReady] = useState(false);
  const [toggleReady, setToggleReady] = useState(false);
  const [readyPage, setReadyPage] = useState<number>(0);
  const [hint, setHint] = useState(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [correct, setCorrect] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [unitName, setUnitName] = useState<string>("");
  const [chapterName, setChapterName] = useState<string | null>(null);
  const [chapterNumber, setChapterNumber] = useState<number | null>(null);
  const [unitNumber, setUnitNumber] = useState<number | null>(null);
  const [levels, setLevels] = useState<string>("");
  const [redo, setRedo] = useState(true);
  const [showHamburger, setShowHamburger] = useState(false);
  // scorecard display
  const [completed, setCompleted] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [proceedInteraction, setProceedInteraction] = useState(false);
  const totalPoints = usePaginationStore((s) => s.totalPoints);
  const setTotalPoints = usePaginationStore((s) => s.setTotalPoints);
  const [numPages, setNumPages] = useState<number>(0);
  // tracking hints for points
  const [hintTrack, setHintTrack] = useState<number>(0);
  // tracking hints for position mcq points
  const [hintPositionTrack, setHintPositionTrack] = useState<number>(0);
  const [revealTrack, setRevealTrack] = useState<number>(0);
  // tracking reveals for position mcq points
  const [revealPositionTrack, setRevealPositionTrack] = useState<number>(0);
  // displaying hint for position mcq points
  const [displayhint, setDisplayHint] = useState(false);
  const [interactionHint, setInteractionHint] = useState(false);
  const [bottomMcqCorrect, setBottomMcqCorrect] = useState(initialCorrect);
  const [bottomMcqWrong, setBottomMcqWrong] = useState(initialWrong);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [reveal, setReveal] = useState(false);
  const [displayReveal, setDisplayReveal] = useState(false);
  const router = useRouter();
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  let selectedId: any = null;
  if (typeof window !== "undefined" && selectedId !== undefined) {
    selectedId = JSON.parse(localStorage?.getItem("selectedId") || "null");
  }
  let selectChapterId: any = null;
  if (typeof window !== "undefined" && selectChapterId !== undefined) {
    selectChapterId = JSON.parse(
      localStorage?.getItem("selectChapterId") || "null"
    );
  }
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    const storedPageId = localStorage.getItem("selectPageId");
    if (storedPageId !== null) {
      selectPageId = JSON.parse(storedPageId);
    }
  }

  let studentId: any = null;
  if (typeof window !== "undefined" && studentId !== undefined) {
    studentId = JSON.parse(localStorage?.getItem("studentId") || "null");
  }

  const onClickOkay = () => {
    setHint(false);
    setShowResult(true);
    setRedoVisible(true);
  };
  function proceedTrigger() {
    setProceedInteraction(true);
  }
  const onClickRedo = () => {
    setReveal(false);
    setShowResult(false);
    setRedo(true);
    setCorrect(false);
    setWrong(false);
    setHint(false);
    setShowHint(false);
    setRedoVisible(false);
    setHighlightSquares([]);
  };
  useEffect(() => {
    console.log("SetType", type);
  }, [type]);
  async function onClickNext() {
    setDisplayHint(false);
    setReveal(false);
    setShowResult(false);
    setInitialCorrect(false);
    setInitialWrong(false);
    setCorrect(false);
    setWrong(false);
    setBottomMcqCorrect(false);
    setBottomMcqWrong(false);
    setShowHint(false);
    setHint(false);
    setShowResult(false);
    setHighlightSquares([]);
    // Calculate the next page number
    let newCurrentPage = currentPage + 1;
    // Check if we have the pages array and if the next page is within the bounds of the array
    if (pages && newCurrentPage < pages.length) {
      // If so, proceed to the next page
      setCurrentPage((prev) => prev + 1);
      setReadyPage(newCurrentPage);
      await calculateTheDeductedPoints();
      setUserAction("none");
      setProceed(false);
      setProceedInteraction(false);
    }
    if (pages && currentPage >= pages.length - 1) {
      await calculateTheDeductedPoints();
      await getTotalUserPoints(selectChapterId);
      setUserAction("none");
      setCompleted(true);
      scoreboardSound();
    }
    setHintPositionTrack(0);
    setHintTrack(0);
  }
  useEffect(() => {
    getChapterPoints(selectChapterId)
      .then((result) => {
        setNumPages(result?.numPages);
        setTotalPoints(result?.points);
      })
      .catch((error) => {
        console.error("Error getting chapter points:", error);
      });
  }, [selectChapterId]);
  // value is the each page points declared as value;
  let value: number;
  let pointsForCurrentPage: number;
  // const calculateTheDeductedPoints = async () => {
  //   value = totalPoints / numPages;
  //   pointsForCurrentPage = value;
  //   if (hintTrack === 1 || hintPositionTrack === 1) {
  //     pointsForCurrentPage = value - 0.1 * value;
  //     await progressApi(pointsForCurrentPage);
  //   } else if (revealTrack === 1 || revealPositionTrack === 1) {
  //     console.log("triggered reveal");
  //     pointsForCurrentPage = 0.9 * value;
  //     await progressApi(pointsForCurrentPage);
  //   }
  //   console.log("Tp", totalPoints, numPages, pointsForCurrentPage);

  //   // Update the points for the current page in the map
  //   setEachPagePointsMap((prevPoints: any) => {
  //     // Check if the current points are less than pointsForCurrentPage then return
  //     if (prevPoints[selectPageId] < pointsForCurrentPage) {
  //       return prevPoints;
  //     }
  //     return {
  //       ...prevPoints,
  //       [selectPageId]: pointsForCurrentPage,
  //     };
  //   });
  // };
  const calculateTheDeductedPoints = async () => {
    value = totalPoints / numPages;
    switch (userAction) {
      case "hint":
        if (hintPositionTrack === 1 && hintTrack === 1) {
          // if hintPositionTrack is 1, deduct 20%
          pointsForCurrentPage = value - 0.2 * value;
        } else {
          // if hintPositionTrack is not 1, deduct 10% as before
          pointsForCurrentPage = value - 0.1 * value;
        }
        break;
      case "reveal":
        pointsForCurrentPage = value * 0.1;
        break;
      default:
        pointsForCurrentPage = value;
    }
    await progressApi(pointsForCurrentPage);
  };

  // useEffect(() => {
  //   if (totalPoints && numPages) {
  //     calculateTheDeductedPoints();
  //   }
  // }, [
  //   currentPage,
  //   totalPoints,
  //   numPages,
  //   hintTrack,
  //   hintPositionTrack,
  //   revealTrack,
  //   revealPositionTrack,
  // ]);
  // updating the points based
  async function progressApi(pointsForCurrentPage: number) {
    try {
      const currentPointsResponse = await getStudentApi(studentId);
      const studentData = currentPointsResponse.Progress;
      let currentPoints = 0;
      for (const unitId in studentData) {
        for (const chapterId in studentData[unitId]) {
          // Only calculate points for the specified chapter
          if (chapterId === selectChapterId) {
            for (const pageId in studentData[unitId][chapterId]) {
              if (pageId === selectPageId) {
                currentPoints = studentData[unitId][chapterId][pageId];
              }
            }
          }
        }
      }

      // Only update the points if currentPoints is greater than zero and less than currentPagePoints
      if (currentPoints > 0) {
        console.log(
          "Existing points are less than new points, not updating the points."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/v1/student/${studentId}/${selectedId}/${selectChapterId}/${selectPageId}/progress`,
        {
          mode: "cors",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            points: pointsForCurrentPage,
          }),
        }
      );
      const dataB = await response.json();
      const data = dataB.data;
      console.log("post progress", data);
    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    getStudentApi(studentId)
      .then((result) => {
        console.log("studentData", result);
        setStudentData(result.Progress);
      })
      .catch((error) => {
        console.error("Error getting chapter points:", error);
      });
  }, [studentId]);
  async function getTotalUserPoints(selectChapterId: string) {
    try {
      const result = await getStudentApi(studentId);
      console.log("studentData", result);
      const studentData = result?.Progress || {};
      setStudentData(studentData);
      let pointsSum = 0;

      // Iterate over studentData and calculate the total points for a specific chapter
      for (const unitId in studentData) {
        for (const chapterId in studentData[unitId]) {
          // Only calculate points for the specified chapter
          if (chapterId === selectChapterId) {
            for (const pageId in studentData[unitId][chapterId]) {
              const points = studentData[unitId][chapterId][pageId];
              pointsSum += points;
            }
          }
        }
      }
      // Update the total points for the specified chapter
      console.log("pointsSum", pointsSum);
      setUserPoints(pointsSum);
    } catch (error) {
      console.error("Error getting chapter points:", error);
    }
  }
  async function onClickReady() {
    setDisplayHint(false);
    setReveal(false);
    const dropPiecesExist = dropPieces?.length > 0;
    const pieceMoveExist = pieceMove?.length > 0;
    const boardExist = board?.length > 0;

    if (!pages || currentPage === pages.length) {
      // Check if none of dropPieces, pieceMove, and board exist
      if (!dropPiecesExist && !pieceMoveExist && !boardExist) {
        await calculateTheDeductedPoints();
        //await progressApi(pointsForCurrentPage);
        await getTotalUserPoints(selectChapterId);
      }
      setCompleted(true);
      return;
    }

    setInitialCorrect(false);
    setInitialWrong(false);
    setReadyPage(currentPage);
    setShowHint(false);
    setHint(false);
    setCorrect(false);
    setWrong(false);
    setBottomMcqCorrect(false);
    setBottomMcqWrong(false);
    await getTopBottomData(pages[currentPage]?.id);

    if (dropPiecesExist) {
      setReady(true);
      setType("drop");
      console.log("set dropPiecesExist");
    } else if (pieceMoveExist) {
      setReady(true);
      setType("pieceMove");
      console.log("set PiecesExist");
    } else if (boardExist) {
      setReady(true);
      setType("board");
      console.log("set boardExist");
    } else {
      onClickNext();
    }
    setShowResult(false);
  }
  useEffect(() => {
    console.log("set ", userAction);
    console.log("set pos", hintPositionTrack);
    console.log("set inter", hintTrack);
  }, [userAction, hintPositionTrack, hintTrack]);
  // async function onClickReady() {
  //   setReveal(false);
  //   if (!pages || currentPage === pages.length) {
  //     pointsForCurrentPage = totalPoints / numPages;
  //     await progressApi(pointsForCurrentPage);
  //     await getTotalUserPoints(selectChapterId);
  //     setCompleted(true);
  //     return;
  //   }
  //   setInitialCorrect(false);
  //   setInitialWrong(false);
  //   setReadyPage(currentPage);
  //   setShowHint(false);
  //   setHint(false);
  //   setCorrect(false);
  //   setWrong(false);
  //   setBottomMcqCorrect(false);
  //   setBottomMcqWrong(false);
  //   await getTopBottomData(pages[currentPage]?.id);
  //   if (dropPieces?.length > 0) {
  //     setReady(true);
  //     setType("drop");
  //   } else if (pieceMove?.length > 0) {
  //     setReady(true);
  //     setType("pieceMove");
  //   } else if (board?.length > 0) {
  //     setReady(true);
  //     setType("board");
  //   } else {
  //     onClickNext();
  //   }
  //   setShowResult(false);
  // }
  useEffect(() => {
    if (readyPage !== null && pages) {
      getTopBottomData(pages[readyPage]?.id);
    }
  }, [readyPage, pages]);
  useEffect(() => {
    if (pages) {
      getUnitChapterNames(pages[currentPage]?.id).then((data) => {
        const unitNumber = data?.unit?.unitNumber;
        const unitName = data?.unit?.unitName;
        const chapterNumber = data?.chapter?.chapterNumber;
        const chapterName = data?.chapter?.chapterName;
        const levels = data?.unit?.levels;
        setUnitName(unitName);
        setUnitNumber(unitNumber);
        setChapterName(chapterName);
        setChapterNumber(chapterNumber);
        setLevels(levels);
      });
    }
  }, [currentPage, pages]);

  async function onClickBack() {
    setDisplayHint(false);
    setReveal(false);
    setShowHint(false);
    setHint(false);
    if (!pages) {
      return;
    }
    if (ready && currentPage >= 0) {
      // If we're currently showing the second part, just switch to the first part
      setReady(false);
      if (
        pages[currentPage]?.position.length === 0 ||
        pages[currentPage]?.position === undefined
      ) {
        if (board?.length > 0) {
          setType("board");
          setRedo(true);
        } else if (dropPieces?.length > 0) {
          setType("drop");
        } else if (pieceMove?.length > 0) {
          setType("pieceMove");
        }
        setReady(true);
      } else {
        setType("position");
        setReady(false);
      }
      getTopBottomData(pages[currentPage]?.id);
      setCurrentPage(currentPage);
      setReadyPage(currentPage);
    } else if (currentPage > 0) {
      // If we're already showing the first part, go to the previous page
      setCurrentPage((prev) => prev - 1);
      setReadyPage(currentPage - 1);
      if (
        pages[currentPage - 1]?.position?.length === 0 ||
        pages[currentPage - 1]?.position === undefined
      ) {
        if (board?.length > 0) {
          setType("board");
          setRedo(true);
        } else if (dropPieces?.length > 0) {
          setType("drop");
        } else if (pieceMove?.length > 0) {
          setType("pieceMove");
        }
        setReady(true);
      } else {
        setType("position");
        setReady(false);
      }
    } else if (currentPage === 0) {
      router.push("/auth/units");
    }
  }
  //common for next and backpage
  const getTopBottomData = async (id: string) => {
    setShowBottomPage(true);
    const topData = await getTopApi(id);
    if (topData && topData.length > 0) {
      setTopSectionData(topData);
      const top = topData[0];
      console.log("toppest data", top);
      setTopText(top?.text);
      setTopOneImage(top?.oneImage);
      setTopTwoImage(top?.twoImages);
      setTopVideo(top?.videos);
    }
    const bottomData = await getBottomApi(id);
    if (bottomData.length === 0) {
      setProceed(true);
    }
    if (bottomData && bottomData.length > 0) {
      setBottomSectionData(bottomData);
      const bottom = bottomData[0];
      console.log("bottomest data", bottom);
      setBottomText(bottom?.text);
      setBottomOneImage(bottom?.oneImage);
      setBottomTwoImage(bottom?.twoImages);
      setBottomVideo(bottom?.videos);
      setBottomMcq(bottom?.mcq);
      if (bottom?.mcq.hint) {
        setDisplayHint(true);
        setBottomHint(bottom?.mcq?.hint);
      }
      if (bottom?.mcq.wrong) {
        setBottomWrong(bottom?.mcq.wrong);
      }
      const hintObject = bottomData.find(
        (obj: any) => typeof obj.hint === "string"
      );
      const hint = hintObject ? hintObject.hint : "";
      const wrongObject = bottomData.find(
        (obj: any) => typeof obj.wrong === "string"
      );
      const wrong = wrongObject ? wrongObject.wrong : "";
      console.log("set hint", hint);
      if (hint !== "") {
        setInteractionHint(true);
        setBottomInteractionHint(hint);
        setBottomInteractionWrong(wrong);
      } else {
        setInteractionHint(false);
      }
    }
  };
  // render only once
  useEffect(() => {
    const fetchChapterData = async () => {
      const data = await getChPages(selectChapterId);
      setPages(data);
      console.log("pages", data);
      return data;
    };
    const fetchProgressData = async () => {
      const getPageIndexFromId = async (pageId: string) => {
        const data = await getChPages(selectChapterId);
        return data?.findIndex((page: any) => page.id === pageId);
      };
      const progressData = await getStudentApi(studentId);
      const Progress = progressData?.Progress;
      console.log("Progress data", Progress);
      let currentPage = 0; // default to first page

      if (
        Progress &&
        Progress[selectedId] &&
        Progress[selectedId][selectChapterId]
      ) {
        const chapterProgress = Progress[selectedId][selectChapterId];

        // find the page index based on progress data
        const startedPageId = Object.keys(chapterProgress)
          .filter((pageId) => chapterProgress[pageId] === 0)
          .shift();
        if (startedPageId) {
          currentPage = await getPageIndexFromId(startedPageId);
        } else {
          const lastCompletedPageId = Object.keys(chapterProgress)
            .filter((pageId) => chapterProgress[pageId] > 0)
            .pop();
          if (lastCompletedPageId) {
            currentPage = await getPageIndexFromId(lastCompletedPageId);
          }
        }
      }
      if (currentPage >= 0) {
        setCurrentPage(currentPage);
        setReadyPage(currentPage);
      }
      const data = await fetchChapterData();
      if (data && data.length > 0) {
        firstPageId = data[currentPage]?.id;
        const dropPieces = data[currentPage]?.dropPieces;
        const pieceMove = data[currentPage]?.pieceMove;
        const board = data[currentPage]?.board?.AddedBlocks;
        if (
          dropPieces?.length > 0 ||
          pieceMove?.length > 0 ||
          board?.length > 0
        ) {
          setToggleReady(true);
        } else {
          setToggleReady(false);
        }
        const positionData = data[currentPage]?.position[0];
        console.log("positionData", positionData);
        if (positionData?.length === 0 || positionData === undefined) {
          if (board.length > 0) {
            setType("board");
            setRedo(true);
          } else if (dropPieces.length > 0) {
            setType("drop");
          } else if (pieceMove.length > 0) {
            setType("pieceMove");
          }
          setReady(true);
        } else {
          setType("position");
          setReady(false);
        }
        setDropPieces(dropPieces);
        setPieceMove(pieceMove);
        setBoard(board);
        setPositions(positionData);
        setFenString(
          positionData?.fenString
            ? positionData.fenString
            : data[currentPage]?.fenstring
        );
        setArrowPercentages(positionData?.arrowsPercentage);
        setLinePercentages(positionData?.linesPercentage);
        setBrush(positionData?.brush);
        setScreen(positionData?.screen);
        setPieces(positionData?.pieces);
        setShowBoard(true);
      }

      const topData = await getTopApi(firstPageId);
      console.log("get top data", topData);
      setTopSectionData(topData);
      if (topData && topData.length > 0) {
        const top = topData[currentPage];
        setTopText(top?.text);
        setTopOneImage(top?.oneImage);
        setTopTwoImage(top?.twoImages);
        setTopVideo(top?.videos);
      }
      const bottomData = await getBottomApi(firstPageId);
      console.log("get bottomData", bottomData);
      setBottomSectionData(bottomData);
      if (bottomData && bottomData.length > 0) {
        const bottom = bottomData[currentPage];
        setBottomText(bottom?.text);
        setBottomOneImage(bottom?.oneImage);
        setBottomTwoImage(bottom?.twoImages);
        setBottomVideo(bottom?.videos);
        setBottomMcq(bottom?.mcq);
        if (bottom?.mcq.hint) {
          setDisplayHint(true);
          setBottomHint(bottom?.mcq?.hint);
        }
        if (bottom?.mcq.wrong) {
          setBottomWrong(bottom?.mcq.wrong);
        }
        const hintObject = bottomData.find(
          (obj: any) => typeof obj.hint === "string"
        );
        const hint = hintObject ? hintObject.hint : "";
        const wrongObject = bottomData.find(
          (obj: any) => typeof obj.wrong === "string"
        );
        const wrong = wrongObject ? wrongObject.wrong : "";
        if (hint !== "") {
          setInteractionHint(true);
          setBottomInteractionHint(hint);
          setBottomInteractionWrong(wrong);
        } else {
          setInteractionHint(false);
        }
      }
    };
    setLoading(true);
    fetchProgressData();
    setLoading(false);
  }, []);
  useEffect(() => {
    if (!pages) return;
    localStorage.setItem(
      "selectPageId",
      JSON.stringify(pages[currentPage]?.id)
    );
  }, [currentPage, pages]);
  //render every change of current page
  useEffect(() => {
    if (pages && pages.length > 0) {
      console.log("Set current page", currentPage);
      console.log("", pages[currentPage]?.fenstring);
      const positionData = pages[currentPage]?.position[0];
      const dropPieces = pages[currentPage]?.dropPieces;
      const pieceMove = pages[currentPage]?.pieceMove;
      const board = pages[currentPage]?.board?.AddedBlocks;
      // placing the next when there is no interaction.
      if (
        dropPieces?.length > 0 ||
        pieceMove?.length > 0 ||
        board?.length > 0
      ) {
        setToggleReady(true);
      } else {
        setToggleReady(false);
      }
      if (positionData?.length === 0 || positionData === undefined) {
        if (board?.length > 0) {
          setType("board");
          setRedo(true);
        } else if (dropPieces?.length > 0) {
          setType("drop");
        } else if (pieceMove?.length > 0) {
          setType("pieceMove");
        } else {
          alert("No Page kindly go to Next/Back/Home page");
        }
        setReady(true);
        // getTopBottomData(pages[currentPage]?.id);
      } else {
        setType("position");
        setReady(false);
      }
      setPositions(positionData);
      setFenString(
        positionData?.fenString
          ? positionData.fenString
          : pages[currentPage]?.fenstring
      );
      setArrowPercentages(positionData?.arrowsPercentage);
      setLinePercentages(positionData?.linesPercentage);
      setBrush(positionData?.brush);
      setScreen(positionData?.screen);
      setPieces(positionData?.pieces);
      setShowBoard(true);
      setDropPieces(dropPieces);
      setPieceMove(pieceMove);
      setBoard(board);
    }
  }, [currentPage]);
  function onClickHint() {
    setUserAction("hint");
    setCorrect(false);
    setWrong(false);
    setBottomMcqCorrect(false);
    setBottomMcqWrong(false);
    setHint(!hint);
    if (hintTrack !== 1) {
      setHintTrack((prev) => prev + 1);
      setDisplayReveal(true);
    }
  }

  const onClickReveal = () => {
    setUserAction("reveal");
    setReveal(true);
    setProceedInteraction(true);
    revealSound();
    if (type === "position" && revealPositionTrack < 1) {
      setRevealPositionTrack((prev) => prev + 1);
    } else if (
      (type === "board" || type === "pieceMove" || type === "drop") &&
      revealTrack < 1
    ) {
      setRevealTrack((prev) => prev + 1);
    }
  };
  // useEffect(() => {
  //   if (displayReveal) {
  //     progressApi(pointsForCurrentPage);
  //     setDisplayHint(false);
  //     setInteractionHint(false);
  //     console.log("rev", reveal);
  //   }
  // }, [reveal]);

  function onClickPositionHint() {
    setUserAction("hint");
    setShowHint(!showHint);
    setCorrect(false);
    setWrong(false);
    setBottomMcqCorrect(false);
    setBottomMcqWrong(false);
    if (hintPositionTrack !== 1) {
      setHintPositionTrack((prev) => prev + 1);
    }
  }
  // changing the mcq option correct and wrong answer
  const handleBottomMcqCorrect = (value: boolean) => {
    setBottomMcqCorrect(value);
  };

  const handleBottomMcqWrong = (value: boolean) => {
    setBottomMcqWrong(value);
  };
  // useEffect(() => {
  //   // Check bottomMcq conditions
  //   const hasOptions = bottomMcq?.options.length > 0;
  //   const hasHint = bottomMcq?.hint !== "";
  //   //const isEmptyMcq = bottomMcq?.options.length === 0;
  //   //const isEmpty = bottomSectionData?.length === 0;
  //   //const isEmptyText = bottomText && Object.keys(bottomText).length > 0;
  //   const hasText = bottomText && Object.keys(bottomText).length > 0;
  //   setProceed(
  //     !hasOptions || (bottomText && !hasOptions && !hasHint) || hasText
  //     // ||isEmpty
  //   );
  //   // Check bottomMcqCorrect condition
  //   setDisplayHint(!bottomMcqCorrect);

  //   // Check bottomHint conditions
  //   const isBottomHintEmpty =
  //     !bottomHint || Object.keys(bottomHint).length === 0;
  //   setInteractionHint(!isBottomHintEmpty);

  //   // Check bottomText conditions
  //   setProceed(
  //     (proceed) => proceed || (bottomText && Object.keys(bottomText).length > 0)
  //   );
  // }, []);
  useEffect(() => {
    if (
      bottomMcq?.options.length === 0 ||
      (bottomText && Object.keys(bottomText).length > 0)
    ) {
      setProceed(true);
      setDisplayHint(false);
    }
    if (bottomMcq?.options.length > 0) {
      setProceed(false);
    }
    if (
      bottomMcq &&
      Object.keys(bottomMcq).length === 0 &&
      bottomText &&
      Object.keys(bottomText).length === 0
    ) {
      setProceed(false);
    }
  }, [bottomMcq, bottomText, bottomHint]);
  // useEffect(() => {
  //   if (bottomMcq?.options.length > 0 && bottomMcq?.hint !== "") {
  //     setDisplayHint(true);
  //   }
  //   if (bottomMcqCorrect) {
  //     setDisplayHint(false);
  //   }
  //   if (bottomHint && Object.keys(bottomHint).length === 0) {
  //     setInteractionHint(false);
  //   }
  //   if (bottomHint) {
  //     setInteractionHint(true);
  //   }
  //   if (bottomText && Object.keys(bottomText)?.length > 0) {
  //     setProceed(true);
  //   }
  //   if (bottomMcq?.options.length === 0) {
  //     setProceed(true);
  //   } else if (
  //     bottomText &&
  //     Object.keys(bottomText).length === 0
  //   ) {
  //     setProceed(true);
  //   }
  // }, [bottomMcq, bottomMcqCorrect, bottomHint, bottomText]);
  const [getWidth, setGetWidth] = useState<number>(0);
  const [getHeight, setGetHeight] = useState<number>(0);
  function getBalanceData(width: number, height: number) {
    setGetWidth(width - width * 0.1);
    setGetHeight(height);
  }
  function getBalancePositionData(width: number, height: number) {
    setGetWidth(width - width * 0.1);
    setGetHeight(height);
  }
  function getBalanceDropData(width: number, height: number) {
    setGetWidth(width - width * 0.1);
    setGetHeight(height);
  }
  const [redoVisible, setRedoVisible] = useState(false);
  useEffect(() => {
    setShowHint(false);
  }, [correct, wrong, bottomMcqCorrect, bottomMcqWrong]);
  function renderTheBoard() {
    switch (type) {
      case "position":
        return (
          <div className="flex flex-row justify-around">
            <div>
              <PositionBoard
                calculateWidth={getBalancePositionData}
                positions={positions}
                pieces={pieces}
                arrowPercentages={arrowPercentages}
                linePercentages={linePercentages}
                brush={brush}
                screen={screen}
                fenString={fenString}
              />
            </div>
            <div className="flex flex-col mt-3">
              <div
                className="flex justify-center rounded-lg"
                style={{
                  ...getContainerStyle(
                    bottomMcqCorrect,
                    bottomMcqWrong,
                    showHint
                  ),

                  boxShadow:
                    "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(18.5px)",
                  border: "1px solid #583469",
                  height: getHeight * 0.35 + "px",
                  width: getWidth + "px",
                }}
              >
                <div className="justify-center">
                  {!showHint && !bottomMcqCorrect && !bottomMcqWrong && (
                    <Title
                      unitName={unitName}
                      unitNumber={unitNumber}
                      levels={levels}
                      chapterName={chapterName}
                      chapterNumber={chapterNumber}
                    />
                  )}
                  <div className="absolute top-0 right-0">
                    {!showHint && (
                      <img
                        src={getbackroundImage(
                          bottomMcqCorrect,
                          bottomMcqWrong,
                          topOneImage?.image
                        )}
                        alt="logo"
                        style={{ height: getHeight * 0.3 + "px" }}
                      />
                    )}
                  </div>
                </div>

                <div className="text-white px-2">
                  <div
                    className="p-5 md:text-xl 2xl:text-3xl mt-3"
                    style={{ fontFamily: "Sans" }}
                  >
                    {!showHint &&
                      topSectionData &&
                      !bottomMcqCorrect &&
                      !bottomMcqWrong && (
                        <div className="absolute top-0 left-0 m-2">
                          {topText && getTopText(topText)}
                          {topOneImage && getTopOneImage(topOneImage)}
                        </div>
                      )}
                    <HintCorrectWrong
                      correct={bottomMcqCorrect}
                      wrong={bottomMcqWrong}
                      hint={showHint}
                      bottomHint={bottomMcq?.hint}
                      bottomWrong={bottomMcq?.wrong}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  boxShadow:
                    "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(18.5px)",
                  height: getHeight * 0.62 + "px",
                  width: getWidth + "px",
                  fontFamily: "Sans",
                }}
                className="my-5 rounded-md border-2 border-[#583469]"
              >
                {bottomSectionData && (
                  <>
                    {bottomText && getBottomText(bottomText)}
                    <BottomMcq
                      setProceed={setProceed}
                      key={currentPage}
                      bottomMcq={bottomMcq}
                      initialCorrect={initialCorrect}
                      initialWrong={initialWrong}
                      onCorrect={handleBottomMcqCorrect}
                      onWrong={handleBottomMcqWrong}
                      setHint={setHint}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        );
      case "pieceMove":
        return (
          <PieceMove
            onClickReveal={onClickReveal}
            calculateWidth={getBalanceData}
            fenString={fenString}
            pieceMove={pieceMove}
            setCorrect={setCorrect}
            setWrong={setWrong}
            showResult={showResult}
            setProceedInteraction={setProceedInteraction}
            setHint={setHint}
            reveal={reveal}
            setReveal={setReveal}
            pageId={selectPageId}
          />
        );
      case "drop":
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="flex flex-row justify-between">
              <div>
                <DropPieces
                  calculateWidth={getBalanceDropData}
                  dropPieces={dropPieces}
                  setProceedInteraction={setProceedInteraction}
                  setCorrect={setCorrect}
                  setWrong={setWrong}
                  showResult={showResult}
                  setHint={setHint}
                  proceedTrigger={proceedTrigger}
                  reveal={reveal}
                />
              </div>
              <div className="flex flex-col mt-3">
                <div
                  className="flex justify-center rounded-lg"
                  style={{
                    ...getContainerStyle(correct, wrong, hint),
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(18.5px)",
                    border: "1px solid #583469",
                    height: getHeight * 0.35 + "px",
                    width: getWidth + "px",
                  }}
                >
                  <div className="justify-center">
                    {!hint && !correct && !wrong && (
                      <Title
                        unitName={unitName}
                        unitNumber={unitNumber}
                        levels={levels}
                        chapterName={chapterName}
                        chapterNumber={chapterNumber}
                      />
                    )}
                    <div className="absolute top-0 right-0">
                      {!hint && (
                        <img
                          src={getbackroundImage(
                            correct,
                            wrong,
                            topOneImage?.image
                          )}
                          height={getHeight * 0.3 + "px"}
                          alt="logo"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    {!hint && !correct && !wrong && topSectionData && (
                      <div className="text-white p-5 md:text-xl 2xl:text-3xl mt-5 absolute top-0 left-0 m-2">
                        {topOneImage && getTopOneImage(topOneImage)}
                      </div>
                    )}
                    <HintCorrectWrong
                      correct={correct}
                      wrong={wrong}
                      hint={hint}
                      bottomHint={bottomInteractionHint}
                      bottomWrong={bottomInteractionWrong}
                    />
                  </div>
                </div>
                <div
                  style={{
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(18.5px)",
                    height: getHeight * 0.62 + "px",
                    width: getWidth + "px",
                    fontFamily: "Sans",
                  }}
                  className="my-5 lg:p-2 rounded-md border-2 border-[#583469]"
                >
                  {bottomOneImage && getBottomOneImage(bottomOneImage)}
                  {bottomTwoImage && getBottomTwoImages(bottomTwoImage)}
                  {bottomVideo && getBottomVideo(bottomVideo)}
                  <PiecesRender dropPieces={dropPieces} />
                </div>
              </div>
            </div>
          </DndProvider>
        );
      case "board":
        return (
          <BoardMove
            reveal={reveal}
            setReveal={setReveal}
            onClickReveal={onClickReveal}
            setRedoVisible={setRedoVisible}
            calculateWidth={getBalanceData}
            setHighlightSquares={setHighlightSquares}
            highlightSquares={highlightSquares}
            fenString={fenString}
            board={board}
            showResult={showResult}
            setCorrect={setCorrect}
            setWrong={setWrong}
            redo={redo}
            proceedTrigger={proceedTrigger}
            setHint={setHint}
            setShowResult={setShowResult}
          />
        );
      default:
        return null;
    }
  }
  useEffect(() => {
    if (!pages) return;
    console.log("current pages", currentPage);
    if (currentPage >= 0) {
      getTopBottomData(pages[currentPage]?.id);
    }
  }, [currentPage]);
  const onClickHamburger = () => {
    setShowHamburger(!showHamburger);
  };
  const onClickHome = () => {
    router.push("/auth");
  };

  function InActivateScoreBoard() {
    setCompleted(false);
  }

  return (
    <>
      <div>
        <div className="flex flex-row justify-around">
          <div className="flex flex-row">
            <div>{renderTheBoard()}</div>
            {(type === "pieceMove" || type === "board") && (
              <div className="flex flex-col mt-3">
                <div
                  className="flex justify-center rounded-lg"
                  style={{
                    ...getContainerStyle(correct, wrong, hint),
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(18.5px)",
                    border: "1px solid #583469",
                    height: getHeight * 0.35 + "px",
                    width: getWidth + "px",
                  }}
                >
                  <div className="justify-center">
                    {!hint && !correct && !wrong && (
                      <Title
                        unitName={unitName}
                        unitNumber={unitNumber}
                        levels={levels}
                        chapterName={chapterName}
                        chapterNumber={chapterNumber}
                      />
                    )}
                    <div className="absolute top-0 right-0">
                      {!hint && (
                        <img
                          src={getbackroundImage(
                            correct,
                            wrong,
                            topOneImage?.image
                          )}
                          height={getHeight * 0.3 + "px"}
                          alt="logo"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    {!hint && !correct && !wrong && topSectionData && (
                      <div className="text-white p-5 md:text-xl 2xl:text-3xl mt-5 absolute top-0 left-0 m-2">
                        {topOneImage && getTopOneImage(topOneImage)}
                      </div>
                    )}
                    <HintCorrectWrong
                      correct={correct}
                      wrong={wrong}
                      hint={hint}
                      bottomHint={bottomInteractionHint}
                      bottomWrong={bottomInteractionWrong}
                    />
                  </div>
                </div>
                {bottomSectionData && (
                  <div
                    style={{
                      boxShadow:
                        "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                      backdropFilter: "blur(18.5px)",
                      height: getHeight * 0.63 + "px",
                      width: getWidth + "px",
                      fontFamily: "Sans",
                    }}
                    className="my-5 rounded-md border-2 border-[#583469]"
                  >
                    {bottomOneImage && getBottomOneImage(bottomOneImage)}
                    {bottomTwoImage && getBottomTwoImages(bottomTwoImage)}
                    {bottomVideo && getBottomVideo(bottomVideo)}
                  </div>
                )}
              </div>
            )}
          </div>
          <Hamburger
            pages={pages}
            currentPage={currentPage}
            showHamburger={showHamburger}
            onClickHamburger={onClickHamburger}
            onClickHome={onClickHome}
          />
          {completed && (
            <ScoreBoard
              userPoints={userPoints}
              totalPoints={totalPoints}
              InActivateScoreBoard={InActivateScoreBoard}
            />
          )}
        </div>
      </div>
      <BottomButton
        onClickNextButton={onClickNext}
        onClickBackButton={onClickBack}
        onClickHintButton={onClickHint}
        onClickPositionHintButton={onClickPositionHint}
        onClickReadyButton={onClickReady}
        onClickOkayButton={onClickOkay}
        onClickRedoButton={onClickRedo}
        onClickRevealButton={onClickReveal}
        highlightSquares={highlightSquares}
        reveal={reveal}
        ready={ready}
        hint={hint}
        type={type}
        redo={redo}
        redoVisible={redoVisible}
        proceed={proceed}
        proceedInteraction={proceedInteraction}
        bottomMcq={bottomMcq}
        displayhint={displayhint}
        interactionHint={interactionHint}
        toggleReady={toggleReady}
        pages={pages}
        currentPage={currentPage}
        displayReveal={displayReveal}
      />
    </>
  );
};

export default Pageboard;
