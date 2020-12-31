import moment from "moment";

import ApiConstants from "themes/apiConstants";
import { isArrayNotEmpty } from "util/helpers";
import { getMatchListSettings } from "store/objectModel/getMatchTeamListObject";
import liveScoreMatchModal from "store/objectModel/liveScoreMatchModal";

const object = {
    id: "",
    team1Score: 0,
    team2Score: 0,
    venueId: "",
    competitionId: "",
    divisionId: null,
    team1id: "",
    team2id: "",
    startTime: null,
    startdate: "",
    starttime: "",
    type: "",
    matchDuration: "",
    breakDuration: "",
    mainBreakDuration: "",
    extraTimeDuration: "",
    scorerStatus: "",
    mnbMatchId: "",
    mnbPushed: "",
    matchEnded: "",
    matchStatus: "",
    endTime: "",
    team1ResultId: "",
    team2ResultId: "",
    roundId: "",
    originalStartTime: "",
    pauseStartTime: "",
    totalPausedMs: "",
    centrePassStatus: "",
    centrePassWonBy: "",
    umpire1: "",
    umpire2: "",
    resultStatus: "",
    forfietedTeam: null,
    abandoneReason: null,
    isFinals: false,
    extraTimeType: null,
    extraTimeMainBreak: null,
    extraTimeqtrBreak: null,
    extraTimeWinByGoals: null,
    team1: {
        id: "",
        name: "",
        divisionId: "",
        logoUrl: "",
        competitionId: "",
        nameFilter: null,
        clubId: "",
        gameTimeTrackingOverride: "",
        positionTracking: "",
    },
    team2: {
        id: "",
        name: "",
        divisionId: "",
        logoUrl: "",
        competitionId: "",
        nameFilter: "",
        clubId: "",
        gameTimeTrackingOverride: "",
        positionTracking: "",
    },
    venue: {
        id: "",
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        parentId: "",
        parent: {
            id: "",
            name: "",
            address: "",
            latitude: "",
            longitude: "",
            parentId: "",
        },
    },
    division: {
        id: "",
        name: "",
        age: "",
        grade: "",
        competitionId: "",
    },
    competition: {
        id: "",
        name: "",
        longName: "",
        logoUrl: "",
        recordUmpire: "",
        gameTimeTracking: "",
        positionTracking: "",
        uploadScores: "",
        uploadAttendance: "",
        scoringType: "",
        attendanceRecordingType: "",
        timerType: "",
        attendanceRecordingPeriod: "",
        softBuzzerUrl: "",
        hardBuzzerUrl: "",
        recordGoalAttempts: " ",
        centrePassEnabled: "",
        lineupSelectionTime: "",
        attendanceSelectionTime: "",
        lineupSelectionEnabled: "",
        incidentsEnabled: "",
        location: {
            id: "",
            name: "",
            abbreviation: "",
        },
    },
    round: {
        id: "",
        name: "",
        sequence: "",
        competitionId: "",
        divisionId: "",
    },
};

