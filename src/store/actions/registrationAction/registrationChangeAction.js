import ApiConstants from "../../../themes/apiConstants";

function updateRegistrationReviewAction(data) {
    const action = {
        type: ApiConstants.API_UPDATE_REG_REVIEW,
        data
    };
    return action;
}

function saveDeRegisterDataAction(payload){
    const action = {
        type: ApiConstants.API_SAVE_DE_REGISTRATION_LOAD,
        payload
    };
    return action;
}

function updateDeregistrationData(value, key, subKey) {
    const action = {
        type: ApiConstants.API_UPDATE_DE_REGISTRATION,
        value, key, subKey
    };
    return action;
}

function getRegistrationChangeDashboard(payload){
    const action = {
        type: ApiConstants.API_GET_REGISTRATION_CHANGE_DASHBOARD_LOAD,
        payload
    }

    return action;
}
export {
    updateRegistrationReviewAction,
    saveDeRegisterDataAction,
    updateDeregistrationData,
    getRegistrationChangeDashboard
};
