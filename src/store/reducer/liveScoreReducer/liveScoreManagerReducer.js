import ApiConstants from "themes/apiConstants";

const managerObj = {
    id: null,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    teams: null,
};

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    managerListResult: [],
    MainManagerListResult: [],
    managerData: managerObj,
    teamId: null,
    managerRadioBtn: null,
    exsitingManagerId: null,
    teamResult: [],
    onLoadSearch: false,
    managerSearchResult: [],
    loading: false,
};

// function getManagerListObject(managerListArray, key) {
//     let obj = null;
//     let index = managerListArray.findIndex(x => x.id === key);
//     // let index = managerListArray.findIndex(x => x.firstName + " " + x.lastName === key);
//     if (index > -1) {
//         obj = managerListArray[index];
//     }
//     return obj;
// }

function generateTeamId(teamIdArr) {
    let teamId = [];
    for (let i in teamIdArr) {
        teamId.push(teamIdArr[i].entityId);
    }
    return teamId;
}

function getTeamObj(teamSelectId, teamArr) {
    let teamObj = [];
    for (let i in teamArr) {
        for (let j in teamSelectId) {
            if (teamSelectId[j] === teamArr[i].id) {
                teamObj.push({
                    name: teamArr[i].name,
                    id: teamArr[i].id,
                });
                break;
            }
        }
    }
    return teamObj;
}

function getSelectedTeam(managerSelectedId, managerArr) {
    let teamObjArr;
    for (let i in managerArr) {
        if (managerSelectedId === managerArr[i].id) {
            teamObjArr = managerArr[i].linkedEntity;
            return teamObjArr;
        }
    }
}

// function generateSelectedTeamId(linkedEntityArr, teamArray) {
//     let teamIds = [];
//     for (let i in teamArray) {
//         for (let j in linkedEntityArr) {
//             if (linkedEntityArr[j].entityId === teamArray[i].id) {
//                 teamIds.push(linkedEntityArr[j].entityId);
//             }
//         }
//     }
//     return teamIds;
// }

function liveScoreMangerState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_MANAGER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_MANAGER_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                MainManagerListResult: action.result,
                managerListResult: action.result,
                status: action.status,
                managerSearchResult: action.result,
            };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_LOAD:
            return { ...state, loading: true };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_SUCCESS:
            return { ...state, loading: false };

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            // let playerData = liveScoreTeamModal.getTeamViewPlayerListData(action.result.players);
            return {
                ...state,
                teamResult: action.result,
            };

        case ApiConstants.API_LIVE_SCORE_UPDATE_MANAGER_DATA:
            if (action.key === "teamId") {
                state.managerData["teams"] = getTeamObj(action.data, state.teamResult);
                state.teamId = action.data;
            } else if (action.key === "managerRadioBtn") {
                state[action.key] = action.data;
                state.exsitingManagerId = null;
            } else if (action.key === "managerSearch") {
                state.exsitingManagerId = action.data;
                state.selectedTeam = getSelectedTeam(action.data, state.managerListResult);
                // state.teamId = generateSelectedTeamId( state.selectedTeam, state.teamResult);
                // let managerTeamObj = getTeamObj(state.teamId, state.teamResult);
                // let managerTeamObj = getSelectedTeamObj(state.getSelectedTeam);
                // state.managerData["teams"] = managerTeamObj;
            } else if (action.key === "isEditManager") {
                state.managerData.id = action.data.id;
                state.managerData.firstName = action.data.firstName;
                state.managerData.lastName = action.data.lastName;
                state.managerData.mobileNumber = action.data.mobileNumber;
                state.managerData.email = action.data.email;
                state.teamId = generateTeamId(action.data.linkedEntity);
                state.managerData["teams"] = getTeamObj(state.teamId, state.teamResult);
                state.managerRadioBtn = "new";
            } else if (action.key === "isAddManager") {
                state.managerData = managerObj;
                state.managerData.id = null;
                state.teamId = [];
                state.managerRadioBtn = "new";
            } else {
                state.managerData[action.key] = action.data;
            }
            return { ...state };

        case ApiConstants.API_LIVE_SCORE_MANAGER_FAIL:
            return {
                ...state,
                onLoad: false,
                loading: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_MANAGER_ERROR:
            return {
                ...state,
                onLoad: false,
                loading: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVESCORE_MANAGER_FILTER:
            return {
                ...state,
                managerListResult: action.payload,
            };

        case ApiConstants.CLEAR_LIVESCORE_MANAGER:
            return {
                ...state,
                managerListResult: state.MainManagerListResult
            }

        case ApiConstants.API_LIVESCORE_MANAGER_SEARCH_LOAD:
            return { ...state, onLoadSearch: true };

        case ApiConstants.API_LIVESCORE_MANAGER_SEARCH_SUCCESS:
            // state.managerListResult = action.result ? action.result : state.managerSearchResult;
            return {
                ...state,
                onLoadSearch: false,
                // managerSearchResult: action.result,
                managerListResult: action.result,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_MANAGER_IMPORT_LOAD:
            return {
                ...state,
                onLoad: true,
                importResult: null,
            };

        case ApiConstants.API_LIVE_SCORE_MANAGER_IMPORT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                importResult: action.result,
            };

        case ApiConstants.API_LIVE_SCORE_MANAGER_IMPORT_RESET:
            return {
                ...state,
                importResult: null,
            };

        default:
            return state;
    }
}

export default liveScoreMangerState;
