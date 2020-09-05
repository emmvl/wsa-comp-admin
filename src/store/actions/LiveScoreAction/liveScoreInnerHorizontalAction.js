import ApiConstants from "../../../themes/apiConstants";

function innerHorizontalCompetitionListAction(organisationId, yearRefId) {
    const action = {
        type: ApiConstants.API_INNER_HORIZONTAL_COMPETITION_LIST_LOAD,
        organisationId,
        yearRefId

    };

    return action;
}

export {
    innerHorizontalCompetitionListAction
};
