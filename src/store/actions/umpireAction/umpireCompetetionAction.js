import ApiConstants from "../../../themes/apiConstants";

function umpireCompetitionListAction(data, yearId, orgId, recordUmpireTypes) {
    const action = {
        type: ApiConstants.API_UMPIRE_COMPETITION_LIST_LOAD,
        orgId,
        data,
        yearId,
        recordUmpireTypes

    };

    return action;
}

export {
    umpireCompetitionListAction
} 
