import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import { usePlayComputer } from "@/store/usePlayComputer";
import { displayLevelImage } from "@/helpers/playComputer";

const styles = { color: "white", fontSize: "20px" };
const marks = [
  {
    value: 0,
    label: "250",
    style: { styles },
  },
  {
    value: 25,
    label: "1000",
    style: { styles },
  },
  {
    value: 50,
    label: "1600",
    style: { styles },
  },
  {
    value: 75,
    label: "2000",
    style: { styles },
  },
  {
    value: 100,
    label: "2600",
    style: { styles },
  },
];

function valuetext(value: number) {
  return `${value}`;
}

function valueLabelFormat(value: number) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

export default function DiscreteSliderValues({ avatar }: any) {
  const [value, setValue] = React.useState(20);
  const label = usePlayComputer((s) => s.label);
  const setLabel = usePlayComputer((s) => s.setLabel);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
    const mark = marks.find((mark) => mark.value === newValue);
    if (mark) {
      setLabel(mark.label);
    }
  };

  return (
    <>
      <div className="flex items-center text-white">
        {avatar && (
          <img
            src={avatar}
            alt="avatar"
            className="md:w-[7rem] md:h-[7rem] lg:w-[10rem] lg:h-[10rem]"
          />
        )}
        Vs
        <div className="ml-10">{displayLevelImage(label)}</div>
      </div>
      <Box sx={{ width: 300 }}>
        <Slider
          aria-label="Restricted values"
          defaultValue={0}
          onChange={handleChange}
          valueLabelFormat={valueLabelFormat}
          getAriaValueText={valuetext}
          step={null}
          marks={marks.map((mark) => ({
            value: mark.value,
            label: (
              <Typography sx={mark.style}>
                <span style={mark.style.styles}>{mark.label}</span>
              </Typography>
            ),
          }))}
          sx={{ color: "white" }}
        />
      </Box>
    </>
  );
}
