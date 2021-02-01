import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    onPublishLoad: false,
    onDeleteLoad: false,
    deleteSuccess: false,
    addSuccess: false,
    publishSuccess: false,

    addedCommunication: null,
    communicationList: [],

    error: null,
    status: 0,
};
function CommunicationState(state = initialState, action) {
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
                addSuccess: false,
                onLoad: true,
            };

        case ApiConstants.API_ADD_COMMUNICATION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                addSuccess: true,
                addedCommunication: action.result,
                communicationList: [...state.communicationList.filter((com) => com.id !== action.result.id), action.result],
                status: action.status,
            };
        case ApiConstants.API_ADD_COMMUNICATION_FAIL:
            return {
                ...state,
                onLoad: false,
                addSuccess: false,
                addedCommunication: null,
                error: action.error,
                status: action.status,
            };
        case ApiConstants.API_ADD_COMMUNICATION_ERROR:
            return {
                ...state,
                onLoad: false,
                addSuccess: false,
                addedCommunication: null,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_DELETE_COMMUNICATION_LOAD:
            return { ...state, onDeleteLoad: true, deleteSuccess: false };

        case ApiConstants.API_DELETE_COMMUNICATION_SUCCESS:
            return {
                ...state,
                onDeleteLoad: false,
                deleteSuccess: true,
                communicationList: state.communicationList.filter((com) => com.id !== action.result),
                status: action.status,
            };
        case ApiConstants.API_DELETE_COMMUNICATION_FAIL:
            return {
                ...state,
                onDeleteLoad: false,
                deleteSuccess: false,
                error: action.error,
                status: action.status,
            };
        case ApiConstants.API_DELETE_COMMUNICATION_ERROR:
            return {
                ...state,
                onDeleteLoad: false,
                deleteSuccess: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_COMMUNICATION_PUBLISH_LOAD:
            return { ...state, onPublishLoad: true, publishSuccess: false };
        case ApiConstants.API_COMMUNICATION_PUBLISH_SUCCESS:
            return {
                ...state,
                onPublishLoad: false,
                publishSuccess: true,
                communicationList: state.communicationList.filter((com) => com.id !== action.result),
                status: action.status,
            };
        case ApiConstants.API_COMMUNICATION_PUBLISH_FAIL:
            return {
                ...state,
                onPublishLoad: false,
                publishSuccess: false,
                error: action.error,
                status: action.status,
            };
        case ApiConstants.API_COMMUNICATION_PUBLISH_ERROR:
            return {
                ...state,
                onPublishLoad: false,
                publishSuccess: false,
                error: action.error,
                status: action.status,
            };
        default:
            return state;
    }
}

export default CommunicationState;
