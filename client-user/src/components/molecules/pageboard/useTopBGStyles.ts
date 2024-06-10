const correctAnswerGradient =
  "linear-gradient(270deg, #A9ECEA 0%, #71BEEE 97.93%)";
const wrongAnswerGradient = "linear-gradient(270deg, #F1BE70 0%, #F09570 100%)";
const hintGradient =
  "linear-gradient(270.25deg, #F1D070 18.96%, #F0D770 80.16%)";
const defaultGradient =
  "linear-gradient(274.88deg, #765188 0%, rgba(38, 44, 85, 0.95) 86.33%)";

export const getContainerStyle = (
  correct: boolean,
  wrong: boolean,
  hint: boolean
) => {
  if (correct) {
    return {
      background: `var(--correct-gradient, ${correctAnswerGradient})`,
    };
  } else if (wrong) {
    return {
      background: `var(--wrong-gradient, ${wrongAnswerGradient})`,
    };
  } else if (hint) {
    return {
      background: `var(--hint-gradient, ${hintGradient})`,
    };
  } else {
    return {
      background: `var(--default-gradient, ${defaultGradient})`,
    };
  }
};
export const getbackroundImage = (
  correct: boolean,
  wrong: boolean,
  image: string
) => {
  if (correct) {
    return "/mcqRight.svg";
  } else if (wrong) {
    return "/mcqWrong.svg";
  } else {
    return `${image ? image : "/pageImage1.svg"}`;
  }
};
