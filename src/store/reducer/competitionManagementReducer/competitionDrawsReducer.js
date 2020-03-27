import ApiConstants from '../../../themes/apiConstants';
import { isArrayNotEmpty, isNullOrEmptyString } from '../../../util/helpers';
import { isDateSame, sortArrayByDate } from './../../../themes/dateformate';
import ColorsArray from "../../../util/colorsArray";


const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  getDrawsData: [],
  dateArray: [],
  getDrawsRoundsData: [],
  competitionVenues: [],
  updateLoad: false
};
const colorsArray = ColorsArray;
const lightGray = '#999999';


function structureDrawsData(data) {
  let mainCourtNumberArray = [];
  let dateArray = [];
  let gradeArray = [];
  let sortedDateArray = [];
  if (data.draws) {
    if (isArrayNotEmpty(data.draws)) {
      data.draws.map(object => {
        if (checkDateNotInArray(dateArray, object.matchDate)) {
          dateArray.push(object.matchDate);
        }
        if (setupGradesArray(gradeArray, object.competitionDivisionGradeId)) {
          gradeArray.push(object.competitionDivisionGradeId);
        }
        let courtNumberResponse = checkVenueCourtNumber(
          mainCourtNumberArray,
          object
        );
        if (!courtNumberResponse.status) {
          mainCourtNumberArray.push({
            venueCourtNumber: object.venueCourtNumber,
            slotsArray: []
          });
        }
      });
      sortedDateArray = sortArrayByDate(dateArray);
      mainCourtNumberArray = mapSlotObjectsWithTimeSlots(
        data.draws,
        mainCourtNumberArray,
        sortedDateArray,
        gradeArray
      );
    }
  }
  return { mainCourtNumberArray, sortedDateArray };
}

function mapSlotObjectsWithTimeSlots(
  drawsArray,
  mainCourtNumberArray,
  sortedDateArray,
  gradeArray
) {
  for (let i in mainCourtNumberArray) {
    let tempSlotsArray = [];
    for (let j in sortedDateArray) {
      tempSlotsArray.push(
        getSlotFromDate(
          drawsArray,
          mainCourtNumberArray[i].venueCourtNumber,
          sortedDateArray[j],
          gradeArray
        )
      );
    }
    mainCourtNumberArray[i].slotsArray = tempSlotsArray;
  }
  return mainCourtNumberArray;
}

function getSlotFromDate(
  drawsArray,
  venueCourtNumber,
  matchDate,
  gradeArray,
) {
  let startTime
  let endTime
  for (let i in drawsArray) {
    startTime = drawsArray[i].startTime
    endTime = drawsArray[i].endTime
    if (
      drawsArray[i].venueCourtNumber === venueCourtNumber &&
      isDateSame(drawsArray[i].matchDate, matchDate)
    ) {
      let gradeIndex = gradeArray.indexOf(
        drawsArray[i].competitionDivisionGradeId
      );
      if (gradeIndex === -1) {
        drawsArray[i].colorCode = '#999999';
      } else {
        if (gradeIndex < 39) {
          drawsArray[i].colorCode = colorsArray[gradeIndex];
        } else {
          drawsArray[i].colorCode = '#999999';
        }
      }
      drawsArray[i].teamArray = [
        {
          teamName: drawsArray[i].homeTeamName,
          teamId: drawsArray[i].homeTeamId
        },
        {
          teamName: drawsArray[i].awayTeamName,
          teamId: drawsArray[i].awayTeamId
        }
      ];

      return drawsArray[i];
    }
  }
  let teamArray = [
    {
      teamName: null,
      teamId: null
    },
    {
      teamName: null,
      teamId: null
    }
  ];
  return {
    drawsId: null,
    venueCourtNumber: venueCourtNumber,
    matchDate: matchDate,
    startTime: startTime,
    endTime: endTime,
    homeTeamId: null,
    awayTeamId: null,
    homeTeamName: null,
    awayTeamName: null,
    gradeName: null,
    competitionDivisionGradeId: null,
    isLocked: 0,
    colorCode: '#999999',
    teamArray: teamArray
  };
}

function checkVenueCourtNumber(mainCourtNumberArray, object) {
  for (let i in mainCourtNumberArray) {
    if (mainCourtNumberArray[i].venueCourtNumber === object.venueCourtNumber) {
      return { status: true, index: i };
    }
  }
  return { status: false, index: -1 };
}

