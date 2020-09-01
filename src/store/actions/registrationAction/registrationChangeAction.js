import ApiConstants from "../../../themes/apiConstants";

function updateRegistrationReviewAction(data) {
    const action = {
        type: ApiConstants.API_UPDATE_REG_REVIEW,
        data
    };
    return action;
}

function getDeRegisterDataAction(userId){
    const action = {
        type: ApiConstants.API_GET_DE_REGISTRATION_LOAD,
        userId
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
export {
    updateRegistrationReviewAction,
    getDeRegisterDataAction,
    updateDeregistrationData
};
