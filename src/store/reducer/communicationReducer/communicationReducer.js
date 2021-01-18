import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    addEditCommunication: {},
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    communicationList: [],
    allOrg: false,
    individualOrg: false,
    individualUsers: false,
    allUser: false,
    selectedRoles: false,
    onTextualLoad: false,
    userDashboardTextualList: [],
    userId: null,
    orgId: null,
    orgName: "",
    userName: "",
    affiliateTo: [],
    onLoadSearch: false,
};
function communicationModuleState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_COMMUNICATION_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_COMMUNICATION_LIST_SUCCESS:
            const { result } = action;
            return {
                ...state,
                onLoad: false,
                communicationList: result,
                status: action.status,
            };

        case ApiConstants.API_UPDATE_COMMUNICATION_DATA:
            const { data } = action.data;
            const { key } = action.data;
            if (key === 'allOrg' || key === 'individualOrg') {
                if (key === 'allOrg') {
                    state[key] = data;
                    state.individualOrg = false;
                    state.orgId = null;
                    state.orgName = "";
                }
                if (key === 'individualOrg') {
                    state[key] = data;
                    state.allOrg = false;
                    state.affiliateTo = [];
                }
            } else if (key === 'allUser' || key === 'selectedRoles' || key === 'individualUsers') {
                if (key === 'allUser') {
                    state[key] = data;
                    state.selectedRoles = false;
                    state.individualUsers = false;
                    state.userId = null;
                    state.userName = "";
                }
                if (key === 'selectedRoles') {
                    state[key] = data;
                    state.allUser = false;
                    state.individualUsers = false;
                    state.userId = null;
                    state.userName = "";
                }
                if (key === 'individualUsers') {
                    state[key] = data;
                    state.allUser = false;
                    state.selectedRoles = false;
                    state.userDashboardTextualList = [];
                }
            } else {
                const { subKey } = action.data;
                const { selectedName } = action.data;
                state[key] = data;
                state[subKey] = selectedName;
            }
            return {
                ...state,
            };

        case ApiConstants.API_COMMUNICATION_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
            };
        case ApiConstants.API_COMMUNICATION_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
            };

        default:
            return state;
    }
}

export default communicationModuleState;