function checkSlots(slotsArray, slotObject) {
  for (let i in slotsArray) {
    if (isDateSame(slotsArray[i].fixtureTime, slotObject.matchDate)) {
      return { status: true, index: i };
    }
  }
  return { status: false, index: -1 };
}

function checkDateNotInArray(dateArray, date) {
  for (let i in dateArray) {
    if (isDateSame(dateArray[i], date)) {
      return false;
    }
  }
  return true;
}

function setupGradesArray(gradesArray, gradeId) {
  for (let i in gradesArray) {
    if (gradesArray[i] === gradeId) {
      return false;
    }
  }
  return true;
}

//// Swipe Array object - draws

function swapedDrawsArrayFunc(
  drawsArray,
  sourtXIndex,
  targetXIndex,
  sourceYIndex,
  targetYIndex
) {
  var source = drawsArray[sourtXIndex].slotsArray[sourceYIndex];
  var target = drawsArray[targetXIndex].slotsArray[targetYIndex];

  /// object of source index

  let sourceObject = {
    drawsId: target.drawsId,
    venueCourtNumber: target.venueCourtNumber,
    venueCourtId: target.venueCourtId,
    matchDate: target.matchDate,
    startTime: target.startTime,
    endTime: target.endTime,
    homeTeamId: source.homeTeamId,
    awayTeamId: source.awayTeamId,
    homeTeamName: target.homeTeamName,
    awayTeamName: target.awayTeamName,
    competitionDivisionGradeId: source.competitionDivisionGradeId,
    gradeName: source.gradeName,
    isLocked: '1',
    teamArray: source.teamArray,
    colorCode: source.colorCode
  };

  //// object of target index
  let targetObject = {
    drawsId: source.drawsId,
    venueCourtNumber: source.venueCourtNumber,
    venueCourtId: source.venueCourtId,
    matchDate: source.matchDate,
    startTime: source.startTime,
    endTime: source.endTime,
    homeTeamId: target.homeTeamId,
    awayTeamId: target.awayTeamId,
    homeTeamName: source.homeTeamName,
    awayTeamName: source.awayTeamName,
    competitionDivisionGradeId: target.competitionDivisionGradeId,
    gradeName: target.gradeName,
    isLocked: '1',
    teamArray: target.teamArray,
    colorCode: target.colorCode
  };


  drawsArray[sourtXIndex].slotsArray[sourceYIndex] = targetObject;
  drawsArray[targetXIndex].slotsArray[targetYIndex] = sourceObject;

  return drawsArray;
}


