import React from "react";
//import { Button } from "react-bootstrap";

import DrawFix from "./DrawFix";
import * as DrawDots from "./DrawDots";
import DrawBox from "./DrawBox";
import * as DrawChoice from "./DrawChoice";
import styles from "./style/taskStyle.module.css";
import * as utils from "./utils.js";
import * as staircase from "./staircase.js";
import withRouter from "./withRouter.js";

//import { DATABASE_URL } from "./config";

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
// THIS CODES THE TUTORIAL SESSIONS + QUIZ FOR THE TASK
class TutorDotsTask extends React.Component {
  //////////////////////////////////////////////////////////////////////////////////////////////
  // CONSTRUCTOR
  constructor(props) {
    super(props);

    const userID = this.props.state.userID;
    const date = this.props.state.date;
    const startTime = this.props.state.startTime;

    var trialNumTotal = 10; //26

    //the stim position
    var pracStimPos = Array(Math.round(trialNumTotal / 2))
      .fill(1)
      .concat(Array(Math.round(trialNumTotal / 2)).fill(2));
    utils.shuffle(pracStimPos);

    //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////
    // SET STATES
    this.state = {
      userID: userID,
      date: date,
      startTime: startTime,

      // trial timings in ms
      fixTimeLag: 1000, //1000
      fbTimeLag: 500, //500
      stimTimeLag: 1000, //300
      respTimeLag: 3000,
      respFbTimeLag: 1000,
      itiTimeLag: 500, //500

      //trial parameters
      trialNumTotal: trialNumTotal,
      pracPos: pracStimPos,
      respKeyCode: [87, 79], // for left and right choice keys, currently it is W and O

      //trial by trial paramters
      trialNum: 0,
      trialTime: 0,
      fixTime: 0,
      stimTime: 0,
      dotDiffLeft: 0,
      dotDiffRight: 0,
      dotDiffStim1: 0,
      dotDiffStim2: 120,
      responseKey: 0,
      respTime: 0,
      respFbTime: 0,
      leftChoice: 0,
      rightChoice: 0,
      confLevel: 0,
      confTime: 0,

      dotRadius: 5,

      // staircase parameters
      responseMatrix: [true, true],
      reversals: 0,
      stairDir: ["up", "up"],
      dotsStair1: 4.65, //in log space; this is about 104 dots which is 70 dots shown for the first one
      dotsStair2: 0,
      dotsStairLeft: 0,
      dotsStairRight: 0,
      count: 0,

      // screen parameters
      instructScreen: true,
      instructNum: 1,
      taskScreen: false,
      taskSection: null,
      debug: false,
    };

    //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////

    this.handleInstruct = this.handleInstruct.bind(this);
    this.handleBegin = this.handleBegin.bind(this);
    this.handleResp = this.handleResp.bind(this);
    this.instructText = this.instructText.bind(this);

    //////////////////////////////////////////////////////////////////////////////////////////////
    //End constructor props
  }

  // This handles instruction screen within the component USING KEYBOARD
  handleInstruct(keyPressed) {
    var curInstructNum = this.state.instructNum;
    var whichButton = keyPressed;

    if (whichButton === 1 && curInstructNum > 1) {
      this.setState({ instructNum: curInstructNum - 1 });
    } else if (whichButton === 2 && curInstructNum < 3) {
      this.setState({ instructNum: curInstructNum + 1 });
    }
  }

  handleBegin(keyPressed) {
    var curInstructNum = this.state.instructNum;
    var whichButton = keyPressed;
    if (whichButton === 3 && curInstructNum === 3) {
      setTimeout(
        function () {
          this.tutorBegin();
        }.bind(this),
        0
      );
    }
  }

  handleResp(keyPressed, timePressed) {
    //Check first whether it is a valid press
    var respTime =
      timePressed -
      (this.state.trialTime + this.state.fixTime + this.state.stimTime);
    var leftChoice;
    var rightChoice;
    if (keyPressed === 1) {
      leftChoice = 10;
      rightChoice = 0;
    } else if (keyPressed === 2) {
      leftChoice = 0;
      rightChoice = 10;
    } else {
      leftChoice = 0;
      rightChoice = 0;
      console.log("No response made!");
    }

    this.setState({
      responseKey: keyPressed,
      leftChoice: leftChoice,
      rightChoice: rightChoice,
      respTime: respTime,
    });

    setTimeout(
      function () {
        this.renderChoiceFb();
      }.bind(this),
      0
    );
  }

  // handle key keyPressed
  _handleInstructKey = (event) => {
    var keyPressed;

    switch (event.keyCode) {
      case 37:
        //    this is left arrow
        keyPressed = 1;
        this.handleInstruct(keyPressed);
        break;
      case 39:
        //    this is right arrow
        keyPressed = 2;
        this.handleInstruct(keyPressed);
        break;
      default:
    }
  };

  // handle key keyPressed
  _handleBeginKey = (event) => {
    var keyPressed;

    switch (event.keyCode) {
      case 32:
        //    this is spacebar
        keyPressed = 3;
        this.handleBegin(keyPressed);
        break;
      default:
    }
  };

