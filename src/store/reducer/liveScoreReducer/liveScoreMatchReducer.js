import ApiConstants from '../../../themes/apiConstants'
import { getMatchListSettings } from '../../../store/objectModel/getMatchTeamListObject'
import { formateTime, liveScore_formateDate, formatDateTime } from '../../../themes/dateformate'
import moment from "moment";
import liveScoreMatchModal from "../../objectModel/liveScoreMatchModal";


var object = {
    id: '',
    team1Score: 0,
    team2Score: 0,
    venueId: '',
    competitionId: '',
    divisionId: null,
    team1id: '',
    team2id: '',
    startTime: null,
    startdate: '',
    starttime: '',
    type: '',
    matchDuration: '',
    breakDuration: '',
    mainBreakDuration: '',
    extraTimeDuration: '',
    scorerStatus: '',
    mnbMatchId: '',
    mnbPushed: '',
    matchEnded: '',
    matchStatus: '',
    endTime: '',
    team1ResultId: '',
    team2ResultId: '',
    roundId: '',
    originalStartTime: '',
    pauseStartTime: '',
    totalPausedMs: '',
    centrePassStatus: '',
    centrePassWonBy: '',
    umpire1: '',
    umpire2: '',
    team1: {
        id: '',
        name: '',
        divisionId: '',
        logoUrl: '',
        competitionId: '',
        nameFilter: null,
        clubId: '',
        gameTimeTrackingOverride: '',
        positionTracking: ''
    },
    team2: {
        id: '',
        name: '',
        divisionId: '',
        logoUrl: '',
        competitionId: '',
        nameFilter: '',
        clubId: '',
        gameTimeTrackingOverride: '',
        positionTracking: ''
    },
    venue: {
        id: '',
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        parentId: '',
        parent: {
            id: '',
            name: '',
            address: '',
            latitude: '',
            longitude: '',
            parentId: ''
        }
    },
    division: {
        id: '',
        name: '',
        age: '',
        grade: '',
        competitionId: ''
    },
    competition: {
        id: '',
        name: '',
        longName: '',
        logoUrl: '',
        recordUmpire: '',
        gameTimeTracking: '',
        positionTracking: '',
        uploadScores: '',
        uploadAttendance: '',
        scoringType: '',
        attendanceRecordingType: '',
        timerType: '',
        attendanceRecordingPeriod: '',
        softBuzzerUrl: '',
        hardBuzzerUrl: '',
        recordGoalAttempts: ' ',
        centrePassEnabled: '',
        lineupSelectionTime: '',
        attendanceSelectionTime: '',
        lineupSelectionEnabled: '',
        incidentsEnabled: '',

        location: {
            id: '',
            name: '',
            abbreviation: ''
        }
    },
    round: {
        id: '',
        name: '',
        sequence: '',
        competitionId: '',
        divisionId: ''
    }
}

var matchObj = {
    "id": 0,
    "startTime": "",
    "divisionId": null,
    "type": null,
    "competitionId": null,
    "mnbMatchId": null,
    "team1id": null,
    "team2id": null,
    "venueId": null,
    "roundId": null,
    "matchDuration": null,
    "mainBreakDuration": null,
    "breakDuration": null,
    "team1Score": 0,
    "team2Score": 0,
    umpire1: '',
    umpire2: ''
}

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    liveScoreMatchListData: [],
    addEditMatch: object,
    start_date: "",
    start_time: "",
    venueData: null,
    venueIdArray: [],
    liveScoreMatchListPage: 1,
    liveScoreMatchListTotalCount: 1,
    matchData: matchObj,
    matchLoad: false,
    matchDetails: [],
    start_post_date: null,
    displayTime: "",
    team1Players: [],
    team2Players: [],
    divisionList: [],
    teamResult: [],
    roundList: [],
    clubListData:[],
    courList : []
};

function setMatchData(data) {
    let matchObject = {
        "id": data.id ? data.id : 0,
        "startTime": data.startTime,
        "divisionId": data.divisionId,
        "type": data.type,
        "competitionId": data.competitionId,
        "mnbMatchId": data.mnbMatchId,
        "team1id": data.team1Id,
        "team2id": data.team2Id,
        "venueId": data.venueCourtId,
        "roundId": data.roundId,
        "matchDuration": data.matchDuration,
        "mainBreakDuration": data.mainBreakDuration,
        "breakDuration": data.breakDuration,
        "team1Score": data.team1Score ? data.team1Score : 0,
        "team2Score": data.team2Score ? data.team2Score : 0,
    }

    return matchObject;
}


function generateCourtsArray(venuesData) {

    let courtsArray = []
    for (let i in venuesData) {
        let venueCourtsValue = venuesData[i].venueCourts
        for (let j in venueCourtsValue) {
            venueCourtsValue[j]["name"] = venuesData[i].venueName + "-" + venueCourtsValue[j].courtNumber
            courtsArray.push(venueCourtsValue[j])

        }
    }

    return courtsArray

}