///  Swipe Array object - Edit
function swapedDrawsEditArrayFunc(drawsArray,
  sourtXIndex,
  targetXIndex,
  sourceYIndex,
  targetYIndex,
  sourceZIndex,
  targetZIndex
) {
  var source = drawsArray[sourtXIndex].slotsArray[sourceYIndex];
  var target = drawsArray[targetXIndex].slotsArray[targetYIndex];

  let sourceObject = null
  let targetObject = null
  /// object of source index

  if (sourceZIndex == 0) {
    if (targetZIndex == 0) {
      sourceObject = {
        drawsId: source.drawsId,
        venueCourtNumber: source.venueCourtNumber,
        venueCourtId: source.venueCourtId,
        matchDate: source.matchDate,
        startTime: source.startTime,
        endTime: source.endTime,
        homeTeamId: target.homeTeamId,
        awayTeamId: source.awayTeamId,
        homeTeamName: source.homeTeamName, // home source
        awayTeamName: source.awayTeamName,
        competitionDivisionGradeId: source.competitionDivisionGradeId,
        gradeName: source.gradeName,
        isLocked: '1',
        teamArray: source.teamArray,
        colorCode: source.colorCode
      };
    } else {
      sourceObject = {
        drawsId: source.drawsId,
        venueCourtNumber: source.venueCourtNumber,
        venueCourtId: source.venueCourtId,
        matchDate: source.matchDate,
        startTime: source.startTime,
        endTime: source.endTime,
        homeTeamId: target.awayTeamId,
        awayTeamId: source.awayTeamId,
        homeTeamName: source.homeTeamName, // home source
        awayTeamName: source.awayTeamName,
        competitionDivisionGradeId: source.competitionDivisionGradeId,
        gradeName: source.gradeName,
        isLocked: '1',
        teamArray: source.teamArray,
        colorCode: source.colorCode
      };
    }

  } else {
    if (targetZIndex == 0) {
      sourceObject = {
        drawsId: source.drawsId,
        venueCourtNumber: source.venueCourtNumber,
        venueCourtId: source.venueCourtId,
        matchDate: source.matchDate,
        startTime: source.startTime,
        endTime: source.endTime,
        homeTeamId: source.homeTeamId,
        awayTeamId: target.homeTeamId,
        homeTeamName: source.homeTeamName,
        awayTeamName: source.awayTeamName, // away target
        competitionDivisionGradeId: source.competitionDivisionGradeId,
        gradeName: source.gradeName,
        isLocked: '1',
        teamArray: source.teamArray,
        colorCode: source.colorCode
      };
    } else {
      sourceObject = {
        drawsId: source.drawsId,
        venueCourtNumber: source.venueCourtNumber,
        venueCourtId: source.venueCourtId,
        matchDate: source.matchDate,
        startTime: source.startTime,
        endTime: source.endTime,
        homeTeamId: source.homeTeamId,
        awayTeamId: target.awayTeamId,
        homeTeamName: source.homeTeamName,
        awayTeamName: source.awayTeamName, // away target
        competitionDivisionGradeId: source.competitionDivisionGradeId,
        gradeName: source.gradeName,
        isLocked: '1',
        teamArray: source.teamArray,
        colorCode: source.colorCode
      };
    }
  }

  //// object of target index
  if (targetZIndex == 0) {
    if (sourceZIndex == 0) {
      targetObject = {
        drawsId: target.drawsId,
        venueCourtNumber: target.venueCourtNumber,
        venueCourtId: target.venueCourtId,
        matchDate: target.matchDate,
        startTime: target.startTime,
        endTime: target.endTime,
        homeTeamId: source.homeTeamId,
        awayTeamId: target.awayTeamId,
        homeTeamName: source.homeTeamName, // home source
        awayTeamName: source.awayTeamName,
        competitionDivisionGradeId: target.competitionDivisionGradeId,
        gradeName: target.gradeName,
        isLocked: '1',
        teamArray: target.teamArray,
        colorCode: target.colorCode
      };
    } else {
      targetObject = {
        drawsId: target.drawsId,
        venueCourtNumber: target.venueCourtNumber,
        venueCourtId: target.venueCourtId,
        matchDate: target.matchDate,
        startTime: target.startTime,
        endTime: target.endTime,
        homeTeamId: source.awayTeamId,
        awayTeamId: target.awayTeamId,
        homeTeamName: target.homeTeamName, // home source
        awayTeamName: target.awayTeamName,
        competitionDivisionGradeId: target.competitionDivisionGradeId,
        gradeName: target.gradeName,
        isLocked: '1',
        teamArray: target.teamArray,
        colorCode: target.colorCode
      };
    }
  } else {
    if (sourceZIndex == 0) {
      targetObject = {
        drawsId: target.drawsId,
        venueCourtNumber: target.venueCourtNumber,
        venueCourtId: target.venueCourtId,
        matchDate: target.matchDate,
        startTime: target.startTime,
        endTime: target.endTime,
        homeTeamId: target.homeTeamId,
        awayTeamId: source.homeTeamId,
        homeTeamName: target.homeTeamName,
        awayTeamName: source.awayTeamName, /// away source
        competitionDivisionGradeId: target.competitionDivisionGradeId,
        gradeName: target.gradeName,
        isLocked: '1',
        teamArray: target.teamArray,
        colorCode: target.colorCode
      };
    } else {
      targetObject = {
        drawsId: target.drawsId,
        venueCourtNumber: target.venueCourtNumber,
        venueCourtId: target.venueCourtId,
        matchDate: target.matchDate,
        startTime: target.startTime,
        endTime: target.endTime,
        homeTeamId: target.homeTeamId,
        awayTeamId: target.awayTeamId,
        homeTeamName: target.homeTeamName,
        awayTeamName: source.awayTeamName, /// away source
        competitionDivisionGradeId: target.competitionDivisionGradeId,
        gradeName: target.gradeName,
        isLocked: '1',
        teamArray: target.teamArray,
        colorCode: target.colorCode
      }
    }
  }


  drawsArray[sourtXIndex].slotsArray[sourceYIndex] = targetObject;
  drawsArray[targetXIndex].slotsArray[targetYIndex] = sourceObject;

  return drawsArray;
}

