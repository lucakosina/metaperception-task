import React from "react";
import { Stage, Layer, Rect } from "react-konva";

var boxDist = 200; //distance between the boxes
var squareWidth = 250;
var bufferFix = 400;
var bufferFixWin = 0;

//left box
var leftBoxStartX = window.innerWidth / 2 - squareWidth / 2 - boxDist;
var leftBoxStartY = (window.innerHeight - bufferFix) / 2 - squareWidth / 2;

//right box
var rightBoxStartX = window.innerWidth / 2 - squareWidth / 2 + boxDist;
var rightBoxStartY = (window.innerHeight - bufferFix) / 2 - squareWidth / 2;

export const DrawChoice = ({ choice }) => {
  var leftChoice;
  var rightChoice;
  var rightColour;
  var leftColour;

  if (choice === "left") {
    leftChoice = 10;
    leftColour = "blue";
    rightChoice = 2.5;
    rightColour = "white";
  } else if (choice === "right") {
    leftChoice = 2.5;
    leftColour = "white";
    rightChoice = 10;
    rightColour = "blue";
  } else {
    leftChoice = 2.5;
    rightChoice = 2.5;
    leftColour = "white";
    rightColour = "white";
  }

  const [leftBoxState, setLeftBoxState] = React.useState(leftChoice);
  const [rightBoxState, setRightBoxState] = React.useState(rightChoice);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight - bufferFixWin}>
      <Layer>
        <Rect
          x={leftBoxStartX}
          y={leftBoxStartY}
          width={squareWidth}
          height={squareWidth}
          fill="black"
          strokeWidth={leftBoxState} // border width
          stroke={leftColour} // border color
        />
        <Rect
          x={rightBoxStartX}
          y={rightBoxStartY}
          width={squareWidth}
          height={squareWidth}
          fill="black"
          strokeWidth={rightBoxState} // border width
          stroke={rightColour} // border color
        />
      </Layer>
    </Stage>
  );
};
