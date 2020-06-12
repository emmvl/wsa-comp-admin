import ApiConstants from "../../../themes/apiConstants";

function umpireCompetitionListAction(orgId) {
    const action = {
        type: ApiConstants.API_UMPIRE_COMPETITION_LIST_LOAD,
        orgId,
    };

    return action;
}

export {
    umpireCompetitionListAction
} 
