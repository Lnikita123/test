import { responsiveStyle } from "@/components/molecules/pageboard/topSection";
import React from "react";

interface IHintCorrectWrong {
  hint: boolean;
  bottomHint: any;
  wrong: boolean;
  correct: boolean;
  bottomWrong: any;
}

const HintCorrectWrong = ({
  hint,
  bottomHint,
  correct,
  wrong,
  bottomWrong,
}: IHintCorrectWrong) => {
  return (
    <div className={`text-[#283272] ${responsiveStyle}`}>
      {hint && bottomHint && (!correct || !wrong) ? (
        <h6
          className="absolute top-0 left-0 m-2"
          style={{ fontFamily: "Sans" }}
        >
          Hint: {bottomHint}
        </h6>
      ) : null}

      {correct && !wrong && !hint ? (
        <h6
          className="absolute top-0 left-0 m-2"
          style={{ fontFamily: "Sans" }}
        >
          Hurray! you did a great job
        </h6>
      ) : null}

      {!correct && wrong && !hint ? (
        <p className="absolute top-0 left-0 m-2" style={{ fontFamily: "Sans" }}>
          {bottomWrong ? bottomWrong : "You're almost there!!"}
        </p>
      ) : null}
    </div>
  );
};

export default HintCorrectWrong;
