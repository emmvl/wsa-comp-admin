import ApiConstants from '../../../themes/apiConstants';
import { isArrayNotEmpty, isNotNullOrEmptyString } from '../../../util/helpers';
import { isDateSame, sortArrayByDate } from './../../../themes/dateformate';
import ColorsArray from '../../../util/colorsArray';

const initialState = {
  changeStatus: false,
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
  maindivisionGradeNameList:[],
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
  onActRndLoad: false,
  teamNames: null,
  liveScoreCompetiton: null,
  allcompetitionDateRange: [],
  drawDivisions: [],
  drawsCompetitionArray: []


};
var gradeColorArray = [];
var gradeCompColorArray = []
var fixtureColorArray = [];
const colorsArray = ColorsArray;
const lightGray = '#999999';
var legendsArray = [];
let colorsArrayDup = [...colorsArray];
let allColorsArray = colorsArray

function createCompLegendsArray(drawsArray, currentLegends, dateArray) {
  let newArray = currentLegends
  for (let i in drawsArray) {
    for (let j in drawsArray[i].slotsArray) {
      let competitionName = drawsArray[i].slotsArray[j].competitionName
      let compIndex = currentLegends.findIndex((x) => x.competitionName == competitionName)
      if (compIndex === -1) {
        let color = drawsArray[i].slotsArray[j].colorCode
        if (color !== "#999999") {
          newArray.unshift({ competitionName: competitionName, legendArray: [] })
          // let index = currentLegends.findIndex((x) => x.colorCode === color)
          let object = {
            colorCode: color,
            gradeName: color == "#999999" ? "N/A" : drawsArray[i].slotsArray[j].gradeName,
            divisionName: drawsArray[i].slotsArray[j].divisionName ? drawsArray[i].slotsArray[j].divisionName : "N/A",
            competitionDivisionGradeId: drawsArray[i].slotsArray[j].competitionDivisionGradeId ? drawsArray[i].slotsArray[j].competitionDivisionGradeId : "N/A",
            "checked": true
          }

          // if (index === -1) {
          newArray[0].legendArray.push(object)
          // break;
          // }
        }
      } else {
        let color = drawsArray[i].slotsArray[j].colorCode
        let getIndex = newArray[compIndex].legendArray.findIndex((x) => x.colorCode === color)
        let object = {
          colorCode: color,
          gradeName: color == "#999999" ? "N/A" : drawsArray[i].slotsArray[j].gradeName,
          divisionName: drawsArray[i].slotsArray[j].divisionName ? drawsArray[i].slotsArray[j].divisionName : "N/A",
          competitionDivisionGradeId: drawsArray[i].slotsArray[j].competitionDivisionGradeId ? drawsArray[i].slotsArray[j].competitionDivisionGradeId : "N/A",
          "checked": true
        }
        if (getIndex === -1) {
          if (color !== "#999999") {
            newArray[compIndex].legendArray.push(object)
          }
        }
      }
    }
  }
  return newArray
}

