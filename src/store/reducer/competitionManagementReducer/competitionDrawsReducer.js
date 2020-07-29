import ApiConstants from '../../../themes/apiConstants';
import { isArrayNotEmpty, isNotNullOrEmptyString } from '../../../util/helpers';
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
  divisionGradeNameList: [],
  publishStatus: 0,
  isTeamInDraw: null,
  legendsArray: [],
  fixtureDivisionGradeNameList: [],
  divisionLoad: false,
  fixtureArray: [],
  updateFixtureLoad: false,
  getRoundsDrawsdata: [],
  spinLoad: false,
  drawOrganisations: [],
  // colorsArray: [],
  activeDrawsRoundsData: [],
  onActRndLoad: false

};
var gradeColorArray = [];
var fixtureColorArray = [];
const colorsArray = ColorsArray;
const lightGray = '#999999';
var legendsArray = [];
let colorsArrayDup = [...colorsArray];

function createLegendsArray(drawsArray, currentLegends, dateArray) {
  let newArray = currentLegends
  for (let i in drawsArray) {
    for (let j in drawsArray[i].slotsArray) {
      let color = drawsArray[i].slotsArray[j].colorCode
      let index = currentLegends.findIndex((x) => x.colorCode === color)
      let object = {
        "colorCode": color,
        "gradeName": color == "#999999" ? "N/A" : drawsArray[i].slotsArray[j].gradeName,
        "divisionName": drawsArray[i].slotsArray[j].divisionName ? drawsArray[i].slotsArray[j].divisionName : "N/A"
      }
      if (index === -1) {
        if (color !== "#999999") {
          newArray.push(object)
        }
      }
    }

  }
  let dateArrayLength = isArrayNotEmpty(dateArray) ? dateArray.length : 1
  let temparray = []
  let finalLegendsChunkArray = []
  for (let i = 0, j = newArray.length; i < j; i += dateArrayLength) {
    temparray = newArray.slice(i, i + dateArrayLength);
    finalLegendsChunkArray.push(temparray)
  }
  return finalLegendsChunkArray
}

function setFixtureColor(data) {
  let fixtureDraws
  for (let i in data) {
    fixtureDraws = data[i].draws
    for (let j in fixtureDraws) {
      // let colorTeam = getColor(fixtureDraws[j].team1)
      fixtureDraws[j].team1Color = getFixtureColor(fixtureDraws[j].team1)
      fixtureDraws[j].team2Color = getFixtureColor(fixtureDraws[j].team2)
    }
  }
  return data
}

function roundstructureData(data) {
  let roundsdata = data.rounds
  let newStructureDrawsData
  if (roundsdata.length > 0) {
    for (let i in roundsdata) {
      newStructureDrawsData = structureDrawsData(roundsdata[i].draws)
      roundsdata[i].draws = newStructureDrawsData.mainCourtNumberArray
      roundsdata[i].dateNewArray = newStructureDrawsData.sortedDateArray
      roundsdata[i].legendsArray = newStructureDrawsData.legendsArray
    }
  }
  return {
    roundsdata,
  }
}



function structureDrawsData(data) {
  let mainCourtNumberArray = [];
  let dateArray = [];
  let gradeArray = [];
  let sortedDateArray = [];
  let legendArray = [];
  let sortMainCourtNumberArray = [];
  if (data) {
    if (isArrayNotEmpty(data)) {
      data.map((object) => {
        dateArray = setupDateObjectArray(dateArray, object)
        // if (checkDateNotInArray(dateArray, object.matchDate)) {
        //   let dateObject = checkOutOfRound(object)
        //   console.log("dateObject", dateObject)
        //   dateArray.push(dateObject);
        // }
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
            venueCourtName: object.venueCourtName,
            venueShortName: object.venueShortName,
            venueNameCourtName: (JSON.stringify(object.venueShortName) + JSON.stringify(object.venueCourtNumber)),
            venueCourtId: object.venueCourtId,
            slotsArray: [],
          });
        }
      });
      sortedDateArray = sortDateArray(dateArray);
      sortMainCourtNumberArray = sortCourtArray(JSON.parse(JSON.stringify(mainCourtNumberArray)))

      // sortedDateArray = sortArrayByDate(dateArray);
      // sortedDateArray = dateArray;
      mainCourtNumberArray = mapSlotObjectsWithTimeSlots(
        data,
        sortMainCourtNumberArray,
        sortedDateArray,
        gradeArray
      );
    }
  }
  legendsArray = createLegendsArray(mainCourtNumberArray, legendArray, sortedDateArray)
  return { mainCourtNumberArray, sortedDateArray, legendsArray };
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
          mainCourtNumberArray[i].venueCourtId,
          sortedDateArray[j].date,
          gradeArray
        )
      );
    }
    mainCourtNumberArray[i].slotsArray = tempSlotsArray;
  }
  return mainCourtNumberArray;
}

