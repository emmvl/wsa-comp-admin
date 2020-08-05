import ApiConstants from "../../../themes/apiConstants";

function innerHorizontalCompetitionListAction(organisationId) {
    const action = {
        type: ApiConstants.API_INNER_HORIZONTAL_COMPETITION_LIST_LOAD,
        organisationId

    };

    return action;
}

export {
    innerHorizontalCompetitionListAction
};
