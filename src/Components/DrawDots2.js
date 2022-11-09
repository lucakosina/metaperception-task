import React from "react";
import { Stage, Layer, Circle } from "react-konva";

function genDotPos(sqxstartpoint, sqystartpoint, squareWidth, dotSize) {
  var dotXArray = [];
  var dotYArray = [];
  for (var x = sqxstartpoint; x < sqxstartpoint + squareWidth; x += dotSize) {
    for (var y = sqystartpoint; y < sqystartpoint + squareWidth; y += dotSize) {
      dotXArray.push(x);
      dotYArray.push(y);
    }
  }
  return [dotXArray, dotYArray];
}

//shuffling 2 or more arrays in the same order
var isArray =
  Array.isArray ||
  function (value) {
    return {}.toString.call(value) !== "[object Array]";
  };

function shuffleSame() {
  var arrLength = 0;
  var argsLength = arguments.length;
  var rnd, tmp, argsIndex;

  for (var index = 0; index < argsLength; index += 1) {
    if (!isArray(arguments[index])) {
      throw new TypeError("Argument is not an array.");
    }

    if (index === 0) {
      arrLength = arguments[0].length;
    }

    if (arrLength !== arguments[index].length) {
      throw new RangeError("Array lengths do not match.");
    }
  }

  while (arrLength) {
    rnd = Math.round(Math.random() * arrLength);
    arrLength -= 1;
    for (argsIndex = 0; argsIndex < argsLength; argsIndex += 1) {
      tmp = arguments[argsIndex][arrLength];
      arguments[argsIndex][arrLength] = arguments[argsIndex][rnd];
      arguments[argsIndex][rnd] = tmp;
    }
  }
}

function genDots(dotPosX, dotPosY) {
  if (dotPosX.length === dotPosY.length) {
    return [...Array(dotPosX.length)].map((_, i) => ({
      id: i.toString(),
      x: dotPosX,
      y: dotPosY,
      isDragging: false,
    }));
  } else {
    const e = new Error("Dot coordinates not same length!");
    throw e;
  }
}

///////////////////////////////////////////////////////////////////
//create black stimulus box
var squareWidth = 250; //250
var dotSize = 10;
var boxDist = 200; //distance between the boxes
var dotTotal = (squareWidth / dotSize) * (squareWidth / dotSize);
var dotDiffLeft = 5;
var dotDiffRight = 50;

// left box
var leftBoxStartX = window.innerWidth / 2 - squareWidth / 2 - boxDist;
var leftBoxStartY = window.innerHeight / 2 - squareWidth / 2;

//right box
var rightBoxStartX = window.innerWidth / 2 - squareWidth / 2 + boxDist;
var rightBoxStartY = window.innerHeight / 2 - squareWidth / 2;

var leftDotPos = genDotPos(leftBoxStartX, leftBoxStartY, squareWidth, dotSize);
var rightDotPos = genDotPos(
  rightBoxStartX,
  rightBoxStartY,
  squareWidth,
  dotSize
);

var leftDotPosX = leftDotPos[0];
var leftDotPosY = leftDotPos[1];
var rightDotPosX = rightDotPos[0];
var rightDotPosY = rightDotPos[1];

shuffleSame(leftDotPosX, leftDotPosX); // randomise the shown vs hidden dots
shuffleSame(rightDotPosX, rightDotPosY);

var leftDotShown = Math.floor(dotTotal / 2) + dotDiffLeft;
var leftDotCorrXShown = leftDotPosX.slice(0, leftDotShown - 1);
var leftDotCorrXHidden = leftDotPosX.slice(leftDotShown, dotTotal - 1);
var leftDotCorrYShown = leftDotPosY.slice(0, leftDotShown - 1);
var leftDotCorrYHidden = leftDotPosY.slice(leftDotShown, dotTotal - 1);

var rightDotShown = Math.floor(dotTotal / 2) + dotDiffRight;
var rightDotCorrXShown = rightDotPosX.slice(0, rightDotShown - 1);
var rightDotCorrXHidden = rightDotPosX.slice(rightDotShown, dotTotal - 1);
var rightDotCorrYShown = rightDotPosY.slice(0, rightDotShown - 1);
var rightDotCorrYHidden = rightDotPosY.slice(rightDotShown, dotTotal - 1);

var leftDotShownCoor = genDots(leftDotCorrXShown, leftDotCorrYShown);
var leftDotHiddenCoor = genDots(leftDotCorrXHidden, leftDotCorrYHidden);

var rightDotShownCoor = genDots(rightDotCorrXShown, rightDotCorrYShown);
var rightDotHiddenCoor = genDots(rightDotCorrXHidden, rightDotCorrYHidden);

export const DrawDots = ({ dotSize }) => {
  const [dotsLeftShow, setDotsLeftShow] = React.useState(leftDotShownCoor);
  const [dotsLeftHide, setDotsLeftHide] = React.useState(leftDotHiddenCoor);
  const [dotsRightShow, setDotsRightShow] = React.useState(rightDotShownCoor);
  const [dotsRightHide, setDotsRightHide] = React.useState(rightDotHiddenCoor);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {dotsLeftShow.map((dotsLeftShow) => (
          <Circle
            key={dotsLeftShow.id}
            id={dotsLeftShow.id}
            x={dotsLeftShow.x}
            y={dotsLeftShow.y}
            radius={dotSize}
            fill="white"
            opacity={1}
          />
        ))}
      </Layer>
      //// black dots (hidden)
      <Layer>
        {dotsLeftHide.map((dotsLeftHide) => (
          <Circle
            key={dotsLeftHide.id}
            id={dotsLeftHide.id}
            x={dotsLeftHide.x}
            y={dotsLeftHide.y}
            radius={dotSize}
            fill="black"
            opacity={1}
          />
        ))}
      </Layer>
      // left square white dots (visible)
      <Layer>
        {dotsRightShow.map((dotsRightShow) => (
          <Circle
            key={dotsRightShow.id}
            id={dotsRightShow.id}
            x={dotsRightShow.x}
            y={dotsRightShow.y}
            radius={dotSize}
            fill="white"
            opacity={1}
          />
        ))}
      </Layer>
      //// black dots (hidden)
      <Layer>
        {dotsRightHide.map((dotsRightHide) => (
          <Circle
            key={dotsRightHide.id}
            id={dotsRightHide.id}
            x={dotsRightHide.x}
            y={dotsRightHide.y}
            radius={dotSize}
            fill="black"
            opacity={1}
          />
        ))}
      </Layer>
    </Stage>
  );
};