  // handle key keyPressed
  _handleRespKey = (event) => {
    var keyPressed;
    var timePressed;
    var leftKey = this.state.respKeyCode[0];
    var rightKey = this.state.respKeyCode[1];

    switch (event.keyCode) {
      case leftKey:
        //    this is left choice
        keyPressed = 1;
        timePressed = Math.round(performance.now());
        this.handleResp(keyPressed, timePressed);
        break;
      case rightKey:
        //    this is right choice
        keyPressed = 2;
        timePressed = Math.round(performance.now());
        this.handleResp(keyPressed, timePressed);
        break;
      default:
    }
  };

  // To ask them for the valence rating of the noises
  // before we start the task
  instructText(instructNum) {
    let instruct_text1 = (
      <div>
        <span>
          Welcome to the task!
          <br /> <br />
          We will now ask you to judge which of two images contains more dots,
          before asking you to rate your confidence in your judgement.
          <br /> <br />
          At the beginning of each trial, you will be presented with a black
          cross in the middle of the screen. Focus your attention on it. Then,
          two black boxes with a number of white dots will be flashed and you
          will be asked to judge which box had a higher number of dots.
          <br /> <br />
          If the box on the <strong>left</strong> had more dots,{" "}
          <strong>press W</strong>. <br /> <br />
          If the box on the <strong>right</strong> had more dots,{" "}
          <strong> press O</strong>. <br /> <br />
          Please respond quickly and to the best of your ability.
          <br /> <br />
          You will then rate your confidence in your judgement on a scale with
          the mouse.
          <br /> <br />
          Please do your best to rate your confidence accurately and do take
          advantage of the whole rating scale.
          <br /> <br />
          <span>
            [<strong>NEXT</strong> →]
            <br /> <br />
            Use the left and right arrow keys to navigate the pages.
          </span>
        </span>
      </div>
    );

    let instruct_text2 = (
      <div>
        <span>
          You will now continue directly to the experiment. The dots will
          presented only for a short period of time.
          <br />
          <br />
          You will be asked to rate your confidence in your judgement after each
          trial.
          <br />
          <br />
          <span>
            [← <strong>BACK</strong>] [<strong>NEXT</strong> →]
          </span>
        </span>
      </div>
    );

    let instruct_text3 = (
      <div>
        <span>
          We will now ask you to carry out some practice trials. Please respond
          only when the dots have disappeared.
          <br />
          <br />
          In this practice phase we will tell you whether your judgements are
          right or wrong. <br></br>If you are <strong>correct</strong>, the box
          that you selected will be outlined in{" "}
          <font color="blue">
            <strong>blue</strong>
          </font>
          .
          <br />
          <br />
          If you are <strong>incorrect</strong>, the box that you selected will
          be outlined in{" "}
          <font color="red">
            <strong>red</strong>
          </font>
          . You will not need to rate your confidence of your judgements on
          these trials.
          <br />
          <br />
          Press [<strong>SPACEBAR</strong>] to begin the practice.
          <br />
          <br />
          <span>
            [← <strong>BACK</strong>]
          </span>
        </span>
      </div>
    );

    let instruct_text4 = (
      <div>
        <span>
          End of practice!
          <br />
          Press [<strong>SPACEBAR]</strong> to move on to the task.
        </span>
      </div>
    );

    switch (instructNum) {
      case 1:
        return <div>{instruct_text1}</div>;
      case 2:
        return <div>{instruct_text2}</div>;
      case 3:
        return <div>{instruct_text3}</div>;
      case 4:
        return <div>{instruct_text4}</div>;
      default:
    }
  }

  tutorBegin() {
    // remove access to left/right/space keys for the instructions
    document.removeEventListener("keydown", this._handleInstructKey);
    document.removeEventListener("keydown", this._handleBeginKey);
    //add access to left/right/space keys for the task

    // change state to make sure the screen is changed for the task
    this.setState({
      instructScreen: false,
      taskScreen: true,
      taskSection: "fixation",
    });

    // push to render fixation for the first trial
    setTimeout(
      function () {
        this.renderFix();
      }.bind(this),
      0
    );
  }

  tutorEnd() {
    // remove access to left/right/space keys for the instructions
    //  document.removeEventListener("keyup", this._handleRespKey);
    // change state to make sure the screen is changed for the task
    this.setState({
      instructScreen: true,
      taskScreen: false,
      instructNum: 4,
      taskSection: null,
    });
  }

  //////////////////////////////////////////////////////////////////////////////////
  // FOUR COMPONENTS OF THE TASK, Fixation, Stimulus/Response, Feedback and Confidence

