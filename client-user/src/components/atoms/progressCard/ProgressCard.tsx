import React, { useEffect, useState } from "react";
import NavigationBar from "../navigationBar/NavigationBar";
import useStudent from "@/store/useStudent";
import { Avatar } from "@mui/material";
import LogoutButton from "../logout";
import Rank from "../rank/Rank";
import Accuracy from "../accuracy/Accuracy";
import EffectiveLearning from "../effectiveLearning/EffectiveLearning";
import {
  getChapterApi,
  getChapterPoints,
  getStudentApi,
  getUnitsWithUnitId,
} from "@/pages/api/pageApi";
import { IProgressUnitStore, IStudentData } from "@/store/useInterfaceStore";
import UnitProgressCard from "./unitProgressCard";
import Effort from "../effort/Effort";
import {
  calculateAccuracy,
  calculateEffectiveLearning,
  calculateUserUnitPoints,
} from "@/helpers/calculationsProgress";

const ProgressCard = () => {
  const avatar = useStudent((s) => s.avatar);
  const name = useStudent((s) => s.name);
  const email = useStudent((s) => s.email);
  const [rank, setRank] = useState("");
  const [Progress, setProgress] = useState<IStudentData>({});
  const [percentage, setPercentage] = useState<number>(0);
  const [overAllProgress, setOverAllProgress] = useState<string>("");
  const [data, setData] = useState<IProgressUnitStore[]>([]);
  let studentId: any = null;
  if (typeof window !== "undefined" && studentId !== undefined) {
    studentId = JSON.parse(localStorage?.getItem("studentId") || "null");
  }
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getStudentApi(studentId);
        console.log("Student", response?.Progress);
        setProgress(response?.Progress);
        await getProgressDetails(response?.Progress);
      } catch (error) {
        console.error("Error getting student data:", error);
      }
    };
    fetchStudentData();
  }, [studentId]);

  async function getProgressDetails(Progress: IStudentData) {
    try {
      let studentPoints = 0; // Reset studentPoints for each chapter
      let totalPoints = 0;
      for (const unitId in Progress) {
        const unit = Progress[unitId];
        for (const chapterId in unit) {
          const chapter = unit[chapterId];

          for (const pageId in chapter) {
            studentPoints += chapter[pageId];
            console.log("studentPoints: ", studentPoints);
          }

          // Fetch total points for the chapter
          const data = await getChapterPoints(chapterId);
          totalPoints += data?.points || 0; // Accumulate totalPoints for each chapter
        }
      }
      // Calculate overall progress
      setPercentage((studentPoints / totalPoints) * 100);
      console.log("per", (studentPoints / totalPoints) * 100);
      const overallProgress = `${studentPoints}/${totalPoints}`;
      setOverAllProgress(overallProgress);
      console.log(overallProgress);
    } catch (error) {
      console.log("err", error);
    }
  }
  useEffect(() => {
    const calculateTheUnitData = async () => {
      let unitIdsArr = Object.keys(Progress);
      let chapArr = [];
      console.log("unitIdsArr", unitIdsArr);
      const newData: IProgressUnitStore[] = [];
      let beginnerCount = 0;
      let intermediateCount = 0;
      let advancedCount = 0;
      for (let i = 0; i < unitIdsArr.length; i++) {
        console.log("prog: ", unitIdsArr[i]);
        const unitData = await getUnitsWithUnitId(unitIdsArr[i]);
        console.log("unitData", unitData);
        const unitId = unitData.id;
        const rankData = unitData?.levels;

        if (rankData === "beginner") {
          beginnerCount++;
        } else if (rankData === "intermediate") {
          intermediateCount++;
        } else if (rankData === "advanced") {
          advancedCount++;
        }
        const chaptersWithUnitId = await getChapterApi(unitId);
        chapArr = chaptersWithUnitId;
        const totalPoints: any = await calculateAccuracy(chapArr);
        const userUnitPoints = await calculateUserUnitPoints(Progress);
        console.log("userUnitPoints", userUnitPoints, typeof userUnitPoints);
        let perOfUnit = (userUnitPoints[unitId] / totalPoints) * 100;
        console.log("perOfUnit", perOfUnit, typeof perOfUnit);
        const unitEffectiveLearning = calculateEffectiveLearning(perOfUnit);
        const updatedUnitData = {
          ...unitData,
          accuracy: perOfUnit,
          effectiveLearning: unitEffectiveLearning,
        };
        console.log("updatedUnitData", updatedUnitData);
        newData.push(updatedUnitData);
      }
      console.log("Beginner Count:", beginnerCount);
      console.log("Intermediate Count:", intermediateCount);
      console.log("Advanced Count:", advancedCount);
      if (advancedCount > 0) {
        setRank("Advanced" + "-" + advancedCount);
      } else if (intermediateCount > 0 && advancedCount === 0) {
        setRank("Intermediate" + "-" + intermediateCount);
      } else if (
        beginnerCount > 0 &&
        advancedCount === 0 &&
        intermediateCount === 0
      ) {
        setRank("Beginner" + "-" + beginnerCount);
      }
      setData(newData);
    };
    calculateTheUnitData();
  }, [Progress]);
  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage: "url('/backgroundImage.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "1%",
      }}
    >
      <NavigationBar />
      <div className="flex flex-row ">
        <div className="xl:h-5/6 md:mt-5 2xl:ml-2 2xl:mt-[1rem] w-1/2 2xl:h-1/2">
          <div
            className=" bg-[#7E93DC80] p-4 xl:h-5/6 flex flex-col justify-around rounded-xl border border-1 border-gray-500"
            style={{
              //   backgroundImage: "url('/bgImage.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "80vh",
            }}
          >
            <div className="flex flex-row">
              <div>
                <Avatar
                  alt={avatar}
                  src={avatar}
                  sx={{ width: 150, height: 150, backgroundColor: "#E0E4FC" }}
                />
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold text-2xl ml-7  text-white">{name}</h2>

                <p className="font-bold ml-7 mt-3 text-white">
                  lets have look at your progress {email}
                </p>
                <LogoutButton />
              </div>
            </div>
            <div className="flex flex-col mt-5 overflow-y-auto">
              <Rank rank={rank} />
              <Accuracy overAllProgress={overAllProgress} />
              <EffectiveLearning percentage={percentage} />
              <Effort percentage={percentage} />
            </div>
          </div>
        </div>
        <UnitProgressCard data={data} />
      </div>
    </div>
  );
};
export default ProgressCard;
