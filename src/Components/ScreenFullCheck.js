import screenfull from "screenfull";
import React from "react";
import withRouter from "./withRouter";

import style from "./style/taskStyle.module.css";

class Home extends React.Component {
  constructor(props) {
    super(props);

    var prolific_id = Math.floor(100000 + Math.random() * 900000);
    //var prolific_id = 120000; //for testing

    this.state = {
      // demo paramters
      userID: prolific_id,
    };

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener("keyup", function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });

    this.redirectToTarget = this.redirectToTarget.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keyup", this._handleStartKey);
    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        console.log("Am I fullscreen?", screenfull.isFullscreen ? "Yes" : "No");
      });
    }
  }

  // enabling fullscreen has to be done after some user input
  toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };

  redirectToTarget() {
    //On click consent, sent to tutorial page with the props
    this.props.navigate("/StartPage", {
      state: {
        userID: this.state.userID,
      },
    });

    console.log("UserID is: " + this.state.userID);
  }

  render() {
    return (
      <div className={style.bg}>
        <div className={style.textFrame}>
          <div className={style.fontStyle}>
            <p>
              This experiment only has support for{" "}
              <strong>Google Chrome</strong> or{" "}
              <strong>Mozilla Firefox.</strong> Please use reopen the page if
              you are using another.
              <br />
              <br />
              To take part, your browser must be <strong>maximised</strong> and
              be in <strong>fullscreen mode</strong>, due to the dimensions of
              some graphics. Please click the button below.
              <br />
              <br />
              <span>
                <center>
                  <button onClick={this.toggleFullScreen}>
                    Toggle fullscreen
                  </button>
                </center>
              </span>
              <br></br>
              Please do not change the dimensions of your browser once you have
              begun. If you encounter any technical issues, please send a
              message to the researcher with a screenshot of the error and
              details of the browser you are using.
              <br></br>
              <br></br>
              When you are ready, click the button below to start.
              <br></br>
              <br></br>
              <span>
                <center>
                  <button onClick={this.redirectToTarget}>Start</button>
                </center>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
