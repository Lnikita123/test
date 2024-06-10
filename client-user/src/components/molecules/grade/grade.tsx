import LogoText from "@/components/atoms/logoText/LogoText";
import { API_BASE_URL } from "@/config";
import usePaginationStore from "@/store/usePaginationStore";
import { useRouter } from "next/router";

import React, { memo, useState } from "react";
const Grade = () => {
  const router = useRouter();
  const email = router.query.email as string;
  const currentPage = usePaginationStore((s) => s.currentPage);
  const setCurrentPage = usePaginationStore((s) => s.setCurrentPage);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  function handleNameChange(e: any) {
    setName(e.target.value);
  }
  function handleGradeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setGrade(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/studentUpdate?email=${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, grade }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update password");
      }
      //router.push(`/auth/avatar?email=${encodeURIComponent(email)}`);
      // If the update is successful, you can navigate to the next page here
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-around p-2">
        <div className="flex flex-col items-start md:w-1/2 m-3">
          <LogoText />
          <div className="items-start justify-center md:mt-10">
            <h1 className="font-bold text-2xl mt-[2rem]">
              <span>Make it more personalised.....</span>
            </h1>

            <p className="text-sm mt-2 font-bold">
              <span>Loreum ipsum is simply dummy text of the printing</span>
            </p>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter Name"
              className="p-3 border bg-[#E0E4FC] border-[#757575] rounded-full mt-5 md:w-full 2xl:w-[30rem] md:mt-10"
            />

            <div className="flex">
              <select
                value={grade}
                onChange={handleGradeChange}
                name="levels"
                className="p-3 border hover:border-b-2 hover:border-sky-500 bg-[#E0E4FC] border-[#757575] rounded-full mt-5 md:w-full 2xl:w-[30rem] md:mt-10"
              >
                <option>Enter Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>
          <button
            className="bg-[#283272] text-white rounded-full py-2 px-4 font-bold my-10"
            onClick={() => {
              const nextPage = currentPage + 1;
              setCurrentPage(nextPage);
            }}
          >
            Continue
          </button>
        </div>
        <div className="h-screen ml-2">
          <img
            src="/logoImage1.svg"
            alt="logo"
            className="h-full w-5/6 2xl:w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default memo(Grade);
