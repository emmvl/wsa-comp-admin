import ApiConstants from "../../../themes/apiConstants";

function communicationListAction(competitionId) {
    const action = {
        type: ApiConstants.API_COMMUNICATION_LIST_LOAD,
        competitionId,
    };
    return action;
}

function addCommunicationAction(data) {
    const action = {
        type: ApiConstants.API_ADD_COMMUNICATION_LOAD,
        data,
    };

    return action;
}

function refreshCommunicationModuleDataAction() {
    const action = {
        type: ApiConstants.API_REFRESH_COMMUNICATION_DATA,
    };
    return action;
}

// get communication List Action
function updateCommunicationModuleData(data) {
    const action = {
        type: ApiConstants.API_UPDATE_COMMUNICATION_DATA,
        data,
    };
    return action;
}

// Communication notification on click publish and notify
function communicationNotificationAction(data, value, screenKey) {
    const action = {
        type: ApiConstants.API_COMMUNICATION_NOTIFICATION_LOAD,
        data,
        value,
        screenKey,
    };
    return action;
}

// delete Communication data
function deleteCommunicationAction(id) {
    const action = {
        type: ApiConstants.API_DELETE_COMMUNICATION_LOAD,
        id,
    };
    return action;
}

function setDefaultImageVideoNewAction(data) {
    const action = {
        type: ApiConstants.API_DEFAULT_COMMUNICATION_IMAGE_VIDEO,
        payload: data,
    };
    return action;
}

export {
    communicationListAction,
    addCommunicationAction,
    refreshCommunicationModuleDataAction,
    communicationNotificationAction,
    deleteCommunicationAction,
    setDefaultImageVideoNewAction,
    updateCommunicationModuleData,
};