function createLegendsArray(drawsArray, currentLegends, dateArray) {
  let newArray = currentLegends
  for (let i in drawsArray) {
    for (let j in drawsArray[i].slotsArray) {
      let color = drawsArray[i].slotsArray[j].colorCode
      let index = currentLegends.findIndex((x) => x.colorCode === color)
      let object = {
        colorCode: color,
        gradeName: color == "#999999" ? "N/A" : drawsArray[i].slotsArray[j].gradeName,
        divisionName: drawsArray[i].slotsArray[j].divisionName ? drawsArray[i].slotsArray[j].divisionName : "N/A"
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
  let newStructureDrawsData;
  const venuesData = data.venues;
  if (roundsdata.length > 0) {
    for (let i in roundsdata) {
      newStructureDrawsData = structureDrawsData(roundsdata[i].draws, "single", venuesData)
      roundsdata[i].draws = newStructureDrawsData.mainCourtNumberArray
      roundsdata[i].dateNewArray = newStructureDrawsData.sortedDateArray
      roundsdata[i].legendsArray = newStructureDrawsData.legendsArray
    }
  }
  return {
    roundsdata,
  }
}



function structureDrawsData(data, key, venuesData) {
  console.log(data)
  let mainCourtNumberArray = [];
  let dateArray = [];
  let gradeArray = [];
  let sortedDateArray = [];
  let legendArray = [];
  let sortMainCourtNumberArray = [];
if(data.length >0){
  venuesData.forEach(venue => {
    venue.courts.forEach(court => {
      const isCourtNotEmpty = data.some(dataSlot => dataSlot.venueCourtId === court.courtId);
      if(!isCourtNotEmpty) {
        mainCourtNumberArray.push({
          venueCourtNumber: court.courtName,
          venueCourtName: court.courtName + '',
          venueShortName: venue.shortName,
          venueNameCourtName: (JSON.stringify(venue.shortName) + JSON.stringify(court.courtName)),
          venueCourtId: court.courtId,
          roundId: venue.roundId ? venue.roundId : 0,
          venueId: venue.id,
          slotsArray: [],
        });
      }
    })
  })
}
  if (data) {
    if (isArrayNotEmpty(data)) {
      data.map((object) => {
        dateArray = setupDateObjectArray(dateArray, object)
        // if (checkDateNotInArray(dateArray, object.matchDate)) {
        //   let dateObject = checkOutOfRound(object)

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
            roundId: object.roundId ? object.roundId : 0,
            slotsArray: [],
          });
        }
      });
      sortedDateArray = sortDateArray(dateArray);
      sortMainCourtNumberArray = sortCourtArray(JSON.parse(JSON.stringify(mainCourtNumberArray)))

      mainCourtNumberArray = mapSlotObjectsWithTimeSlots(
        data,
        sortMainCourtNumberArray,
        sortedDateArray,
        gradeArray, key
      );
    }
  }
  legendsArray = key === "all" ? createCompLegendsArray(mainCourtNumberArray, legendArray, sortedDateArray) : createLegendsArray(mainCourtNumberArray, legendArray, sortedDateArray)
  return { mainCourtNumberArray, sortedDateArray, legendsArray };
}

function mapSlotObjectsWithTimeSlots(
  drawsArray,
  mainCourtNumberArray,
  sortedDateArray,
  gradeArray, key
) {
  for (let i in mainCourtNumberArray) {
    let tempSlotsArray = [];
    for (let j in sortedDateArray) {
      tempSlotsArray.push(
        getSlotFromDate(
          drawsArray,
          sortedDateArray[j].date,
          gradeArray, key,
          mainCourtNumberArray[i]
        )
      );
    }
    mainCourtNumberArray[i].slotsArray = tempSlotsArray;
  }
  return mainCourtNumberArray;
}

function getSlotFromDate(drawsArray, matchDate, gradeArray, key, mainCourtNumber) {
  let startTime;
  let endTime;
  const { venueCourtId, venueCourtNumber, venueCourtName, venueShortName, venueId } = mainCourtNumber;
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

      let gradeColour = key === "all" ? getCompGradeColor(drawsArray[i].competitionDivisionGradeId, drawsArray[i].competitionUniqueKey) : getGradeColor(drawsArray[i].competitionDivisionGradeId);

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
      let checkDuplicate=getDrawsDuplicate(drawsArray,drawsArray[i])
if(checkDuplicate ){
  drawsArray[i]['duplicate'] = true
}else{
  drawsArray[i]['duplicate'] = false
}

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
    venueCourtNumber,
    venueCourtName,
    venueCourtId,
    venueShortName,
    matchDate,
    startTime,
    endTime,
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
    venueId
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
}

function getDrawsDuplicate(drawsArray,drawsObject){
  for(let i in drawsArray){
    if(drawsArray[i].drawsId!== drawsObject.drawsId && drawsArray[i].venueCourtId === drawsObject.venueCourtId &&
      isDateSame(drawsArray[i].matchDate, drawsObject.matchDate)){
     return true
      }
  }
}

function pushColorDivision(division, drawsResultData) {
  console.log(division.length,'called',drawsResultData.length)
  let newDivisionArray = []
  for (let i in division) {
    let divisionGradeId = division[i].competitionDivisionGradeId
    for (let j in drawsResultData) {
      let draws = drawsResultData[j].draws
      for (let k in draws) {
        let slots = draws[k].slotsArray
        for (let l in slots) {
          if (slots[l].competitionDivisionGradeId == divisionGradeId) {
            let newDivisionobject = {
              divisionId: division[i].division,
              competitionDivisionGradeId: division[i].competitionDivisionGradeId,
              name: division[i].name,
              colorCode: slots[l].colorCode,
              checked: true
            }
            let index = newDivisionArray.findIndex((x) => x.colorCode === slots[l].colorCode)
            if (index === -1) {
              newDivisionArray.push(newDivisionobject)
            }
          }
        }

      }
    }
  }
  console.log('called',newDivisionArray)
  return newDivisionArray
}