function liveScoreMatchReducer(state = initialState, action) {
    switch (action.type) {
        //LIVESCORE Match LIST
        case ApiConstants.API_LIVE_SCORE_MATCH_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_MATCH_LIST_SUCCESS:

            const result = getMatchListSettings(action.result.matches)

            // state.liveScoreMatchListData = result

            return {
                ...state,
                onLoad: false,
                liveScoreMatchListPage: action.result.page ? action.result.page.currentPage : 1,
                liveScoreMatchListTotalCount: action.result.page.totalCount,
                status: action.status,
                liveScoreMatchListData: result
            };

        case ApiConstants.API_LIVE_SCORE_MATCH_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status

            };
        case ApiConstants.API_LIVE_SCORE_MATCH_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        //// Live Score Add Match
        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_LOAD:
            return { ...state, onLoad: true, matchLoad: true };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_SUCCESS:

            let data = action.result
            state.addEditMatch = action.result;
            state.start_date = moment(action.result.startTime).format("DD-MM-YYYY")
            state.start_post_date = moment(action.result.startTime, "YYYY-MM-DD")
            state.start_time = action.result.startTime
            state.displayTime = action.result.startTime
            let checkSelectedVenue = [data.venueCourt.venueId]

            let matchPostObject = setMatchData(data)
            state.matchData = matchPostObject
            state.matchLoad = false
            return {
                ...state,
                onLoad: false,
                error: null,

                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_ADD_MATCH:
            let emptyData = object
            state.addEditMatch = emptyData
            state.matchData = matchObj
            state.start_date = null
            state.start_time = null
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_UPDATE_MATCH:

            let utcTimestamp = null
            let date = null
            if (action.key === "start_date") {
                state.start_date = action.data
                state.start_post_date = action.data
            } else if (action.key === "start_time") {

                state.start_time = action.data
                state.displayTime = action.data


            } else {

                state.addEditMatch[action.key] = action.data
                state.matchData[action.key] = action.data
            }

            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        //LIVESCORE create Match
        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_LOAD:

            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_SUCCESS:
            let createData = action.result
            // state.matchData = dataObject

            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_COMPETITION_VENUES_LIST_SUCCESS:


            let venueCourts = generateCourtsArray(action.venues)
            state.venueData = venueCourts
            state.courList = venueCourts
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        // case ApiConstants.API_REG_FORM_VENUE_SUCCESS:

        //     state.venueData = action.result
        //     return {
        //         ...state,
        //         onLoad: false,
        //     };

        //// Competition venues


        case ApiConstants.API_LIVE_SCORE_CLEAR_MATCH_DATA:
            state.matchData = matchObj
            state.addEditMatch = object
            return {
                ...state
            }

        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_SUCCESS:
            state.roundList.push(action.result)
            state.matchData.roundId = action.result.id
            state.addEditMatch.roundId = action.result.id
            state.addEditMatch.round = action.result
            return {
                ...state,
                onLoad: false,

            };

        case ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_INITAITE:
            return {
                ...state,
                onLoad: true
            }
        case ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_SUCCESS:
            let team1Player = liveScoreMatchModal.getMatchViewData(action.payload.team1players)
            let team2Player = liveScoreMatchModal.getMatchViewData(action.payload.team2players)

            return {
                ...state,
                onLoad: false,
                matchDetails: action.payload,
                team1Players: team1Player,
                team2Players: team2Player
            }
        case ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.payload
            }
        default:
            return state;

        //LIVESCORE create Match
        case ApiConstants.API_LIVE_SCORE_DELETE_MATCH_LOAD:

            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DELETE_MATCH_SUCCESS:

            return {
                ...state,
                onLoad: false,

            };

        //LiveScore Match Import
        case ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_SUCCESS:
            return {
                ...state,
                onLoad: false,

            };

        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_FAIL:
            return { ...state, onLoad: false };

        case ApiConstants.API_LIVE_SCORE_CREATE_MATCH_ERROR:
            return {
                ...state,
                onLoad: false,

            };
        // case ApiConstants.API_LIVE_SCORE_DIVISION_LOAD:
        //     return { ...state, onLoad: true };

        // case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:

        //     return {
        //         ...state,
        //         onLoad: false,
        //     };

        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS:

            return {
                ...state,
                onLoad: false,
                divisionList: action.result,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            
            console.log(action.result)
            state.teamResult =  action.result
            return {
                ...state,
                onLoad: false,
                teamResult: action.result,
                status: action.status

            }
        case ApiConstants.API_LIVE_SCORE_ROUND_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                roundList: action.result,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_CLUB_LIST_LOAD:
                return{
                    ...state,
                    onLoad:true
                }
        case ApiConstants.API_LIVE_SCORE_CLUB_LIST_SUCCESS:
            console.log(action.result,"ClubcompetitionId")
          
            return{
                ...state,
                onLoad:false,
                clubListData:action.result
            }

        //// Local serach 
        
        case ApiConstants.API_LIVE_MATCH_LOCAL_SEARCH:
           
            if(action.key == "courts"){
                if(action.search.length > 0){
                    const filteredData = state.venueData.filter(item => {
                        return item.name.toLowerCase().indexOf(action.search.toLowerCase()) > -1
                    })
                    state.venueData = filteredData
                }else{
                    state.venueData = state.courList 
                }
              
            }
        return{
                ...state
            }

    };

}

export default liveScoreMatchReducer;



