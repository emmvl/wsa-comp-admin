import ApiConstants from "../../../themes/apiConstants";

function liveScorePositionTrackingAction(data) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_POSITION_TRACKING_LOAD,
        data
    };

    return action;
}

export {
    liveScorePositionTrackingAction
};
