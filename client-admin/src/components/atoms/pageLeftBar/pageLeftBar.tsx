import React from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { usePageStore } from "@/store/usePageStore";
import { useRouter } from "next/router";
import Image from "next/image";

const PageLeftBar = () => {
  const setSelectedOption = useBoardStore((s) => s.setSelectedOption);
  const drop = usePageStore((s) => s.drop);
  const board = usePageStore((s) => s.board);
  const piece = usePageStore((s) => s.piece);
  const position = usePageStore((s) => s.position);
  const metaTags = usePageStore((S) => S.metaTags);
  const setBoard = usePageStore((s) => s.setBoard);
  const setPiece = usePageStore((s) => s.setPiece);
  const setDrop = usePageStore((s) => s.setDrop);
  const setHint = usePageStore((s) => s.setHint);
  const setMetaTags = usePageStore((s) => s.setMetaTags);
  const setPosition = usePageStore((s) => s.setPosition);
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

  const isOpen = usePageStore((s) => s.isOpen);
  const setIsOpen = usePageStore((s) => s.setIsOpen);
  const onConfirm = usePageStore((s) => s.onConfirm);
  const setOnConfirm = usePageStore((s) => s.setOnConfirm);
  const router = useRouter();
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  const onClickConfirm = () => {
    setOnConfirm(true);
  };
  // calculate whether an option from "Add option box" is selected
  let toggleOptionColor = position;

  // calculate whether an option from "Add Interactions" is selected
  let toggleInteractiveColor = board || piece || drop;

  const handleOptionChange = (event: any, newOption: any) => {
    onClickConfirm();
    setSelectedOption(newOption);
    switch (newOption) {
      case "position":
        setPosition(true);
        setHint(false);
        setDrop(false);
        setPiece(false);
        setBoard(false);
        setMetaTags(false);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/position`
        );
        break;
      case "board":
        setPosition(false);
        setBoard(true);
        setPiece(false);
        setDrop(false);
        setHint(false);
        setMetaTags(false);
        // if (onConfirm) {
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/board`
        );
        setOnConfirm(false);
        // }
        break;
      case "piece":
        setPosition(false);
        setPiece(true);
        setBoard(false);
        setDrop(false);
        setHint(false);
        setMetaTags(false);
        // if (onConfirm) {
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/pieces`
        );
        setOnConfirm(false);
        // }
        break;
      case "drop":
        setPosition(false);
        setDrop(true);
        setPiece(false);
        setBoard(false);
        setHint(false);
        setMetaTags(false);
        // if (onConfirm) {
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/drop`
        );
        setOnConfirm(false);
        // }
        break;
      case "hint":
        setPosition(false);
        setHint(true);
        setDrop(false);
        setPiece(false);
        setBoard(false);
        setMetaTags(false);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/hint`
        );
        break;
      case "meta":
        setPosition(false);
        setHint(false);
        setDrop(false);
        setPiece(false);
        setBoard(false);
        setMetaTags(true);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/meta`
        );
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div
        className="md:w-48 md:h-10"
        style={{
          border: 1,
          paddingTop: "1%",
          paddingBottom: "1%",
          paddingLeft: "1%",
          paddingRight: "1%",
          marginTop: "1%",
          marginLeft: "1%",
          marginBottom: "15%",
        }}
      >
        <div className="flex flex-col justify-center">
          <div>
            <div
              className="text-[#FFFFFF] font-bold"
              style={{
                display: "flex",
                flexDirection: "column",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
              }}
            >
              <center
                className="md:text-sm"
                style={{
                  backgroundColor:
                    position || metaTags || toggleOptionColor
                      ? "#03A9F4"
                      : "#A8A8A8",
                  color: "#ffffff",
                  padding: "8%",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              >
                Add option box
              </center>
              <div className="bg-white">
                <div
                  className="md:text-sm"
                  onClick={(e) => handleOptionChange(e, "position")}
                  style={{
                    color: position ? "#ffffff" : "#000000",
                    padding: "15px",
                    marginTop: "5%",
                    marginBottom: "5%",
                    marginLeft: "15%",
                    marginRight: "15%",
                    display: "flex",
                    gap: "5px",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #BDDFF6",
                    backgroundColor: position ? "#03A9F4" : "#ffffff",
                    borderRadius: "10px",
                  }}
                >
                  <Image
                    src="/position.svg"
                    alt="logo"
                    width={30}
                    height={40}
                  />
                  Position
                </div>
                <div
                  className="md:text-sm"
                  onClick={(e) => handleOptionChange(e, "meta")}
                  style={{
                    color: metaTags ? "#ffffff" : "#000000",
                    padding: "6%",
                    marginTop: "10%",
                    marginBottom: "15%",
                    marginLeft: "15%",
                    marginRight: "15%",
                    display: "flex",
                    gap: "5px",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #BDDFF6",
                    borderRadius: "10px",
                    backgroundColor: metaTags ? "#03A9F4" : "#ffffff",
                  }}
                >
                  <Image src="/metaTag.svg" alt="logo" width={30} height={40} />
                  Meta tags
                </div>
              </div>
            </div>
          </div>
          <br />
          <div>
            <div className="text-[#FFFFFF] font-bold">
              <center
                className="md:text-sm"
                style={{
                  backgroundColor:
                    piece || drop || board || toggleInteractiveColor
                      ? "#03A9F4"
                      : "#A8A8A8",
                  color: "#ffffff",
                  padding: "8%",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              >
                Add Interactions
              </center>
            </div>
            <div
              className="bg-white"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                paddingBottom: "15%",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
              }}
            >
              <button
                onClick={(e) => handleOptionChange(e, "piece")}
                className="md:text-sm"
                style={{
                  color: piece ? "#ffffff" : "#000000",
                  padding: "12%",
                  margin: "3%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #BDDFF6",
                  backgroundColor: piece ? "#03A9F4" : "#ffffff",
                  borderRadius: "10px",
                }}
              >
                <Image src="/piece.svg" alt="logo" width={30} height={40} />
                Piece
              </button>
              <button
                className="md:text-sm"
                onClick={(e) => handleOptionChange(e, "board")}
                style={{
                  color: board ? "#ffffff" : "#000000",
                  padding: "12%",
                  margin: "3%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #BDDFF6",
                  backgroundColor: board ? "#03A9F4" : "#ffffff",
                  borderRadius: "10px",
                }}
              >
                <Image src="/Board.svg" alt="logo" width={30} height={40} />
                Board
              </button>
              <button
                className="md:text-sm"
                onClick={(e) => handleOptionChange(e, "drop")}
                style={{
                  color: drop ? "#ffffff" : "#000000",
                  padding: "12%",
                  margin: "2%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #BDDFF6",
                  backgroundColor: drop ? "#03A9F4" : "#ffffff",
                  borderRadius: "10px",
                }}
              >
                <Image src="/drop.svg" alt="logo" width={30} height={40} />
                Drop
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLeftBar;
