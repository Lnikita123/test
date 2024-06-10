import { useBottomStore } from "@/store/useBottomStore";
import { useRouter } from "next/router";
import Image from "next/image";
import useTopBottomStyles from "@/store/useTopBottomStyles";
const BottomLeftBar = () => {
  const setSelectedOption = useBottomStore((s) => s.setSelectedOption);
  const setSelectedImage = useTopBottomStyles((s) => s.setSelectedImage);
  const setSelectedImage2 = useTopBottomStyles((s) => s.setSelectedImage2);
  const text = useBottomStore((S) => S.text);
  const image = useBottomStore((s) => s.image);
  const twoImage = useBottomStore((s) => s.twoImage);
  const video = useBottomStore((s) => s.video);
  const mcq = useBottomStore((s) => s.mcq);
  const hint = useBottomStore((s) => s.hint);
  const setText = useBottomStore((S) => S.setText);
  const setImage = useBottomStore((S) => S.setImage);
  const setTwoImage = useBottomStore((S) => S.setTwoImage);
  const setHint = useBottomStore((S) => S.setHint);
  const setVideo = useBottomStore((S) => S.setVideo);
  const setMcq = useBottomStore((S) => S.setMcq);
  const router = useRouter();
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
  const handleOptionChange = (event: any, newOption: any) => {
    setSelectedOption(newOption);
    setSelectedImage("");
    setSelectedImage2("");
    switch (newOption) {
      case "text":
        setText(true);
        setImage(false);
        setTwoImage(false);
        setHint(false);
        setVideo(false);
        setMcq(false);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/bottom/text`
        );
        break;
      case "image":
        setImage(true);
        setText(false);
        setTwoImage(false);
        setHint(false);
        setVideo(false);
        setMcq(false);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/bottom/oneImage`
        );
        break;
      case "twoImage":
        setTwoImage(true);
        setImage(false);
        setText(false);
        setHint(false);
        setVideo(false);
        setMcq(false);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/bottom/twoImage`
        );
        break;
      case "hint":
        setHint(true);
        setTwoImage(false);
        setImage(false);
        setText(false);
        setVideo(false);
        setMcq(false);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/bottom/hint`
        );
        break;
      case "video":
        setHint(false);
        setTwoImage(false);
        setImage(false);
        setText(false);
        setVideo(true);
        setMcq(false);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/bottom/video`
        );
        break;
      case "mcq":
        setHint(false);
        setTwoImage(false);
        setImage(false);
        setText(false);
        setVideo(false);
        setMcq(true);
        router.push(
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/bottom/mcq`
        );
        break;
      default:
        break;
    }
  };
  return (
    <div
      className="md:w-[20rem] 2xl:[40rem]"
      style={{
        maxHeight: "120vh",
        border: 1,
        paddingTop: "1%",
        paddingBottom: "1%",
        paddingLeft: "1%",
        paddingRight: "1%",
        marginTop: "1%",
        marginLeft: "1%",
        backgroundColor: "#C2E7FF",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col justify-center ">
        <div>
          <div className="text-[#FFFFFF] font-bold ">
            <center
              style={{
                backgroundColor:
                  text || image || twoImage || mcq || video || hint
                    ? "#03A9F4"
                    : "#A8A8A8",
                color: "#ffffff",
                padding: "5%",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
            >
              Add option box
            </center>
          </div>
          <center className="bg-white font-semibold">Position</center>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
              background: "#ffffff",
              paddingTop: "10px",
              paddingBottom: "20px",
            }}
          >
            <button
              className="rounded-xl"
              onClick={(e) => handleOptionChange(e, "text")}
              style={{
                color: text ? "#ffffff" : "#000000",
                padding: "10%",
                margin: "3%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #BDDFF6",
                borderRadius: "15px !important",
                backgroundColor: text ? "#03A9F4" : "",
              }}
            >
              <Image src="/video.svg" alt="logo" width={30} height={40} />
              Text
            </button>
            <button
              className="rounded-xl"
              onClick={(e) => handleOptionChange(e, "mcq")}
              style={{
                color: mcq ? "#ffffff" : "#000000",
                padding: "10%",
                margin: "3%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #BDDFF6",
                borderRadius: "15px !important",
                backgroundColor: mcq ? "#03A9F4" : "",
              }}
            >
              <Image src="/mcq.svg" alt="logo" width={30} height={40} />
              Mcq
            </button>
            <div className="mx-1 w-full border-t border-sky-500">
              <center className="bg-white font-semibold my-1">
                Interaction
              </center>
            </div>
            <button
              className="rounded-xl"
              onClick={(e) => handleOptionChange(e, "image")}
              style={{
                color: image ? "#ffffff" : "#000000",
                padding: "10%",
                margin: "3%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #BDDFF6",
                borderRadius: "15px !important",
                backgroundColor: image ? "#03A9F4" : "",
              }}
            >
              <Image src="/image.svg" alt="logo" width={30} height={40} />
              image
            </button>
            <button
              className="rounded-xl"
              onClick={(e) => handleOptionChange(e, "twoImage")}
              style={{
                color: twoImage ? "#ffffff" : "#000000",
                padding: "10%",
                margin: "3%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #BDDFF6",
                borderRadius: "15px !important",
                backgroundColor: twoImage ? "#03A9F4" : "",
              }}
            >
              <Image src="/twoImage.svg" alt="logo" width={30} height={40} />
              2image
            </button>
            <button
              className="rounded-xl"
              onClick={(e) => handleOptionChange(e, "video")}
              style={{
                color: video ? "#ffffff" : "#000000",
                padding: "10%",
                margin: "3%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #BDDFF6",
                borderRadius: "15px !important",
                backgroundColor: video ? "#03A9F4" : "",
              }}
            >
              <Image src="/video.svg" alt="logo" width={30} height={40} />
              video
            </button>
            <button
              className="rounded-xl"
              onClick={(e) => handleOptionChange(e, "hint")}
              style={{
                color: hint ? "#ffffff" : "#000000",
                padding: "10%",
                margin: "3%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #BDDFF6",
                borderRadius: "15px !important",
                backgroundColor: hint ? "#03A9F4" : "",
              }}
            >
              <Image src="/topHint.svg" alt="logo" width={30} height={40} />
              Hint &<br />
              Wrong
            </button>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export default BottomLeftBar;
