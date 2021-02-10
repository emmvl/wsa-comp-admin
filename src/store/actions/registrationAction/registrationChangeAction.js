import ApiConstants from "../../../themes/apiConstants";

function updateRegistrationReviewAction(value, key) {
    const action = {
        type: ApiConstants.API_UPDATE_REG_REVIEW,
        value, key
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

function getRegistrationChangeReview(payload){
    const action = {
        type: ApiConstants.API_GET_REGISTRATION_CHANGE_REVIEW_LOAD,
        payload
    }

    return action;
}

function saveRegistrationChangeReview(payload){
    const action = {
        type: ApiConstants.API_SAVE_REGISTRATION_CHANGE_REVIEW_LOAD,
        payload
    }

    return action;
}

function getTransferCompetitionsAction(payload){
    const action = {
        type: ApiConstants.API_GET_TRANSFER_COMPETITIONS_LOAD,
        payload
    }

    return action;
}

function setRegistrationChangeListPageSize(pageSize) {
    const action = {
        type: ApiConstants.SET_REGISTRATION_CHANGE_LIST_PAGE_SIZE,
        pageSize,
    }

    return action;
}

function setRegistrationChangeListPageNumber(pageNum) {
    const action = {
        type: ApiConstants.SET_REGISTRATION_CHANGE_LIST_PAGE_CURRENT_NUMBER,
        pageNum,
    }

    return action;
}

export {
    updateRegistrationReviewAction,
    saveDeRegisterDataAction,
    updateDeregistrationData,
    getRegistrationChangeDashboard,
    getRegistrationChangeReview,
    saveRegistrationChangeReview,
    getTransferCompetitionsAction,
    setRegistrationChangeListPageSize,
    setRegistrationChangeListPageNumber,
};
