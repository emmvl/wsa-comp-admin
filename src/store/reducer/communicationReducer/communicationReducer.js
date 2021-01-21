import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    communicationList: [],

    error: null,
    status: 0,
};
function communicationModuleState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_COMMUNICATION_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_COMMUNICATION_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                communicationList: action.result,
                status: action.status,
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

        case ApiConstants.API_ADD_COMMUNICATION_LOAD:
            return {
                ...state,
                onLoad: true,
            };

        case ApiConstants.API_ADD_COMMUNICATION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                communicationList: [...state.communicationList, action.result],
                status: action.status,
            };
        case ApiConstants.API_ADD_COMMUNICATION_FAIL:
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
