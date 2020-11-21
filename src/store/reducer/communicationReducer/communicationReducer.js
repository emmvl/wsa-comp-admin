import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireComptitionList: [],
    allOrg: false,
    indivisualOrg: false,
    indivisualUsers: false,
    allUser: false,
    selectedRoles: false,
    onTextualLoad: false,
    userDashboardTextualList: [],
    userId: null,
    orgId: null,
    orgName: "",
    userName: "",
    affiliateTo: [],
    onLoadSearch: false
};
function communicationModuleState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_COMMUNICATION_LIST_LOAD:


            return { ...state, onLoad: true };

        case ApiConstants.API_COMMUNICATION_LIST_SUCCESS:
            let result = action.result
            return {
                ...state,
                onLoad: false,
                umpireComptitionList: result,
                status: action.status
            };

        case ApiConstants.API_USER_DASHBOARD_TEXTUAL_LOAD:
            return { ...state, onTextualLoad: true };

        case ApiConstants.API_USER_DASHBOARD_TEXTUAL_SUCCESS:
            let textualData = action.result;
            return {
                ...state,
                onTextualLoad: false,
                userDashboardTextualList: textualData.users,
            };

        case ApiConstants.API_UPDATE_COMMUNICATION_DATA:
            let data = action.data.data
            let key = action.data.key
            if (key == 'allOrg' || key == 'indivisualOrg') {
                if (key == 'allOrg') {
                    state[key] = data
                    state['indivisualOrg'] = false
                    state.orgId = null
                    state.orgName = ""
                }
                if (key == 'indivisualOrg') {
                    state[key] = data
                    state['allOrg'] = false
                    state.affiliateTo = []
                }
            } else if (key === 'allUser' || key === 'selectedRoles' || key === 'indivisualUsers') {
                if (key === 'allUser') {
                    state[key] = data
                    state['selectedRoles'] = false
                    state['indivisualUsers'] = false
                    state.userId = null
                    state.userName = ""
                }
                if (key === 'selectedRoles') {
                    state[key] = data
                    state['allUser'] = false
                    state['indivisualUsers'] = false
                    state.userId = null
                    state.userName = ""
                }
                if (key === 'indivisualUsers') {
                    state[key] = data
                    state['allUser'] = false
                    state['selectedRoles'] = false
                    state.userDashboardTextualList = []
                }
            } else {
                let subKey = action.data.subKey
                let selectedName = action.data.selectedName
                state[key] = data
                state[subKey] = selectedName
            }
            return {
                ...state,
            };

        case ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD:
            return { ...state, onLoad: true, affiliateToOnLoad: true, onLoadSearch: true };

        case ApiConstants.API_AFFILIATE_TO_ORGANISATION_SUCCESS:
            let affiliateToData = action.result;
            return {
                ...state,
                onLoad: false,
                affiliateTo: affiliateToData,
                affiliateToOnLoad: false,
                status: action.status,
                onLoadSearch: false
            };

        case ApiConstants.API_CLEAR_LIST_DATA:
            state.userDashboardTextualList = []
            state.onTextualLoad = false
            return { ...state };

        case ApiConstants.API_COMMUNICATION_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_COMMUNICATION_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        default:
            return state;
    }
}

export default communicationModuleState;
