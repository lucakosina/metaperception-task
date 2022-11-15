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

class DrawBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftBoxStartX: leftBoxStartX,
      leftBoxStartY: leftBoxStartY,
      rightBoxStartX: rightBoxStartX,
      rightBoxStartY: rightBoxStartY,
      squareWidth: squareWidth,
    };
  }

  render() {
    let text;
    text = (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Rect
              x={this.state.leftBoxStartX}
              y={this.state.leftBoxStartY}
              width={this.state.squareWidth}
              height={this.state.squareWidth}
              fill="black"
            />
            <Rect
              x={this.state.rightBoxStartX}
              y={this.state.rightBoxStartY}
              width={this.state.squareWidth}
              height={this.state.squareWidth}
              fill="black"
            />
          </Layer>
        </Stage>
      </div>
    );

    return <div>{text}</div>;
  }
}

export default DrawBox;
