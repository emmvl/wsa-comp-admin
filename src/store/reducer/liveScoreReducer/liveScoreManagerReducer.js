import ApiConstants from '../../../themes/apiConstants'

var managerObj = {
    id: null,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    teams: null,
}

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
    managerSearchResult: []
}

/////get manager List Object on index basis
function getManagerListObject(managerListArray, key) {
    let obj = null
    let index = managerListArray.findIndex(x => x.id == key)
    // let index = managerListArray.findIndex(x => x.firstName + " " + x.lastName == key)
    if (index > -1) {
        obj = managerListArray[index]
    }
    return obj
}

function genrateTeamId(teamIdArr) {

    let teamId = []
    for (let i in teamIdArr) {
        teamId.push(teamIdArr[i].entityId)
    }

    return teamId

}

function getTeamObj(teamSelectId, teamArr) {

    let teamObj = []
    let obj = ''
    for (let i in teamArr) {

        for (let j in teamSelectId) {
            if (teamSelectId[j] == teamArr[i].id) {
                obj = {
                    "name": teamArr[i].name,
                    "id": teamArr[i].id
                }
                teamObj.push(obj)
                break;
            }

        }

    }
    return teamObj;

}

function liveScoreMangerState(state = initialState, action) {
    switch (action.type) {
        //// Manager List
        case ApiConstants.API_LIVE_SCORE_MANAGER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_MANAGER_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                MainManagerListResult: action.result,
                managerListResult: action.result,
                status: action.status,
            }

        //// Add Edit Manager
        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_SUCCESS:
            return {
                ...state,
            }
        case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:

            return {
                ...state,
                onLoad: false,
                teamResult: action.teamResult,

            };

        ////Update Manager Data
        case ApiConstants.API_LIVE_SCORE_UPDATE_MANAGER_DATA:


            if (action.key == 'teamId') {

                let teamObj = getTeamObj(action.data, state.teamResult)
                state.managerData['teams'] = teamObj
                console.log(teamObj, 'teamObj')

                state.teamId = action.data

            } else if (action.key == 'managerRadioBtn') {
                state[action.key] = action.data
                state.exsitingManagerId = null

            }else if (action.key == "managerSearch") {

                state.exsitingManagerId = action.data
            

            } else if (action.key == 'isEditManager') {
                state.managerData.id = action.data.id
                state.managerData.firstName = action.data.firstName
                state.managerData.lastName = action.data.lastName
                state.managerData.mobileNumber = action.data.mobileNumber
                state.managerData.email = action.data.email
                let getTeamId = genrateTeamId(action.data.linkedEntity)
                state.teamId = getTeamId

                let managerTeamObj = getTeamObj(state.teamId, state.teamResult)
                state.managerData['teams'] = managerTeamObj

                state.managerRadioBtn = 'new'

            } else if (action.key == 'isAddManager') {
                state.managerData = managerObj
                state.managerData.id = null
                state.teamId = []
                state.managerRadioBtn = 'new'

            } else {
                state.managerData[action.key] = action.data
            }
            return {
                ...state,

            }

        ///******fail and error handling */

        case ApiConstants.API_LIVE_SCORE_MANAGER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_MANAGER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVESCORE_MANAGER_FILTER:

            return {
                ...state,
                managerListResult: action.payload
            }
        case ApiConstants.CLEAR_LIVESCORE_MANAGER:

            return {
                ...state,
                managerListResult: state.MainManagerListResult
            }

        ////Manager Search
        case ApiConstants.API_LIVESCORE_MANAGER_SEARCH_LOAD:
            return { ...state, onLoadSearch: true };

        case ApiConstants.API_LIVESCORE_MANAGER_SEARCH_SUCCESS:
         
            return {
                ...state,
                onLoadSearch: false,
                managerSearchResult: action.result,
                status: action.status,
            }
        default:
            return state;
    }
}

export default liveScoreMangerState;