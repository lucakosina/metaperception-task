import React from "react";
import { Stage, Layer, Rect } from "react-konva";

var boxDist = 200; //distance between the boxes
var squareWidth = 250;

//left box
var leftBoxStartX = window.innerWidth / 2 - squareWidth / 2 - boxDist;
var leftBoxStartY = (window.innerHeight - 50) / 2 - squareWidth / 2;

//right box
var rightBoxStartX = window.innerWidth / 2 - squareWidth / 2 + boxDist;
var rightBoxStartY = (window.innerHeight - 50) / 2 - squareWidth / 2;

export const DrawChoice = ({ choice }) => {
  var leftChoice;
  var rightChoice;

  if (choice === "left") {
    leftChoice = 10;
    rightChoice = 0;
  } else if (choice === "right") {
    leftChoice = 0;
    rightChoice = 10;
  } else {
    leftChoice = 0;
    rightChoice = 0;
  }

  const [leftBoxState, setLeftBoxState] = React.useState(leftChoice);
  const [rightBoxState, setRightBoxState] = React.useState(rightChoice);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Rect
          x={leftBoxStartX}
          y={leftBoxStartY}
          width={squareWidth}
          height={squareWidth}
          fill="black"
          strokeWidth={leftBoxState} // border width
          stroke="blue" // border color
        />
        <Rect
          x={rightBoxStartX}
          y={rightBoxStartY}
          width={squareWidth}
          height={squareWidth}
          fill="black"
          strokeWidth={rightBoxState} // border width
          stroke="blue" // border color
        />
      </Layer>
    </Stage>
  );
};
