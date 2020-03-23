import ApiConstants from "../../../themes/apiConstants";
// competition dashboard
function competitionDashboardAction(yearId) {
    const action = {
        type: ApiConstants.API_COMPETITION_DASHBOARD_LOAD,
        yearId
    };
    return action;
}


export {
    competitionDashboardAction,

}