const matchObj = {
    id: 0,
    startTime: "",
    divisionId: null,
    type: null,
    competitionId: null,
    mnbMatchId: null,
    team1id: null,
    team2id: null,
    venueId: null,
    roundId: null,
    matchDuration: null,
    mainBreakDuration: null,
    breakDuration: null,
    team1Score: 0,
    team2Score: 0,
    umpire1: "",
    umpire2: "",
    resultStatus: "",
    forfietedTeam: null,
    abandoneReason: null,
    isFinals: false,
    extraTimeType: null,
    extraTimeDuration: null,
    extraTimeMainBreak: null,
    extraTimeqtrBreak: null,
    extraTimeWinByGoals: null,
};

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    isFetchingMatchList: false,
    liveScoreMatchListData: [],
    liveScoreMatchList: [],
    addEditMatch: object,
    start_date: "",
    start_time: "",
    venueData: null,
    venueIdArray: [],
    liveScoreMatchListPage: 1,
    liveScoreMatchListTotalCount: 1,
    matchData: matchObj,
    matchLoad: false,
    matchDetails: null,
    start_post_date: null,
    displayTime: "",
    team1Players: [],
    team2Players: [],
    divisionList: [],
    teamResult: [],
    roundList: [],
    clubListData: [],
    courList: [],
    roundLoad: false,
    matchResult: [],
    forfietedTeam: undefined,
    abandoneReason: undefined,
    recordUmpireType: null,
    scorer1: null,
    scorer2: null,
    umpire1Name: null,
    umpire2Name: null,
    umpire1TextField: null,
    umpire2TextField: null,
    umpire1Orag: [],
    umpire2Orag: [],
    umpires: [],
    teamLineUpPostObject: null,
    matchUmpireId_1: null,
    matchUmpireId_2: null,
    scorerRosterId_1: null,
    scorerRosterId_2: null,
    umpireRosterId_1: null,
    umpireRosterId_2: null,
    team1id: null,
    team2id: null,
    liveScoreBulkScoreList: [],
    highestSequence: null,
    onLoadMatch: false,
    umpireReserve: null,
    umpireCoach: null,
    matchListActionObject: null,
    umpire1NameOrgId: null,
    umpireList: [],
    newUmpireList: [],
    umpireListResult: [],
    newUmpireListResult: [],
    umpire1NameMainId: null,
    umpire2NameOrgId: null,
    umpire2NameMainId: null,
    umpire1SelectedRosterId: null,
    umpire2SelectedRosterId: null,
    coachList: [],
    roster1Umpire: null,
    roster2Umpire: null,
    orgId1UmpirName: null,
    orgId2UmpirName: null,
    staticMatchData: JSON.parse(JSON.stringify(object)),
    umpireReserveId: null,
    umpireCoachId: null,
    accreditation: [],
    updateUmpireFetchCall: false
};

function setMatchData(data) {
    return {
        id: data.id ? data.id : 0,
        startTime: data.startTime,
        divisionId: data.divisionId,
        type: data.type,
        competitionId: data.competitionId,
        mnbMatchId: data.mnbMatchId,
        team1id: data.team1Id,
        team2id: data.team2Id,
        venueId: data.venueCourtId,
        roundId: data.roundId,
        matchDuration: data.matchDuration,
        mainBreakDuration: data.mainBreakDuration,
        breakDuration: data.breakDuration,
        team1Score: data.team1Score ? data.team1Score : 0,
        team2Score: data.team2Score ? data.team2Score : 0,
    };
}

function generateCourtsArray(venuesData) {
    let courtsArray = [];
    for (let i in venuesData) {
        let venueCourtsValue = venuesData[i].venueCourts;
        for (let j in venueCourtsValue) {
            venueCourtsValue[j]["name"] = venuesData[i].venueName + "-" + venueCourtsValue[j].courtNumber;
            courtsArray.push(venueCourtsValue[j]);
        }
    }
    return courtsArray;
}

function getHighestSequence(roundArr) {
    let sequence = [];
    for (let i in roundArr) {
        sequence.push(roundArr[i].sequence);
    }
    return Math.max.apply(null, sequence);
}

function checkUmpireType(umpireArray, key) {

    let object = null;
    for (let i in umpireArray) {
        if (umpireArray[i].sequence == key) {
            object = umpireArray[i];
        }
    }
    return object;
}

function checkUmpireRole(rosterArray, key) {
    let rosterkey = null;
    for (let i in rosterArray) {
        if (rosterArray[i].roleId == key) {
            rosterkey = rosterArray[i].userId
            break
        }
    }
    return rosterkey
}
// Remove duplicate rounds names
function removeDuplicateValues(array) {
    return array.filter((obj, index, self) =>
        index === self.findIndex((el) => el["name"] === obj["name"]),
    );
}

