/* eslint-disable no-param-reassign, guard-for-in, no-restricted-syntax */
import ColorsArray from 'util/colorsArray';
import {
    isArrayNotEmpty,
    // isNotNullOrEmptyString
} from 'util/helpers';
import ApiConstants from 'themes/apiConstants';
import { isDateSame, sortArrayByDate } from 'themes/dateformate';

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
    maindivisionGradeNameList: [],
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
    drawsCompetitionArray: [],
    onImportLoad: false,
    isPastMatchAvailable :null,
    isTimelineMode: false,
};

const gradeColorArray = [];
const gradeCompColorArray = []
// let fixtureColorArray = [];
const colorsArray = ColorsArray;
const lightGray = '#999999';
let legendsArray = [];
// let colorsArrayDup = [...colorsArray];
let allColorsArray = colorsArray

export const checkColorMatching = (color) => (x) => x.colorCode === color;

function createCompLegendsArray(drawsArray, currentLegends, dateArray) {
    const newArray = currentLegends
    for (const i in drawsArray) {
        for (const j in drawsArray[i].slotsArray) {
            const { competitionName } = drawsArray[i].slotsArray[j];
            const compIndex = currentLegends.findIndex((x) => x.competitionName === competitionName)
            if (compIndex === -1) {
                const color = drawsArray[i].slotsArray[j].colorCode
                if (color !== "#999999") {
                    newArray.unshift({ competitionName, legendArray: [] })
                    // let index = currentLegends.findIndex((x) => x.colorCode === color)
                    const object = {
                        colorCode: color,
                        gradeName: color === "#999999" ? "N/A" : drawsArray[i].slotsArray[j].gradeName,
                        divisionName: drawsArray[i].slotsArray[j].divisionName ? drawsArray[i].slotsArray[j].divisionName : "N/A",
                        competitionDivisionGradeId: drawsArray[i].slotsArray[j].competitionDivisionGradeId
                            ? drawsArray[i].slotsArray[j].competitionDivisionGradeId
                            : "N/A",
                        checked: true,
                    }

                    // if (index === -1) {
                    newArray[0].legendArray.push(object)
                    //     break;
                    // }
                }
            } else {
                const color = drawsArray[i].slotsArray[j].colorCode
                const getIndex = newArray[compIndex].legendArray.findIndex((x) => x.colorCode === color)
                const object = {
                    colorCode: color,
                    gradeName: color === "#999999" ? "N/A" : drawsArray[i].slotsArray[j].gradeName,
                    divisionName: drawsArray[i].slotsArray[j].divisionName ? drawsArray[i].slotsArray[j].divisionName : "N/A",
                    competitionDivisionGradeId: drawsArray[i].slotsArray[j].competitionDivisionGradeId
                        ? drawsArray[i].slotsArray[j].competitionDivisionGradeId
                        : "N/A",
                    checked: true,
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
    const newArray = currentLegends
    for (const i in drawsArray) {
        for (const j in drawsArray[i].slotsArray) {
            const color = drawsArray[i].slotsArray[j].colorCode
            const index = currentLegends.findIndex((x) => x.colorCode === color)
            const object = {
                colorCode: color,
                gradeName: color === "#999999" ? "N/A" : drawsArray[i].slotsArray[j].gradeName,
                divisionName: drawsArray[i].slotsArray[j].divisionName ? drawsArray[i].slotsArray[j].divisionName : "N/A",
            }
            if (index === -1) {
                if (color !== "#999999") {
                    newArray.push(object)
                }
            }
        }
    }
    const dateArrayLength = isArrayNotEmpty(dateArray) ? dateArray.length : 1
    let temparray = []
    const finalLegendsChunkArray = []
    for (let i = 0, j = newArray.length; i < j; i += dateArrayLength) {
        temparray = newArray.slice(i, i + dateArrayLength);
        finalLegendsChunkArray.push(temparray)
    }
    return finalLegendsChunkArray
}

// function setFixtureColor(data) {
//     let fixtureDraws
//     for (let i in data) {
//         fixtureDraws = data[i].draws
//         for (let j in fixtureDraws) {
//             // let colorTeam = getColor(fixtureDraws[j].team1)
//             fixtureDraws[j].team1Color = getFixtureColor(fixtureDraws[j].team1)
//             fixtureDraws[j].team2Color = getFixtureColor(fixtureDraws[j].team2)
//         }
//     }
//     return data
// }

// sort court array
function sortCourtArray(mainCourtNumberArray) {
    let isSortedArray = []
    const sortAlphaNum = (a, b) => a.venueNameCourtName.localeCompare(b.venueNameCourtName, 'en', { numeric: true })
    isSortedArray = mainCourtNumberArray.sort(sortAlphaNum)
    return isSortedArray
}

function sortDateArray(dateArray) {
    let inDrawsArray = []
    let outDrawsArray = []
    for (const i in dateArray) {
        if (dateArray[i].notInDraw === false) {
            inDrawsArray.push(dateArray[i])
        } else {
            outDrawsArray.push(dateArray[i])
        }
    }
    inDrawsArray = sortArrayByDate(inDrawsArray)
    outDrawsArray = sortArrayByDate(outDrawsArray)
    return inDrawsArray.concat(outDrawsArray);
}

function setupDateObjectArray(dateArray, drawObject) {
    const tempDateArray = JSON.parse(JSON.stringify(dateArray))
    const defaultDateObject = {
        date: drawObject.matchDate,
        endTime: drawObject.endTime,
        notInDraw: drawObject.outOfCompetitionDate === 1 || drawObject.outOfRoundDate === 1,
    }
    for (const i in dateArray) {
        if (isDateSame(dateArray[i].date, drawObject.matchDate)) {
            if (tempDateArray[i].notInDraw === false) {
                tempDateArray[i] = defaultDateObject
            }
            return tempDateArray;
        }
    }
    tempDateArray.push(defaultDateObject)
    return tempDateArray;
}

function setupGradesArray(gradesArray, gradeId) {
    for (const i in gradesArray) {
        if (gradesArray[i] === gradeId) {
            return false;
        }
    }
    return true;
}

function checkVenueCourtNumber(mainCourtNumberArray, object) {
    for (const i in mainCourtNumberArray) {
        if (mainCourtNumberArray[i].venueCourtId === object.venueCourtId) {
            return { status: true, index: i };
        }
    }
    return { status: false, index: -1 };
}

function getDrawsDuplicate(drawsArray, drawsObject) {
    for (const i in drawsArray) {
        if (drawsArray[i].drawsId !== drawsObject.drawsId
            && drawsArray[i].venueCourtId === drawsObject.venueCourtId
            && isDateSame(drawsArray[i].matchDate, drawsObject.matchDate)
        ) {
            return true
        }
    }
}

function getCompGradeColor(gradeId, competitionUniqueKey) {
    const gradeColorCompTempArray = JSON.parse(JSON.stringify(gradeCompColorArray));
    const compIndex = gradeColorCompTempArray.findIndex((x) => x.competitionUniqueKey === competitionUniqueKey);
    let compGradeColor = lightGray;
    if (compIndex !== -1) {
        const compGradeIndex = gradeColorCompTempArray[compIndex].newGradesArray.findIndex((x) => x.gradeId === gradeId);
        if (compGradeIndex !== -1) {
            compGradeColor = gradeColorCompTempArray[compIndex].newGradesArray[compGradeIndex].colorCode
        } else {
            for (const i in allColorsArray) {
                const colorIndex = gradeColorCompTempArray[compIndex].newGradesArray.findIndex(checkColorMatching(allColorsArray[i]));
                if (colorIndex === -1) {
                    gradeCompColorArray[compIndex].newGradesArray.push({
                        gradeId,
                        colorCode: allColorsArray[i],
                    });
                    compGradeColor = allColorsArray[i];
                    allColorsArray.splice(i, 1)
                    break;
                }
            }
        }
    } else {
        gradeCompColorArray.unshift({ competitionUniqueKey, newGradesArray: [] })
        for (const j in allColorsArray) {
            const colorIndex = gradeCompColorArray[0].newGradesArray.findIndex(checkColorMatching(allColorsArray[j]));
            if (colorIndex === -1) {
                gradeCompColorArray[0].newGradesArray.push({ gradeId, colorCode: allColorsArray[j] })
                compGradeColor = allColorsArray[j];
                allColorsArray.splice(j, 1)
                break;
            }
        }
    }
    return compGradeColor
}

function getGradeColor(gradeId) {
    const gradeColorTempArray = JSON.parse(JSON.stringify(gradeColorArray));
    const index = gradeColorTempArray.findIndex((x) => x.gradeId === gradeId);

    let color = lightGray;
    if (index !== -1) {
        color = gradeColorTempArray[index].colorCode;
    } else {
        for (const i in colorsArray) {
            const colorIndex = gradeColorTempArray.findIndex(checkColorMatching(colorsArray[i]));
            if (colorIndex === -1) {
                gradeColorArray.push({ gradeId, colorCode: colorsArray[i] });
                color = colorsArray[i];
                break;
            }
        }
    }
    return color;
}

function getSlotFromDate(drawsArray, matchDate, gradeArray, key, mainCourtNumber) {
    let startTime;
    let endTime;
    const {
        venueCourtId,
        venueCourtNumber,
        venueCourtName,
        venueShortName,
        venueId,
    } = mainCourtNumber;
    for (const i in drawsArray) {
        startTime = drawsArray[i].startTime;
        endTime = drawsArray[i].endTime;
        if (drawsArray[i].venueCourtId === venueCourtId && isDateSame(drawsArray[i].matchDate, matchDate)) {
            // let gradeIndex = gradeArray.indexOf(
            //     drawsArray[i].competitionDivisionGradeId
            // );

            const gradeColour = key === "all"
                ? getCompGradeColor(drawsArray[i].competitionDivisionGradeId, drawsArray[i].competitionUniqueKey)
                : getGradeColor(drawsArray[i].competitionDivisionGradeId);

            // if (gradeIndex === -1) {
            drawsArray[i].colorCode = gradeColour;
            // } else {
            //     if (gradeIndex < 39) {
            //         drawsArray[i].colorCode = colorsArray[gradeIndex];
            //     } else {
            //         drawsArray[i].colorCode = '#999999';
            //     }
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
            const checkDuplicate = getDrawsDuplicate(drawsArray, drawsArray[i])
            if (checkDuplicate) {
                drawsArray[i].duplicate = true
            } else {
                drawsArray[i].duplicate = false
            }

            return drawsArray[i];
        }
    }
    const teamArray = [
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
        teamArray,
        venueId,
    };
}

function mapSlotObjectsWithTimeSlots(
    drawsArray,
    mainCourtNumberArray,
    sortedDateArray,
    gradeArray,
    key,
) {
    for (const i in mainCourtNumberArray) {
        const tempSlotsArray = [];
        for (const j in sortedDateArray) {
            tempSlotsArray.push(
                getSlotFromDate(
                    drawsArray,
                    sortedDateArray[j].date,
                    gradeArray, key,
                    mainCourtNumberArray[i],
                ),
            );
        }
        mainCourtNumberArray[i].slotsArray = tempSlotsArray;
    }
    return mainCourtNumberArray;
}

function structureDrawsData(data, key, venuesData) {
    let mainCourtNumberArray = [];
    let dateArray = [];
    const gradeArray = [];
    let sortedDateArray = [];
    const legendArray = [];
    let sortMainCourtNumberArray = [];
    if (data.length > 0 && venuesData) {
        venuesData.forEach((venue) => {
            venue.courts.forEach((court) => {
                const isCourtNotEmpty = data.some((dataSlot) => dataSlot.venueCourtId === court.courtId);
                if (!isCourtNotEmpty) {
                    mainCourtNumberArray.push({
                        venueCourtNumber: court.courtName,
                        venueCourtName: `${court.courtName}`,
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
            data.forEach((object) => {
                dateArray = setupDateObjectArray(dateArray, object)
                // if (checkDateNotInArray(dateArray, object.matchDate)) {
                //     let dateObject = checkOutOfRound(object)
                //     dateArray.push(dateObject);
                // }
                if (setupGradesArray(gradeArray, object.competitionDivisionGradeId)) {
                    gradeArray.push(object.competitionDivisionGradeId);
                }
                const courtNumberResponse = checkVenueCourtNumber(mainCourtNumberArray, object);
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
                gradeArray,
                key,
            );
        }
    }
    legendsArray = key === "all"
        ? createCompLegendsArray(mainCourtNumberArray, legendArray, sortedDateArray)
        : createLegendsArray(mainCourtNumberArray, legendArray, sortedDateArray)
    return { mainCourtNumberArray, sortedDateArray, legendsArray };
}

function roundStructureData(data) {
    const roundsdata = data.rounds
    let newStructureDrawsData;
    const venuesData = data.venues;
    if (roundsdata.length > 0) {
        for (const i in roundsdata) {
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

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// function getFixtureColor(team) {
//     let teamColorTempArray = JSON.parse(JSON.stringify(fixtureColorArray));
//     let index = teamColorTempArray.findIndex((x) => x.team === team);
//
//     var color = lightGray;
//     if (index !== -1) {
//         color = teamColorTempArray[index].colorCode;
//     } else {
//         for (var i in colorsArray) {
//             let colorIndex = teamColorTempArray.findIndex(
//                 (x) => x.colorCode === colorsArray[i]
//             );
//             if (colorIndex === -1) {
//                 fixtureColorArray.push({ team: team, colorCode: colorsArray[i] });
//                 color = colorsArray[i];
//                 break;
//             }
//         }
//     }
//     return color;
// }

function pushColorDivision(division, drawsResultData) {
    const newDivisionArray = []
    for (const i in division) {
        const divisionGradeId = division[i].competitionDivisionGradeId
        for (const j in drawsResultData) {
            const { draws } = drawsResultData[j]
            for (const k in draws) {
                const slots = draws[k].slotsArray
                for (const l in slots) {
                    if (slots[l].competitionDivisionGradeId === divisionGradeId) {
                        const newDivisionobject = {
                            divisionId: division[i].division,
                            competitionDivisionGradeId: division[i].competitionDivisionGradeId,
                            name: division[i].name,
                            colorCode: slots[l].colorCode,
                            checked: true,
                        }
                        const index = newDivisionArray.findIndex((x) => x.colorCode === slots[l].colorCode)
                        if (index === -1) {
                            newDivisionArray.push(newDivisionobject)
                        }
                    }
                }
            }
        }
    }
    return newDivisionArray
}

function getCompetitionArray(draws) {
    const competitionArray = []
    for (const i in draws) {
        const competitionObject = {
            competitionName: draws[i].competitionName,
            checked: true,
        }
        competitionArray.push(competitionObject)
    }
    return competitionArray
}

function allcompetitionDrawsData(data) {
    // let dateDrawsData = data.dates
    const newStructureDateDraws = structureDrawsData(data.draws, "all", data.venues)
    data.draws = newStructureDateDraws.mainCourtNumberArray
    data.dateNewArray = newStructureDateDraws.sortedDateArray
    data.legendsArray = newStructureDateDraws.legendsArray
    return {
        data,
    }
}

// function checkSlots(slotsArray, slotObject) {
//     for (let i in slotsArray) {
//         if (isDateSame(slotsArray[i].fixtureTime, slotObject.matchDate)) {
//             return { status: true, index: i };
//         }
//     }
//     return { status: false, index: -1 };
// }

// function checkDateNotInArray(dateArray, date) {
//     for (let i in dateArray) {
//         if (isDateSame(dateArray[i].date, date)) {
//             return false;
//         }
//     }
//     return true;
// }

// function checkSlotsDateStatus(slotsArray, checkdate) {
//     let obj = {
//         status: true,
//         index: null
//     }
//     for (let i in slotsArray) {
//         if (slotsArray[i].matchDate === checkdate) {
//             if (slotsArray[i].drawsId === null) {
//                 obj = {
//                     status: false,
//                     index: i
//                 }
//             } else {
//                 obj = {
//                     status: true,
//                     index: i
//                 }
//             }
//             break;
//         } else {
//             obj = {
//                 status: true,
//                 index: i
//             }
//         }
//     }
//     return obj
// }

// function checkDrawsArrayFunc(allDrawsData) {
//     let drawsAllDateData = allDrawsData.dateNewArray
//     let drawsAllData = allDrawsData.draws
//     for (let i in drawsAllDateData) {
//         let nullStatus = false
//         let checkDrawsObject = null
//         let checkdate = drawsAllDateData[i].date
//         for (let j in drawsAllData) {
//             checkDrawsObject = checkSlotsDateStatus(drawsAllData[j].slotsArray, checkdate)
//             if (checkDrawsObject.status === false) {
//
//             } else {
//                 nullStatus = true
//                 break;
//             }
//         }
//         if (nullStatus === false) {
//             for (let j in drawsAllData) {
//                 drawsAllData[j].slotsArray.splice(checkDrawsObject.index, 1)
//             }
//             drawsAllDateData.splice(i, 1)
//         }
//     }
//     allDrawsData.dateNewArray = drawsAllDateData
//     allDrawsData.draws = drawsAllData
//     return allDrawsData
// }

// Swipe Array object - draws
function swapedDrawsArrayFunc(
    drawsArray,
    sourtXIndex,
    targetXIndex,
    sourceYIndex,
    targetYIndex,
) {
    const sourceArray = JSON.parse(JSON.stringify(drawsArray));
    const targetArray = JSON.parse(JSON.stringify(drawsArray));
    sourceArray[sourtXIndex].slotsArray[sourceYIndex].isLocked = 1
    const source = JSON.parse(JSON.stringify(sourceArray[sourtXIndex].slotsArray[sourceYIndex]));
    targetArray[targetXIndex].slotsArray[targetYIndex].isLocked = 1
    const target = JSON.parse(JSON.stringify(targetArray[targetXIndex].slotsArray[targetYIndex]));
    const sourceCopy = JSON.parse(JSON.stringify(sourceArray[sourtXIndex].slotsArray[sourceYIndex]));
    const targetCopy = JSON.parse(JSON.stringify(targetArray[targetXIndex].slotsArray[targetYIndex]));
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

// function swapedFixtureArrayFunc(
//     fixtureArray,
//     fixtureSourceXIndex,
//     fixtureTargetXIndex,
//     fixtureSourceYIndex,
//     fixtureTargetYIndex,
//     sourceZIndex,
//     targetZIndex,
// ) {
//     let fixtureSourceArray = JSON.parse(JSON.stringify(fixtureArray))
//     let fixtureTargetArray = JSON.parse(JSON.stringify(fixtureArray))
//     let fixtureSource = fixtureSourceArray[fixtureSourceYIndex];
//     let fixtureTarget = fixtureTargetArray[fixtureTargetYIndex];
//
//     if (sourceZIndex === '0') {
//         if (targetZIndex === '0') {
//             fixtureArray[fixtureSourceYIndex].team1 = fixtureTarget.team1;
//             fixtureArray[fixtureSourceYIndex].team1Name = fixtureTarget.team1Name;
//             fixtureArray[fixtureSourceYIndex].team1Color = fixtureTarget.team1Color
//         } else {
//             fixtureArray[fixtureSourceYIndex].team1 = fixtureTarget.team2;
//             fixtureArray[fixtureSourceYIndex].team1Name = fixtureTarget.team2Name;
//             fixtureArray[fixtureSourceYIndex].team1Color = fixtureTarget.team2Color;
//         }
//     } else if (targetZIndex === '0') {
//         fixtureArray[fixtureSourceYIndex].team2 = fixtureTarget.team1;
//         fixtureArray[fixtureSourceYIndex].team2Name = fixtureTarget.team1Name;
//         fixtureArray[fixtureSourceYIndex].team2Color = fixtureTarget.team1Color;
//     } else {
//         fixtureArray[fixtureSourceYIndex].team2 = fixtureTarget.team2;
//         fixtureArray[fixtureSourceYIndex].team2Name = fixtureTarget.team2Name;
//         fixtureArray[fixtureSourceYIndex].team2Color = fixtureTarget.team2Color;
//     }
//
//     if (targetZIndex === '0') {
//         if (sourceZIndex === '0') {
//             fixtureArray[fixtureTargetYIndex].team1 = fixtureSource.team1;
//             fixtureArray[fixtureTargetYIndex].team1Name = fixtureSource.team1Name;
//             fixtureArray[fixtureTargetYIndex].team1Color = fixtureSource.team1Color;
//         } else {
//             fixtureArray[fixtureTargetYIndex].team1 = fixtureSource.team2;
//             fixtureArray[fixtureTargetYIndex].team1Name = fixtureSource.team2Name;
//             fixtureArray[fixtureTargetYIndex].team1Color = fixtureSource.team2Color;
//         }
//     } else if (sourceZIndex === '0') {
//         fixtureArray[fixtureTargetYIndex].team2 = fixtureSource.team1;
//         fixtureArray[fixtureTargetYIndex].team2Name = fixtureSource.team1Name;
//         fixtureArray[fixtureTargetYIndex].team2Color = fixtureSource.team1Color;
//     } else {
//         fixtureArray[fixtureTargetYIndex].team2 = fixtureSource.team2;
//         fixtureArray[fixtureTargetYIndex].team2Name = fixtureSource.team2Name;
//         fixtureArray[fixtureTargetYIndex].team2Color = fixtureSource.team2Color;
//     }
//
//     return fixtureArray
// }

// Swipe Array object - Edit
function swapedDrawsEditArrayFunc(
    drawsArray,
    sourceXIndex,
    targetXIndex,
    sourceYIndex,
    targetYIndex,
    sourceZIndex,
    targetZIndex,
) {
    const sourceArray = JSON.parse(JSON.stringify(drawsArray));
    const targetArray = JSON.parse(JSON.stringify(drawsArray));
    // const sourceItem = sourceArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[sourceZIndex];
    // const targetItem = targetArray[targetXIndex].slotsArray[targetYIndex].teamArray[targetZIndex];
    const source = sourceArray[sourceXIndex].slotsArray[sourceYIndex];
    const target = targetArray[targetXIndex].slotsArray[targetYIndex];

    if (sourceZIndex === '0') {
        if (targetZIndex === '0') {
            drawsArray[sourceXIndex].slotsArray[sourceYIndex].homeTeamId = target.homeTeamId;
            drawsArray[sourceXIndex].slotsArray[sourceYIndex].homeTeamName = target.homeTeamName;
            drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[0].teamId = target.homeTeamId;
            drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[0].teamName = target.homeTeamName;
        } else {
            drawsArray[sourceXIndex].slotsArray[sourceYIndex].homeTeamId = target.awayTeamId;
            drawsArray[sourceXIndex].slotsArray[sourceYIndex].homeTeamName = target.awayTeamName;
            drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[0].teamId = target.awayTeamId;
            drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[0].teamName = target.awayTeamName;
        }
    } else if (targetZIndex === '0') {
        drawsArray[sourceXIndex].slotsArray[sourceYIndex].awayTeamId = target.homeTeamId;
        drawsArray[sourceXIndex].slotsArray[sourceYIndex].awayTeamName = target.homeTeamName;
        drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[1].teamId = target.homeTeamId;
        drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[1].teamName = target.homeTeamName;
    } else {
        drawsArray[sourceXIndex].slotsArray[sourceYIndex].awayTeamId = target.awayTeamId;
        drawsArray[sourceXIndex].slotsArray[sourceYIndex].awayTeamName = target.awayTeamName;
        drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[1].teamId = target.awayTeamId;
        drawsArray[sourceXIndex].slotsArray[sourceYIndex].teamArray[1].teamName = target.awayTeamName;
    }

    if (targetZIndex === '0') {
        if (sourceZIndex === '0') {
            drawsArray[targetXIndex].slotsArray[targetYIndex].homeTeamId = source.homeTeamId;
            drawsArray[targetXIndex].slotsArray[targetYIndex].homeTeamName = source.homeTeamName;
            drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[0].teamId = source.homeTeamId;
            drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[0].teamName = source.homeTeamName;
        } else {
            drawsArray[targetXIndex].slotsArray[targetYIndex].homeTeamId = source.awayTeamId;
            drawsArray[targetXIndex].slotsArray[targetYIndex].homeTeamName = source.awayTeamName;
            drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[0].teamId = source.awayTeamId;
            drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[0].teamName = source.awayTeamName;
        }
    } else if (sourceZIndex === '0') {
        drawsArray[targetXIndex].slotsArray[targetYIndex].awayTeamId = source.homeTeamId;
        drawsArray[targetXIndex].slotsArray[targetYIndex].awayTeamName = source.homeTeamName;
        drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[1].teamId = source.homeTeamId;
        drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[1].teamName = source.homeTeamName;
    } else {
        drawsArray[targetXIndex].slotsArray[targetYIndex].awayTeamId = source.awayTeamId;
        drawsArray[targetXIndex].slotsArray[targetYIndex].awayTeamName = source.awayTeamName;
        drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[1].teamId = source.awayTeamId;
        drawsArray[targetXIndex].slotsArray[targetYIndex].teamArray[1].teamName = source.awayTeamName;
    }
    return drawsArray;
}

function updateAllDivisions(drawsDivisionArray, value) {
    for (const i in drawsDivisionArray) {
        const divisionArray = drawsDivisionArray[i].legendArray
        for (const j in divisionArray) {
            divisionArray[j].checked = value
        }
    }
    return drawsDivisionArray
}

// insert checked parameter in venue array
function updateCompVenue(venueArray, value) {
    for (const i in venueArray) {
        venueArray[i].checked = value
    }
    return venueArray
}

// update all organisations checked
function updateAllOrganisations(orgArray, value) {
    for (const i in orgArray) {
        orgArray[i].checked = value
    }
    return orgArray
}

// update all checked competition
function updateCompArray(competitionArray, value) {
    for (const i in competitionArray) {
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
                spinLoad: false,
            };

        case ApiConstants.API_COMPETITION_MULTI_DRAWS_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                updateLoad: false,
                spinLoad: false,
            };

        // competition part player grade calculate player grading summary get API
        case ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_LOAD:
            allColorsArray = [...colorsArray]
            return {
                ...state,
                onLoad: true,
                error: null,
                spinLoad: true,
            };

        case ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_SUCCESS:
            try {
                let resultData;
                let singleCompetitionDivision
                if (action.competitionId === "-1" || action.dateRangeCheck) {
                    const allCompetiitonDraws = action.result
                    resultData = allcompetitionDrawsData(allCompetiitonDraws)
                    state.drawDivisions = resultData.data.legendsArray
                } else {
                    const drawsResultData = action.result
                    resultData = roundStructureData(drawsResultData)
                    singleCompetitionDivision = pushColorDivision(
                        JSON.parse(JSON.stringify(state.maindivisionGradeNameList)),
                        JSON.parse(JSON.stringify(resultData.roundsdata)),
                    )
                }
                state.competitionVenues = action.result
                    ? action.result.venues ? updateCompVenue(action.result.venues, true) : state.competitionVenues
                    : state.competitionVenues

                state.publishStatus = action.result.drawsPublish
                state.isTeamInDraw = action.result.isTeamNotInDraws
                state.isPastMatchAvailable = action.result.isPastMatchAvailable
                // state.drawDivisions = action.competitionId === "-1" || action.dateRangeCheck
                //     ? resultData.data ? resultData.data.legendsArray : []
                //     : []
                // eslint-disable-next-line max-len
                // let singleCompetitionDivision = action.competitionId != "-1" || !action.dateRangeChec && pushColorDivision(JSON.parse(JSON.stringify(state.divisionGradeNameList)), JSON.parse(JSON.stringify(resultData.roundsdata)))
                state.divisionGradeNameList = singleCompetitionDivision || []
                state.drawsCompetitionArray = state.drawDivisions.length > 0
                    ? getCompetitionArray(JSON.parse(JSON.stringify(state.drawDivisions)))
                    : []
                const orgData = updateAllOrganisations(JSON.parse(JSON.stringify(action.result.organisations)), true)
                return {
                    ...state,
                    getRoundsDrawsdata: action.competitionId === "-1" || action.dateRangeCheck ? [resultData.data] : resultData.roundsdata,
                    drawOrganisations: orgData,
                    onLoad: false,
                    error: null,
                    spinLoad: false,
                    updateLoad: false,
                };
            } catch (ex) {
                console.log("exception:", ex)
            }
            return { ...state };

        // get rounds in the competition draws
        case ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_ROUNDS_LOAD:
            return {
                ...state,
                onLoad: true,
                updateLoad: true,
                error: null,
                drawOrganisations: [],
            };

        case ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_ROUNDS_SUCCESS:
            const updatedCompetitionVenues = updateCompVenue(action.Venue_Result, true)
            state.competitionVenues = updatedCompetitionVenues
            state.divisionGradeNameList = JSON.parse(JSON.stringify(action.division_Result))
            state.maindivisionGradeNameList = JSON.parse(JSON.stringify(action.division_Result))
            const DrawsRoundsData = JSON.parse(JSON.stringify(action.result))
            // let venueObject = {
            //     name: "All Venues",
            //     id: 0
            // }
            // let divisionNameObject = {
            //     name: "All Division",
            //     competitionDivisionGradeId: 0
            // }
            const roundNameObject = {
                roundId: 0,
                name: "All Rounds",
                startDateTime: "",
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

        /// Update draws reducer cases
        case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_LOAD:
            return {
                ...state,
                updateLoad: true,
            };

        case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_SUCCESS:
            const sourceXIndex = action.sourceArray[0];
            const sourceYIndex = action.sourceArray[1];
            const targetXIndex = action.targetArray[0];
            const targetYIndex = action.targetArray[1];
            if (action.actionType !== 'all') {
                const drawDataIndex = state.getRoundsDrawsdata.findIndex((x) => x.roundId === action.drawData)
                const drawDataCase = state.getRoundsDrawsdata[drawDataIndex].draws;
                let swapedDrawsArray = state.getRoundsDrawsdata[drawDataIndex].draws;
                if (action.actionType === 'add') {
                    swapedDrawsArray = swapedDrawsArrayFunc(
                        drawDataCase,
                        sourceXIndex,
                        targetXIndex,
                        sourceYIndex,
                        targetYIndex,
                    );
                } else {
                    swapedDrawsArray = swapedDrawsEditArrayFunc(
                        drawDataCase,
                        sourceXIndex,
                        targetXIndex,
                        sourceYIndex,
                        targetYIndex,
                        action.sourceArray[2],
                        action.targetArray[2],
                    );
                }
                state.getRoundsDrawsdata[drawDataIndex].draws = swapedDrawsArray;
            } else {
                const allDrawDataCase = state.getRoundsDrawsdata[0].draws;
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

        /// Update draws timeline reducer cases
        case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_TIMELINE_LOAD:
            return {
                ...state,
                updateLoad: true,
            };

        case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_TIMELINE_SUCCESS:
            const sourceXIndexT = action.sourceArray[0];
            const sourceYIndexT = action.sourceArray[1];
            const targetXIndexT = action.targetArray[0];
            const targetYIndexT = action.targetArray[1];
            if (action.actionType !== 'all') {
                const drawDataIndex = state.getRoundsDrawsdata.findIndex((x) => x.roundId === action.drawData)
                const drawDataCase = state.getRoundsDrawsdata[drawDataIndex].draws;
                let swapedDrawsArray = state.getRoundsDrawsdata[drawDataIndex].draws;
                if (action.actionType === 'add') {
                    swapedDrawsArray = swapedDrawsArrayFunc(
                        drawDataCase,
                        sourceXIndexT,
                        targetXIndexT,
                        sourceYIndexT,
                        targetYIndexT,
                    );
                } else {
                    swapedDrawsArray = swapedDrawsEditArrayFunc(
                        drawDataCase,
                        sourceXIndexT,
                        targetXIndexT,
                        sourceYIndexT,
                        targetYIndexT,
                        action.sourceArray[2],
                        action.targetArray[2],
                    );
                }
                state.getRoundsDrawsdata[drawDataIndex].draws = swapedDrawsArray;
            } else {
                const allDrawDataCase = state.getRoundsDrawsdata[0].draws;
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

        case ApiConstants.API_UPDATE_COMPETITION_SAVE_MULTI_DRAWS_LOAD:
            return {
                ...state,
                onLoad: true,
                error: null,
            }

        // Save Draws Success
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

        // Competition venues
        case ApiConstants.API_GET_COMPETITION_VENUES_MULTI_SUCCESS:
            return {
                ...state,
                onLoad: false,
                competitionVenues: action.result,
            };

        // update draws court timing where N/A(null) is there
        case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_COURT_TIMINGS_LOAD:
            return {
                ...state,
                updateLoad: true,
            };

        case ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_COURT_TIMINGS_SUCCESS:
            let resultDataNew
            if (action.competitionId === "-1" || action.dateRangeCheck) {
                const allCompetiitonDraws = action.getResult;
                resultDataNew = allcompetitionDrawsData(allCompetiitonDraws)
            } else {
                const drawsResultData = action.getResult;
                resultDataNew = roundStructureData(drawsResultData)
            }

            state.publishStatus = action.getResult.drawsPublish
            state.isTeamInDraw = action.getResult.isTeamNotInDraws
            const orgDataNew = JSON.parse(JSON.stringify(action.getResult.organisations))
            return {
                ...state,
                getRoundsDrawsdata: action.competitionId === "-1" || action.dateRangeCheck ? [resultDataNew.data] : resultDataNew.roundsdata,
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
                state.maindivisionGradeNameList = []
                state.legendsArray = [];
                legendsArray = [];
                state.drawsCompetitionArray = []
            }
            return { ...state };

        // draws division grade names list
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
            return {
                ...state,
                onLoad: true,
                updateLoad: true,
                changeStatus: true,
            }

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

        case ApiConstants.API_IMPORT_DRAWS_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_IMPORT_DRAWS_SUCCESS:
            return {
                ...state,
                onImportLoad: false,
                error: null,
            };

        // Competition Dashboard Case
        case ApiConstants.API_GET_DIVISION_MULTI_LOAD:
            return {
                ...state,
                onLoad: true,
                divisionLoad: true,
                error: null,
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
                updateLoad: true,
            }

        case ApiConstants.API_UPDATE_MULTI_DRAWS_LOCK_SUCCESS:
            const getDrawsArray = state.getRoundsDrawsdata
            if (action.key === "all") {
                const updatetLockValueIndex = getDrawsArray[0].draws.findIndex((x) => x.venueCourtId === action.venueCourtId)
                const updateslotsIndex = getDrawsArray[0].draws[updatetLockValueIndex].slotsArray.findIndex((x) => x.drawsId === action.drawsId)
                getDrawsArray[0].draws[updatetLockValueIndex].slotsArray[updateslotsIndex].isLocked = 0
                state.getRoundsDrawsdata = getDrawsArray
            } else {
                const getDrawsArrayIndex = getDrawsArray.findIndex((x) => x.roundId === action.roundId)
                const updatetLockValueIndex = getDrawsArray[getDrawsArrayIndex].draws.findIndex((x) => x.venueCourtId === action.venueCourtId)
                const updateslotsIndex = getDrawsArray[getDrawsArrayIndex].draws[updatetLockValueIndex].slotsArray.findIndex(
                    (x) => x.drawsId === action.drawsId,
                )
                getDrawsArray[getDrawsArrayIndex].draws[updatetLockValueIndex].slotsArray[updateslotsIndex].isLocked = 0
                state.getRoundsDrawsdata = getDrawsArray
            }
            return {
                ...state,
                onLoad: false,
                updateLoad: false,
            }

        // get rounds in the competition draws
        case ApiConstants.API_GET_MULTI_DRAWS_ACTIVE_ROUNDS_LOAD:
            return { ...state, onActRndLoad: true, error: null };

        case ApiConstants.API_GET_MULTI_DRAWS_ACTIVE_ROUNDS_SUCCESS:
            const activeDrawsRoundsData = JSON.parse(JSON.stringify(action.result))
            return {
                ...state,
                onActRndLoad: false,
                activeDrawsRoundsData,
                error: null,
            };

        case ApiConstants.API_MULTI_CHANGE_DATE_RANGE_GET_VENUE_DIVISIONS_LOAD:
            return {
                ...state,
                onLoad: true,
                updateLoad: true,
                error: null,
                drawOrganisations: [],
            }

        case ApiConstants.API_MULTI_CHANGE_DATE_RANGE_GET_VENUE_DIVISIONS_SUCCESS:
            state.competitionVenues = updateCompVenue(action.Venue_Result, true)
            state.divisionGradeNameList = JSON.parse(JSON.stringify(action.division_Result))
            state.maindivisionGradeNameList = JSON.parse(JSON.stringify(action.division_Result))
            const divisionNameObjectNew = {
                name: "All Division",
                competitionDivisionGradeId: 0,
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
            if (action.key === "division") {
                state.drawDivisions[action.index].legendArray[action.subIndex].checked = action.value
            }
            if (action.key === 'allCompetitionVenues') {
                state.competitionVenues = updateCompVenue(JSON.parse(JSON.stringify(state.competitionVenues)), action.value)
            }
            if (action.key === "allCompetition") {
                state.drawsCompetitionArray = updateCompArray(JSON.parse(JSON.stringify(state.drawsCompetitionArray)), action.value)
            }
            if (action.key === "allOrganisation") {
                state.drawOrganisations = updateAllOrganisations(JSON.parse(JSON.stringify(state.drawOrganisations)), action.value)
            }
            if (action.key === "organisation") {
                state.drawOrganisations[action.index].checked = action.value
            }
            if (action.key === "allDivisionChecked") {
                state.drawDivisions = updateAllDivisions(JSON.parse(JSON.stringify(state.drawDivisions)), action.value)
            }
            if (action.key === "singleCompDivisionCheked") {
                const singleCompAllDivision = updateAllOrganisations(JSON.parse(JSON.stringify(state.divisionGradeNameList)), action.value)
                state.divisionGradeNameList = singleCompAllDivision || []
            }
            return {
                ...state,
                onLoad: false,
                error: null,
            };

        case ApiConstants.SET_TIMELINE_MODE:
            console.log(action.value);
            return {
                ...state,
                isTimelineMode: action.value,
            }

        default:
            return state;
    }
}

export default CompetitionMultiDraws;
