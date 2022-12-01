import React from "react";
import withRouter from "./withRouter.js";
import * as Quest from "survey-react";
import "survey-react/survey.css";
import style from "./style/taskStyle.module.css";
import * as utils from "./utils.js";
//import { DATABASE_URL } from "./config";

import "./style/questStyle.css";

//also need to add self esteem questionnaire

class Questionnaires extends React.Component {
  constructor(props) {
    super(props);

    //  const userID = this.props.state.userID;
    //  const date = this.props.state.date;
    //  const startTime = this.props.state.startTime;

    //when deug
    const userID = 100;
    const date = 100;
    const startTime = 100;

    var currentTime = Math.round(performance.now());

    this.state = {
      userID: userID,
      date: date,
      startTime: startTime,
      resultAsString: {},

      qnStart: currentTime,
      qnTime: currentTime,
      qnTotal: 9,
      quizLabel: [
        "AES",
        "AUDIT",
        "BIS11",
        "EAT26",
        "LSAS",
        "OCIR",
        "SDS",
        "SSMS",
        "STAIY2",
      ],
      qnText1: [],
      qnText2: [],
      qnText3: [],
      qnText4: [],
      qnText5: [],
      qnText6: [],
      qnText7: [],
      qnText8: [],
      qnText9: [],

      instructScreen: true,
      questScreen: false,
      debug: false,
    };
  }

  //Define a callback methods on survey complete
  onComplete(survey, options) {
    // //Write survey results into database

    var quizText = "IQ_image";
    var quizPgFinish = "PgFinish_" + quizText;
    var quizRT = "PgRT_" + quizText;

    var qnTime = Math.round(performance.now());
    var qnRT = qnTime - this.state.qnTime;
    survey.setValue(quizPgFinish, qnTime);
    survey.setValue(quizRT, qnRT);

    var qnEnd = Math.round(performance.now());
    var userID = this.state.userID;
    survey.setValue("userID", userID);
    survey.setValue("date", this.state.date);
    survey.setValue("startTime", this.state.startTime);
    survey.setValue("qnTimeStart", this.state.qnStart);
    survey.setValue("qnTimeEnd", qnEnd);

    var resultAsString = JSON.stringify(survey.data);
    //
    // console.log("resultAsString", resultAsString);

    //    fetch(`${DATABASE_URL}/psych_quiz/` + userID, {
    //      method: "POST",
    //      headers: {
    //        Accept: "application/json",
    //        "Content-Type": "application/json",
    //      },
    //      body: resultAsString,
    //    });

    this.setState({
      resultAsString: resultAsString,
    });
    // console.log("userID: " + userID);
    // console.log("Survey results: " + JSON.stringify(survey.data));
  }

  startQuest() {
    this.setState({ questScreen: true, instructScreen: false });

    setTimeout(
      function () {
        this.shuffleQuest();
      }.bind(this),
      10
    );
  }

  timerCallback(survey) {
    var page = survey.pages.indexOf(survey.currentPage);
    let quizText;
    //CHECK THIS!!!
    if (page === 0) {
      quizText = "intro";
    } else if (page === 1) {
      quizText = "demo";
    } else if (page === 10) {
      quizText = "IQ_text";
    } else if (page === 11) {
      quizText = "IQ_image";
    } else {
      quizText = this.state.quizLabel[page - 2];
    }

    var questPgFinish = "PgFinish_" + quizText;
    var questRT = "PgRT_" + quizText;
    var qnTime = Math.round(performance.now());
    var qnRT = qnTime - this.state.qnTime;
    survey.setValue(questPgFinish, qnTime);
    survey.setValue(questRT, qnRT);

    this.setState({ qnTime: qnTime });
  }

  redirectToNextTask() {
    document.removeEventListener("keyup", this._handleInstructKey);
    document.removeEventListener("keyup", this._handleDebugKey);
    this.props.navigate("/EndPage", {
      state: {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,
      },
    });
  }

