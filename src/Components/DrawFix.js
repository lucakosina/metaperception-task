import React from "react";
import { Stage, Layer, Rect } from "react-konva";

class DrawFix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fixWidVert: 5,
      fixHeiVert: 75,
      fixWidHori: 75,
      fixHeiHori: 5,
    };
  }

  render() {
    let text;

    text = (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Rect
              x={window.innerWidth / 2 + this.state.fixWidVert / 2}
              y={window.innerHeight / 2 - this.state.fixHeiVert / 2}
              width={this.state.fixWidVert}
              height={this.state.fixHeiVert}
              fill="black"
            />

            <Rect
              x={
                window.innerWidth / 2 -
                this.state.fixWidHori / 2 +
                this.state.fixHeiHori
              }
              y={window.innerHeight / 2 - this.state.fixHeiHori / 2}
              width={this.state.fixWidHori}
              height={this.state.fixHeiHori}
              fill="black"
            />
          </Layer>
        </Stage>
      </div>
    );

    return <div>{text}</div>;
  }
}

export default DrawFix;
