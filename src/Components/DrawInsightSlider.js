import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    primary: {
      contrastThreshold: 4.5,
      main: "#ffffff",
    },

    text: { primary: "#ffffff", secondary: "#ffffff" },
  },
});

//labels
//1 - not at allowed
//2 - not very likely
//3 - somewhat likely
//4 - very likely
//5 - definitely

const marks = [
  {
    value: 1,
    label: "Not at all",
  },
  {
    value: 2,
    label: "Not much",
  },
  {
    value: 3,
    label: "Somewhat",
  },
  {
    value: 4,
    label: "Quite a bit",
  },
  {
    value: 5,
    label: "A lot",
  },
];

export function InsightSlider({ callBackValue, initialValue }) {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    callBackValue(newValue);
  };

  return (
    <Box sx={{ width: 600 }}>
      <Box sx={{ width: 500 }}>
        <ThemeProvider theme={theme}>
          <Slider
            color="primary"
            aria-label="Always visible"
            step={1}
            marks={marks}
            min={1}
            max={5}
            track={false}
            valueLabelDisplay="off"
            value={value}
            onChange={handleChange}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
}