  shuffleQuest() {
    let ocir = {
      type: "matrix",
      name: "OCIR",
      isAllRowRequired: true,
      title:
        "Please indicate what best describes HOW MUCH each experience has DISTRESSED or BOTHERED you during the PAST MONTH. (Please make sure to scroll down within the questionnaire box.)",
      columns: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "A little" },
        { value: 2, text: "Moderately" },
        { value: 3, text: "A lot" },
        { value: 4, text: "Extremely" },
      ],
      rows: [
        {
          value: "OCIR_1",
          text: "I have saved up so many things that they get in the way.",
        },
        {
          value: "OCIR_2",
          text: "I check things more often than necessary.",
        },
        {
          value: "OCIR_3",
          text: "I get upset if objects are not arranged properly.",
        },
        {
          value: "OCIR_4",
          text: "I feel compelled to count while I am doing things.",
        },
        {
          value: "OCIR_5",
          text:
            "I find it difficult to touch an object when I know it has been touched by strangers or certain people.",
        },
        {
          value: "OCIR_6",
          text: "I find it difficult to control my own thoughts.",
        },
        { value: "OCIR_7", text: "I collect things I don’t need." },
        {
          value: "OCIR_8",
          text: "I repeatedly check doors, windows, drawers, etc.",
        },
        {
          value: "OCIR_9",
          text: "I get upset if others change the way I have arranged things.",
        },

        {
          value: "CHECK_1",
          text: "Demonstrate your attention by selecting 'A lot'. ",
        },

        {
          value: "OCIR_10",
          text: "I feel I have to repeat certain numbers.",
        },
        {
          value: "OCIR_11",
          text:
            "I sometimes have to wash or clean myself simply because I feel contaminated.",
        },
        {
          value: "OCIR_12",
          text:
            "I am upset by unpleasant thoughts that come into my mind against my will.",
        },
        {
          value: "OCIR_13",
          text:
            "I avoid throwing things away because I am afraid I might need them later.",
        },
        {
          value: "OCIR_14",
          text:
            "I repeatedly check gas and water taps and light switches after turning them off.",
        },
        {
          value: "OCIR_15",
          text: "I need things to be arranged in a particular way.",
        },
        {
          value: "OCIR_16",
          text: "I feel that there are good and bad numbers.",
        },
        {
          value: "OCIR_17",
          text: "I wash my hands more often and longer than necessary.",
        },
        {
          value: "OCIR_18",
          text:
            "I frequently get nasty thoughts and have difficulty in getting rid of them.",
        },
      ],
    };

    let staiy2 = {
      type: "matrix",
      name: "STAIY2",
      isAllRowRequired: true,
      title:
        "Read each statement and then indicate how you GENERALLY feel. There is no right or wrong answer. Do not spend too much time on any one statement but give the answer which seems to describe how you GENERALLY feel. (Please make sure to scroll down within the questionnaire box.)",
      columns: [
        { value: 1, text: "Almost Never" },
        { value: 2, text: "Sometimes" },
        { value: 3, text: "Often" },
        { value: 4, text: "Almost Always" },
      ],
      rows: [
        { value: "STAI_21", text: "I feel pleasant." },
        { value: "STAI_22", text: "I feel nervous and restless." },
        { value: "STAI_23", text: "I feel satisfied with myself." },
        {
          value: "STAI_24",
          text: "I wish I could be as happy as others seem to be.",
        },
        { value: "STAI_25", text: "I feel like a failure." },
        { value: "STAI_26", text: "I feel rested." },
        { value: "STAI_27", text: "I am calm, cool, and collected." },
        {
          value: "STAI_28",
          text:
            "I feel that difficulties are piling up so that I cannot overcome them.",
        },
        {
          value: "STAI_29",
          text: "I worry too much over something that really doesn’t matter.",
        },
        { value: "STAI_30", text: "I am happy." },
        { value: "STAI_31", text: "I have disturbing thoughts." },
        { value: "STAI_32", text: "I lack self confidence." },
        { value: "STAI_33", text: "I feel secure." },
        { value: "STAI_34", text: "I make decisions easily." },
        { value: "STAI_35", text: "I feel inadequate." },
        { value: "STAI_36", text: "I am content." },
        {
          value: "STAI_37",
          text: "Some unimportant thoughts run through my mind and bother me.",
        },
        {
          value: "STAI_38",
          text:
            "I take disappointments so keenly that I can’t put them out of my mind.",
        },
        { value: "STAI_39", text: "I am a steady person." },
        {
          value: "STAI_40",
          text:
            "I get in a state of tension or turmoil as I think over my recent concerns and interests.",
        },
      ],
    };

    let bis11 = {
      type: "matrix",
      name: "BIS11",
      isAllRowRequired: true,
      title:
        "People differ in the ways they act and think in different situations. This is a test to measure some of the ways in which you act and think. Read each statement and select the answer that DESCRIBES YOU BEST. Do not spend too much time on any statement. Answer quickly and honestly. (Please make sure to scroll down within the questionnaire box.)",
      columns: [
        { value: 1, text: "Do not agree at all" },
        { value: 2, text: "Agree slightly" },
        { value: 3, text: "Agree a lot" },
        { value: 4, text: "Agree completely" },
      ],
      rows: [
        { value: "BIS_1", text: "I plan tasks carefully." },
        { value: "BIS_2", text: "I do things without thinking." },
        { value: "BIS_3", text: "I make-up my mind quickly." },
        { value: "BIS_4", text: "I am happy-go-lucky." },
        { value: "BIS_5", text: "I don’t 'pay attention'." },
        { value: "BIS_6", text: "I have 'racing' thoughts." },
        { value: "BIS_7", text: "I plan trips well ahead of time." },
        { value: "BIS_8", text: "I am self controlled." },
        { value: "BIS_9", text: "I concentrate easily." },
        { value: "BIS_10", text: "I save regularly." },
        { value: "BIS_11", text: "I 'squirm' at plays or lectures." },
        { value: "BIS_12", text: "I am a careful thinker." },
        { value: "BIS_13", text: "I plan for job security." },
        { value: "BIS_14", text: "I say things without thinking." },
        { value: "BIS_15", text: "I like to think about complex problems." },
        { value: "BIS_16", text: "I change jobs." },
        { value: "BIS_17", text: "I act 'on impulse'." },
        {
          value: "BIS_18",
          text: "I get easily bored when solving thought problems.",
        },
        { value: "BIS_19", text: "I act on the spur of the moment." },
        { value: "BIS_20", text: "I am a steady thinker." },
        { value: "BIS_21", text: "I change residences." },
        { value: "BIS_22", text: "I buy things on impulse." },
        {
          value: "BIS_23",
          text: "I can only think about one thing at a time.",
        },
        { value: "BIS_24", text: "I change hobbies." },
        { value: "BIS_25", text: "I spend or charge more than I earn." },
        {
          value: "BIS_26",
          text: "I often have extraneous thoughts when thinking.",
        },
        {
          value: "BIS_27",
          text: "I am more interested in the present than the future.",
        },
        { value: "BIS_28", text: "I am restless at the theater or lectures." },
        { value: "BIS_29", text: "I like puzzles." },
        { value: "BIS_30", text: "I am future oriented." },
      ],
    };

    let sds = {
      type: "matrix",
      name: "SDS",
      isAllRowRequired: true,
      title:
        "Please read the following statements and then select the option that best describes how often you FELT OR BEHAVED this way during the PAST SEVERAL DAYS. (Please make sure to scroll down within the questionnaire box.)",
      columns: [
        { value: 1, text: "A little of the time" },
        { value: 2, text: "Some of the time" },
        { value: 3, text: "Good part of the time" },
        { value: 4, text: "Most of the time" },
      ],
      rows: [
        { value: "SDS_1", text: "I feel down-hearted and blue." },
        { value: "SDS_2", text: "Morning is when I feel the best." },
        { value: "SDS_3", text: "I have crying spells or feel like it." },
        { value: "SDS_4", text: "I have trouble sleeping at night." },
        { value: "SDS_5", text: "I eat as much as I used to." },
        { value: "SDS_6", text: "I still enjoy sex." },
        { value: "SDS_7", text: "I notice that I am losing weight." },
        { value: "SDS_8", text: "I have trouble with constipation." },
        { value: "SDS_9", text: "My heart beats faster than normal." },
        { value: "SDS_10", text: "I get tired for no reason." },
        { value: "SDS_11", text: "My mind is as clear as it used to be." },
        {
          value: "SDS_12",
          text: "I find it easy to do the things I used to do.",
        },
        { value: "SDS_13", text: "I am restless and can't keep still." },
        { value: "SDS_14", text: "I feel hopeful about the future." },
        { value: "SDS_15", text: "I am more irritable than usual." },
        { value: "SDS_16", text: "I find it easy to make decisions." },
        { value: "SDS_17", text: "I feel that I am useful and needed." },
        {
          value: "SDS_18",
          text: "My life is pretty full.",
        },
        {
          value: "SDS_19",
          text: "I feel that others would be better off if I were dead.",
        },
        { value: "SDS_20", text: "I still enjoy the things I used to do." },
      ],
    };

    let audit = [
      {
        type: "radiogroup",
        name: "AUDIT_1",
        isRequired: true,
        title: "How often do you have a drink containing alcohol?",
        //colCount: 4,
        choices: [
          { value: 0, text: "Never" },
          { value: 1, text: "Monthly or less" },
          { value: 2, text: "Two to four times a month" },
          { value: 3, text: "Two to three times a week" },
          { value: 4, text: "Four or more times a week" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_2",
        isRequired: true,
        title:
          "How many drinks containing alcohol do you have on a typical day when you are drinking?",
        choices: [
          { value: 0, text: "1 or 2" },
          { value: 1, text: "3 or 4" },
          { value: 2, text: "5 or 6" },
          { value: 3, text: "7 or 9" },
          { value: 4, text: "10 or more" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_3",
        isRequired: true,
        title: "How often do you have six or more drinks on one occasion?",
        choices: [
          { value: 0, text: "Never" },
          { value: 1, text: "Less than monthly" },
          { value: 2, text: "Monthly" },
          { value: 3, text: "Weekly" },
          { value: 4, text: "Daily or almost daily" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_4",
        isRequired: true,
        title:
          "How often during the last year have you found that you were not able to stop drinking once you had started?",
        choices: [
          { value: 0, text: "Never" },
          { value: 1, text: "Less than monthly" },
          { value: 2, text: "Monthly" },
          { value: 3, text: "Weekly" },
          { value: 4, text: "Daily or almost daily" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_5",
        isRequired: true,
        title:
          "How often during the last year have you failed to do what was normally expected from you because of drinking?",
        choices: [
          { value: 0, text: "Never" },
          { value: 1, text: "Less than monthly" },
          { value: 2, text: "Monthly" },
          { value: 3, text: "Weekly" },
          { value: 4, text: "Daily or almost daily" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_6",
        isRequired: true,
        title:
          "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
        choices: [
          { value: 0, text: "Never" },
          { value: 1, text: "Less than monthly" },
          { value: 2, text: "Monthly" },
          { value: 3, text: "Weekly" },
          { value: 4, text: "Daily or almost daily" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_7",
        isRequired: true,
        title:
          "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
        choices: [
          { value: 0, text: "Never" },
          { value: 1, text: "Less than monthly" },
          { value: 2, text: "Monthly" },
          { value: 3, text: "Weekly" },
          { value: 4, text: "Daily or almost daily" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_8",
        isRequired: true,
        title:
          "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
        choices: [
          { value: 0, text: "Never" },
          { value: 1, text: "Less than monthly" },
          { value: 2, text: "Monthly" },
          { value: 3, text: "Weekly" },
          { value: 4, text: "Daily or almost daily" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_9",
        isRequired: true,
        title:
          "Have you or someone else been injured as a result of your drinking?",
        choices: [
          { value: 0, text: "No" },
          { value: 2, text: "Yes, but not in the last year" },
          { value: 4, text: "Yes during the last year" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_10",
        isRequired: true,
        title:
          "Has a relative or friend, or a doctor or other health worker been concerned about your drinking or suggested you cut down?",
        choices: [
          { value: 0, text: "No" },
          { value: 2, text: "Yes, but not in the last year" },
          { value: 4, text: "Yes during the last year" },
        ],
      },

      {
        type: "radiogroup",
        name: "AUDIT_11",
        isRequired: true,
        title: "Do you smoke cigarettes?",
        choices: [
          { value: 0, text: "No" },
          { value: 1, text: "Fewer than 1 stick per day" },
          { value: 2, text: "1-5 sticks per day" },
          { value: 3, text: "5-10 sticks per day" },
          { value: 4, text: "10-20 sticks per day" },
          { value: 5, text: "20-30 sticks per day" },
          { value: 6, text: "More than 30 sticks per day" },
        ],
      },
      {
        type: "radiogroup",
        name: "AUDIT_12",
        isRequired: true,
        title: "Do you vape?",
        choices: [
          { value: 0, text: "No" },
          { value: 1, text: "Yes" },
        ],
      },
      {
        type: "radiogroup",
        name: "AUDIT_13",
        title: "What strength of nicotine do you use?",
        visibleIf: "{AUDIT_12}=1",
        isRequired: true,
        choices: [
          { value: 0, text: "0 mg" },
          { value: 1, text: "1-3 mg" },
          { value: 2, text: "4-6 mg" },
          { value: 3, text: "7-10 mg" },
          { value: 4, text: "11-15 mg" },
          { value: 5, text: "16-20 mg" },
          { value: 7, text: ">20 mg" },
        ],
      },
      {
        type: "radiogroup",
        name: "AUDIT_14",
        title: "How often do you vape?",
        visibleIf: "{AUDIT_12}=1",
        isRequired: true,
        choices: [
          { value: 1, text: "1 to 12 times a year" },
          { value: 2, text: "1 to 4 times a month" },
          { value: 3, text: "More than once a week" },
          { value: 6, text: "Daily" },
        ],
      },
    ];

    let aes = {
      type: "matrix",
      name: "AES",
      isAllRowRequired: true,
      title:
        "For each question, select the answer that best describes your thoughts, feelings, and actions during the past 4 weeks",
      columns: [
        { value: 1, text: "Not at all characteristic" },
        { value: 2, text: "Slightly characteristic" },
        { value: 3, text: "Somewhat characteristic" },
        { value: 4, text: "Very characteristic" },
      ],
      rows: [
        { value: "AES_1", text: "I am interested in things." },
        { value: "AES_2", text: "I get things done during the day." },
        {
          value: "AES_3",
          text: "Getting things started on my own is important to me.",
        },
        { value: "AES_4", text: "I am interested in having new experiences." },
        { value: "AES_5", text: "I am interested in learning new things." },
        { value: "AES_6", text: "I put little effort into anything." },
        { value: "AES_7", text: "I approach life with intensity." },
        {
          value: "AES_8",
          text: "Seeing a job through to the end is important to me.",
        },
        { value: "AES_9", text: "I spend time doing things that interest me." },
        {
          value: "AES_10",
          text: "Someone has to tell me what to do each day.",
        },
        {
          value: "AES_11",
          text: "I am less concerned about my problems than I should be.",
        },
        { value: "AES_12", text: "I have friends." },
        {
          value: "AES_13",
          text: "Getting together with friends is important to me.",
        },
        {
          value: "AES_14",
          text: "When something good happens, I get excited.",
        },
        {
          value: "AES_15",
          text: "I have an accurate understanding of my problems.",
        },
        {
          value: "AES_16",
          text: "Getting things done during the day is important to me.",
        },
        { value: "AES_17", text: "I have initiative." },
        { value: "AES_18", text: "I have motivation." },
      ],
    };

    let eat26 = {
      type: "matrix",
      name: "EAT26",
      isAllRowRequired: true,
      title:
        "For each question, select the answer that best describes your thoughts, feelings, and actions.",
      columns: [
        { value: 1, text: "Never" },
        { value: 2, text: "Rarely" },
        { value: 3, text: "Sometimes" },
        { value: 4, text: "Often" },
        { value: 5, text: "Usually" },
        { value: 6, text: "Always" },
      ],
      rows: [
        { value: "EAT_1", text: "I am terrified about being overweight." },
        { value: "EAT_2", text: "I avoid eating when I am hungry." },
        {
          value: "EAT_3",
          text: "I find myself preoccupied with food.",
        },
        {
          value: "EAT_4",
          text:
            "I have gone on EATing binges where I feel that I may not be able to stop.",
        },
        { value: "EAT_5", text: "I cut my food into small pieces." },
        {
          value: "EAT_6",
          text: "I am aware of the calorie content of foods I eat.",
        },
        {
          value: "EAT_7",
          text: "I particularly avoid foods with high carbohydrate content.",
        },
        {
          value: "EAT_8",
          text: "I feel that others would prefer if I ate more.",
        },
        { value: "EAT_9", text: "I vomit after I have eaten." },
        {
          value: "EAT_10",
          text: "I feel extremely guilty after eating.",
        },
        {
          value: "EAT_11",
          text: "I am preoccupied with a desire to be thinner.",
        },
        {
          value: "EAT_12",
          text: "I think about burning up calories when I exercise.",
        },
        {
          value: "EAT_13",
          text: "Other people think that I am too thin.",
        },
        {
          value: "EAT_14",
          text: "I am preoccupied with the thought of having fat on my body.",
        },
        {
          value: "EAT_15",
          text: "I take longer than others to EAT meals.",
        },
        {
          value: "EAT_16",
          text: "I avoid foods with sugar in them.",
        },

        { value: "EAT_17", text: "I EAT diet foods." },
        { value: "EAT_18", text: "I feel that food controls my life." },
        { value: "EAT_19", text: "I display self-control around food." },
        { value: "EAT_20", text: "I feel that others pressure me to EAT." },
        { value: "EAT_21", text: "I give too much time and thought to food." },
        { value: "EAT_22", text: "I feel uncomfortable after EATing sweets." },
        { value: "EAT_23", text: "I engage in dieting behaviour." },
        { value: "EAT_24", text: "I like my stomach to be empty." },
        { value: "EAT_25", text: "I enjoy trying new rich foods." },
        { value: "EAT_26", text: "I have the impulse to voimit after meals." },
      ],
    };

    let smss = {
      type: "matrix",
      name: "SMSS",
      isAllRowRequired: true,
      title:
        "For each question, select the answer that best describes your thoughts, feelings, and actions.",
      columns: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      rows: [
        {
          value: "LSAS_1",
          text:
            "When in the dark do you often see shapes and forms even though there is nothing there?",
        },
        {
          value: "LSAS_2",
          text:
            "Are your thoughts sometimes so strong that you can almost hear them?",
        },
        {
          value: "LSAS_3",
          text:
            "Have you ever thought that you had special, almost magical powers?",
        },
        {
          value: "LSAS_4",
          text:
            "Have you sometimes sensed an evil presence around you, even though you could not see it?",
        },
        {
          value: "LSAS_5",
          text:
            "Do you think that you could learn to read other's minds if you wanted to?",
        },
        {
          value: "LSAS_6",
          text:
            "When you look in the mirror does your face sometimes seem quite different from usual?",
        },
        {
          value: "LSAS_7",
          text:
            "Do ideas and insights sometimes come to you so fast that you cannot express them all?",
        },
        {
          value: "LSAS_8",
          text:
            "Can some people make you aware of them just by thinking about you?",
        },
        { value: "LSAS_9", text: "I vomit after I have LSASen." },
        {
          value: "LSAS_10",
          text: "I feel extremely guilty after LSASing.",
        },
        {
          value: "LSAS_11",
          text: "I am preoccupied with a desire to be thinner.",
        },
        {
          value: "LSAS_12",
          text: "I think about burning up calories when I exercise.",
        },
        {
          value: "LSAS_13",
          text: "Other people think that I am too thin.",
        },
        {
          value: "LSAS_14",
          text: "I am preoccupied with the thought of having fat on my body.",
        },
        {
          value: "LSAS_15",
          text: "I take longer than others to LSAS meals.",
        },
        {
          value: "LSAS_16",
          text: "I avoid foods with sugar in them.",
        },

        { value: "LSAS_17", text: "I LSAS diet foods." },
        { value: "LSAS_18", text: "I feel that food controls my life." },
        { value: "LSAS_19", text: "I display self-control around food." },
        { value: "LSAS_20", text: "I feel that others pressure me to LSAS." },
        { value: "LSAS_21", text: "I give too much time and thought to food." },
        {
          value: "LSAS_22",
          text: "I feel uncomfortable after LSASing sweets.",
        },
        { value: "LSAS_23", text: "I engage in dieting behaviour." },
        { value: "LSAS_24", text: "I like my stomach to be empty." },
      ],
    };

    let lsas = {
      type: "matrix",
      name: "LSAS",
      isAllRowRequired: true,
      title:
        "For each question, select the answer that best describes your thoughts, feelings, and actions.",
      columns: [
        { value: 1, text: "No" },
        { value: 2, text: "Yes" },
      ],
      rows: [
        {
          value: "LSAS_1",
          text:
            "When in the dark do you often see shapes and forms even though there is nothing there?",
        },
        {
          value: "LSAS_2",
          text:
            "Are your thoughts sometimes so strong that you can almost hear them?",
        },
        {
          value: "LSAS_3",
          text:
            "Have you ever thought that you had special, almost magical powers?",
        },
        {
          value: "LSAS_4",
          text:
            "Have you sometimes sensed an evil presence around you, even though you could not see it?",
        },
        {
          value: "LSAS_5",
          text:
            "Do you think that you could learn to read other's minds if you wanted to?",
        },
        {
          value: "LSAS_6",
          text:
            "When you look in the mirror does your face sometimes seem quite different from usual?",
        },
        {
          value: "LSAS_7",
          text:
            "Do ideas and insights sometimes come to you so fast that you cannot express them all?",
        },
        {
          value: "LSAS_8",
          text:
            "Can some people make you aware of them just by thinking about you?",
        },
        { value: "LSAS_9", text: "I vomit after I have LSASen." },
        {
          value: "LSAS_10",
          text: "I feel extremely guilty after LSASing.",
        },
        {
          value: "LSAS_11",
          text: "I am preoccupied with a desire to be thinner.",
        },
        {
          value: "LSAS_12",
          text: "I think about burning up calories when I exercise.",
        },
        {
          value: "LSAS_13",
          text: "Other people think that I am too thin.",
        },
        {
          value: "LSAS_14",
          text: "I am preoccupied with the thought of having fat on my body.",
        },
        {
          value: "LSAS_15",
          text: "I take longer than others to LSAS meals.",
        },
        {
          value: "LSAS_16",
          text: "I avoid foods with sugar in them.",
        },

        { value: "LSAS_17", text: "I LSAS diet foods." },
        { value: "LSAS_18", text: "I feel that food controls my life." },
        { value: "LSAS_19", text: "I display self-control around food." },
        { value: "LSAS_20", text: "I feel that others pressure me to LSAS." },
        { value: "LSAS_21", text: "I give too much time and thought to food." },
        {
          value: "LSAS_22",
          text: "I feel uncomfortable after LSASing sweets.",
        },
        { value: "LSAS_23", text: "I engage in dieting behaviour." },
        { value: "LSAS_24", text: "I like my stomach to be empty." },
      ],
    };

    var allQuizText = [aes, audit, bis11, ocir, smss, sds, eat26, staiy2, lsas];
    var quizLabel = this.state.quizLabel;

    utils.shuffleSame(allQuizText, quizLabel);

    allQuizText = allQuizText.filter(function (val) {
      return val !== undefined;
    });
    quizLabel = quizLabel.filter(function (val) {
      return val !== undefined;
    });

    this.setState({
      qnText1: allQuizText[0],
      qnText2: allQuizText[1],
      qnText3: allQuizText[2],
      qnText4: allQuizText[3],
      qnText5: allQuizText[4],
      qnText6: allQuizText[5],
      qnText7: allQuizText[6],
      qnText8: allQuizText[7],
      qnText9: allQuizText[8],
      quizLabel: quizLabel,
    });
  }

  handleBegin(key_pressed) {
    var whichButton = key_pressed;
    if (whichButton === 3) {
      setTimeout(
        function () {
          this.startQuest();
        }.bind(this),
        0
      );
    }
  }

  // handle key key_pressed
  _handleBeginKey = (event) => {
    var key_pressed;

    switch (event.keyCode) {
      case 32:
        //    this is sapcebar
        key_pressed = 3;
        this.handleBegin(key_pressed);
        break;
      default:
    }
  };

  useEffect() {
    window.scrollTo(0, 0);
  }

  render() {
    let text;
    if (this.state.debug === false) {
      if (
        this.state.instructScreen === true &&
        this.state.questScreen === false
      ) {
        this.useEffect();
        document.addEventListener("keyup", this._handleBeginKey);
        //intructions
        text = (
          <div className={style.bg}>
            <div className={style.textFrame}>
              <div className={style.fontStyle}>
                <div>
                  For the last section, we would like you to:
                  <br />
                  <br />
                  <li>Provide some demographic information (age and gender)</li>
                  <li>Complete {this.state.qnTotal} questionnaires</li>
                  <li>Complete a short IQ quiz</li>
                  <br />
                  Do read the instructions for each quiz, which will be
                  positioned at the top of each page, carefully.
                  <br />
                  <br />
                  <center>
                    Please press [<strong>SPACEBAR</strong>] to begin.
                  </center>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (
        this.state.instructScreen === false &&
        this.state.questScreen === true
      ) {
        //the quiz
        document.removeEventListener("keyup", this._handleBeginKey);
        Quest.StylesManager.applyTheme("default");

        var myCss = {
          matrix: {
            // root: "table table-striped",
            root: "table sv_q_matrix",
          },
        };

        var json = {
          title: null,
          showProgressBar: "top",
          pages: [
            {
              questions: [
                {
                  type: "dropdown",
                  name: "age",
                  title: "What is your age?",
                  isRequired: true,
                  colCount: 0,
                  choices: [
                    "18",
                    "19",
                    "20",
                    "21",
                    "22",
                    "23",
                    "24",
                    "25",
                    "26",
                    "27",
                    "28",
                    "29",
                    "30",
                    "31",
                    "32",
                    "33",
                    "34",
                    "35",
                    "36",
                    "37",
                    "38",
                    "39",
                    "40",
                    "41",
                    "42",
                    "43",
                    "44",
                    "45",
                    "46",
                    "47",
                    "48",
                    "49",
                    "50",
                    "51",
                    "52",
                    "53",
                    "54",
                    "55",
                  ],
                },
                {
                  type: "dropdown",
                  name: "gender",
                  title: "What is your gender?",
                  isRequired: true,
                  colCount: 0,
                  choices: ["Female", "Male", "Other"],
                },
              ],
            },
            {
              questions: [this.state.qnText1],
            },

            {
              questions: [this.state.qnText2],
            },

            {
              questions: [this.state.qnText3],
            },

            {
              questions: [this.state.qnText4],
            },

            {
              questions: [this.state.qnText5],
            },
            {
              questions: [this.state.qnText6],
            },
            {
              questions: [this.state.qnText7],
            },
            {
              questions: [this.state.qnText8],
            },
            {
              questions: [this.state.qnText9],
            },
            {
              questions: [
                {
                  type: "radiogroup",
                  name: "IQ_1",
                  isRequired: true,
                  title:
                    "What number is one fifth of one fourth of one ninth of 900?",
                  //colCount: 4,
                  choices: [
                    { value: 1, text: "2" },
                    { value: 2, text: "3" },
                    { value: 3, text: "4" },
                    { value: 4, text: "5" },
                    { value: 5, text: "6" },
                    { value: 6, text: "7" },
                  ],
                },

                {
                  type: "radiogroup",
                  name: "IQ_2",
                  isRequired: true,
                  title:
                    "Zach is taller than Matt and Richard is shorter than Zach. Which of the following statements would be the most accurate?",
                  choices: [
                    { value: 1, text: "Richard is taller than Matt" },
                    { value: 2, text: "Richard is shorter than Matt" },
                    { value: 3, text: "Richard is as tall as Matt" },
                    { value: 4, text: "It's impossible to tell" },
                  ],
                },

                {
                  type: "radiogroup",
                  name: "IQ_3",
                  isRequired: true,
                  title:
                    "Joshua is 12 years old and his sister is three times as old as he. When Joshua is 23 years old, how old will his sister be?",
                  choices: [
                    { value: 1, text: "25" },
                    { value: 2, text: "39" },
                    { value: 3, text: "44" },
                    { value: 4, text: "47" },
                    { value: 5, text: "53" },
                  ],
                },

                {
                  type: "radiogroup",
                  name: "IQ_4",
                  isRequired: true,
                  title:
                    "If the day after tomorrow is two days before Thursday then what day is it today?",
                  choices: [
                    { value: 1, text: "Friday" },
                    { value: 2, text: "Monday" },
                    { value: 3, text: "Wednesday" },
                    { value: 4, text: "Saturday" },
                    { value: 5, text: "Tuesday" },
                    { value: 6, text: "Sunday" },
                  ],
                },

                {
                  type: "radiogroup",
                  name: "IQ_5",
                  isRequired: true,
                  title:
                    "In the following alphanumeric series, what letter comes next? K N P S U ...?",
                  choices: [
                    { value: 1, text: "S" },
                    { value: 2, text: "T" },
                    { value: 3, text: "U" },
                    { value: 4, text: "V" },
                    { value: 5, text: "W" },
                    { value: 6, text: "X" },
                  ],
                },

                {
                  type: "radiogroup",
                  name: "IQ_6",
                  isRequired: true,
                  title:
                    "In the following alphanumeric series, what letter comes next? V Q M J H ...?",
                  choices: [
                    { value: 1, text: "E" },
                    { value: 2, text: "F" },
                    { value: 3, text: "G" },
                    { value: 4, text: "H" },
                    { value: 5, text: "I" },
                    { value: 6, text: "J" },
                  ],
                },

                {
                  type: "radiogroup",
                  name: "IQ_7",
                  isRequired: true,
                  title:
                    "In the following alphanumeric series, what letter comes next? I J L O S ...?",
                  choices: [
                    { value: 1, text: "T" },
                    { value: 2, text: "U" },
                    { value: 3, text: "V" },
                    { value: 4, text: "X" },
                    { value: 5, text: "Y" },
                    { value: 6, text: "Z" },
                  ],
                },

                {
                  type: "radiogroup",
                  name: "IQ_8",
                  isRequired: true,
                  title:
                    "In the following alphanumeric series, what letter comes next? Q S N P L ...?",
                  choices: [
                    { value: 1, text: "J" },
                    { value: 2, text: "H" },
                    { value: 3, text: "I" },
                    { value: 4, text: "N" },
                    { value: 5, text: "M" },
                    { value: 6, text: "L" },
                  ],
                },
              ],
            },

            // IQ images
            {
              questions: [
                {
                  type: "html",
                  name: "info",
                  html:
                    "<table><body></br></br></br></br><img src='img/icar/mx45_q.jpg' width='230px'/></br></br></br> </td><img src='/icar/mx45_a.jpg' width='460px'/></body></table>",
                },
                {
                  type: "radiogroup",
                  name: "IQimage_1",
                  isRequired: true,
                  title: "Which figure fits into the missing slot?",
                  choices: [
                    { value: 1, text: "A" },
                    { value: 2, text: "B" },
                    { value: 3, text: "C" },
                    { value: 4, text: "D" },
                    { value: 5, text: "E" },
                    { value: 6, text: "F" },
                  ],
                },

                {
                  type: "html",
                  name: "info",
                  html:
                    "<table><body></br></br></br></br><img src='img/icar/mx46_q.jpg' width='230px'/></br></br></br> </td><img src='img/icar/mx46_a.jpg' width='460px'/></body></table>",
                },
                {
                  type: "radiogroup",
                  name: "IQimage_2",
                  isRequired: true,
                  title: "Which figure fits into the missing slot?",
                  choices: [
                    { value: 1, text: "A" },
                    { value: 2, text: "B" },
                    { value: 3, text: "C" },
                    { value: 4, text: "D" },
                    { value: 5, text: "E" },
                    { value: 6, text: "F" },
                  ],
                },

                {
                  type: "html",
                  name: "info",
                  html:
                    "<table><body></br></br></br></br><img src='img/icar/mx47_q.jpg' width='230px'/></br></br></br> </td><img src='img/icar/mx47_a.jpg' width='460px'/></body></table>",
                },
                {
                  type: "radiogroup",
                  name: "IQimage_3",
                  isRequired: true,
                  title: "Which figure fits into the missing slot?",
                  choices: [
                    { value: 1, text: "A" },
                    { value: 2, text: "B" },
                    { value: 3, text: "C" },
                    { value: 4, text: "D" },
                    { value: 5, text: "E" },
                    { value: 6, text: "F" },
                  ],
                },

                {
                  type: "html",
                  name: "info",
                  html:
                    "<table><body></br></br></br></br><img src='img/icar/mx55_q.jpg' width='230px'/></br></br></br> </td><img src='img/icar/mx55_a.jpg' width='460px'/></body></table>",
                },
                {
                  type: "radiogroup",
                  name: "IQimage_4",
                  isRequired: true,
                  title: "Which figure fits into the missing slot?",
                  choices: [
                    { value: 1, text: "A" },
                    { value: 2, text: "B" },
                    { value: 3, text: "C" },
                    { value: 4, text: "D" },
                    { value: 5, text: "E" },
                    { value: 6, text: "F" },
                  ],
                },

                {
                  type: "html",
                  name: "info",
                  html:
                    "<table><body></br></br></br></br><img src='img/icar/rsd3_q.jpg' width='550px'/></body></table>",
                },
                {
                  type: "radiogroup",
                  name: "IQimage_5",
                  isRequired: true,
                  title:
                    "All the cubes above have a different image on each side. Select the choice that represents a rotation of the cube labeled X.",
                  choices: [
                    { value: 1, text: "A" },
                    { value: 2, text: "B" },
                    { value: 3, text: "C" },
                    { value: 4, text: "D" },
                    { value: 5, text: "E" },
                    { value: 6, text: "F" },
                    { value: 7, text: "G" },
                    { value: 8, text: "H" },
                  ],
                },

                {
                  type: "html",
                  name: "info",
                  html:
                    "<table><body></br></br></br></br><img src='img/icar/rsd4_q.jpg' width='550px'/></body></table>",
                },
                {
                  type: "radiogroup",
                  name: "IQimage_6",
                  isRequired: true,
                  title:
                    "All the cubes above have a different image on each side. Select the choice that represents a rotation of the cube labeled X.",
                  choices: [
                    { value: 1, text: "A" },
                    { value: 2, text: "B" },
                    { value: 3, text: "C" },
                    { value: 4, text: "D" },
                    { value: 5, text: "E" },
                    { value: 6, text: "F" },
                    { value: 7, text: "G" },
                    { value: 8, text: "H" },
                  ],
                },

                {
                  type: "html",
                  name: "info",
                  html:
                    "<table><body></br></br></br></br><img src='img/icar/rsd6_q.jpg' width='550px'/></body></table>",
                },
                {
                  type: "radiogroup",
                  name: "IQimage_7",
                  isRequired: true,
                  title:
                    "All the cubes above have a different image on each side. Select the choice that represents a rotation of the cube labeled X.",
                  choices: [
                    { value: 1, text: "A" },
                    { value: 2, text: "B" },
                    { value: 3, text: "C" },
                    { value: 4, text: "D" },
                    { value: 5, text: "E" },
                    { value: 6, text: "F" },
                    { value: 7, text: "G" },
                    { value: 8, text: "H" },
                  ],
                },

                {
                  type: "html",
                  name: "info",
                  html:
                    "<table><body></br></br></br></br><img src='img/icar/rsd8_q.jpg' width='550px'/></body></table>",
                },
                {
                  type: "radiogroup",
                  name: "IQimage_8",
                  isRequired: true,
                  title:
                    "All the cubes above have a different image on each side. Select the choice that represents a rotation of the cube labeled X.",
                  choices: [
                    { value: 1, text: "A" },
                    { value: 2, text: "B" },
                    { value: 3, text: "C" },
                    { value: 4, text: "D" },
                    { value: 5, text: "E" },
                    { value: 6, text: "F" },
                    { value: 7, text: "G" },
                    { value: 8, text: "H" },
                  ],
                },
              ],
            },
          ],
        };

        text = (
          <div>
            <Quest.Survey
              json={json}
              css={myCss}
              onComplete={this.onComplete.bind(this)}
              onCurrentPageChanged={this.timerCallback.bind(this)}
            />
          </div>
        );
      }
    } else if (this.state.debug === true) {
      text = (
        <div className={style.bg}>
          <div className={style.textFrame}>
            <div className={style.fontStyle}>
              Press the [<strong>SPACEBAR</strong>] to skip to next section.
            </div>
          </div>
        </div>
      );
    }
    return <div>{text}</div>;
  }
}
export default withRouter(Questionnaires);
