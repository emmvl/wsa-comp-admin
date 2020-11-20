import ApiConstants from "../../../themes/apiConstants";

//get communication List Action
function getCommunicationListAction(orgUniquekey) {
    const action = {
        type: ApiConstants.API_COMMUNICATION_LIST_LOAD,
        orgUniquekey,
    };
    return action;
}

//get communication List Action
function updateCommunicationModuleData(data) {
    const action = {
        type: ApiConstants.API_UPDATE_COMMUNICATION_DATA,
        data,
    };
    return action;
}

export {
    getCommunicationListAction,
    updateCommunicationModuleData
}
