import { IuseChapterStore } from "@/store/useInterfaceStore";

export const calculateEffectiveLearning = (
  accuracy: number
): string | undefined => {
  let effectiveLearning = "";
  if (accuracy >= 95 && accuracy <= 100) {
    effectiveLearning = "A+";
  } else if (accuracy >= 90 && accuracy < 95) {
    effectiveLearning = "A";
  } else if (accuracy >= 80 && accuracy < 90) {
    effectiveLearning = "B";
  } else if (accuracy >= 70 && accuracy < 80) {
    effectiveLearning = "C";
  } else if (accuracy < 70) {
    effectiveLearning = "Below C";
  }
  return effectiveLearning;
};
export async function calculateUserUnitPoints(Progress: any) {
  const unitPoints: Record<string, number> | any = {}; // Object to store unit points

  for (const unitId in Progress) {
    const unit = Progress[unitId];
    let unitTotalPoints = 0;

    for (const chapterId in unit) {
      const chapter = unit[chapterId];

      for (const pageId in chapter) {
        unitTotalPoints += chapter[pageId]; // Accumulate points for each page
      }
    }

    unitPoints[unitId] = unitTotalPoints; // Store the total points for the unit
  }

  console.log(unitPoints); // Display the unit points
  return unitPoints;
}

export const calculateAccuracy = async (chapArr: IuseChapterStore[]) => {
  let totalPoints = 0;
  if (!chapArr) return;
  for (let i = 0; i < chapArr.length; i++) {
    const chapter = chapArr[i];
    if (chapter && chapter.points) {
      totalPoints += chapter.points;
    }
  }
  if (totalPoints === 0) {
    return 0;
  }
  return totalPoints;
};