function CompetitionDraws(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.API_COMPETITION_DRAWS_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        updateLoad: false
      };

    case ApiConstants.API_COMPETITION_DRAWS_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        updateLoad: false
      };

    //competition part player grade calculate player grading summmary get API
    case ApiConstants.API_GET_COMPETITION_DRAWS_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_GET_COMPETITION_DRAWS_SUCCESS:
      let drawsResultData = action.result[0];
      let resultData = structureDrawsData(drawsResultData);
      return {
        ...state,
        getDrawsData: resultData.mainCourtNumberArray,
        dateArray: resultData.sortedDateArray,
        onLoad: false,
        error: null
      };

    /////get rounds in the competition draws
    case ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_LOAD:
      return { ...state, onLoad: true, updateLoad: true, error: null };

    case ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_SUCCESS:
      state.updateLoad = false
      return {
        ...state,
        getDrawsRoundsData: action.result,
        competitionVenues: action.Venue_Result,
        onLoad: false,
        error: null
      };

    /// Update draws reducer ceses
    case ApiConstants.API_UPDATE_COMPETITION_DRAWS_LOAD:
      return {
        ...state,
        updateLoad: true
      }


    case ApiConstants.API_UPDATE_COMPETITION_DRAWS_SUCCESS:
      let sourceXIndex = action.sourceArray[0];
      let sourceYIndex = action.sourceArray[1];
      let targetXIndex = action.targetArray[0];
      let targetYIndex = action.targetArray[1];
      let drawData = state.getDrawsData;
      let swapedDrawsArray = state.getDrawsData
      if (action.actionType == "add") {
        swapedDrawsArray = swapedDrawsArrayFunc(
          drawData,
          sourceXIndex,
          targetXIndex,
          sourceYIndex,
          targetYIndex
        );
      } else {
        swapedDrawsArray = swapedDrawsEditArrayFunc(
          drawData,
          sourceXIndex,
          targetXIndex,
          sourceYIndex,
          targetYIndex,
          action.sourceArray[2],
          action.targetArray[2]
        );
      }
      state.getDrawsData = swapedDrawsArray;
      return {
        ...state,
        onLoad: false,
        error: null,
        updateLoad: false
      };

    /// Save Draws Success
    case ApiConstants.API_UPDATE_COMPETITION_SAVE_DRAWS_SUCCESS:
      return {
        ...state,
        onLoad: false,
        error: null
      };

    case ApiConstants.API_GET_COMPETITION_VENUES_LOAD:
      return {
        ...state, onLoad: true
      }

    //// Competition venues
    case ApiConstants.API_GET_COMPETITION_VENUES_SUCCESS:

      return {
        ...state,
        onLoad: false,
        competitionVenues: action.result
      }


    ///////update draws court timing where N/A(null) is there
    case ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_LOAD:
      return {
        ...state,
        updateLoad: true
      }


    case ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_SUCCESS:

      let sourceXNullCaseIndex = action.sourceArray[0];
      let sourceYNullCaseIndex = action.sourceArray[1];
      let targetXNullCaseIndex = action.targetArray[0];
      let targetYNullCaseIndex = action.targetArray[1];

      let drawDataNullCase = state.getDrawsData;

      let swapedDrawsArrayNullCase = state.getDrawsData
      if (action.actionType == "add") {
        swapedDrawsArrayNullCase = swapedDrawsArrayFunc(
          drawDataNullCase,
          sourceXNullCaseIndex,
          targetXNullCaseIndex,
          sourceYNullCaseIndex,
          targetYNullCaseIndex
        );
      } else {
        swapedDrawsArrayNullCase = swapedDrawsEditArrayFunc(
          drawDataNullCase,
          sourceXNullCaseIndex,
          targetXNullCaseIndex,
          sourceYNullCaseIndex,
          targetYNullCaseIndex,
          action.sourceArray[2],
          action.targetArray[2]
        );

      }
      state.getDrawsData = swapedDrawsArrayNullCase;
      return {
        ...state,
        onLoad: false,
        error: null,
        updateLoad: false
      };

    case ApiConstants.cleardrawsData:
      state.getDrawsData = []
      state.dateArray = []
      if (action.key == "round") {
        state.competitionVenues = []
        state.getDrawsRoundsData = []
      }
      return { ...state }

    default:
      return state;
  }
}

export default CompetitionDraws;
