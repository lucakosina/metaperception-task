import React from "react";
import DrawFix from "./DrawFix";
import * as DrawDots from "./DrawDots";
import DrawBox from "./DrawBox";
import * as DrawChoice from "./DrawChoice";
import style from "./style/taskStyle.module.css";
import * as utils from "./utils.js";
import * as staircase from "./staircase.js";
import withRouter from "./withRouter.js";
import * as ConfSlider from "./DrawConfSlider.js";

//import { DATABASE_URL } from "./config";

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
// THIS CODES THE TUTORIAL SESSIONS + QUIZ FOR THE TASK
class MetaPerTask extends React.Component {
  //////////////////////////////////////////////////////////////////////////////////////////////
  // CONSTRUCTOR
  constructor(props) {
    super(props);

    const userID = this.props.state.userID;
    const date = this.props.state.date;
    const startTime = this.props.state.startTime;

    var trialNumTotal = 12; //26
    var trialNumPerBlock = 3;
    var blockNumTotal = Math.round(trialNumTotal / trialNumPerBlock);

    //the stim position
    var stimPos = Array(Math.round(trialNumTotal / 2))
      .fill(1)
      .concat(Array(Math.round(trialNumTotal / 2)).fill(2));
    utils.shuffle(stimPos);

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
      stimTimeLag: 500, //300
      respFbTimeLag: 1000,
      itiTimeLag: 500, //500

      //trial parameters
      trialNumTotal: trialNumTotal,
      trialNumPerBlock: trialNumPerBlock,
      blockNumTotal: blockNumTotal,
      stimPos: stimPos,
      respKeyCode: [87, 79], // for left and right choice keys, currently it is W and O

      //trial by trial paramters
      blockNum: 0,
      trialNum: 0,
      trialNumInBlock: 0,
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
      choice: null,
      confLevel: null,
      confTime: 0,
      confMove: null, //can only move to next trial if conf was toggled
      correct: null,

      //dot paramters
      dotRadius: 5,

      // staircase parameters
      responseMatrix: [true, true],
      reversals: 0,
      stairDir: ["up", "up"],
      dotStair1: 4.65, //in log space; this is about 104 dots which is 70 dots shown for the first one
      dotStair2: 0,
      dotStairLeft: 0,
      dotStairRight: 0,
      count: 0,

      dotRadius: 5,

      // staircase parameters
      responseMatrix: [true, true],
      reversals: 0,
      stairDir: ["up", "up"],
      dotStair1: 4.65, //in log space; this is about 104 dots which is 70 dots shown for the first one
      dotStair2: 0,
      dotStairLeft: 0,
      dotStairRight: 0,
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
    this.handleConfResp = this.handleConfResp.bind(this);
    this.instructText = this.instructText.bind(this);

    //////////////////////////////////////////////////////////////////////////////////////////////
    //End constructor props
  }

  // This handles instruction screen within the component USING KEYBOARD
  handleInstruct(keyPressed) {
    var curInstructNum = this.state.instructNum;
    var whichButton = keyPressed;

    if (whichButton === 1 && curInstructNum === 2) {
      // from page 2 , I can move back a page
      this.setState({ instructNum: curInstructNum - 1 });
    } else if (whichButton === 2 && curInstructNum === 1) {
      // from page 1 , I can move forward a page
      this.setState({ instructNum: curInstructNum + 1 });
    }
  }

