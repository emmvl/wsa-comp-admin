import ApiConstants from "../../../themes/apiConstants";

function liveScoreUpdateVenueChange(data, key) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_VENUE_CHANGE,
        data,
        key
    }

    return action
}
export {
    liveScoreUpdateVenueChange,
}
