import ApiConstants from "../../../themes/apiConstants";

function updateRegistrationReviewAction(data) {
    const action = {
        type: ApiConstants.API_UPDATE_REG_REVIEW,
        data
    };
    return action;
}

export {
    updateRegistrationReviewAction
};
