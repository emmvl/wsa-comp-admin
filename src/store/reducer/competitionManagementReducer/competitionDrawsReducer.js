import ApiConstants from '../../../themes/apiConstants';
import { isArrayNotEmpty, isNullOrEmptyString } from '../../../util/helpers';
import { isDateSame, sortArrayByDate } from './../../../themes/dateformate';
import ColorsArray from '../../../util/colorsArray';

const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  getDrawsData: [],
  getStaticDrawsData: [],
  dateArray: [],
  getDrawsRoundsData: [],
  competitionVenues: [],
  updateLoad: false,
  gradeColorArray: [],
};
var gradeColorArray = [];
const colorsArray = ColorsArray;
const lightGray = '#999999';

function structureDrawsData(data) {
  let mainCourtNumberArray = [];
  let dateArray = [];
  let gradeArray = [];
  let sortedDateArray = [];
  if (data.draws) {
    if (isArrayNotEmpty(data.draws)) {
      data.draws.map((object) => {
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
            slotsArray: [],
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

function getSlotFromDate(drawsArray, venueCourtNumber, matchDate, gradeArray) {
  let startTime;
  let endTime;
  for (let i in drawsArray) {
    startTime = drawsArray[i].startTime;
    endTime = drawsArray[i].endTime;
    if (
      drawsArray[i].venueCourtNumber === venueCourtNumber &&
      isDateSame(drawsArray[i].matchDate, matchDate)
    ) {
      // let gradeIndex = gradeArray.indexOf(
      //   drawsArray[i].competitionDivisionGradeId
      // );

      let gradeColour = getGradeColor(drawsArray[i].competitionDivisionGradeId);

      // if (gradeIndex === -1) {
      drawsArray[i].colorCode = gradeColour;
      // } else {
      //   if (gradeIndex < 39) {
      //     drawsArray[i].colorCode = colorsArray[gradeIndex];
      //   } else {
      //     drawsArray[i].colorCode = '#999999';
      //   }
      // }
      drawsArray[i].teamArray = [
        {
          teamName: drawsArray[i].homeTeamName,
          teamId: drawsArray[i].homeTeamId,
        },
        {
          teamName: drawsArray[i].awayTeamName,
          teamId: drawsArray[i].awayTeamId,
        },
      ];

      return drawsArray[i];
    }
  }
  let teamArray = [
    {
      teamName: null,
      teamId: null,
    },
    {
      teamName: null,
      teamId: null,
    },
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
    divisionName: null,
    isLocked: 0,
    colorCode: '#999999',
    teamArray: teamArray,
  };
}

function getGradeColor(gradeId) {
  let gradeColorTempArray = JSON.parse(JSON.stringify(gradeColorArray));
  let index = gradeColorTempArray.findIndex((x) => x.gradeId === gradeId);

  var color = lightGray;
  if (index !== -1) {
    color = gradeColorTempArray[index].colorCode;
  } else {
    for (var i in colorsArray) {
      let colorIndex = gradeColorTempArray.findIndex(
        (x) => x.colorCode === colorsArray[i]
      );
      if (colorIndex === -1) {
        gradeColorArray.push({ gradeId: gradeId, colorCode: colorsArray[i] });
        color = colorsArray[i];
        break;
      }
    }
  }
  return color;
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
  let sourceArray = JSON.parse(JSON.stringify(drawsArray));
  let targetArray = JSON.parse(JSON.stringify(drawsArray));
  let source = JSON.parse(
    JSON.stringify(sourceArray[sourtXIndex].slotsArray[sourceYIndex])
  );
  let target = JSON.parse(
    JSON.stringify(targetArray[targetXIndex].slotsArray[targetYIndex])
  );
  let sourceCopy = JSON.parse(
    JSON.stringify(sourceArray[sourtXIndex].slotsArray[sourceYIndex])
  );
  let targetCopy = JSON.parse(
    JSON.stringify(targetArray[targetXIndex].slotsArray[targetYIndex])
  );
  sourceCopy.drawsId = target.drawsId;
  targetCopy.drawsId = source.drawsId;
  if (source.drawsId === null) {
    drawsArray[sourtXIndex].slotsArray[sourceYIndex] = target;
    drawsArray[targetXIndex].slotsArray[targetYIndex] = source;
  } else if (target.drawsId === null) {
    drawsArray[sourtXIndex].slotsArray[sourceYIndex] = target;
    drawsArray[targetXIndex].slotsArray[targetYIndex] = source;
  } else {
    drawsArray[sourtXIndex].slotsArray[sourceYIndex] = targetCopy;
    drawsArray[targetXIndex].slotsArray[targetYIndex] = sourceCopy;
  }

  console.log('Source', source);
  console.log('Target', target);
  console.log('Draws', drawsArray);

  /*
  var source = drawsArray[sourtXIndex].slotsArray[sourceYIndex];
  var target = drawsArray[targetXIndex].slotsArray[targetYIndex];

  /// object of source index

  // if(source.drawsId != target.drawsId){
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
      teamArray: [{teamName: target.homeTeamName, teamId: source.homeTeamId},{teamName: target.awayTeamName, teamId: source.awayTeamId}],
      // source.teamArray,
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
      // teamArray: target.teamArray,
      teamArray: [{teamName: source.homeTeamName, teamId: target.homeTeamId},{teamName: source.awayTeamName, teamId: target.awayTeamId}],
      colorCode: target.colorCode
    };
  
  
    drawsArray[sourtXIndex].slotsArray[sourceYIndex] = targetObject;
    drawsArray[targetXIndex].slotsArray[targetYIndex] = sourceObject;
  // }else{
  //   let sourceObject = {
  //     drawsId: target.drawsId,
  //     venueCourtNumber: target.venueCourtNumber,
  //     venueCourtId: target.venueCourtId,
  //     matchDate: target.matchDate,
  //     startTime: target.startTime,
  //     endTime: target.endTime,
  //     homeTeamId: source.awayTeamId,
  //     awayTeamId: source.homeTeamId,
  //     homeTeamName: source.awayTeamName,
  //     awayTeamName: source.homeTeamName,
  //     competitionDivisionGradeId: source.competitionDivisionGradeId,
  //     gradeName: source.gradeName,
  //     isLocked: '1',
  //     teamArray: [{teamName: source.awayTeamName, teamId: source.awayTeamId},{teamName: source.homeTeamName, teamId: source.homeTeamId}],
  //     // source.teamArray,
  //     colorCode: source.colorCode
  //   };
  
  //   drawsArray[sourtXIndex].slotsArray[sourceYIndex] = sourceObject;
  // }
  
*/
  return drawsArray;
}

///  Swipe Array object - Edit
function swapedDrawsEditArrayFunc(
  drawsArray,
  sourceXIndex,
  targetXIndex,
  sourceYIndex,
  targetYIndex,
  sourceZIndex,
  targetZIndex
) {
  var sourceArray = JSON.parse(JSON.stringify(drawsArray));
  var targetArray = JSON.parse(JSON.stringify(drawsArray));
  var sourceItem =
    sourceArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[sourceZIndex];
  var targetItem =
    targetArray[targetXIndex].slotsArray[targetYIndex].teamArray[targetZIndex];

  var source = sourceArray[sourceXIndex].slotsArray[sourceYIndex];
  var target = targetArray[targetXIndex].slotsArray[targetYIndex];
  console.error(
    'SourceXYZ',
    sourceXIndex,
    ':',
    sourceYIndex,
    ':',
    sourceZIndex
  );
  console.error(
    'TargetXYZ',
    targetXIndex,
    ':',
    targetYIndex,
    ':',
    targetZIndex
  );
  if (sourceZIndex === '0') {
    if (targetZIndex === '0') {
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].homeTeamId =
        target.homeTeamId;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].homeTeamName =
        target.homeTeamName;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[0].teamId =
        target.homeTeamId;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[0].teamName =
        target.homeTeamName;
    } else {
      console.error('Called123');
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].homeTeamId =
        target.awayTeamId;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].homeTeamName =
        target.awayTeamName;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[0].teamId =
        target.awayTeamId;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[0].teamName =
        target.awayTeamName;
    }
  } else {
    if (targetZIndex === '0') {
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].awayTeamId =
        target.homeTeamId;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].awayTeamName =
        target.homeTeamName;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[1].teamId =
        target.homeTeamId;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[1].teamName =
        target.homeTeamName;
    } else {
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].awayTeamId =
        target.awayTeamId;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].awayTeamName =
        target.awayTeamName;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[1].teamId =
        target.awayTeamId;
      drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[1].teamName =
        target.awayTeamName;
    }
  }

  if (targetZIndex === '0') {
    if (sourceZIndex === '0') {
      drawsArray[targetXIndex].slotsArray[targetYIndex].homeTeamId =
        source.homeTeamId;
      drawsArray[targetXIndex].slotsArray[targetYIndex].homeTeamName =
        source.homeTeamName;
      drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[0].teamId =
        source.homeTeamId;
      drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[0].teamName =
        source.homeTeamName;
    } else {
      drawsArray[targetXIndex].slotsArray[targetYIndex].homeTeamId =
        source.awayTeamId;
      drawsArray[targetXIndex].slotsArray[targetYIndex].homeTeamName =
        source.awayTeamName;
      drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[0].teamId =
        source.awayTeamId;
      drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[0].teamName =
        source.awayTeamName;
    }
  } else {
    if (sourceZIndex === '0') {
      drawsArray[targetXIndex].slotsArray[targetYIndex].awayTeamId =
        source.homeTeamId;
      drawsArray[targetXIndex].slotsArray[targetYIndex].awayTeamName =
        source.homeTeamName;
      drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[1].teamId =
        source.homeTeamId;
      drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[1].teamName =
        source.homeTeamName;
    } else {
      drawsArray[targetXIndex].slotsArray[targetYIndex].awayTeamId =
        source.awayTeamId;
      drawsArray[targetXIndex].slotsArray[targetYIndex].awayTeamName =
        source.awayTeamName;
      drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[1].teamId =
        source.awayTeamId;
      drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[1].teamName =
        source.awayTeamName;
    }
  }

  console.log('Source', source);
  console.log('Target', target);
  console.log('Draws Data**', drawsArray);

  // let sourceObject = null
  // let targetObject = null
  /// object of source index
  // if (sourceZIndex == 0) {
  //   if (targetZIndex == 0) {
  //     sourceObject = {
  //       drawsId: source.drawsId,
  //       venueCourtNumber: source.venueCourtNumber,
  //       venueCourtId: source.venueCourtId,
  //       matchDate: source.matchDate,
  //       startTime: source.startTime,
  //       endTime: source.endTime,
  //       homeTeamId: target.homeTeamId,
  //       awayTeamId: source.awayTeamId,
  //       homeTeamName: source.homeTeamName, // home source
  //       awayTeamName: source.awayTeamName,
  //       competitionDivisionGradeId: source.competitionDivisionGradeId,
  //       gradeName: source.gradeName,
  //       isLocked: '1',
  //       teamArray: source.teamArray,
  //       colorCode: source.colorCode
  //     };
  //   } else {
  //     sourceObject = {
  //       drawsId: source.drawsId,
  //       venueCourtNumber: source.venueCourtNumber,
  //       venueCourtId: source.venueCourtId,
  //       matchDate: source.matchDate,
  //       startTime: source.startTime,
  //       endTime: source.endTime,
  //       homeTeamId: target.awayTeamId,
  //       awayTeamId: source.awayTeamId,
  //       homeTeamName: source.homeTeamName, // home source
  //       awayTeamName: source.awayTeamName,
  //       competitionDivisionGradeId: source.competitionDivisionGradeId,
  //       gradeName: source.gradeName,
  //       isLocked: '1',
  //       teamArray: source.teamArray,
  //       colorCode: source.colorCode
  //     };
  //   }

  // } else {
  //   if (targetZIndex == 0) {
  //     sourceObject = {
  //       drawsId: source.drawsId,
  //       venueCourtNumber: source.venueCourtNumber,
  //       venueCourtId: source.venueCourtId,
  //       matchDate: source.matchDate,
  //       startTime: source.startTime,
  //       endTime: source.endTime,
  //       homeTeamId: source.homeTeamId,
  //       awayTeamId: target.homeTeamId,
  //       homeTeamName: source.homeTeamName,
  //       awayTeamName: source.awayTeamName, // away target
  //       competitionDivisionGradeId: source.competitionDivisionGradeId,
  //       gradeName: source.gradeName,
  //       isLocked: '1',
  //       teamArray: source.teamArray,
  //       colorCode: source.colorCode
  //     };
  //   } else {
  //     sourceObject = {
  //       drawsId: source.drawsId,
  //       venueCourtNumber: source.venueCourtNumber,
  //       venueCourtId: source.venueCourtId,
  //       matchDate: source.matchDate,
  //       startTime: source.startTime,
  //       endTime: source.endTime,
  //       homeTeamId: source.homeTeamId,
  //       awayTeamId: target.awayTeamId,
  //       homeTeamName: source.homeTeamName,
  //       awayTeamName: source.awayTeamName, // away target
  //       competitionDivisionGradeId: source.competitionDivisionGradeId,
  //       gradeName: source.gradeName,
  //       isLocked: '1',
  //       teamArray: source.teamArray,
  //       colorCode: source.colorCode
  //     };
  //   }
  // }

  // //// object of target index
  // if (targetZIndex == 0) {
  //   if (sourceZIndex == 0) {
  //     targetObject = {
  //       drawsId: target.drawsId,
  //       venueCourtNumber: target.venueCourtNumber,
  //       venueCourtId: target.venueCourtId,
  //       matchDate: target.matchDate,
  //       startTime: target.startTime,
  //       endTime: target.endTime,
  //       homeTeamId: source.homeTeamId,
  //       awayTeamId: target.awayTeamId,
  //       homeTeamName: source.homeTeamName, // home source
  //       awayTeamName: source.awayTeamName,
  //       competitionDivisionGradeId: target.competitionDivisionGradeId,
  //       gradeName: target.gradeName,
  //       isLocked: '1',
  //       teamArray: target.teamArray,
  //       colorCode: target.colorCode
  //     };
  //   } else {
  //     targetObject = {
  //       drawsId: target.drawsId,
  //       venueCourtNumber: target.venueCourtNumber,
  //       venueCourtId: target.venueCourtId,
  //       matchDate: target.matchDate,
  //       startTime: target.startTime,
  //       endTime: target.endTime,
  //       homeTeamId: source.awayTeamId,
  //       awayTeamId: target.awayTeamId,
  //       homeTeamName: target.homeTeamName, // home source
  //       awayTeamName: target.awayTeamName,
  //       competitionDivisionGradeId: target.competitionDivisionGradeId,
  //       gradeName: target.gradeName,
  //       isLocked: '1',
  //       teamArray: target.teamArray,
  //       colorCode: target.colorCode
  //     };
  //   }
  // } else {
  //   if (sourceZIndex == 0) {
  //     targetObject = {
  //       drawsId: target.drawsId,
  //       venueCourtNumber: target.venueCourtNumber,
  //       venueCourtId: target.venueCourtId,
  //       matchDate: target.matchDate,
  //       startTime: target.startTime,
  //       endTime: target.endTime,
  //       homeTeamId: target.homeTeamId,
  //       awayTeamId: source.homeTeamId,
  //       homeTeamName: target.homeTeamName,
  //       awayTeamName: source.awayTeamName, /// away source
  //       competitionDivisionGradeId: target.competitionDivisionGradeId,
  //       gradeName: target.gradeName,
  //       isLocked: '1',
  //       teamArray: target.teamArray,
  //       colorCode: target.colorCode
  //     };
  //   } else {
  //     targetObject = {
  //       drawsId: target.drawsId,
  //       venueCourtNumber: target.venueCourtNumber,
  //       venueCourtId: target.venueCourtId,
  //       matchDate: target.matchDate,
  //       startTime: target.startTime,
  //       endTime: target.endTime,
  //       homeTeamId: target.homeTeamId,
  //       awayTeamId: target.awayTeamId,
  //       homeTeamName: target.homeTeamName,
  //       awayTeamName: source.awayTeamName, /// away source
  //       competitionDivisionGradeId: target.competitionDivisionGradeId,
  //       gradeName: target.gradeName,
  //       isLocked: '1',
  //       teamArray: target.teamArray,
  //       colorCode: target.colorCode
  //     }
  //   }
  // }

  // drawsArray[sourtXIndex].slotsArray[sourceYIndex] = targetObject;
  // drawsArray[targetXIndex].slotsArray[targetYIndex] = sourceObject;

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
        updateLoad: false,
      };

    case ApiConstants.API_COMPETITION_DRAWS_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        updateLoad: false,
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
        getStaticDrawsData: JSON.parse(
          JSON.stringify(resultData.mainCourtNumberArray)
        ),
        dateArray: resultData.sortedDateArray,
        onLoad: false,
        error: null,
      };

    /////get rounds in the competition draws
    case ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_LOAD:
      return { ...state, onLoad: true, updateLoad: true, error: null };

    case ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_SUCCESS:
      state.competitionVenues = JSON.parse(JSON.stringify(action.Venue_Result))
      let venueObject = {
        name: "All Venues",
        id: 0
      }
      state.competitionVenues.unshift(venueObject)
      state.updateLoad = false;
      return {
        ...state,
        getDrawsRoundsData: action.result,
        // competitionVenues: action.Venue_Result,
        onLoad: false,
        error: null,
      };

    /// Update draws reducer ceses
    case ApiConstants.API_UPDATE_COMPETITION_DRAWS_LOAD:
      return {
        ...state,
        updateLoad: true,
      };

    case ApiConstants.API_UPDATE_COMPETITION_DRAWS_SUCCESS:
      let sourceXIndex = action.sourceArray[0];
      let sourceYIndex = action.sourceArray[1];
      let targetXIndex = action.targetArray[0];
      let targetYIndex = action.targetArray[1];
      let drawData = state.getDrawsData;
      let swapedDrawsArray = state.getStaticDrawsData;
      if (action.actionType == 'add') {
        swapedDrawsArray = swapedDrawsArrayFunc(
          state.getStaticDrawsData,
          sourceXIndex,
          targetXIndex,
          sourceYIndex,
          targetYIndex
        );
      } else {
        swapedDrawsArray = swapedDrawsEditArrayFunc(
          state.getStaticDrawsData,
          sourceXIndex,
          targetXIndex,
          sourceYIndex,
          targetYIndex,
          action.sourceArray[2],
          action.targetArray[2]
        );
      }
      // state.getDrawsData = swapedDrawsArray;
      state.getStaticDrawsData = swapedDrawsArray;
      return {
        ...state,
        onLoad: false,
        error: null,
        updateLoad: false,
      };

    /// Save Draws Success
    case ApiConstants.API_UPDATE_COMPETITION_SAVE_DRAWS_SUCCESS:
      return {
        ...state,
        onLoad: false,
        error: null,
      };

    case ApiConstants.API_GET_COMPETITION_VENUES_LOAD:
      return {
        ...state,
        onLoad: true,
      };

    //// Competition venues
    case ApiConstants.API_GET_COMPETITION_VENUES_SUCCESS:
      return {
        ...state,
        onLoad: false,
        competitionVenues: action.result,
      };

    ///////update draws court timing where N/A(null) is there
    case ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_LOAD:
      return {
        ...state,
        updateLoad: true,
      };

    case ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_SUCCESS:
      let sourceXNullCaseIndex = action.sourceArray[0];
      let sourceYNullCaseIndex = action.sourceArray[1];
      let targetXNullCaseIndex = action.targetArray[0];
      let targetYNullCaseIndex = action.targetArray[1];

      let drawDataNullCase = state.getStaticDrawsData;

      let swapedDrawsArrayNullCase = state.getStaticDrawsData;
      if (action.actionType == 'add') {
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
      state.getStaticDrawsData = swapedDrawsArrayNullCase;
      return {
        ...state,
        onLoad: false,
        error: null,
        updateLoad: false,
      };

    case ApiConstants.cleardrawsData:
      state.getStaticDrawsData = [];
      state.dateArray = [];
      if (action.key == 'round') {
        state.competitionVenues = [];
        state.getDrawsRoundsData = [];
      }
      return { ...state };

    default:
      return state;
  }
}

export default CompetitionDraws;
