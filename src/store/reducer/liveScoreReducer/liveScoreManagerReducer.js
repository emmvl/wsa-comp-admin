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
    totalCount: 1,
    currentPage: 1,
    pageSize: 10,
    managerListActionObject: null,
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

function getNameWithNumber(name, number) {

    let numberLength = number.length < 10 ? new Array(10 - 4).join('x') + number.substr(number - 5, 4) : new Array(number.length - 4).join('x') +
        number.substr(number.length - 5, 4);
    let newName = name + "-" + numberLength
    return newName
}

function updateManagersData(result) {
    if (result.length > 0) {
        for (let i in result) {
            let number = JSON.stringify(result[i].mobileNumber)
            let name = result[i].firstName + " " + result[i].lastName
            let NameWithNumber = getNameWithNumber(name, number)
            result[i].NameWithNumber = NameWithNumber
        }
    }
    return result
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

function liveScoreManagerState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_MANAGER_LIST_LOAD:
            if (action.key === "managerList") {
                state.managerListActionObject = action
            }
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_MANAGER_LIST_SUCCESS:
            // let user_Data = action.result.userData ? action.result.userData : action.result
            let user_Data = action.result.userData ? updateManagersData(action.result.userData) : updateManagersData(action.result)

            return {
                ...state,
                onLoad: false,
                MainManagerListResult: user_Data,
                managerListResult: user_Data,
                status: action.status,
                managerSearchResult: user_Data,
                currentPage: action.result.page ? action.result.page.currentPage : null,
                totalCount: action.result.page ? action.result.page.totalCount : null,
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
            let managerResult = updateManagersData(action.result)
            return {
                ...state,
                onLoadSearch: false,
                // managerSearchResult: action.result,
                managerListResult: managerResult,
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

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.managerListActionObject = null
            return { ...state, onLoad: false };

        case ApiConstants.API_LIVE_SCORE_CLEAR_LIST:
            state.managerListResult = []
            return { ...state, };

        case ApiConstants.SET_LIVE_SCORE_MANAGER_LIST_PAGE_SIZE:
            return {
                ...state,
                pageSize: action.pageSize,
            }

        case ApiConstants.SET_LIVE_SCORE_MANAGER_LIST_PAGE_CURRENT_NUMBER:
            return {
                ...state,
                currentPage: action.pageNum,
            }

        default:
            return state;
    }
}

export default liveScoreManagerState;
