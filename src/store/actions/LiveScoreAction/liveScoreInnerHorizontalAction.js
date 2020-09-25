import ApiConstants from "../../../themes/apiConstants";

function innerHorizontalCompetitionListAction(organisationId, yearRefId, compData) {
    const action = {
        type: ApiConstants.API_INNER_HORIZONTAL_COMPETITION_LIST_LOAD,
        organisationId,
        yearRefId,
        compData

    };

    return action;
}

function updateInnerHorizontalData() {
    const action = {
        type: ApiConstants.API_UPDATE_INNER_HORIZONTAL,
    };

    return action;
}

function initializeCompData() {
    const action = {
        type: ApiConstants.API_INITIALIZE_COMP_DATA,
    };

    return action;
}

export {
    innerHorizontalCompetitionListAction,
    updateInnerHorizontalData,
    initializeCompData
};
