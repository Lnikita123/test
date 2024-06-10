import { useTopStore } from "@/store/useTopStore";
import { useRouter } from "next/router";
import Image from "next/image";
import useTopBottomStyles from "@/store/useTopBottomStyles";

const TopLeftBar = () => {
  const setSelectedOption = useTopStore((s) => s.setSelectedOption);
  const setSelectedImage = useTopBottomStyles((s) => s.setSelectedImage);
  const setSelectedImage2 = useTopBottomStyles((s) => s.setSelectedImage2);
  const text = useTopStore((S) => S.text);
  const image = useTopStore((s) => s.image);
  const twoImage = useTopStore((s) => s.twoImage);
  const video = useTopStore((s) => s.video);
  const mcq = useTopStore((s) => s.mcq);
  const hint = useTopStore((s) => s.hint);
  const setText = useTopStore((S) => S.setText);
  const setImage = useTopStore((S) => S.setImage);
  const setTwoImage = useTopStore((S) => S.setTwoImage);
  const setHint = useTopStore((S) => S.setHint);
  const setVideo = useTopStore((S) => S.setVideo);
  const setMcq = useTopStore((S) => S.setMcq);
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
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/top/text`
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
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/top/oneImage`
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
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/top/twoImage`
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
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/top/video`
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
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/top/mcq`
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
          `/auth/units/${selectedId}/${selectChapterId}/${selectPageId}/top/hint`
        );
        break;
      default:
        break;
    }
  };
  return (
    <div
      style={{
        maxHeight: "80vh",
        maxWidth: "18vw",
        border: 1,
        paddingTop: "1%",
        paddingBottom: "1%",
        paddingLeft: "1%",
        paddingRight: "1%",
        marginTop: "2%",
        marginLeft: "1%",
        backgroundColor: "#C2E7FF",
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
            {/* <button
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
              Hint
            </button> */}
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export default TopLeftBar;
