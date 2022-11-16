import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 50,
    label: "50%",
  },
  {
    value: 60,
    label: "60%",
  },
  {
    value: 70,
    label: "70%",
  },
  {
    value: 80,
    label: "80%",
  },
  {
    value: 90,
    label: "80%",
  },
  {
    value: 100,
    label: "100%",
  },
];

function valuetext(value: number) {
  //  console.log(value);
  return value;
}

export function ConfSlider({ callBackValue, initialValue }) {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    callBackValue(newValue);
  };

  return (
    <Box sx={{ width: 500 }}>
      <Slider
        color="primary"
        aria-label="Always visible"
        step={1}
        marks={marks}
        min={50}
        max={100}
        track={false}
        valueLabelDisplay="on"
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
}
