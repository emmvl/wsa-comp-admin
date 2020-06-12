import ApiConstants from "../../../themes/apiConstants";
// competition dashboard
function competitionDashboardAction(yearId) {
    const action = {
        type: ApiConstants.API_COMPETITION_DASHBOARD_LOAD,
        yearId
    };
    return action;
}

//  Enhanced Round Robin Fixture template

function fixtureTemplateRoundsAction() {
    const action = {
        type: ApiConstants.API_FIXTURE_TEMPLATE_ROUNDS_LOAD,        
    };
    return action;
}

export {
    competitionDashboardAction,
    fixtureTemplateRoundsAction
}
