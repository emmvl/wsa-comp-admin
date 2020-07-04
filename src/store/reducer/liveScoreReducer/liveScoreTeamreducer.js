import ApiConstants from "../../../themes/apiConstants";
import liveScoreTeamModal from '../../objectModel/liveScoreTeamModal'

var teamManagerObj = {
    name: "",
    alias: "",
    logoUrl: null,
    divisionId: null,
    organisationId: null,
    userIds: [],
    firstName: '',
    lastName: '',
    mobileNumber: "",
    email: '',
}

var teamNewObj = {
    name: "",
    alias: "",
    logoUrl: null,
    divisionId: null,
    organisationId: null,
    firstName: '',
    lastName: '',
    mobileNumber: "",
    email: '',
}

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    teamResult: [],
    playerList: [],
    onLoad_2: false,
    form: {
        name: '',
        alias: '',
        logoUrl: '',
        teamLogo: '',
        divisionId: '',
        affiliate: '',
        managerType: '',
        managerContactNo: '',
        managerEmailAddress: '',
        managerLastName: '',
        managerFirstName: '',
        existingManager: '',
        division: [],
        AffilateList: []
    },
    allData: null,
    teamData: null,
    managerData: null,
    teamManagerData: teamManagerObj,
    teamNewData: teamNewObj,
    affilateList: [],
    divisionList: [],
    managerType: null,
    selectedManager: [],
    teamLogo: null,
    managerList: [],
    isCheked: false,
    totalTeams: null
};

function getManagerId(managerData) {
    let managerIds = []

    for (let i in managerData) {
        managerIds.push(JSON.stringify(managerData[i].userId))
    }
    return managerIds

}

function LiveScoreTeamState(state = initialState, action) {

    switch (action.type) {
        ////Team reducers

        case ApiConstants.API_GET_TEAM_VIEW_PLAYER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_TEAM_VIEW_PLAYER_LIST_SUCCESS:

            // let playerData = liveScoreTeamModal.getTeamViewPlayerListData(action.result.players)
            return {
                ...state,
                onLoad: false,
                playerList: action.result.players,
                allData: action.result,
                teamData: action.result.team[0],
                managerData: action.result.managers[0],
                managerList: action.result.managers

            };

        case ApiConstants.API_LIVE_SCORE_DELETE_TEAM_LOAD:
            return { ...state, onLoad_2: true };

        case ApiConstants.API_LIVE_SCORE_DELETE_TEAM_SUCCESS:
            return {
                ...state,
                onLoad_2: false,
            };

        // case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
        //     return { ...state, onLoad: true };

        // case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:

        //     const result = action.result

        //     return {
        //         ...state,
        //         onLoad: false,
        //         teamResult: result,
        //         status: action.status

        //     }

        case ApiConstants.API_LIVE_SCORE_TEAM_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_TEAM_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.LIVE_SCORE_TEAM_EDIT:
            const { key } = action.payload;
            const { data } = action.payload

            if (key == 'managerType') {
                state[key] = data

            }
            else if (key == 'teamLogo') {
                state[key] = data
            } else if (key == 'checkBox') {
                state.isCheked = data

                if (data == true) {
                    state.teamManagerData['logoUrl'] = null
                    state.teamLogo = null
                }

            } else if (key == 'addTeam') {
                state.teamManagerData['logoUrl'] = null
                state.teamLogo = null
                state.managerType = null
                state.teamManagerData['alias'] = ""

                let obj = {
                    name: "",
                    alias: "",
                    logoUrl: null,
                    divisionId: null,
                    organisationId: null,
                    userIds: [],
                    firstName: '',
                    lastName: '',
                    mobileNumber: "",
                    email: '',
                }

                state.teamManagerData = obj
            } else if (key == "logoUrl") {

                state.teamManagerData['logoUrl'] = data
                state.isCheked = false
            }
            else {
                state.teamManagerData[key] = data
                if (key == "userIds") {
                    state.selectedManager = data
                }

            }
            return {
                ...state,
                // form: {
                //     ...state.form,
                //     [key]: data
                // }
            }
        case ApiConstants.GET_DIVISION_TEAM:
            return {
                ...state,
                onLoad: true
            }
        case ApiConstants.GET_AFFILATE_TEAM:
            return {
                ...state,

            }
        case ApiConstants.GET_DIVISION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                // form: {
                //     ...state.form,
                //     division: action.payload
                // }
                divisionList: action.payload
            }
        case ApiConstants.GET_DIVISION_ERROR:
            return {
                ...state,
                onLoad: false,
                form: {
                    ...state.form,
                    DivisionListError: action.payload
                }

            }
        case ApiConstants.GET_AFFILATE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                // form: {
                //     ...state.form,
                //     AffilateList: action.payload
                // }
                affilateList: action.payload

            }
        case ApiConstants.GET_AFFILATE_ERROR:
            return {
                ...state,
                onLoad: false,
                form: {
                    ...state.form,
                    AffilateListError: action.payload
                }

            }

        ////Import Team

        case ApiConstants.API_LIVE_SCORE_TEAM_IMPORT_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_IMPORT_SUCCESS:
            return {
                ...state,
                onLoad: false,
            }

        //// Add Team
        case ApiConstants.API_LIVE_SCORE_ADD_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_ADD_TEAM_SUCCESS:
            return {
                ...state,
                onLoad: false,
            }

        //// Get Team Data
        case ApiConstants.API_LIVE_SCORE_GET_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_GET_TEAM_SUCCESS:


            state.teamManagerData = action.result.team[0]

            state.teamLogo = action.result.team[0].logoUrl
            let managerId = getManagerId(action.result.managers)

            state.teamManagerData['userIds'] = managerId

            state.selectedManager = managerId
            state.managerType = action.result.managers.length > 0 ? 'existing' : null
            return {
                ...state,
                onLoad: false,
            }

        case ApiConstants.API_LIVE_SCORE_TEAM_WITH_PAGGING_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_WITH_PAGGING_SUCCESS:

            const result = action.result.teams
            state.totalTeams = action.result.page.page.totalCount
            return {
                ...state,
                onLoad: false,
                teamResult: result,
                status: action.status

            }

        default:
            return state;
    }
}

export default LiveScoreTeamState;