function getCompetitionArray(draws) {
  let competitionArray = []
  for (let i in draws) {
    let competitionObject = {
      competitionName: draws[i].competitionName,
      checked: true
    }
    competitionArray.push(competitionObject)
  }
  return competitionArray
}

function allcompetitionDrawsData(data) {
  // let dateDrawsData = data.dates
  let newStructureDateDraws
  newStructureDateDraws = structureDrawsData(data.draws, "all",data.venues)
  data.draws = newStructureDateDraws.mainCourtNumberArray
  data.dateNewArray = newStructureDateDraws.sortedDateArray
  data.legendsArray = newStructureDateDraws.legendsArray
  return {
    data,
  }
}

function getCompGradeColor(gradeId, competitionUniqueKey) {
  let gradeColorCompTempArray = JSON.parse(JSON.stringify(gradeCompColorArray));
  let compIndex = gradeColorCompTempArray.findIndex((x) => x.competitionUniqueKey == competitionUniqueKey);
  var compGradeColor = lightGray;
  if (compIndex !== -1) {
    let compGradeIndex = gradeColorCompTempArray[compIndex].newGradesArray.findIndex((x) => x.gradeId == gradeId);
    if (compGradeIndex !== -1) {
      compGradeColor = gradeColorCompTempArray[compIndex].newGradesArray[compGradeIndex].colorCode
    }
    else {
      for (var i in allColorsArray) {
        let colorIndex = gradeColorCompTempArray[compIndex].newGradesArray.findIndex(
          (x) => x.colorCode === allColorsArray[i]
        );
        if (colorIndex === -1) {
          gradeCompColorArray[compIndex].newGradesArray.push({ gradeId: gradeId, colorCode: allColorsArray[i] });
          compGradeColor = allColorsArray[i];
          allColorsArray.splice(i, 1)
          break;
        }
      }
    }
  } else {
    gradeCompColorArray.unshift({ competitionUniqueKey: competitionUniqueKey, newGradesArray: [] })
    for (var j in allColorsArray) {
      let colorIndex = gradeCompColorArray[0].newGradesArray.findIndex(
        (x) => x.colorCode === allColorsArray[j]
      );
      if (colorIndex === -1) {
        gradeCompColorArray[0].newGradesArray.push({ gradeId: gradeId, colorCode: allColorsArray[j] })
        compGradeColor = allColorsArray[j];
        allColorsArray.splice(j, 1)
        break;
      }
    }
  }
  return compGradeColor
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
    notInDraw: drawObject.outOfCompetitionDate == 1 || drawObject.outOfRoundDate == 1
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

function checkSlotsDateStatus(slotsArray, checkdate) {
  let obj = {
    status: true,
    index: null
  }
  for (let i in slotsArray) {
    if (slotsArray[i].matchDate == checkdate) {
      if (slotsArray[i].drawsId == null) {
        obj = {
          status: false,
          index: i
        }
      }
      else {
        obj = {
          status: true,
          index: i
        }
      }
      break;
    }
    else {
      obj = {
        status: true,
        index: i
      }
    }
  }
  return obj
}


function checkDrawsArrayFunc(allDrawsData) {
  let drawsAllDateData = allDrawsData.dateNewArray
  let drawsAllData = allDrawsData.draws
  for (let i in drawsAllDateData) {
    let nullStatus = false
    let checkDrawsObject = null
    let checkdate = drawsAllDateData[i].date
    for (let j in drawsAllData) {
      checkDrawsObject = checkSlotsDateStatus(drawsAllData[j].slotsArray, checkdate)
      if (checkDrawsObject.status === false) {

      }
      else {
        nullStatus = true
        break;
      }
    }
    if (nullStatus === false) {
      for (let j in drawsAllData) {
        drawsAllData[j].slotsArray.splice(checkDrawsObject.index, 1)
      }
      drawsAllDateData.splice(i, 1)
    }
  }
  allDrawsData.dateNewArray = drawsAllDateData
  allDrawsData.draws = drawsAllData
  return allDrawsData
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
  return drawsArray;
}

function updateAllDivisions(drawsDivisionArray, value) {
  for (let i in drawsDivisionArray) {
    let divisionArray = drawsDivisionArray[i].legendArray
    for (let j in divisionArray) {
      divisionArray[j].checked = value
    }
  }
  return drawsDivisionArray
}

///insert checked parameter in venue array
function updateCompVenue(venueArray, value) {
  for (let i in venueArray) {
    venueArray[i].checked = value
  }
  return venueArray
}
//update all organisations checked
function updateAllOrganisations(orgArray, value) {
  for (let i in orgArray) {
    orgArray[i].checked = value
  }
  return orgArray
}


// update all checked competition
function updateCompArray(competitionArray, value) {
  for (let i in competitionArray) {
    competitionArray[i].checked = value
  }
  return competitionArray
}

function CompetitionMultiDraws(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.API_COMPETITION_MULTI_DRAWS_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        updateLoad: false,
        spinLoad: false
      };

    case ApiConstants.API_COMPETITION_MULTI_DRAWS_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        updateLoad: false,
        spinLoad: false
      };

    //competition part player grade calculate player grading summary get API
    case ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_LOAD:
      allColorsArray = [...colorsArray]
      return { ...state, onLoad: true, error: null, spinLoad: true, };

    case ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_SUCCESS:
      try {
        let resultData;
        let singleCompetitionDivision
        if (action.competitionId == "-1" || action.dateRangeCheck) {
          let allCompetiitonDraws = action.result
          
          resultData = allcompetitionDrawsData(allCompetiitonDraws)
          state.drawDivisions = resultData.data.legendsArray
        }
        else {
          let drawsResultData = action.result
        
          resultData = roundstructureData(drawsResultData)
          singleCompetitionDivision = pushColorDivision(JSON.parse(JSON.stringify(state.maindivisionGradeNameList)), JSON.parse(JSON.stringify(resultData.roundsdata)))
        }
        state.competitionVenues = action.result ? action.result.venues ? updateCompVenue(action.result.venues, true) : state.competitionVenues : state.competitionVenues

        state.publishStatus = action.result.drawsPublish
        state.isTeamInDraw = action.result.isTeamNotInDraws
        // state.drawDivisions  = action.competitionId == "-1" || action.dateRangeCheck ? resultData.data ? resultData.data.legendsArray : [] : []
        // let singleCompetitionDivision = action.competitionId != "-1" || !action.dateRangeChec && pushColorDivision(JSON.parse(JSON.stringify(state.divisionGradeNameList)), JSON.parse(JSON.stringify(resultData.roundsdata)))
        state.divisionGradeNameList = singleCompetitionDivision ? singleCompetitionDivision : []
        state.drawsCompetitionArray = state.drawDivisions.length > 0 ? getCompetitionArray(JSON.parse(JSON.stringify(state.drawDivisions))) : []
        let orgData = updateAllOrganisations(JSON.parse(JSON.stringify(action.result.organisations)), true)
        return {
          ...state,
          getRoundsDrawsdata: action.competitionId == "-1" || action.dateRangeCheck ? [resultData.data] : resultData.roundsdata,
          drawOrganisations: orgData,
          onLoad: false,
          error: null,
          spinLoad: false,
          updateLoad: false,
        };
      } catch (ex) {
        console.log("exception:", ex)
      }



    /////get rounds in the competition draws
    case ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_ROUNDS_LOAD:
      return { ...state, onLoad: true, updateLoad: true, error: null, drawOrganisations: [] };

    case ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_ROUNDS_SUCCESS:
      let updatedCompetitionVenues = updateCompVenue(action.Venue_Result, true)
      state.competitionVenues = updatedCompetitionVenues
      state.divisionGradeNameList = JSON.parse(JSON.stringify(action.division_Result))
      state.maindivisionGradeNameList = JSON.parse(JSON.stringify(action.division_Result))
      let DrawsRoundsData = JSON.parse(JSON.stringify(action.result))
      // let venueObject = {
      //   name: "All Venues",
      //   id: 0
      // }
      let divisionNameObject = {
        name: "All Division",
        competitionDivisionGradeId: 0
      }
      let roundNameObject = {
        roundId: 0, name: "All Rounds", startDateTime: ""
      }
      // state.competitionVenues.unshift(venueObject)
      // state.divisionGradeNameList.unshift(divisionNameObject)
      DrawsRoundsData.unshift(roundNameObject)
      state.allcompetitionDateRange = action.dateRangeResult
      state.updateLoad = false;
      return {
        ...state,
        onLoad: false,
        getDrawsRoundsData: DrawsRoundsData,
        error: null,
      };

    /// Update draws reducer ceses
    case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_LOAD:
      return {
        ...state,
        updateLoad: true,
      };

    case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_SUCCESS:
      let sourceXIndex = action.sourceArray[0];
      let sourceYIndex = action.sourceArray[1];
      let targetXIndex = action.targetArray[0];
      let targetYIndex = action.targetArray[1];
      if (action.actionType !== 'all') {
        let drawDataIndex = state.getRoundsDrawsdata.findIndex((x) => x.roundId === action.drawData)
        let drawDataCase = state.getRoundsDrawsdata[drawDataIndex].draws;
        let swapedDrawsArray = state.getRoundsDrawsdata[drawDataIndex].draws;
        if (action.actionType === 'add') {
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
      } else {
        let allDrawDataCase = state.getRoundsDrawsdata[0].draws;
        let allSwapedDrawsArray = state.getRoundsDrawsdata[0].draws;
        allSwapedDrawsArray = swapedDrawsArrayFunc(
          allDrawDataCase,
          sourceXIndex,
          targetXIndex,
          sourceYIndex,
          targetYIndex,
        );
        state.getRoundsDrawsdata[0].draws = allSwapedDrawsArray;
      }
      return {
        ...state,
        onLoad: false,
        error: null,
        updateLoad: false,
      };

    /// Update draws timeline reducer ceses
    case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_TIMELINE_LOAD:
      return {
        ...state,
        updateLoad: true,
      };

    case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_TIMELINE_SUCCESS:
      let sourceXIndexT = action.sourceArray[0];
      let sourceYIndexT = action.sourceArray[1];
      let targetXIndexT = action.targetArray[0];
      let targetYIndexT = action.targetArray[1];
      if (action.actionType !== 'all') {
        let drawDataIndex = state.getRoundsDrawsdata.findIndex((x) => x.roundId === action.drawData)
        let drawDataCase = state.getRoundsDrawsdata[drawDataIndex].draws;
        let swapedDrawsArray = state.getRoundsDrawsdata[drawDataIndex].draws;
        if (action.actionType === 'add') {
          swapedDrawsArray = swapedDrawsArrayFunc(
            drawDataCase,
            sourceXIndexT,
            targetXIndexT,
            sourceYIndexT,
            targetYIndexT
          );
        } else {
          swapedDrawsArray = swapedDrawsEditArrayFunc(
            drawDataCase,
            sourceXIndexT,
            targetXIndexT,
            sourceYIndexT,
            targetYIndexT,
            action.sourceArray[2],
            action.targetArray[2]
          );
        }
        state.getRoundsDrawsdata[drawDataIndex].draws = swapedDrawsArray;
      } else {
        let allDrawDataCase = state.getRoundsDrawsdata[0].draws;
        let allSwapedDrawsArray = state.getRoundsDrawsdata[0].draws;
        allSwapedDrawsArray = swapedDrawsArrayFunc(
          allDrawDataCase,
          sourceXIndexT,
          targetXIndexT,
          sourceYIndexT,
          targetYIndexT,
        );
        state.getRoundsDrawsdata[0].draws = allSwapedDrawsArray;
      }
      return {
        ...state,
        onLoad: false,
        error: null,
        updateLoad: false,
      };

    //case
    case ApiConstants.API_UPDATE_COMPETITION_SAVE_MULTI_DRAWS_LOAD:
      return {
        ...state,
        onLoad: true,
        error: null
      }

    /// Save Draws Success
    case ApiConstants.API_UPDATE_COMPETITION_SAVE_MULTI_DRAWS_SUCCESS:
      return {
        ...state,
        onLoad: false,
        error: null,
      };

    case ApiConstants.API_GET_COMPETITION_VENUES_MULTI_LOAD:
      return {
        ...state,
        onLoad: true,
      };

    //// Competition venues
    case ApiConstants.API_GET_COMPETITION_VENUES_MULTI_SUCCESS:
      return {
        ...state,
        onLoad: false,
        competitionVenues: action.result,
      };

    ///////update draws court timing where N/A(null) is there
    case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_COURT_TIMINGS_LOAD:
      return {
        ...state,
        updateLoad: true,
      };

    case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_COURT_TIMINGS_SUCCESS:
      let resultDataNew
      if (action.competitionId == "-1") {
        let allCompetiitonDraws = action.getResult;
        resultDataNew = allcompetitionDrawsData(allCompetiitonDraws)
      }
      else {
        let drawsResultData = action.getResult;
        resultDataNew = roundstructureData(drawsResultData)
      }

      state.publishStatus = action.getResult.drawsPublish
      state.isTeamInDraw = action.getResult.isTeamNotInDraws
      let orgDataNew = JSON.parse(JSON.stringify(action.getResult.organisations))
      return {
        ...state,
        getRoundsDrawsdata: action.competitionId == "-1" ? [resultDataNew.data] : resultDataNew.roundsdata,
        drawOrganisations: orgDataNew,
        onLoad: false,
        error: null,
        updateLoad: false,
      };

    case ApiConstants.clearMultidrawsData:
      state.drawDivisions = []
      state.isTeamInDraw = null
      state.publishStatus = 0
      state.getStaticDrawsData = [];
      state.dateArray = [];
      state.legendsArray = [];
      legendsArray = [];
      state.getRoundsDrawsdata = []
      state.drawOrganisations = []
      if (action.key === 'rounds') {
        state.allcompetitionDateRange = []
        state.competitionVenues = [];
        state.getDrawsRoundsData = [];
        state.divisionGradeNameList = [];
        state.maindivisionGradeNameList=[]
        state.legendsArray = [];
        legendsArray = [];
        state.drawsCompetitionArray = []
      }
      return { ...state };

    ///draws division grade names list
    case ApiConstants.API_MULTI_DRAWS_DIVISION_GRADE_NAME_LIST_LOAD:
      return {
        ...state,
        onLoad: true,
      };

    case ApiConstants.API_MULTI_DRAWS_DIVISION_GRADE_NAME_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        divisionGradeNameList: isArrayNotEmpty(action.result) ? action.result : [],
        maindivisionGradeNameList: isArrayNotEmpty(action.result) ? action.result : [],
        
      };

    case ApiConstants.API_MULTI_DRAW_PUBLISH_LOAD:
      return { ...state, onLoad: true, updateLoad: true, changeStatus: true }

    case ApiConstants.API_MULTI_DRAW_PUBLISH_SUCCESS:
      state.publishStatus = action.result.statusRefId;
      state.isTeamInDraw = null;
      state.updateLoad = false;
      state.teamNames = action.result.teamNames;
      state.liveScoreCompetiton = action.result.liveScoreCompetiton
      return {
        ...state,
        onLoad: false,
        changeStatus: false,
        teamNames: action.result.teamNames,
        error: null,
      }

    case ApiConstants.API_MULTI_DRAW_MATCHES_LIST_LOAD:
      return { ...state, onLoad: true }

    case ApiConstants.API_MULTI_DRAW_MATCHES_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        error: null,
      }
    ////Competition Dashboard Case
    case ApiConstants.API_GET_DIVISION_MULTI_LOAD:
      return {
        ...state,
        onLoad: true,
        divisionLoad: true,
        error: null
      }
    case ApiConstants.API_GET_DIVISION_MULTI_SUCCESS:
      state.fixtureDivisionGradeNameList = action.result
      return { ...state, onLoad: true, divisionLoad: false };

    case ApiConstants.clearFixtureData:
      state.fixtureArray = []
      if (action.key === 'grades') {
        state.fixtureDivisionGradeNameList = []
      }
      return { ...state };


    case ApiConstants.API_UPDATE_MULTI_DRAWS_LOCK_LOAD:
      return {
        ...state,
        onLoad: true,
        error: null,
        updateLoad: true
      }

    case ApiConstants.API_UPDATE_MULTI_DRAWS_LOCK_SUCCESS:
      let getDrawsArray = state.getRoundsDrawsdata
      if (action.key === "all") {
        let updatetLockValueIndex = getDrawsArray[0].draws.findIndex((x) => x.venueCourtId == action.venueCourtId)
        let updateslotsIndex = getDrawsArray[0].draws[updatetLockValueIndex].slotsArray.findIndex((x) => x.drawsId == action.drawsId)
        getDrawsArray[0].draws[updatetLockValueIndex].slotsArray[updateslotsIndex].isLocked = 0
        state.getRoundsDrawsdata = getDrawsArray
      } else {
        let getDrawsArrayIndex = getDrawsArray.findIndex((x) => x.roundId === action.roundId)
        let updatetLockValueIndex = getDrawsArray[getDrawsArrayIndex].draws.findIndex((x) => x.venueCourtId == action.venueCourtId)
        let updateslotsIndex = getDrawsArray[getDrawsArrayIndex].draws[updatetLockValueIndex].slotsArray.findIndex((x) => x.drawsId == action.drawsId)
        getDrawsArray[getDrawsArrayIndex].draws[updatetLockValueIndex].slotsArray[updateslotsIndex].isLocked = 0
        state.getRoundsDrawsdata = getDrawsArray
      }
      return {
        ...state,
        onLoad: false,
        updateLoad: false
      }

    /////get rounds in the competition draws
    case ApiConstants.API_GET_MULTI_DRAWS_ACTIVE_ROUNDS_LOAD:
      return { ...state, onActRndLoad: true, error: null };

    case ApiConstants.API_GET_MULTI_DRAWS_ACTIVE_ROUNDS_SUCCESS:
      let activeDrawsRoundsData = JSON.parse(JSON.stringify(action.result))
      return {
        ...state,
        onActRndLoad: false,
        activeDrawsRoundsData: activeDrawsRoundsData,
        error: null,
      };

    case ApiConstants.API_MULTI_CHANGE_DATE_RANGE_GET_VENUE_DIVISIONS_LOAD:
      return {
        ...state,
        onLoad: true,
        updateLoad: true, error: null, drawOrganisations: []
      }

    case ApiConstants.API_MULTI_CHANGE_DATE_RANGE_GET_VENUE_DIVISIONS_SUCCESS:
      let updatedCompetition_Venues = updateCompVenue(action.Venue_Result, true)
      state.competitionVenues = updatedCompetition_Venues
      state.divisionGradeNameList = JSON.parse(JSON.stringify(action.division_Result))
      state.maindivisionGradeNameList=JSON.parse(JSON.stringify(action.division_Result))
      let divisionNameObjectNew = {
        name: "All Division",
        competitionDivisionGradeId: 0
      }
      state.divisionGradeNameList.unshift(divisionNameObjectNew)
      state.updateLoad = false;
      return {
        ...state,
        onLoad: false,
        getDrawsRoundsData: [],
        error: null,
      };

    case ApiConstants.ONCHANGE_MULTI_FIELD_DRAWS_CHECKBOX:
      if (action.key === "singleCompeDivision") {
        state.divisionGradeNameList[action.index].checked = action.value
      }
      if (action.key === "competitionVenues") {
        state[action.key][action.index].checked = action.value
      }
      if (action.key === "competition") {
        state.drawsCompetitionArray[action.index].checked = action.value
      }
      if (action.key == "division") {
        state.drawDivisions[action.index].legendArray[action.subIndex].checked = action.value
      }
      if (action.key === 'allCompetitionVenues') {
        let allVenueChange = updateCompVenue(JSON.parse(JSON.stringify(state.competitionVenues)), action.value)
        state.competitionVenues = allVenueChange

      }
      if (action.key === "allCompetition") {
        let allCompetitionChange = updateCompArray(JSON.parse(JSON.stringify(state.drawsCompetitionArray)), action.value)
        state.drawsCompetitionArray = allCompetitionChange
      }
      if (action.key === "allOrganisation") {
        let allOrganisations = updateAllOrganisations(JSON.parse(JSON.stringify(state.drawOrganisations)), action.value)
        state.drawOrganisations = allOrganisations

      }
      if (action.key == "organisation") {
        state.drawOrganisations[action.index].checked = action.value
      }
      if (action.key === "allDivisionChecked") {
        let allDivision = updateAllDivisions(JSON.parse(JSON.stringify(state.drawDivisions)), action.value)
        state.drawDivisions = allDivision
      }
      if (action.key === "singleCompDivisionCheked") {
        let singleCompAllDivision = updateAllOrganisations(JSON.parse(JSON.stringify(state.divisionGradeNameList)), action.value)
        state.divisionGradeNameList = singleCompAllDivision ? singleCompAllDivision : []
      }

      return {
        ...state,
        onLoad: false,
        error: null,
      };


    default:
      return state;
  }
}

export default CompetitionMultiDraws;