function createCoachArray(result) {
    let coachArray = []
    for (let i in result) {
        let userRole = result[i].userRoleEntities
        let linkedEntity = result[i].linkedEntity
        for (let j in userRole) {
            if (userRole[j].roleId == 20) {

                for (let k in linkedEntity) {
                    let obj = {
                        name: (result[i].firstName + " " + result[i].lastName) + " - " + linkedEntity[k].name,
                        id: parseInt(result[i].id + "" + linkedEntity[k].entityId),
                        umpireId: result[i].id,
                        entityId: linkedEntity[k].entityId
                    }
                    coachArray.push(obj)
                }
                break
            }
        }
    }
    return coachArray
}

function getAccreditationValue(accreditationArray, accreditationValue) {
    if (accreditationArray) {
        for (let i in accreditationArray) {
            if (accreditationArray[i].id == accreditationValue) {
                return accreditationArray[i].description
            }
        }
    }
    return "N/A"
}

function createUmpireArray(result, accreditationArr) {
    let umpireArray = []
    for (let i in result) {
        let userRoleCheck = result[i].userRoleEntities
        let linkedEntity = result[i].linkedEntity
        for (let j in userRoleCheck) {
            if (userRoleCheck[j].roleId == 15 || userRoleCheck[j].roleId == 19) {

                for (let k in linkedEntity) {
                    let accreditationBadge = getAccreditationValue(accreditationArr, result[i].accreditationLevelUmpireRefId)
                    let obj = {
                        name: (result[i].firstName + " " + result[i].lastName) + " - " + accreditationBadge + " - " + linkedEntity[k].name,
                        reserveName: (result[i].firstName + " " + result[i].lastName) + " - " + linkedEntity[k].name,
                        id: parseInt(result[i].id + "" + linkedEntity[k].entityId),
                        umpireId: result[i].id,
                        entityId: linkedEntity[k].entityId
                    }
                    umpireArray.push(obj)
                }
                break
            }
        }
    }
    return umpireArray
}

function getUmpureUserId(umpireList, umpireData) {
    let userId = null
    let orgId = null
    for (let i in umpireList) {
        if (umpireData.userId === umpireList[i].umpireId) {
            for (let j in umpireData.competitionOrganisations) {
                if (umpireList[i].entityId === umpireData.competitionOrganisations[j].id) {
                    userId = umpireList[i].id
                    orgId = umpireData.competitionOrganisations[j].id
                }
            }
            break;
        }
    }
    return { userId, orgId }

}
function getUmpureReserveId(umpireList, umpireReserveData) {
    let userId = null
    for (let i in umpireList) {
        if (umpireReserveData === umpireList[i].umpireId) {
            userId = umpireList[i].id
            break;
        }
    }
    return userId
}

function liveScoreMatchReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_MATCH_LIST_LOAD:
            return {
                ...state,
                onLoadMatch: true,
                isFetchingMatchList: true,
                liveScoreMatchListData: [],
                matchListActionObject: action,
            };

        case ApiConstants.API_LIVE_SCORE_MATCH_LIST_SUCCESS:
            const result = getMatchListSettings(action.result.matches);
            return {
                ...state,
                onLoadMatch: false,
                isFetchingMatchList: false,
                liveScoreMatchListPage: action.result.page ? action.result.page.currentPage : 1,
                liveScoreMatchListTotalCount: action.result.page ? action.result.page.totalCount : 0,
                status: action.status,
                liveScoreMatchListData: result,
                liveScoreBulkScoreList: result,
                liveScoreMatchList: isArrayNotEmpty(action.result) ? action.result : result,
            };

        case ApiConstants.API_LIVE_SCORE_MATCH_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_MATCH_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_LOAD:
            return {
                ...state,
                onLoad: true,
                matchLoad: true,
            };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_SUCCESS:
            let data = action.result;
            state.addEditMatch = JSON.parse(JSON.stringify(action.result));
            state.staticMatchData = JSON.parse(JSON.stringify(action.result));
            state.addEditMatch['extraTimeMainBreak'] = data.extraTimeType === "FOUR_QUARTERS" ? data.extraTimeMainBreak : data.extraTimeBreak
            state.addEditMatch['extraTimeqtrBreak'] = data.extraTimeType === "FOUR_QUARTERS" ? data.extraTimeBreak : null
            if (action.result) {
                state.team1id = action.result.team1Id;
                state.team2id = action.result.team2Id;
            }
            state.start_date = moment(action.result.startTime).format("DD-MM-YYYY");
            state.start_post_date = moment(action.result.startTime, "YYYY-MM-DD");
            state.start_time = action.result.startTime;
            state.displayTime = action.result.startTime;
            // let checkSelectedVenue = [data.venueCourt.venueId];
            state.matchData = setMatchData(data);
            state.matchLoad = false;
            return {
                ...state,
                onLoad: false,
                error: null,
                status: action.status,
                recordUmpireType: data.competition.recordUmpireType,
                updateUmpireFetchCall: true
            };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_ADD_MATCH:
            state.addEditMatch = object;
            state.matchData = matchObj;
            state.start_date = null;
            state.start_time = null;
            return {
                ...state,
                onLoad: false,
                status: action.status,
            };

        case ApiConstants.API_UMPIRE_LIST_SUCCESS:
            let user_Data = action.result.userData ? action.result.userData : action.result
            if (action.key === "data") {
                let coachData = createCoachArray(JSON.parse(JSON.stringify(user_Data)))
                state.coachList = coachData
            }
            let checkUserData = createUmpireArray(JSON.parse(JSON.stringify(user_Data)), state.accreditation)
            return {
                ...state,
                onLoad: false,
                umpireList: [...checkUserData],
                umpireListResult: checkUserData,
                // umpireList: user_Data,
                // umpireListResult: user_Data,
                status: action.status
            };
        case ApiConstants.API_NEW_UMPIRE_LIST_SUCCESS:
            let new_user_Data = action.result.userData ? action.result.userData : action.result
            let newCheckUserData = createUmpireArray(JSON.parse(JSON.stringify(new_user_Data)), state.accreditation)
            return {
                ...state,
                onLoad: false,
                newUmpireList: [...newCheckUserData],
                newUmpireListResult: newCheckUserData,
                // umpireList: user_Data,
                // umpireListResult: user_Data,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_UPDATE_MATCH:
            // let utcTimestamp = null;
            // let date = null;
            if (action.key === "start_date") {
                state.start_date = action.data;
                state.start_post_date = action.data;
                if (action.data != null) {
                    let d_date = moment(action.data).format('YYYY-MM-DD').split('-');
                    let d_oldTime = moment(state.start_time).format('HH:mm').split(':')
                    let d_newTime = moment([d_date[0], d_date[1] - 1, d_date[2], d_oldTime[0], d_oldTime[1]]).utc().format();
                    console.log(d_newTime, d_date, d_oldTime)
                    state.matchData.startTime = d_newTime;
                    if (d_newTime != 'Invalid date') {
                        state.updateUmpireFetchCall = true;
                    }
                }
            } else if (action.key === "start_time") {
                state.start_time = action.data;
                state.displayTime = action.data;
                if (action.data != null) {
                    let t_date = moment(state.matchData.startTime).format('YYYY-MM-DD').split('-');
                    let t_time = moment(action.data).format('HH:mm').split(':');
                    let t_newTime = moment([t_date[0], t_date[1] - 1, t_date[2], t_time[0], t_time[1]]).utc().format();
                    state.matchData.startTime = t_newTime;
                    console.log(t_newTime, t_date, t_time)
                    if (t_newTime != 'Invalid date') {
                        state.updateUmpireFetchCall = true;
                    }
                }
            } else if (action.key === "forfietedTeam") {
                state.forfietedTeam = action.data;
            } else if (action.key === "abandoneReason") {
                state.abandoneReason = action.data;
            } else if (action.key === "clearData") {
                state.forfietedTeam = null;
                state.abandoneReason = null;
            } else if (action.key === "scorer1") {
                state.scorer1 = action.data;
            } else if (action.key === "scorer2") {
                state.scorer2 = action.data;
            } else if (action.key === "umpire1NameSelection") {
                let umpireResList = state.umpireList

                for (let i in umpireResList) {
                    if (umpireResList[i].id === action.data) {
                        state.umpire1NameOrgId = umpireResList[i].entityId
                        state.umpire1Name = umpireResList[i].umpireId
                    }
                }

                if (state.umpire1NameOrgId === state.orgId1UmpirName) {
                    state.umpireRosterId_1 = state.roster1Umpire
                } else {
                    state.umpireRosterId_1 = null
                }

                if (action.data === state.umpire2NameMainId) {
                    state.umpire2NameMainId = null
                    state.umpire2Name = null
                    state.umpireRosterId_2 = null
                    state.umpire2NameOrgId = null
                }

                if (action.data === state.umpireReserve) {
                    state.umpireReserve = null
                }

                if (action.data === state.umpireCoach) {
                    state.umpireCoach = null
                }
                state.umpire1NameMainId = action.data;
            } else if (action.key === "umpire2NameSelection") {
                let umpireResList = state.umpireList
                // state.umpire1Name = null
                // state.umpireRosterId_1 = null
                // state.organisationId = null
                for (let i in umpireResList) {
                    if (umpireResList[i].id === action.data) {
                        state.umpire2NameOrgId = umpireResList[i].entityId
                        state.umpire2Name = umpireResList[i].umpireId
                    }
                }

                if (state.umpire2NameOrgId === state.orgId2UmpirName) {
                    state.umpireRosterId_2 = state.roster2Umpire
                } else {
                    state.umpireRosterId_2 = null
                }

                if (action.data === state.umpire1NameMainId) {
                    state.umpire1NameMainId = null
                    state.umpire1Name = null
                    state.umpireRosterId_1 = null
                    state.umpire1NameOrgId = null
                }

                if (action.data === state.umpireReserve) {
                    state.umpireReserve = null
                }

                if (action.data === state.umpireCoach) {
                    state.umpireCoach = null
                }
                state.umpire2NameMainId = action.data;
            } else if (action.key === "umpire1TextField") {
                state.umpire1TextField = action.data;
            } else if (action.key === "umpire2TextField") {
                state.umpire2TextField = action.data;
            } else if (action.key === "umpire1Orag") {
                state.umpire1Orag = action.data;
            } else if (action.key === "umpireReserve") {
                state.umpireReserve = action.data
                let umpireResList = state.umpireList

                if (action.data === state.umpire1NameMainId) {
                    state.umpire1NameMainId = null
                }

                if (action.data === state.umpire2NameMainId) {
                    state.umpire2NameMainId = null
                }

                if (action.data === state.umpireCoach) {
                    state.umpireCoach = null
                }
                for (let i in umpireResList) {
                    if (umpireResList[i].id === action.data) {
                        state.umpireReserveId = umpireResList[i].umpireId
                    }
                }
                // state.umpireReserve = action.data;
            }
            else if (action.key === "umpireCoach") {
                let umpireResList = state.umpireList
                if (action.data === state.umpire1NameMainId) {
                    state.umpire1NameMainId = null
                }

                if (action.data === state.umpire2NameMainId) {
                    state.umpire2NameMainId = null
                }

                if (action.data === state.umpireReserve) {
                    state.umpireReserve = null
                }
                for (let i in umpireResList) {
                    if (umpireResList[i].id === action.data) {
                        state.umpireCoachId = umpireResList[i].umpireId
                    }
                }
                state.umpireCoach = action.data
            }
            else if (action.key === "umpireCoach") {
                state.umpireCoach = action.data
            }
            else if (action.key === "umpire2Orag") {
                state.umpire2Orag = action.data;
            } else if (action.key === "addMatch") {
                state.recordUmpireType = null;
                state.scorer1 = null;
                state.scorer2 = null;
                state.umpireRosterId_1 = null;
                state.umpireRosterId_2 = null;
                state.umpire1Orag = null;
                state.umpire2Orag = null;
                state.umpire1TextField = null;
                state.umpire2TextField = null;
                state.umpire1Name = null;
                state.umpire2Name = null;
                state.matchUmpireId_1 = null;
                state.matchUmpireId_2 = null;
                state.scorerRosterId_1 = null;
                state.scorerRosterId_2 = null;
                state.team1id = null;
                state.team2id = null;
                state.addEditMatch["divisionId"] = null;
                state.addEditMatch["mnbMatchId"] = null;
                state.addEditMatch["isFinals"] = false;
                state.addEditMatch["extraTimeType"] = null;
                state.addEditMatch["extraTimeDuration"] = null;
                state.addEditMatch["extraTimeMainBreak"] = null;
                state.addEditMatch["extraTimeqtrBreak"] = null;
                state.addEditMatch["extraTimeWinByGoals"] = null;
                state.matchData["isFinals"] = false;
                state.matchData["extraTimeType"] = null;
                state.matchData["extraTimeDuration"] = null;
                state.matchData["extraTimeMainBreak"] = null;
                state.matchData["extraTimeqtrBreak"] = null;
                state.matchData["extraTimeWinByGoals"] = null;
                state.umpireReserve = null;
                state.umpireCoach = null


            } else if (action.key === "isFinals") {

                if (action.data === true) {
                    state[action.key] = action.data;
                    state.addEditMatch[action.key] = action.data;
                    state.matchData[action.key] = action.data;
                } else {
                    state.addEditMatch["isFinals"] = false;
                    state.matchData["isFinals"] = false;
                    state.addEditMatch["extraTimeType"] = null;
                    state.addEditMatch["extraTimeDuration"] = null;
                    state.addEditMatch["extraTimeMainBreak"] = null;
                    state.addEditMatch["extraTimeqtrBreak"] = null;
                    state.addEditMatch["extraTimeWinByGoals"] = null;
                    state.matchData["extraTimeType"] = null;
                    state.matchData["extraTimeDuration"] = null;
                    state.matchData["extraTimeMainBreak"] = null;
                    state.matchData["extraTimeqtrBreak"] = null;
                    state.matchData["extraTimeWinByGoals"] = null;
                }
            }
            else if (action.key == 'matchDuration' || action.key == 'mainBreakDuration') {
                state[action.key] = action.data;
                state.addEditMatch[action.key] = action.data;
                state.matchData[action.key] = action.data;
                state.updateUmpireFetchCall = true;
            }
            else {
                state[action.key] = action.data;
                state.addEditMatch[action.key] = action.data;
                state.matchData[action.key] = action.data;
            }
            return {
                ...state,
                onLoad: false,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_SUCCESS:
            // let createData = action.result;
            return {
                ...state,
                onLoad: false,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_COMPETITION_VENUES_LIST_SUCCESS:
            let venueCourts = generateCourtsArray(action.venues);
            state.venueData = venueCourts;
            state.courList = venueCourts;
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_CLEAR_MATCH_DATA:
            state.matchData = matchObj;
            state.addEditMatch = object;
            return { ...state };

        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_LOAD:
            return { ...state, roundLoad: true };

        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_SUCCESS:
            state.roundList.push(action.result);
            state.matchData.roundId = action.result.id;
            state.addEditMatch.roundId = action.result.id;
            state.addEditMatch.round = action.result;
            state.highestSequence = action.result.sequence;
            return { ...state, roundLoad: false };

        case ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_INITIATE:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_SUCCESS:
            state.umpire1NameMainId = null
            state.umpire2NameMainId = null
            let team1Player = liveScoreMatchModal.getMatchViewData(action.payload.team1players);
            let team2Player = liveScoreMatchModal.getMatchViewData(action.payload.team2players);
            let match = isArrayNotEmpty(action.payload.match) ? action.payload.match[0] : null;
            let umpireReserveData = isArrayNotEmpty(action.payload.rosters) ? checkUmpireRole(action.payload.rosters, 19) : null
            let umpireCoachData = isArrayNotEmpty(action.payload.rosters) ? checkUmpireRole(action.payload.rosters, 20) : null
            let umpires_1 = isArrayNotEmpty(action.payload.umpires) ? checkUmpireType(action.payload.umpires, 1) : null;
            let umpires_2 = isArrayNotEmpty(action.payload.umpires) ? checkUmpireType(action.payload.umpires, 2) : null;
            // state.umpireReserve = umpireReserveData ? umpireReserveData : null
            state.umpireReserve = getUmpureReserveId(state.umpireList, umpireReserveData)
            // state.umpireCoach = umpireCoachData ? umpireCoachData : null
            state.umpireCoach = getUmpureReserveId(state.umpireList, umpireReserveData)
            if (umpires_1) {

                let umpir1UserId = getUmpureUserId(state.umpireList, umpires_1)
                // for (let i in state.umpireList) {
                //     if (umpires_1.userId === state.umpireList[i].umpireId) {
                //         for (let j in umpires_1.competitionOrganisations) {
                //             if (state.umpireList[i].entityId === umpires_1.competitionOrganisations[j].id) {
                //                 umpir1UserId = state.umpireList[i].id
                //                 break;
                //             }
                //         }
                //     }
                // }
                state.umpire1Orag = isArrayNotEmpty(umpires_1.competitionOrganisations) ? umpires_1.competitionOrganisations[0].id : [];
                state.umpire1Name = umpires_1.userId;
                state.umpire1NameMainId = umpir1UserId.userId;
                state.umpire1NameOrgId = umpir1UserId.orgId
                state.orgId1UmpirName = umpir1UserId.orgId
                state.umpire1TextField = umpires_1.umpireName;
                state.matchUmpireId_1 = umpires_1.matchUmpiresId;
                state.umpireRosterId_1 = umpires_1.rosterId;
                state.roster1Umpire = umpires_1.rosterId;
            } else {
                state.umpire1Orag = null;
                state.orgId1UmpirName = null;
                state.umpire1Name = null;
                state.umpire1TextField = null;
                state.matchUmpireId_1 = null;
                state.umpireRosterId_1 = null;
                state.roster1Umpire = null;
            }
            if (umpires_2) {
                let umpir2UserId = getUmpureUserId(state.umpireList, umpires_2)
                state.umpire2Orag = isArrayNotEmpty(umpires_2.competitionOrganisations) ? umpires_2.competitionOrganisations[0].id : [];
                state.umpire2Name = umpires_2.userId;
                state.umpire2NameMainId = umpir2UserId.userId;
                state.umpire2NameOrgId = umpir2UserId.orgId
                state.orgId2UmpirName = umpir2UserId.orgId
                state.umpire2TextField = umpires_2.umpireName;
                state.matchUmpireId_2 = umpires_2.matchUmpiresId;
                state.umpireRosterId_2 = umpires_2.rosterId;
                state.roster2Umpire = umpires_2.rosterId;
            } else {
                state.umpire2Orag = null;
                state.orgId2UmpirName = null;
                state.umpire2Name = null;
                state.umpire2TextField = null;
                state.matchUmpireId_2 = null;
                state.umpireRosterId_2 = null;
                state.roster2Umpire = null;
            }
            if (match) {
                if (match.scorer1 !== null) {
                    state.scorer1 = match.scorer1.id;
                    state.scorerRosterId_1 = match.scorer1.rosterId;
                } else {
                    state.scorer1 = null;
                    state.scorerRosterId_1 = null;
                }
                if (match.scorer2 !== null) {
                    state.scorer2 = match.scorer2.id;
                    state.scorerRosterId_2 = match.scorer2.rosterId;
                } else {
                    state.scorer2 = null;
                    state.scorerRosterId_2 = null;
                }
            }
            return {
                ...state,
                onLoad: false,
                matchDetails: action.payload,
                team1Players: team1Player,
                team2Players: team2Player,
            };

        case ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.payload,
            };

        case ApiConstants.API_LIVE_SCORE_DELETE_MATCH_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DELETE_MATCH_SUCCESS:
            return { ...state, onLoad: false };

        case ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_LOAD:
            return {
                ...state,
                onLoad: true,
                importResult: null,
            };

        case ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                importResult: action.result,
            };

        case ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_RESET:
            return {
                ...state,
                importResult: null,
            };

        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_ERROR:
            return { ...state, onLoad: false };

        // case ApiConstants.API_LIVE_SCORE_DIVISION_LOAD:
        //     return { ...state, onLoad: true };

        // case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:
        //     return { ...state, onLoad: false };

        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                divisionList: action.result,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            state.teamResult = action.result;
            return {
                ...state,
                onLoad: false,
                teamResult: action.result,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_ROUND_LIST_LOAD:
            return { ...state, roundLoad: true };

        case ApiConstants.API_LIVE_SCORE_ROUND_LIST_SUCCESS:
            let sequenceValue = getHighestSequence(action.result);
            state.highestSequence = sequenceValue;
            let roundListArray = action.result;
            roundListArray.sort((a, b) => Number(a.sequence) - Number(b.sequence));
            state.roundList = removeDuplicateValues(roundListArray);
            return {
                ...state,
                onLoad: false,
                status: action.status,
                roundLoad: false,
            };

        case ApiConstants.API_LIVE_SCORE_CLUB_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_CLUB_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                clubListData: action.result,
            };

        case ApiConstants.API_LIVE_MATCH_LOCAL_SEARCH:
            if (action.key === "courts") {
                if (action.search.length > 0) {
                    const filteredData = state.venueData.filter(item => {
                        return item.name.toLowerCase().indexOf(action.search.toLowerCase()) > -1
                    });
                    state.venueData = filteredData;
                } else {
                    state.venueData = state.courList;
                }
            }
            return { ...state };

        case ApiConstants.API_CLEAR_ROUND_DATA:
            if (action.key === "all") {
                state.roundList = [];
                state.divisionList = [];
            } else {
                state.roundList = [];
            }
            return { ...state };

        case ApiConstants.API_LADDER_SETTING_MATCH_RESULT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                matchResult: action.result,
                error: null,
                state: action.status,
            };

        case ApiConstants.CHANGE_PLAYER_LINEUP_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_CHANGE_LINEUP_STATUS_SUCCESS:
            if (action.key === "team1Players") {
                state[action.key][action.index]["lineup"][0] = action.result[action.index];
            } else if (action.key === "team2Players") {
                state[action.key][action.index]["lineup"][0] = action.result[action.index];
            }
            return {
                ...state,
                onLoad: false,
                error: null,
                state: action.status,
            };

        case ApiConstants.CHANGE_BULK_MATCH_SCORE:
            let matchListArray = JSON.parse(JSON.stringify(state.liveScoreMatchListData));
            matchListArray[action.index][action.key] = action.value;
            state.liveScoreMatchListData = matchListArray;
            return {
                ...state,
                onLoad: false,
                error: null,
                state: action.status,
            };

        case ApiConstants.BULK_SCORE_UPDATE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.BULK_SCORE_UPDATE_SUCCESS:
            let matchUpdatedList = state.liveScoreMatchListData;
            state.liveScoreBulkScoreList = matchUpdatedList;
            return {
                ...state,
                onLoad: false,
                status: action.status,
            };

        case ApiConstants.BULK_SCORE_UPDATE_CANCEL:
            state.liveScoreMatchListData = state.liveScoreBulkScoreList
            return { ...state, onLoad: false };

        case ApiConstants.API_ADD_LIVE_STREAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_ADD_LIVE_STREAM_SUCCESS:
            state.matchDetails.match[0].livestreamURL = action.result.livestreamURL
            return { ...state, onLoad: false };

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.matchListActionObject = null
            return { ...state, onLoad: false };

        case ApiConstants.API_GET_REF_BADGE_SUCCESS:
            state.accreditation = action.result
            return {
                ...state,
                onLoad: false
            }
        case ApiConstants.RESET_UMPIRE_LIST_BOOL:
            return {
                ...state,
                updateUmpireFetchCall: false
            }

        default:
            return state;
    }
}

export default liveScoreMatchReducer;