  handleBegin(keyPressed) {
    document.removeEventListener("keydown", this._handleInstructKey);
    document.removeEventListener("keydown", this._handleBeginKey);
    var curInstructNum = this.state.instructNum;
    var whichButton = keyPressed;
    if (whichButton === 3 && curInstructNum === 2) {
      // begin the task
      console.log("BEGIN");
      setTimeout(
        function () {
          this.taskBegin();
        }.bind(this),
        0
      );
    } else if (whichButton === 3 && curInstructNum === 3) {
      // continue after a block break
      var blockNum = this.state.blockNum + 1;
      this.setState({
        trialNumInBlock: 0,
        blockNum: blockNum,
      });

      setTimeout(
        function () {
          this.trialReset();
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

    var choice;
    if (keyPressed === 1) {
      choice = "left";
    } else if (keyPressed === 2) {
      choice = "right";
    } else {
      choice = null;
      console.log("No response made!");
    }

    var correct;
    var response;
    if (this.state.dotDiffLeft > this.state.dotDiffRight && choice === "left") {
      response = true;
      correct = 1;
    } else if (
      this.state.dotDiffLeft < this.state.dotDiffRight &&
      choice === "right"
    ) {
      response = true;
      correct = 1;
    } else {
      response = false;
      correct = 0;
    }

    console.log("response: " + response);

    var responseMatrix = this.state.responseMatrix.concat(response);

    this.setState({
      responseKey: keyPressed,
      choice: choice,
      respTime: respTime,
      correct: correct,
      responseMatrix: responseMatrix,
    });

    setTimeout(
      function () {
        this.renderChoiceFb();
      }.bind(this),
      0
    );
  }

  handleConfResp(keyPressed, timePressed) {
    var whichButton = keyPressed;
    if (whichButton === 3 && this.state.confMove === true) {
      document.removeEventListener("keydown", this._handleConfRespKey);
      setTimeout(
        function () {
          this.renderTaskSave();
        }.bind(this),
        0
      );
    }
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

  // handle key keyPressed
  _handleConfRespKey = (event) => {
    var keyPressed;
    var timePressed;

    console.log("Confidence is when pressed: " + this.state.confValue);

    switch (event.keyCode) {
      case 32:
        //    this is enter
        keyPressed = 3;
        timePressed = Math.round(performance.now());
        this.handleConfResp(keyPressed, timePressed);
        break;
      default:
    }
  };

  handleCallbackConf(callBackValue) {
    this.setState({ confValue: callBackValue });
    console.log("Confidence is: " + callBackValue);

    if (this.state.confValue !== null) {
      this.setState({ confMove: true });
    }
  }

  // To ask them for the valence rating of the noises
  // before we start the task
  instructText(instructNum) {
    let instruct_text1 = (
      <div>
        <span>
          The spaceship&apos;s power is dropping low - we need your help to sort
          the battery cards quickly!
          <br /> <br />
          You will have {this.state.trialNumTotal} set pairs of battery cards to
          make your decisions. This will be split over{" "}
          {this.state.blockNumTotal} sections with {this.state.trialNumPerBlock}{" "}
          sets of batteries each so that you can take breaks in between.
          <br /> <br />
          If the battery on the <strong>left</strong> has higher charge (more
          dots), <strong>press W</strong>.
          <br /> <br />
          If the battery on the <strong>right</strong> has higher charge (more
          dots), <strong> press O</strong>.
          <br /> <br />
          Please respond quickly and to the best of your ability. This time, you{" "}
          <strong>will not</strong> be told whether your choice was correct or
          incorrect.
          <br /> <br />
          <center>
            Use the ← and → keys to navigate the pages.
            <br />
            <br />[<strong>→</strong>]
          </center>
        </span>
      </div>
    );

    let instruct_text2 = (
      <div>
        <span>
          After making your choice, you will then rate your confidence in your
          judgement on the rating scale.
          <br /> <br />
          Please do your best to rate your confidence accurately and do take
          advantage of the <strong>whole length</strong> of the rating scale.
          <br /> <br />
          You will not be allowed to move on to the next set of batteries if you
          do not adjust the rating scale.
          <br /> <br />
          If you do well in the task, you can receive up to{" "}
          <strong>£2 bonus</strong>!
          <br /> <br />
          <center>
            When you are ready, please press the [<strong>SPACEBAR</strong>] to
            start.
            <br />
            <br />[<strong>←</strong>]
          </center>
        </span>
      </div>
    );

    let instruct_text3 = (
      <div>
        <span>
          You have completed {this.state.blockNum} out of{" "}
          {this.state.blockNumTotal} blocks!
          <br />
          <br />
          You can now pause for a break.
          <br />
          <br />
          <center>
            Press the [<strong>SPACEBAR</strong>] when you are ready to
            continue.
          </center>
        </span>
      </div>
    );

    let instruct_text4 = (
      <div>
        <span>
          You have completed {this.state.blockNum} out of{" "}
          {this.state.blockNumTotal} blocks!
          <br />
          <br />
          You can now pause for a break.
          <br />
          <br />
          <center>
            Press the [<strong>SPACEBAR</strong>] when you are ready to
            continue.
          </center>
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

  taskBegin() {
    // remove access to left/right/space keys for the instructions
    document.removeEventListener("keydown", this._handleInstructKey);
    document.removeEventListener("keydown", this._handleBeginKey);
    // push to render fixation for the first trial
    setTimeout(
      function () {
        this.trialReset();
      }.bind(this),
      0
    );
  }

  taskEnd() {
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
  trialReset() {
    var trialNum = this.state.trialNum + 1; //trialNum is 0, so it starts from 1
    var trialNumInBlock = this.state.trialNumInBlock + 1;
    var stimPos = this.state.stimPos[trialNum - 1]; //shuffle the order for the dotDiffLeft

    console.log("NEW TRIAL");
    // run staircase
    var s2 = staircase.staircase(
      this.state.dotStair1,
      this.state.responseMatrix,
      this.state.stairDir,
      trialNum
    );

    var dotStair1 = s2.diff;
    var stairDir = s2.direction;
    var responseMatrix = s2.stepcount;

    console.log("dotsStair: " + dotStair1);
    console.log("stairDir: " + stairDir);
    console.log("responseMat: " + responseMatrix);

    var reversals;
    if (s2.reversal) {
      // Check for reversal. If true, add one to reversals variable
      reversals = 1;
    } else {
      reversals = 0;
    }

    var dotDiffLeft;
    var dotDiffRight;
    var dotStairLeft;
    var dotStairRight;

    if (stimPos === 1) {
      dotStairLeft = dotStair1;
      dotStairRight = 0;
      dotDiffLeft = Math.round(Math.exp(dotStairLeft));
      dotDiffRight = dotStairRight; //should be 0
    } else {
      dotStairLeft = 0;
      dotStairRight = dotStair1;
      dotDiffLeft = dotStairLeft; //should be 0
      dotDiffRight = Math.round(Math.exp(dotStairRight));
    }

    //Reset all parameters
    this.setState({
      instructScreen: false,
      taskScreen: true,
      trialNum: trialNum,
      trialNumInBlock: trialNumInBlock,
      taskSection: "iti",
      fixTime: 0,
      stimTime: 0,
      responseKey: 0,
      reactionTime: 0,
      fbTime: 0,
      confLevel: null,
      confTime: 0,
      confMove: false,
      choice: null,
      correct: null,
      stimPos: stimPos,
      reversals: reversals,
      responseMatrix: responseMatrix,
      //Calculate the for the paramters for the stim
      dotDiffStim1: Math.round(Math.exp(dotStair1)),
      dotDiffStim2: 0,
      dotStairLeft: dotStairLeft,
      dotStairRight: dotStairRight,
      dotDiffLeft: dotDiffLeft,
      dotDiffRight: dotDiffRight,
    });

    console.log(trialNum);
    console.log(this.state.trialNumTotal);

    if (trialNum < this.state.trialNumTotal + 1) {
      console.log("render fix");
      setTimeout(
        function () {
          this.renderFix();
        }.bind(this),
        0
      );
    } else {
      // if the trials have reached the total trial number
      setTimeout(
        function () {
          this.taskEnd();
        }.bind(this),
        0
      );
    }
  }

  renderFix() {
    var trialTime = Math.round(performance.now());
    console.log("render fix now");
    //Show fixation
    this.setState({
      instructScreen: false,
      taskScreen: true,
      taskSection: "fixation",
      trialTime: trialTime,
    });

    setTimeout(
      function () {
        this.renderStim();
      }.bind(this),
      this.state.fixTimeLag
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  renderStim() {
    var fixTime = Math.round(performance.now()) - this.state.trialTime;
    console.log("render stim now");
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
        this.renderConfScale();
      }.bind(this),
      this.state.respFbTimeLag
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  renderConfScale() {
    document.addEventListener("keydown", this._handleConfRespKey);

    var initialValue = utils.randomInt(70, 80);

    this.setState({
      instructScreen: false,
      taskScreen: true,
      taskSection: "confidence",
      confInitial: initialValue,
    });

    // it will deploy the next trial with spacebar keypress
  }

  renderTaskSave() {
    var userID = this.state.userID;

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime,
      trialNum: this.state.trialNum,
      blockNum: this.state.blockNum,
      trialNumInBlock: this.state.trialNumInBlock,
      trialTime: this.state.trialTime,
      fixTime: this.state.fixTime,
      stimTime: this.state.stimTime,
      dotDiffLeft: this.state.dotDiffLeft,
      dotDiffRight: this.state.dotDiffRight,
      dotDiffStim1: this.state.dotDiffStim1,
      dotDiffStim2: this.state.dotDiffStim2,
      responseKey: this.state.responseKey,
      respTime: this.state.respTime,
      respFbTime: this.state.respFbTime,
      choice: this.state.choice,
      confLevel: this.state.confLevel,
      confTime: this.state.confTime,
      correct: this.state.correct,

      // staircase parameters
      responseMatrix: this.state.responseMatrix,
      reversals: this.state.reversals,
      stairDir: this.state.stairDir,
      dotStair1: this.state.dotStair1,
      dotStair2: this.state.dotStair2,
      dotStairLeft: this.state.dotStairLeft,
      dotStairRight: this.state.dotStairRight,
      count: this.state.count,

      //quiz paramters
      quizTry: this.state.quizTry,
      quizTime: this.state.quizTime,
      quizNumTotal: this.state.quizNumTotal,
      quizNum: this.state.quizNum,
      quizCor: this.state.quizCor,
      quizCorTotal: this.state.quizCorTotal,
    };

    //    try {
    //      fetch(`${DATABASE_URL}/tut_data/` + userID, {
    //          method: "POST",
    //          headers: {
    //            Accept: "application/json",
    //            "Content-Type": "application/json",
    //          },
    //          body: JSON.stringify(saveString),
    //        });
    //      } catch (e) {
    //        console.log("Cant post?");
    //      }

    console.log("In save: " + this.state.trialNumInBlock);
    console.log("In save: " + this.state.trialNumPerBlock);
    console.log("In save: " + this.state.trialNumInBlock);
    console.log("In save: " + this.state.trialNumTotal);

    if (
      this.state.trialNumInBlock === this.state.trialNumPerBlock &&
      this.state.trialNum !== this.state.trialNumTotal
    ) {
      //and not the last trial, because that will be sent to trialReset to end the task

      console.log("REST TIME");
      setTimeout(
        function () {
          this.restBlock();
        }.bind(this),
        10
      );
    } else {
      setTimeout(
        function () {
          this.trialReset();
        }.bind(this),
        10
      );
    }
  }

  restBlock() {
    this.setState({
      instructScreen: true,
      instructNum: 3,
      taskScreen: false,
      taskSection: "break",
    });
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
        this.state.taskSection === "iti"
      ) {
        text = <div className={style.boxStyle}></div>;
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "fixation"
      ) {
        text = (
          <div className={style.boxStyle}>
            <DrawFix />
          </div>
        );
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "stimulus"
      ) {
        text = (
          <div className={style.boxStyle}>
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
          <div className={style.boxStyle}>
            <DrawBox />
          </div>
        );
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "choiceFeedback"
      ) {
        text = (
          <div className={style.boxStyle}>
            <DrawChoice.DrawChoice choice={this.state.choice} />
          </div>
        );
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "confidence"
      ) {
        text = (
          <div>
            <center>
              Rate your confidence on the probability that your choice was
              correct:
            </center>
            <br />
            <br />
            <br />
            <br />
            <center>
              <ConfSlider.ConfSlider
                callBackValue={this.handleCallbackConf.bind(this)}
                initialValue={this.state.confInitial}
              />
            </center>
            <br />
            <br />
            <br />
            <br />
            <center>
              Press [SPACEBAR] to continue.
              <br />
              <br />
              You will not allowed to move on unless you have adjusted the
              scale.
            </center>
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
              Press [<strong>SPACEBAR</strong>] to skip to next section.
            </span>
          </p>
        </div>
      );
    }

    return (
      <div className={style.bg}>
        <div className={style.textFrame}>
          <div className={style.fontStyle}>{text}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(MetaPerTask);
