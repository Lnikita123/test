import { getStudentApi } from "@/pages/api/pageApi";
import useStudent from "@/store/useStudent";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import React, { memo, useEffect } from "react";
import Logo from "../logo/Logo";

const NavigationBar = () => {
  const router = useRouter();
  const avatar = useStudent((s) => s.avatar);
  const setAvatar = useStudent((s) => s.setAvatar);
  let studentId: any = null;
  if (typeof window !== "undefined" && studentId !== undefined) {
    studentId = JSON.parse(localStorage?.getItem("studentId") || "null");
  }
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getStudentApi(studentId);
        console.log("Student", response?.Progress);
        if (response && response.avatar) {
          setAvatar(response.avatar);
        }
      } catch (error) {
        console.error("Error getting student data:", error);
      }
    };
    fetchStudentData();
  }, [studentId]);

  function redirectProgressCard() {
    router.push("/auth/progress");
  }
  function redirectDashboard() {
    router.push("/auth");
  }
  function redirectAvatarPage() {
    router.push("/auth/avatar");
  }
  return (
    <div className="flex justify-between items-center">
      <div onClick={redirectDashboard}>
        <Logo />
      </div>
      <div className="flex items-center space-x-4 mt-2 mr-4">
        <button
          onClick={redirectProgressCard}
          className="bg-[#E0E4FC] text-[#283272] rounded-full py-2 px-4 font-bold"
        >
          My Progress
        </button>
        <div onClick={redirectAvatarPage}>
          <Avatar
            alt={avatar}
            src={avatar}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: "#E0E4FC",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(NavigationBar);
