import React from "react";
import DrawFix from "./DrawFix";
import * as DrawDots from "./DrawDots";
import * as DrawDotsEx from "./DrawDotsExample";
import DrawBox from "./DrawBox";
import * as DrawChoice from "./DrawChoice";
import * as DrawCorFeedback from "./DrawCorFeedback";
import style from "./style/taskStyle.module.css";
import * as utils from "./utils.js";
import * as staircase from "./staircase.js";
import withRouter from "./withRouter.js";
import * as ConfSlider from "./DrawConfSlider.js";
import * as ConfSliderEx from "./DrawConfSliderExample.js";
import astrodude from "./img/astronaut.png";
import { Stage, Layer, Rect, Text } from "react-konva";

//import { DATABASE_URL } from "./config";

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
// THIS CODES THE TUTORIAL SESSION + QUIZ FOR THE TASK
// Session includes:
// 1) Introduction to cover story
// 2) Quiz on instructions
// 3) Practice on left/right box with feedback
// 4) Instructions to confidence rating
// 5) Quiz on confidence rating
// 6) Move to task proper

class MetaPerTut extends React.Component {
  //////////////////////////////////////////////////////////////////////////////////////////////
  // CONSTRUCTOR
  constructor(props) {
    super(props);

    const userID = this.props.state.userID;
    const date = this.props.state.date;
    const startTime = this.props.state.startTime;

    var trialNumTotal = 4; //26

    //the stim position
    var pracStimPos = Array(Math.round(trialNumTotal / 2))
      .fill(1)
      .concat(Array(Math.round(trialNumTotal / 2)).fill(2));
    utils.shuffle(pracStimPos);

    //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////
    // SET STATES
    this.state = {
      // demo paramters
      userID: userID,
      date: date,
      startTime: startTime,
      astrodude: astrodude,

      // trial timings in ms
      fixTimeLag: 1000, //1000
      fbTimeLag: 500, //500
      stimTimeLag: 700, //300
      respFbTimeLag: 700, //
      corFbTimeLag: 1000, // right or wrong

      //trial parameters
      trialNumTotal: trialNumTotal,
      stimPosList: pracStimPos,
      respKeyCode: [87, 79], // for left and right choice keys, currently it is W and O

      //trial by trial paramters
      trialNum: 0,
      trialTime: 0,
      fixTime: 0,
      stimTime: 0,
      stimPos: 0,
      dotDiffLeft: 0,
      dotDiffRight: 0,
      dotDiffStim1: 0,
      dotDiffStim2: 0,
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

      //quiz paramters
      quizTry: 1,
      quizNumTotal: 4,
      quizNum: 0,
      quizCor: null,
      quizCorTotal: null,
      quizAns: [2, 1, 2, 3],

      // screen parameters
      instructScreen: true,
      instructNum: 1, //start from 1
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
    this.handleNextResp = this.handleNextResp.bind(this);
    this.handleQuizResp = this.handleQuizResp.bind(this);
    this.instructText = this.instructText.bind(this);
    this.quizText = this.quizText.bind(this);
    //////////////////////////////////////////////////////////////////////////////////////////////
    //End constructor props
  }

  // This handles instruction screen within the component USING KEYBOARD
  handleInstruct(keyPressed) {
    var curInstructNum = this.state.instructNum;
    var whichButton = keyPressed;

    if (whichButton === 1 && curInstructNum >= 2 && curInstructNum <= 5) {
      // from page 2 to 5, I can move back a page
      this.setState({ instructNum: curInstructNum - 1 });
    } else if (
      whichButton === 2 &&
      curInstructNum >= 1 &&
      curInstructNum <= 4
    ) {
      // from page 1 to 4, I can move forward a page
      this.setState({ instructNum: curInstructNum + 1 });
    } else if (
      whichButton === 1 &&
      curInstructNum >= 7 &&
      curInstructNum <= 9
    ) {
      // from page 7 to 10, I can move back a page
      this.setState({ instructNum: curInstructNum - 1 });
    } else if (
      whichButton === 2 &&
      curInstructNum >= 6 &&
      curInstructNum <= 8
    ) {
      // from page 6 to 9, I can move forward a page
      this.setState({ instructNum: curInstructNum + 1 });
    }
  }

  handleBegin(keyPressed) {
    var curInstructNum = this.state.instructNum;
    var whichButton = keyPressed;
    if (whichButton === 3 && curInstructNum === 5) {
      setTimeout(
        function () {
          this.tutorBegin();
        }.bind(this),
        0
      );
    } else if (whichButton === 3 && curInstructNum === 9) {
      setTimeout(
        function () {
          this.quizBegin();
        }.bind(this),
        0
      );
    } else if (whichButton === 3 && curInstructNum === 10) {
      setTimeout(
        function () {
          this.redirectToNextTask();
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

  handleNextResp(keyPressed, timePressed) {
    var whichButton = keyPressed;
    if (whichButton === 3) {
      document.removeEventListener("keydown", this._handleNextRespKey);
      setTimeout(
        function () {
          this.renderTutorSave();
        }.bind(this),
        0
      );
    }
  }

  handleQuizResp(keyPressed, timePressed) {
    var quizNum = this.state.quizNum;
    var whichButton = keyPressed;
    var quizCorTotal = this.state.quizCorTotal;
    var quizCor;

    // calculate if quiz was correct or not
    if (whichButton === this.state.quizAns[quizNum - 1]) {
      quizCorTotal = quizCorTotal + 1;
      quizCor = 1;
      this.setState({
        quizCor: quizCor,
        quizCorTotal: quizCorTotal,
        quizTime: timePressed,
      });
    } else {
      quizCor = 0;
      this.setState({
        quizCor: quizCor,
        quizTime: timePressed,
      });
    }

    console.log("Keypress: " + whichButton);
    console.log("QuizNum: " + quizNum);
    console.log("QuizCor: " + quizCor);
    console.log("QuizCorTotal: " + quizCorTotal);
    console.log("QuizAns: " + this.state.quizAns);
    console.log("quizNumTotal: " + this.state.quizNumTotal);

    setTimeout(
      function () {
        this.renderQuizSave();
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

  // handle key keyPressed
  _handleNextRespKey = (event) => {
    var keyPressed;
    var timePressed;
    switch (event.keyCode) {
      case 32:
        //    this is spacebar
        keyPressed = 3;
        timePressed = Math.round(performance.now());
        this.handleNextResp(keyPressed, timePressed);
        break;
      default:
    }
  };

  handleCallbackConf(callBackValue) {
    this.setState({ confValue: callBackValue });
  }

  // handle key keyPressed
  _handleQuizKey = (event) => {
    var keyPressed;
    var timePressed;

    switch (event.keyCode) {
      case 49:
        keyPressed = 1;
        timePressed = Math.round(performance.now());
        this.handleQuizResp(keyPressed, timePressed);
        break;
      case 50:
        keyPressed = 2;
        timePressed = Math.round(performance.now());
        this.handleQuizResp(keyPressed, timePressed);
        break;
      case 51:
        keyPressed = 3;
        timePressed = Math.round(performance.now());
        this.handleQuizResp(keyPressed, timePressed);
        break;
      case 52:
        keyPressed = 4;
        timePressed = Math.round(performance.now());
        this.handleQuizResp(keyPressed, timePressed);
        break;
      default:
    }
  };

  // To ask them for the valence rating of the noises
  // before we start the task
  instructText(instructNum) {
    let quizFeedback1;
    let quizFeedback2;

    if (this.state.quizTry > 1) {
      quizFeedback1 =
        "You scored " +
        this.state.quizCorTotal +
        "/4 correctly. Please read the instructions carefully.";
      quizFeedback2 =
        "Your task is to choose the battery card with the higher charge level, i.e., more number of white dots.";
    } else {
      quizFeedback1 = "Well done!";
      quizFeedback2 =
        "You saw that choosing the battery card with the higher charge level, i.e., more number of white dots was the correct answer.";
    }

    let instruct_text1 = (
      <div>
        <span>
          Welcome to spaceship, engineer!
          <br /> <br />
          The ship has been running low on power, and we are glad you are here
          to help.
          <br /> <br />
          As the engineer, we need you to replace the battery cards fueling the
          spaceship. However, the new battery cards have different charge levels
          - we need your assistance in selecting the ones with{" "}
          <strong>high charge</strong> for use.
          <br /> <br />
          <center>
            Use the ← and → keys to navigate the pages.
            <br />
            <br />[<strong>→</strong>]
          </center>
        </span>
        <span className={style.astro}>
          <img src={this.state.astrodude} width={280} alt="astrodude" />
        </span>
      </div>
    );

    let instruct_text2 = (
      <div>
        <span>A battery card looks like this:</span>
        <br />
        <br />
        <span>
          <center>
            <DrawDotsEx.DrawDotsEx1
              dotRadius={this.state.dotRadius}
              dotDiff={80}
            />
          </center>
        </span>
        <br />
        <span>
          The white dots indicate the charge level of the battery card. The more
          white dots on the card, the higher the charge.
          <br />
          <br />
          <center>
            [<strong>←</strong>] [<strong>→</strong>]
          </center>
        </span>
      </div>
    );

    let instruct_text3 = (
      <div>
        <span>
          As there are many new battery cards to go through, we will show you
          two cards at one time. You will have to choose the battery card which
          has <strong>the higher charge</strong>, i.e., the one with{" "}
          <strong>more white dots</strong>.
        </span>
        <br />
        <br />
        <span>
          <center>
            For instance:
            <br />
            <br />
            <DrawDotsEx.DrawDotsEx2
              dotRadius={this.state.dotRadius}
              dotDiffLeft={0}
              dotDiffRight={100}
            />
          </center>
        </span>
        <br />
        <br />
        <span>
          The battery card on the <strong>right</strong> has a higher charge
          than the battery card on the left - this is the card you should
          select.
          <br />
          <br />
          <center>
            [<strong>←</strong>] [<strong>→</strong>]
          </center>
        </span>
      </div>
    );

    let instruct_text4 = (
      <div>
        <span>
          You can select the battery card of your choice with a keypress.
          <br />
          <br />
          If the battery card on the <strong>left</strong> has more charge,{" "}
          <strong>press W</strong>.
          <br />
          If the battery card on the <strong>right</strong> has more charge,{" "}
          <strong>press O</strong>.
          <br />
          <br />
          Your selected battery card will be outlined in{" "}
          <font color="#87C1FF">
            <strong>light blue</strong>
          </font>
          . Please respond quickly and to the best of your ability - the
          spaceship&apos;s power depends on it!
          <br />
          <br />
          Let&apos;s start with a practice. In this phase we will tell you
          whether your choices are right or wrong.
          <br />
          <br />
          If you are <strong>correct</strong>, the card that you selected will
          have its outline turn{" "}
          <font color="green">
            <strong>green</strong>
          </font>
          .
          <br />
          <br />
          If you are <strong>incorrect</strong>, the box that you selected will
          have its outline turn{" "}
          <font color="red">
            <strong>red</strong>
          </font>
          .
          <br />
          <br />
          <center>
            [<strong>←</strong>] [<strong>→</strong>]
          </center>
        </span>
      </div>
    );

    let instruct_text5 = (
      <div>
        <span>
          You will have {this.state.trialNumTotal} chances to choose the battery
          card with the higher charge.
          <br />
          <br />
          For every choice, you will be presented with a white cross in the
          middle of the screen first before the battery cards appear. Please pay
          attention closely as the charge level indicator (white dots) of the
          battery cards will be <strong>flashed quickly only once</strong>. Make
          your selection{" "}
          <strong>after the charge level indicator disappears</strong>
          .
          <br />
          <br />
          As a reminder:
          <br />
          <br />
          <strong>Press W</strong> to choose the battery on the{" "}
          <strong>left</strong>.
          <br />
          <strong>Press O</strong> to choose the battery on the{" "}
          <strong>right</strong>.
          <br />
          <br />
          <center>
            Press [<strong>SPACEBAR</strong>] to begin the practice.
          </center>
          <br />
          <center>
            [<strong>→</strong>]
          </center>
        </span>
      </div>
    );

    let instruct_text6 = (
      <div>
        <span>
          {quizFeedback1}
          <br />
          <br />
          {quizFeedback2}
          <br />
          <br />
          During the main task, you will also have to indicate your{" "}
          <strong>confidence</strong> in your choice of the battery card you
          pick.
          <br />
          <br />
          After every choice, we will show you a rating scale to rate the{" "}
          <strong>probability that your choice was correct</strong>:
          <br />
          <br />
          <br />
          <br />
          <center>
            <ConfSliderEx.ConfSliderEx1
              callBackValue={this.handleCallbackConf.bind(this)}
              initialValue={68}
            />
          </center>
          <br />
          <br />
          <br />
          <center>
            Use the ← and → keys to navigate the pages.
            <br />
            <br />[<strong>→</strong>]
          </center>
        </span>
      </div>
    );

    let instruct_text7 = (
      <div>
        If you are <strong>very unsure</strong> that you made a correct
        judgement, you should select a 50% chance of being correct, or the{" "}
        <strong>left</strong> end of the scale. It means that your choice was a
        complete guess.
        <br />
        <br />
        <br />
        <br />
        <center>
          <ConfSliderEx.ConfSliderEx1
            callBackValue={this.handleCallbackConf.bind(this)}
            initialValue={50}
          />
        </center>
        <br />
        <br />
        <br />
        If you are <strong>very sure</strong> that you made a correct judgement,
        you should select a 100% chance of being correct, or the{" "}
        <strong>right</strong> end of the scale. It means that you are
        absolutely certain that your choice was correct.
        <br />
        <br />
        <br />
        <br />
        <center>
          <ConfSliderEx.ConfSliderEx1
            callBackValue={this.handleCallbackConf.bind(this)}
            initialValue={100}
          />
        </center>
        <br />
        <br />
        <br />
        <br />
        <center>
          [<strong>←</strong>] [<strong>→</strong>]
        </center>
      </div>
    );

    let instruct_text8 = (
      <div>
        If you are <strong>somewhat sure</strong> that you made a correct
        judgement, you should select a rating between the two ends of the scale.
        <br />
        <br />
        <br />
        <br />
        <center>
          <ConfSliderEx.ConfSliderEx1
            callBackValue={this.handleCallbackConf.bind(this)}
            initialValue={74}
          />
        </center>
        <br />
        <br />
        <br />
        <br />
        You can use the slider by clicking any point along the scale, or
        dragging the circle indicator along the scale. You can try it out for
        yourself above.
        <br />
        <br />
        During the main task, once you have selected your rating, you will have
        to press the [<strong>SPACEBAR</strong>] to confirm it and move on to
        the next set of battery cards.
        <br />
        <br />
        <center>
          [<strong>←</strong>] [<strong>→</strong>]
        </center>
      </div>
    );

    let instruct_text9 = (
      <div>
        Before you begin, you have to pass a quick quiz to make sure that you
        have understood the key points of your task for today.
        <br />
        <br />
        Note: You will have to get <strong>all</strong> quiz questions correct.
        If not, you be sent back to the instructions and will have to retake the
        quiz!
        <br />
        <br />
        <center>
          Press [<strong>SPACEBAR</strong>] to begin the quiz.
        </center>
        <br />
        <center>
          [<strong>←</strong>]
        </center>
      </div>
    );

    let instruct_text10 = (
      <div>
        Amazing! You scored 4/4 for the quiz.
        <br />
        <br />
        You are ready to start the main task.
        <br />
        <br />
        <center>
          Press [<strong>SPACEBAR</strong>] to begin.
        </center>
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
      case 5:
        return <div>{instruct_text5}</div>;
      case 6:
        return <div>{instruct_text6}</div>;
      case 7:
        return <div>{instruct_text7}</div>;
      case 8:
        return <div>{instruct_text8}</div>;
      case 9:
        return <div>{instruct_text9}</div>;
      case 10:
        return <div>{instruct_text10}</div>;
      default:
    }
  }

  // To ask them for the valence rating of the noises
  // before we start the task
  quizText(quizNum) {
    let quiz_text1 = (
      <div>
        <strong>Q{this.state.quizNum}:</strong> You are shown two battery cards
        to inspect. What do you do?
        <br />
        <br />
        [1] - I choose the battery card with the lower number of dots.
        <br />
        [2] - I choose the battery card with the higher number of dots.
        <br />
        [3] - I choose both battery cards when they have same number of dots.
        <br />
        [4] - I am unsure.
      </div>
    );

    let quiz_text2 = (
      <div>
        <strong>Q{this.state.quizNum}:</strong> You have made your choice on the
        battery card with the higher charge. However, you are{" "}
        <strong>very unsure</strong> about your choice. How would you rate your
        confidence on the rating scale?
        <br />
        <br />
        [1] - I would pick the left end of the scale (50% correct).
        <br />
        [2] - I would pick the right end of the scale (100% correct).
        <br />
        [3] - I would pick somwhere in between the ends of the scale.
        <br />
        [4] - I am unsure.
      </div>
    );

    let quiz_text3 = (
      <div>
        <strong>Q{this.state.quizNum}:</strong> On the next set of battery
        cards, you are <strong>very sure</strong> about your choice. How would
        you rate your confidence on the rating scale?
        <br />
        <br />
        [1] - I would pick the left end of the scale (50% correct).
        <br />
        [2] - I would pick the right end of the scale (100% correct).
        <br />
        [3] - I would pick somwhere in between the ends of the scale.
        <br />
        [4] - I am unsure.
      </div>
    );

    let quiz_text4 = (
      <div>
        <strong>Q{this.state.quizNum}:</strong> On the next set of battery
        cards, you are <strong>somewhat sure</strong> about your choice. How
        would you rate your confidence on the rating scale?
        <br />
        <br />
        [1] - I would pick the left end of the scale (50% correct).
        <br />
        [2] - I would pick the right end of the scale (100% correct).
        <br />
        [3] - I would pick somwhere in between the ends of the scale.
        <br />
        [4] - I am unsure.
      </div>
    );

    switch (quizNum) {
      case 1:
        return <div>{quiz_text1}</div>;
      case 2:
        return <div>{quiz_text2}</div>;
      case 3:
        return <div>{quiz_text3}</div>;
      case 4:
        return <div>{quiz_text4}</div>;
      default:
    }
  }

  tutorBegin() {
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

  tutorEnd() {
    // remove access to left/right/space keys for the instructions
    //  document.removeEventListener("keyup", this._handleRespKey);
    // change state to make sure the screen is changed for the task
    this.setState({
      instructScreen: true,
      taskScreen: false,
      instructNum: 6,
      taskSection: null,
    });
  }

  quizBegin() {
    // remove access to left/right/space keys for the instructions
    document.removeEventListener("keydown", this._handleInstructKey);
    document.removeEventListener("keydown", this._handleBeginKey);
    document.addEventListener("keydown", this._handleQuizKey);

    // If I want to shuffle quiz answers?

    this.setState({
      instructScreen: false,
      taskScreen: true,
      taskSection: "quiz",
      quizNum: 1,
      quizCorTotal: 0,
      quizCor: null,
    });
  }

  quizreset() {
    var quizNum = this.state.quizNum;
    var quizCorTotal = this.state.quizCorTotal;

    if (quizNum < this.state.quizNumTotal) {
      //go to next quiz qn
      this.setState({
        quizNum: quizNum + 1,
      });
    } else if (quizNum === this.state.quizNumTotal) {
      document.removeEventListener("keydown", this._handleQuizKey);
      //end quiz, head back to instructions

      //if full marks
      if (quizCorTotal === this.state.quizNumTotal) {
        console.log("PASS QUIZ");
        this.setState({
          instructScreen: true,
          taskScreen: false,
          instructNum: 10,
          taskSection: "instruct",
        });
      } else {
        //if they got one wrong
        console.log("fAIL QUIZ");
        var quizTry = this.state.quizTry + 1;
        this.setState({
          instructScreen: true,
          taskScreen: false,
          instructNum: 6,
          taskSection: "instruct",
          quizTry: quizTry,
        });
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  // FOUR COMPONENTS OF THE TASK, Fixation, Stimulus/Response, Feedback and Confidence
  trialReset() {
    var trialNum = this.state.trialNum + 1; //trialNum is 0, so it starts from 1
    var stimPos = this.state.stimPosList[trialNum - 1]; //shuffle the order for the dotDiffLeft

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
      taskSection: "iti",
      trialNum: trialNum,
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

    console.log(this.state.trialNum);
    console.log(this.state.trialNumTotal);

    if (trialNum < this.state.trialNumTotal + 1) {
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
          this.tutorEnd();
        }.bind(this),
        0
      );
    }
  }

  renderFix() {
    var trialTime = Math.round(performance.now());

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
        this.renderCorFb();
      }.bind(this),
      this.state.respFbTimeLag
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  renderCorFb() {
    document.addEventListener("keydown", this._handleNextRespKey);

    var rewFbTime =
      Math.round(performance.now()) -
      [
        this.state.trialTime +
          this.state.fixTime +
          this.state.stimTime +
          this.state.respTime +
          this.state.respFbTime,
      ];

    this.setState({
      instructScreen: false,
      taskScreen: true,
      taskSection: "corFeedback",
      rewFbTime: rewFbTime,
    });
  }

  renderTutorSave() {
    var userID = this.state.userID;

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime,
      trialTime: this.state.trialTime,
      trialNum: this.state.trialNum,
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
    };

    // try {
    //   fetch(`${DATABASE_URL}/tutorial_data/` + userID, {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(saveString),
    //   });
    // } catch (e) {
    //   console.log("Cant post?");
    // }

    setTimeout(
      function () {
        this.trialReset();
      }.bind(this),
      10
    );
  }

  renderQuizSave() {
    var userID = this.state.userID;
    var userID = this.state.userID;

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime,

      //quiz paramters
      quizTry: this.state.quizTry,
      quizTime: this.state.quizTime,
      quizNumTotal: this.state.quizNumTotal,
      quizNum: this.state.quizNum,
      quizCor: this.state.quizCor,
      quizCorTotal: this.state.quizCorTotal,
    };

    //    try {
    //      fetch(`${DATABASE_URL}/quiz_data/` + userID, {
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

    setTimeout(
      function () {
        this.quizreset();
      }.bind(this),
      10
    );
  }

  redirectToNextTask() {
    this.props.navigate("/MetaPerTask", {
      state: {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,
        dotStair1: this.state.dotStair1,
        dotStair2: this.state.dotStair2,
      },
    });

    console.log("UserID is: " + this.state.userID);
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
        this.state.taskSection === "corFeedback"
      ) {
        text = (
          <div className={style.boxStyle}>
            <DrawCorFeedback.DrawFeedback
              choice={this.state.choice}
              correct={this.state.correct}
            />
          </div>
        );
      } else if (
        this.state.instructScreen === false &&
        this.state.taskScreen === true &&
        this.state.taskSection === "quiz"
      ) {
        text = (
          <div>
            {this.quizText(this.state.quizNum)}
            <br />
            <br />
            <center>Please use the top row number keys to respond.</center>
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

export default withRouter(MetaPerTut);