function getSlotFromDate(drawsArray, venueCourtId, matchDate, gradeArray) {
  let startTime;
  let endTime;
  for (let i in drawsArray) {
    startTime = drawsArray[i].startTime;
    endTime = drawsArray[i].endTime;
    if (
      drawsArray[i].venueCourtId === venueCourtId &&
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
    venueCourtNumber: null,
    venueCourtName: null,
    venueCourtId: venueCourtId,
    venueShortName: null,
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
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getFixtureColor(team) {

  let teamColorTempArray = JSON.parse(JSON.stringify(fixtureColorArray));
  let index = teamColorTempArray.findIndex((x) => x.team === team);

  var color = lightGray;
  if (index !== -1) {
    color = teamColorTempArray[index].colorCode;
  } else {
    for (var i in colorsArray) {
      let colorIndex = teamColorTempArray.findIndex(
        (x) => x.colorCode === colorsArray[i]
      );
      if (colorIndex === -1) {
        fixtureColorArray.push({ team: team, colorCode: colorsArray[i] });
        color = colorsArray[i];
        break;
      }
    }
  }
  return color;
  // let fixtureTempArray = JSON.parse(JSON.stringify(fixtureColorArray))

  // let color1 = getRandomColor()
  // let color2 = getRandomColor()

  // for (let [index, value] of colorsArrayDup.entries()) {
  //   fixtureColorArray.push({
  //     drawsId: draws.drawsId,
  //     colorCode1: colorsArrayDup[index],
  //     colorCode2: colorsArrayDup[Number(index) + 1]
  //   });
  //   color1 = colorsArrayDup[Number(index)]
  //   color2 = colorsArrayDup[Number(index) + 1]

  //   colorsArrayDup.splice(0, 2)
  //   break
  // }
  // return {
  //   color1,
  //   color2,
  // }

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
    if (mainCourtNumberArray[i].venueCourtId === object.venueCourtId) {
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

// function checkDateNotInArray(dateArray, date) {
//   for (let i in dateArray) {
//     if (isDateSame(dateArray[i].date, date)) {
//       return false;
//     }
//   }
//   return true;
// }

//sort court array
function sortCourtArray(mainCourtNumberArray) {
  let isSortedArray = []
  const sortAlphaNum = (a, b) => a.venueNameCourtName.localeCompare(b.venueNameCourtName, 'en', { numeric: true })
  // let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  // isSortedArray = mainCourtNumberArray.sort(collator.compare)
  // isSortedArray = mainCourtNumberArray.sort((a, b) => a.venueNameCourtName.localeCompare(b.venueNameCourtName));
  isSortedArray = mainCourtNumberArray.sort(sortAlphaNum)
  return isSortedArray
}


function sortDateArray(dateArray) {
  let inDrawsArray = []
  let outDrawsArray = []
  for (let i in dateArray) {
    if (dateArray[i].notInDraw == false) {
      inDrawsArray.push(dateArray[i])
    }
    else {
      outDrawsArray.push(dateArray[i])
    }
  }
  inDrawsArray = sortArrayByDate(inDrawsArray)
  outDrawsArray = sortArrayByDate(outDrawsArray)
  return inDrawsArray.concat(outDrawsArray);
}

function setupDateObjectArray(dateArray, drawObject) {
  var tempDateArray = JSON.parse(JSON.stringify(dateArray))
  let defaultDateObject = {
    date: drawObject.matchDate,
    notInDraw: drawObject.outOfCompetitionDate == 1 || drawObject.outOfRoundDate == 1 ? true : false
  }
  for (let i in dateArray) {
    if (isDateSame(dateArray[i].date, drawObject.matchDate)) {
      if (tempDateArray[i].notInDraw == false) {
        tempDateArray[i] = defaultDateObject
      }
      return tempDateArray;
    }

  }
  tempDateArray.push(defaultDateObject)

  return tempDateArray;
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
  sourceArray[sourtXIndex].slotsArray[sourceYIndex].isLocked = 1
  let source = JSON.parse(
    JSON.stringify(sourceArray[sourtXIndex].slotsArray[sourceYIndex])
  );
  targetArray[targetXIndex].slotsArray[targetYIndex].isLocked = 1
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
console.log(sourceArray, drawsArray,'valled')
  return drawsArray;
}

function swapedFixtureArrayFunc(fixtureArray, fixtureSourceXIndex,
  fixtureTargetXIndex,
  fixtureSourceYIndex,
  fixtureTargetYIndex,
  sourceZIndex,
  targetZIndex
) {

  var fixtureSourceArray = JSON.parse(JSON.stringify(fixtureArray))
  var fixtureTargetArray = JSON.parse(JSON.stringify(fixtureArray))
  var fixtureSource = fixtureSourceArray[fixtureSourceYIndex];
  var fixtureTarget = fixtureTargetArray[fixtureTargetYIndex];

  if (sourceZIndex === '0') {
    if (targetZIndex === '0') {
      fixtureArray[fixtureSourceYIndex].team1 =
        fixtureTarget.team1;
      fixtureArray[fixtureSourceYIndex].team1Name =
        fixtureTarget.team1Name;
      fixtureArray[fixtureSourceYIndex].team1Color =
        fixtureTarget.team1Color
    }
    else {

      fixtureArray[fixtureSourceYIndex].team1 =
        fixtureTarget.team2;
      fixtureArray[fixtureSourceYIndex].team1Name =
        fixtureTarget.team2Name;
      fixtureArray[fixtureSourceYIndex].team1Color =
        fixtureTarget.team2Color;
    }
  }
  else {
    if (targetZIndex === '0') {
      fixtureArray[fixtureSourceYIndex].team2 =
        fixtureTarget.team1;
      fixtureArray[fixtureSourceYIndex].team2Name =
        fixtureTarget.team1Name;
      fixtureArray[fixtureSourceYIndex].team2Color =
        fixtureTarget.team1Color;

    } else {
      fixtureArray[fixtureSourceYIndex].team2 =
        fixtureTarget.team2;
      fixtureArray[fixtureSourceYIndex].team2Name =
        fixtureTarget.team2Name;
      fixtureArray[fixtureSourceYIndex].team2Color =
        fixtureTarget.team2Color;

    }
  }

  if (targetZIndex === '0') {
    if (sourceZIndex === '0') {
      fixtureArray[fixtureTargetYIndex].team1 =
        fixtureSource.team1;
      fixtureArray[fixtureTargetYIndex].team1Name =
        fixtureSource.team1Name;
      fixtureArray[fixtureTargetYIndex].team1Color =
        fixtureSource.team1Color;

    } else {
      fixtureArray[fixtureTargetYIndex].team1 =
        fixtureSource.team2;
      fixtureArray[fixtureTargetYIndex].team1Name =
        fixtureSource.team2Name;
      fixtureArray[fixtureTargetYIndex].team1Color =
        fixtureSource.team2Color;

    }
  } else {
    if (sourceZIndex === '0') {
      fixtureArray[fixtureTargetYIndex].team2 =
        fixtureSource.team1;
      fixtureArray[fixtureTargetYIndex].team2Name =
        fixtureSource.team1Name;
      fixtureArray[fixtureTargetYIndex].team2Color =
        fixtureSource.team1Color;

    } else {
      fixtureArray[fixtureTargetYIndex].team2 =
        fixtureSource.team2;
      fixtureArray[fixtureTargetYIndex].team2Name =
        fixtureSource.team2Name;
      fixtureArray[fixtureTargetYIndex].team2Color =
        fixtureSource.team2Color;
    }
  }

  return fixtureArray
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
      return { ...state, onLoad: true, error: null, spinLoad: true, };

    case ApiConstants.API_GET_COMPETITION_DRAWS_SUCCESS:

      let drawsResultData = action.result;
      let resultData = roundstructureData(drawsResultData)
      state.publishStatus = action.result.drawsPublish
      state.isTeamInDraw = action.result.isTeamNotInDraws

      let orgData = JSON.parse(JSON.stringify(action.result.organisations))
      // let orgObject = {
      //   organisationName: "All",
      //   organisationUniqueKey: "-1"
      // }
      // orgData.unshift(orgObject)

      return {
        ...state,
        getRoundsDrawsdata: resultData.roundsdata,
        drawOrganisations: orgData,
        onLoad: false,
        error: null,
        spinLoad: false
      };

    /////get rounds in the competition draws
    case ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_LOAD:
      return { ...state, onLoad: true, updateLoad: true, error: null, drawOrganisations: [] };

    case ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_SUCCESS:
      state.competitionVenues = JSON.parse(JSON.stringify(action.Venue_Result))
      state.divisionGradeNameList = JSON.parse(JSON.stringify(action.division_Result))
      let DrawsRoundsData = JSON.parse(JSON.stringify(action.result))
      let venueObject = {
        name: "All Venues",
        id: 0
      }
      let divisionNameObject = {
        name: "All Division",
        competitionDivisionGradeId: 0
      }
      let roundNameObject = {
        roundId: 0, name: "All Rounds", startDateTime: ""
      }
      state.competitionVenues.unshift(venueObject)
      state.divisionGradeNameList.unshift(divisionNameObject)
      DrawsRoundsData.unshift(roundNameObject)
      state.updateLoad = false;
      return {
        ...state,
        onLoad: false,
        getDrawsRoundsData: DrawsRoundsData,
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
      let drawDataIndex = state.getRoundsDrawsdata.findIndex((x) => x.roundId === action.drawData)
      let drawDataCase = state.getRoundsDrawsdata[drawDataIndex].draws;
      let swapedDrawsArray = state.getRoundsDrawsdata[drawDataIndex].draws;
      if (action.actionType == 'add') {
        swapedDrawsArray = swapedDrawsArrayFunc(
          drawDataCase,
          sourceXIndex,
          targetXIndex,
          sourceYIndex,
          targetYIndex
        );
      } else {
        swapedDrawsArray = swapedDrawsEditArrayFunc(
          drawDataCase,
          sourceXIndex,
          targetXIndex,
          sourceYIndex,
          targetYIndex,
          action.sourceArray[2],
          action.targetArray[2]
        );
      }
      state.getRoundsDrawsdata[drawDataIndex].draws = swapedDrawsArray;
      return {
        ...state,
        onLoad: false,
        error: null,
        updateLoad: false,
      };

    //case 
    case ApiConstants.API_UPDATE_COMPETITION_SAVE_DRAWS_LOAD:
      return {
        ...state,
        onLoad: true,
        error: null
      }

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
      if (action.actionType == 'add') {
        let sourceXNullCaseIndex = action.sourceArray[0];
        let sourceYNullCaseIndex = action.sourceArray[1];
        let targetXNullCaseIndex = action.targetArray[0];
        let targetYNullCaseIndex = action.targetArray[1];
        let drawDataNullCaseIndex = state.getRoundsDrawsdata.findIndex((x) => x.roundId === action.drawData)
        let drawDataNullCase = state.getRoundsDrawsdata[drawDataNullCaseIndex].draws;

        let swapedDrawsArrayNullCase = state.getRoundsDrawsdata[drawDataNullCaseIndex].draws;

        swapedDrawsArrayNullCase = swapedDrawsArrayFunc(
          drawDataNullCase,
          sourceXNullCaseIndex,
          targetXNullCaseIndex,
          sourceYNullCaseIndex,
          targetYNullCaseIndex
        );
        // } else {
        //   swapedDrawsArrayNullCase = swapedDrawsEditArrayFunc(
        //     drawDataNullCase,
        //     sourceXNullCaseIndex,
        //     targetXNullCaseIndex,
        //     sourceYNullCaseIndex,
        //     targetYNullCaseIndex,
        //     action.sourceArray[2],
        //     action.targetArray[2]
        //   );
        // }
        // console.log(state.getStaticDrawsData, drawDataNullCaseIndex)
        state.getRoundsDrawsdata[drawDataNullCaseIndex].draws = swapedDrawsArrayNullCase;
      }

      return {
        ...state,
        onLoad: false,
        error: null,
        updateLoad: false,
      };

    case ApiConstants.cleardrawsData:
      state.isTeamInDraw = null
      state.publishStatus = 0
      state.getStaticDrawsData = [];
      state.dateArray = [];
      state.legendsArray = [];
      legendsArray = [];
      state.getRoundsDrawsdata = []
      state.drawOrganisations = []
      if (action.key == 'round') {
        state.competitionVenues = [];
        state.getDrawsRoundsData = [];
        state.divisionGradeNameList = [];
        state.legendsArray = [];
        legendsArray = []

      }
      return { ...state };

    ///draws division grade names list
    case ApiConstants.API_DRAWS_DIVISION_GRADE_NAME_LIST_LOAD:
      return {
        ...state,
        onLoad: true,
      };

    case ApiConstants.API_DRAWS_DIVISION_GRADE_NAME_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        divisionGradeNameList: isArrayNotEmpty(action.result) ? action.result : [],
      };

    case ApiConstants.API_DRAW_PUBLISH_LOAD:
      return { ...state, onLoad: true, updateLoad: true }

    case ApiConstants.API_DRAW_PUBLISH_SUCCESS:
      state.publishStatus = 1
      state.isTeamInDraw = null
      state.updateLoad = false
      return {
        ...state,
        onLoad: false,
        error: null,
      }

    case ApiConstants.API_DRAW_MATCHES_LIST_LOAD:
      return { ...state, onLoad: true }

    case ApiConstants.API_DRAW_MATCHES_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        error: null,
      }
    ////Competition Dashboard Case
    case ApiConstants.API_GET_DIVISION_LOAD:
      return {
        ...state,
        onLoad: true,
        divisionLoad: true,
        error: null
      }
    case ApiConstants.API_GET_DIVISION_SUCCESS:
      state.fixtureDivisionGradeNameList = action.result
      return { ...state, onLoad: true, divisionLoad: false };

    case ApiConstants.API_GET_FIXTURE_LOAD:
      colorsArrayDup = [...colorsArray]
      return {
        ...state,
        onLoad: true,
        updateFixtureLoad: true,
      }

    case ApiConstants.API_GET_FIXTURE_SUCCESS:
      let fixtureResult = setFixtureColor(action.result)
      state.fixtureArray = fixtureResult
      return {
        ...state,
        onLoad: false,
        updateFixtureLoad: false

      }

    case ApiConstants.clearFixtureData:
      state.fixtureArray = []
      if (action.key == 'grades') {
        state.fixtureDivisionGradeNameList = []
      }
      return { ...state };


    /// Update draws reducer ceses
    case ApiConstants.API_UPDATE_COMPETITION_FIXTURE_LOAD:
      colorsArrayDup = [...colorsArray]

      return {
        ...state,
        updateFixtureLoad: true,
      };

    case ApiConstants.API_UPDATE_COMPETITION_FIXTURE_SUCCESS:
      let updatedFixtureResult = setFixtureColor(action.fixtureResult)
      state.fixtureArray = updatedFixtureResult
      // let fixtureSourceXIndex = action.sourceArray[0];
      // let fixtureSourceYIndex = action.sourceArray[1];
      // let fixtureTargetXIndex = action.targetArray[0];
      // let fixtureTargetYIndex = action.targetArray[1];

      // let fixtureDataIndex = state.fixtureArray.findIndex((x) => x.roundId == action.roundId);
      // let fixtureData = state.fixtureArray[fixtureDataIndex].draws
      // let updatedFixtureData = state.fixtureArray[fixtureDataIndex].draws
      // updatedFixtureData = swapedFixtureArrayFunc(
      //   fixtureData,
      //   fixtureSourceXIndex,
      //   fixtureTargetXIndex,
      //   fixtureSourceYIndex,
      //   fixtureTargetYIndex,
      //   action.sourceArray[2],
      //   action.targetArray[2]
      // );
      // console.log(updatedFixtureData)
      // state.fixtureArray[fixtureDataIndex].draws = updatedFixtureData;
      return {
        ...state,
        onLoad: false,
        error: null,
        updateFixtureLoad: false,
      };

    case ApiConstants.API_UPDATE_DRAWS_LOCK_LOAD:
      return {
        ...state,
        onLoad: true,
        error: null,
        updateLoad: true
      }

    case ApiConstants.API_UPDATE_DRAWS_LOCK_SUCCESS:
      let getDrawsArray = state.getRoundsDrawsdata
      let getDrawsArrayIndex = getDrawsArray.findIndex((x) => x.roundId === action.roundId)
      let updatetLockValueIndex = getDrawsArray[getDrawsArrayIndex].draws.findIndex((x) => x.venueCourtId == action.venueCourtId)
      let updateslotsIndex = getDrawsArray[getDrawsArrayIndex].draws[updatetLockValueIndex].slotsArray.findIndex((x) => x.drawsId == action.drawsId)
      getDrawsArray[getDrawsArrayIndex].draws[updatetLockValueIndex].slotsArray[updateslotsIndex].isLocked = 0
      state.getRoundsDrawsdata = getDrawsArray
      return {
        ...state,
        onLoad: false,
        updateLoad: false
      }

       /////get rounds in the competition draws
    case ApiConstants.API_GET_DRAWS_ACTIVE_ROUNDS_LOAD:
      return { ...state, onActRndLoad: true, error: null };

    case ApiConstants.API_GET_DRAWS_ACTIVE_ROUNDS_SUCCESS:
      let activeDrawsRoundsData = JSON.parse(JSON.stringify(action.result))
      return {
        ...state,
        onActRndLoad: false,
        activeDrawsRoundsData: activeDrawsRoundsData,
        error: null,
      };
    default:
      return state;
  }
}

export default CompetitionDraws;
