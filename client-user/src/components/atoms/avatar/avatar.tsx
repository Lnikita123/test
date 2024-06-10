import LogoText from "../logoText/LogoText";
import { useRouter } from "next/router";
import { API_BASE_URL } from "@/config";
import useStudent from "@/store/useStudent";
import { memo } from "react";

const Avatar = () => {
  const router = useRouter();
  const avatar = useStudent((s) => s.avatar);
  const setAvatar = useStudent((s) => s.setAvatar);
  let studentId: any = null;
  if (typeof window !== "undefined" && studentId !== undefined) {
    studentId = JSON.parse(localStorage?.getItem("studentId") || "null");
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/v1/student/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: avatar }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update password");
      }
      router.push(`/auth`);
      // If the update is successful, you can navigate to the next page here
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="flex justify-around items-start">
        <div className="flex flex-col mx-5">
          <div className="flex p-2 my-4">
            <LogoText />
          </div>
          <div>
            <h6 className="px-2 font-bold text-3xl my-2">
              Choose your favourite avatar
            </h6>
          </div>
          <div className="p-2 flex flex-col">
            <div className="flex flex-wrap">
              <img
                src="/catAvatar.svg"
                alt="logo"
                onClick={() => setAvatar("/catAvatar.svg")}
                className={`${
                  avatar === "/catAvatar.svg" ? "bg-amber-500" : ""
                } cursor-pointer md:w-[7rem] md:h-[7rem] 2xl:w-[10rem] 2xl:h-[10rem] m-5 hover:bg-amber-500 hover:scale-110 hover:transition hover:duration 300`}
              />
              <img
                src="/squirrelAvatar.svg"
                alt="logo"
                onClick={() => setAvatar("/squirrelAvatar.svg")}
                className={`${
                  avatar === "/squirrelAvatar.svg" ? "bg-amber-500" : ""
                } cursor-pointer md:w-[7rem] md:h-[7rem] 2xl:w-[10rem] 2xl:h-[10rem] m-5 hover:bg-amber-500`}
              />
              <img
                src="/parrotAvatar.svg"
                alt="logo"
                onClick={() => setAvatar("/parrotAvatar.svg")}
                className={`${
                  avatar === "/parrotAvatar.svg" ? "bg-amber-500" : ""
                } cursor-pointer md:w-[7rem] md:h-[7rem] 2xl:w-[10rem] 2xl:h-[10rem] m-5 hover:bg-amber-500`}
              />
              <img
                src="/monkeyAvatar.svg"
                alt="logo"
                onClick={() => setAvatar("/monkeyAvatar.svg")}
                className={`${
                  avatar === "/monkeyAvatar.svg" ? "bg-amber-500" : ""
                } cursor-pointer md:w-[7rem] md:h-[7rem] 2xl:w-[10rem] 2xl:h-[10rem] m-5 hover:bg-amber-500`}
              />
              <img
                src="/racoonAvatar.svg"
                alt="logo"
                onClick={() => setAvatar("/racoonAvatar.svg")}
                className={`${
                  avatar === "/racoonAvatar.svg" ? "bg-amber-500" : ""
                } cursor-pointer md:w-[7rem] md:h-[7rem] 2xl:w-[10rem] 2xl:h-[10rem] m-5 hover:bg-amber-500`}
              />
            </div>
            <div>
              <button
                className="mx-2 bg-[#283272] text-white rounded-full py-2 px-4 font-bold"
                onClick={(e) => handleSubmit(e)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
        <div className="h-screen md:mx-2">
          <img
            src="/logoImage2.svg"
            alt="logo"
            className="h-full w-full 2xl:w-11/12"
          />
        </div>
      </div>
    </>
  );
};

export default memo(Avatar);
