import ApiConstants from "../../../themes/apiConstants";

function liveScoreCoachListAction(roleId, entityTypeId, entityId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_COACH_LIST_LOAD,
        roleId: roleId,
        entityTypeId: entityTypeId,
        entityId: entityId
    };
    console.log('action', action)

    return action;
}

function liveScoreUpdateCoach(data, key) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_COACH,
        data: data,
        key: key
    };
    return action;
}



export {
    liveScoreUpdateCoach,
    liveScoreCoachListAction
};
