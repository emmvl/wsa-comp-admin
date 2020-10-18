import ApiConstants from "../../../themes/apiConstants";

//get userCount Action
function getUserCount(year) {
    const action = {
        type: ApiConstants.API_USERCOUNT_LOAD,
        year,
    };
    return action;
}
function clearHomeDashboardData(key) {
    const action = {
        type: ApiConstants.clearHomeDashboardData,
        key
    }
    return action;
}

function setHomeDashboardYear(year) {
    const action = {

        type: ApiConstants.setHomeDashboardYearKey,
        year
    }
    return action
}

function getActionBoxAction(payload){
    const action = {
        type: ApiConstants.API_GET_ACTION_BOX_LOAD,
        payload
    }

    return action;
}

function updateActionBoxAction(payload){
    const action = {
        type: ApiConstants.API_UPDATE_ACTION_BOX_LOAD,
        payload
    }
    return action;
}




export {
    getUserCount,
    clearHomeDashboardData,
    setHomeDashboardYear,
    getActionBoxAction,
    updateActionBoxAction
}