  renderFix() {
    if (this.state.taskScreen === true) {
      //console.log("Fixation IS RENDERED as taskScreen is TRUE");
      //if trials are still ongoing
      var trialNum = this.state.trialNum + 1; //trialNum is 0, so it starts from 1
      var trialTime = Math.round(performance.now());

      //shuffle the order for the dotDiffLeft
      var stimPos = this.state.pracPos[trialNum - 1];

      var s2 = staircase.staircase(
        this.state.dotsStair1,
        this.state.responseMatrix,
        this.state.stairDir,
        trialNum
      );

      var dotsStair1 = s2.diff;
      var stairDir = s2.direction;
      var responseMatrix = s2.stepcount;

      var reversals;
      if (s2.reversal) {
        // Check for reversal. If true, add one to reversals variable
        reversals = 1;
      } else {
        reversals = 0;
      }

      var dotDiffLeft;
      var dotDiffRight;
      var dotsStairLeft;
      var dotsStairRight;

      if (stimPos === 1) {
        dotsStairLeft = dotsStair1;
        dotsStairRight = 0;
        dotDiffLeft = Math.round(Math.exp(dotsStairLeft));
        dotDiffRight = dotsStairRight; //should be 0
      } else {
        dotsStairLeft = 0;
        dotsStairRight = dotsStair1;
        dotDiffLeft = dotsStairLeft; //should be 0
        dotDiffRight = Math.round(Math.exp(dotsStairRight));
      }

      //Reset all parameters
      this.setState({
        instructScreen: false,
        taskScreen: true,
        taskSection: "fixation",
        trialNum: trialNum,
        trialTime: trialTime,
        fixTime: 0,
        stimTime: 0,
        responseKey: 0,
        reactionTime: 0,
        fbTime: 0,
        confLevel: 0,
        confTime: 0,

        reversals: reversals,
        responseMatrix: responseMatrix,
        //Calculate the for the paramters for the stim
        dotDiffStim1: Math.round(Math.exp(dotsStair1)),
        dotDiffStim2: 0,
        dotsStairLeft: dotsStairLeft,
        dotsStairRight: dotsStairRight,
        dotDiffLeft: dotDiffLeft,
        dotDiffRight: dotDiffRight,
      });

      console.log(this.state.trialNum);
      console.log(this.state.trialNumTotal);

      if (this.state.trialNum < this.state.trialNumTotal + 1) {
        setTimeout(
          function () {
            this.renderStim();
          }.bind(this),
          this.state.fixTimeLag
        );
      } else {
        // if the trials have reached the total trial number
        setTimeout(
          function () {
            this.tutorEnd();
          }.bind(this),
          0
        );
      }
    } else {
      // if state.taskScreen is set as false
      console.log("Fixation NOT RENDERED as taskScreen is FALSE");
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  renderStim() {
    var fixTime = Math.round(performance.now()) - this.state.trialTime;

    this.setState({
      instructScreen: false,
      taskScreen: true,
      taskSection: "stimulus",
      fixTime: fixTime,
    });

    setTimeout(
      function () {
        this.renderChoice();
      }.bind(this),
      this.state.stimTimeLag
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  renderChoice() {
    document.addEventListener("keydown", this._handleRespKey);
    var stimTime =
      Math.round(performance.now()) -
      [this.state.trialTime + this.state.fixTime];

    this.setState({
      instructScreen: false,
      taskScreen: true,
      taskSection: "choice",
      stimTime: stimTime,
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  renderChoiceFb() {
    document.removeEventListener("keydown", this._handleRespKey);

    var respFbTime =
      Math.round(performance.now()) -
      [
        this.state.trialTime +
          this.state.fixTime +
          this.state.stimTime +
          this.state.respTime,
      ];

    this.setState({
      instructScreen: false,
      taskScreen: true,
      taskSection: "choiceFeedback",
      respFbTime: respFbTime,
    });

    setTimeout(
      function () {
        this.renderFix();
      }.bind(this),
      this.state.respFbTimeLag
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  ///////////////////////////////////////////////////////////////
  render() {
    let text;
    if (this.state.debug === false) {
      if (
        this.state.instructScreen === true &&
        this.state.taskScreen === false
      ) {
        document.addEventListener("keydown", this._handleInstructKey);
        document.addEventListener("keydown", this._handleBeginKey);
        text = <div> {this.instructText(this.state.instructNum)}</div>;
        console.log("THIS SHOULD BE INSTRUCTION BLOCK");
        console.log(this.state.instructNum);
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "fixation"
      ) {
        text = (
          <div>
            <DrawFix />
          </div>
        );
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "stimulus"
      ) {
        text = (
          <div>
            <DrawDots.DrawDots
              dotRadius={this.state.dotRadius}
              dotDiffLeft={this.state.dotDiffLeft}
              dotDiffRight={this.state.dotDiffRight}
            />
          </div>
        );
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "choice"
      ) {
        text = (
          <div>
            <DrawBox />
          </div>
        );
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "choiceFeedback"
      ) {
        text = (
          <div>
            <DrawChoice.DrawChoice
              leftChoice={this.state.leftChoice}
              rightChoice={this.state.rightChoice}
            />
          </div>
        );
      }
    } else if (this.state.debug === true) {
      text = (
        <div>
          <p>
            <span>DEBUG MODE</span>
            <br />
            <span>
              Press the [<strong>SPACEBAR</strong>] to skip to next section.
            </span>
          </p>
        </div>
      );
    }

    return <div className={styles.main}>{text}</div>;
  }
}

export default withRouter(TutorDotsTask);
