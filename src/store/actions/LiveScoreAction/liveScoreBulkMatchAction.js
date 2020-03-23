import ApiConstants from "../../../themes/apiConstants";

function BulkMatchPushBackAction(pushBackData, start_Date, end_Date, competitionId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_BULK_PUSH_BACK_LOAD,
        pushBackData: pushBackData,
        start_Date: start_Date,
        end_Date: end_Date,
        competitionId: competitionId
    };

    return action;
}

function liveScoreBringForwardAction(competitionID, data, start_Date, end_Date) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_BULK_BRING_FORWARD_LOAD,
        competitionID: competitionID,
        data: data,
        start_Date,
        end_Date,
    };
    return action;

}


function liveScoreEndMatchesdAction(data, start_Date, end_Date) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_BULK_END_MATCHES_LOAD,
        data: data,
        start_Date,
        end_Date
    };
    return action;
}

function liveScoreBulkMatchAction() {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_BULK_MATCH,
    };
    return action;
}

function liveScoreUpdateBulkAction(data, key) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_BULK,
        data: data,
        key: key
    };
    return action;
}

function liveScoreDoubleHeaderAction(competitionID, data) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_BULK_DOUBLE_HEADER_LOAD,
        competitionID: competitionID,
        data: data
    };
    return action;
}

function liveScoreAbandonMatchAction(data, startDate, endDate, competitionID) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_BULK_ABANDON_MATCH_LOAD,
        competitionID,
        data,
        startDate,
        endDate
    };
    return action;
}

function matchResult() {
    const action = {
        type: ApiConstants.API_MATCH_RESULT_LOAD
    }
    return action
}

export {
    BulkMatchPushBackAction,
    liveScoreBringForwardAction,
    liveScoreEndMatchesdAction,
    liveScoreBulkMatchAction,
    liveScoreUpdateBulkAction,
    liveScoreDoubleHeaderAction,
    liveScoreAbandonMatchAction,
    matchResult
};
