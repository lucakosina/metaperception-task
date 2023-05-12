import React from "react";
import * as Consent from "survey-react";
import "../../node_modules/survey-react/survey.css";
import "./style/surveyStyle.css";
import withRouter from "./withRouter";

//import { json } from "./consent/consent.js"; //short for debugging
import { json } from "./consent/consentFull.js";

class StartPage extends React.Component {
  constructor(props) {
    super(props);

    // Get data and time
    var dateTime = new Date().toLocaleString();

    var currentDate = new Date(); // maybe change to local
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = date + "-" + (month + 1) + "-" + year;
    var timeString = currentDate.toTimeString();

    var userID = Math.floor(100000 + Math.random() * 900000);
    var condition = 0;

    
    const prolificID = this.props.state.prolificID;

    // Set state
    this.state = {
      userID: userID,
      prolificID: prolificID,
      condition: condition,
      date: dateString,
      dateTime: dateTime,
      startTime: timeString,
      consentComplete: 0,
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
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto";
  }

  redirectToTarget() {
    this.setState({
      consentComplete: 1,
    });

    //On click consent, sent to tutorial page with the props
    this.props.navigate("/MetaPerTut?PROLIFIC_PID=" + this.state.prolificID, {
      state: {
        prolificID: this.state.prolificID,
        condition:this.state.condition,
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,
        memCorrectPer: 0,
        perCorrectPer: 0,
      },
    });
  }

  render() {
    Consent.StylesManager.applyTheme("default");

    if (this.state.consentComplete === 0) {
      return (
        <div className="textBox">
          <center>
            <strong>INFORMATION FOR THE PARTICIPANT</strong>
          </center>
          <br />
          Please read this information page carefully. If you are happy to
          proceed, please check the boxes on the second page of this form to
          consent to this study proceeding. Please note that you cannot proceed
          to the study unless you give your full consent.
          <br />
          <br />
          <Consent.Survey
            json={json}
            showCompletedPage={false}
            onComplete={this.redirectToTarget}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default withRouter(StartPage);
