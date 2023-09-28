import React, { useState, useContext } from "react";
import { Precisioncontext } from "../App";
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Flex,
} from "@chakra-ui/react";

function SliderAccuracy({ sliderValue, setSliderValue }) {
  const [precision, setPrecision] = useContext(Precisioncontext);
  const setAccuracy = (val) => {
    setSliderValue(val);
    if (val === 0) {
      setPrecision("low");
    } else if (val === 50) {
      setPrecision("middle");
    } else {
      setPrecision("long");
    }
    // console.log(sliderValue, setSliderValue)
  };

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  return (
    <Box m="4" pb={6} maxW="450px" textAlign="center">
      <Slider
        aria-label="slider-ex-6"
        min={0}
        max={100}
        step={50}
        defaultValue={0}
        onChange={(val) => setAccuracy(val)}
      >
        <SliderMark value={0} {...labelStyles}>
          低
        </SliderMark>
        <SliderMark value={50} {...labelStyles}>
          中
        </SliderMark>
        <SliderMark value={100} {...labelStyles}>
          高
        </SliderMark>

        <SliderMark
          value={sliderValue}
          textAlign="center"
          bg="blue.500"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {/* {sliderValue}% */}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
}

export default SliderAccuracy;
