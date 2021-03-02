import ApiConstants from "../../../themes/apiConstants";



//////get the membership fee list in registration
function regDashboardListAction(offset, limit, yearRefId, sortBy, sortOrder) {
    const action = {
        type: ApiConstants.API_REG_DASHBOARD_LIST_LOAD,
        offset,
        limit,
        yearRefId,
        sortBy,
        sortOrder
    };
    return action;
}

function getAllCompetitionAction(yearRefId) {
    const action = {
        type: ApiConstants.API_GET_ALL_COMPETITION_LOAD,
        yearRefId
    }
    return action
}

///////registration main dashboard listing owned and participate registration
function registrationMainDashboardListAction(yearRefId, sortBy, sortOrder, key) {
    const action = {
        type: ApiConstants.API_GET_REGISTRATION_MAIN_DASHBOARD_LISTING_LOAD,
        yearRefId,
        sortBy, sortOrder,
        key
    }
    return action
}

function setPageSizeAction(pageSize) {
    return {
        type: ApiConstants.SET_REGISTRATION_DASHBOARD_LIST_PAGE_SIZE,
        pageSize,
    }
}

function setPageNumberAction(pageNum) {
    return {
        type: ApiConstants.SET_REGISTARTION_DASHBOARD_LIST_PAGE_CURRENT_NUMBER,
        pageNum,
    }
}

function registrationFailedStatusUpdate(payload){
    const action = {
        type: ApiConstants.API_REGISTRATION_FAILED_STATUS_UPDATE_LOAD,
        payload
    }
    return action
}

function registrationRetryPaymentAction(payload){
    const action = {
        type: ApiConstants.API_REGISTRATION_RETRY_PAYMENT_LOAD,
        payload
    }
    return action
}

export {
    regDashboardListAction,
    getAllCompetitionAction,
    registrationMainDashboardListAction,
    setPageSizeAction,
    setPageNumberAction,
    registrationFailedStatusUpdate,
    registrationRetryPaymentAction
};
