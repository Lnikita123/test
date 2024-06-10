import React, { useState } from "react";
import LogoText from "../logoText/LogoText";
import usePaginationStore from "@/store/usePaginationStore";
import { useRouter } from "next/router";
import { API_BASE_URL } from "@/config";

const Password = () => {
  const router = useRouter();
  const email = router.query.email as string;
  const currentPage = usePaginationStore((s) => s.currentPage);
  const setCurrentPage = usePaginationStore((s) => s.setCurrentPage);
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleReenteredPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReenteredPassword(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== reenteredPassword) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/studentUpdate?email=${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update password");
      }
      router.push(`/auth/grade?email=${encodeURIComponent(email)}`);
      // If the update is successful, you can navigate to the next page here
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row 2xl:justify-around md:justify-between p-2">
        <div className="flex flex-col items-start md:w-1/2 m-5">
          <LogoText />
          <div className="items-start justify-center  md:mt-10">
            <h6 className="font-bold text-2xl mt-5">
              <span>Let's make your account secure!</span>
            </h6>
            <p className="text-sm mt-2 font-bold">
              <span>Loreum ipsum is simply dummy text of the printing</span>
            </p>
            <input
              type="text"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter Password"
              className="p-3 border bg-[#E0E4FC] border-[#757575] rounded-full mt-5 md:w-full 2xl:w-[30rem] md:mt-10"
            />
            <input
              type="text"
              value={reenteredPassword}
              onChange={handleReenteredPasswordChange}
              placeholder="Re-enter Password"
              className="p-3 border  bg-[#E0E4FC] border-[#757575] rounded-full mt-5 md:mt-10 md:w-full 2xl:w-[30rem]"
            />
            {passwordError && (
              <p className="text-red-500">Passwords do not match</p>
            )}
          </div>
          <button
            type="submit"
            className="m-5 bg-[#283272] text-white rounded-full py-2 px-4 font-bold my-10"
            onClick={() => {
              const nextPage = currentPage + 1;
              setCurrentPage(nextPage);
            }}
          >
            Continue
          </button>
        </div>
        <div className="h-screen md:mx-2">
          <img
            src="/logoImage.svg"
            alt="logo"
            className="h-full w-full 2xl:w-11/12"
          />
        </div>
      </div>
    </form>
  );
};

export default Password;
