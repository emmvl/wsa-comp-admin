import ApiConstants from "themes/apiConstants";

function liveScorePlayerMinuteTrackingListAction(matchId, teamId, playerId) {
  return {
    type: ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_TRACKING_LIST_LOAD,
    matchId,
    teamId,
    playerId,
  };
}

function liveScorePlayerMinuteRecordAction(data, matchId) {
  return {
    type: ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_RECORD_LOAD,
    data,
    matchId
  };
}

function liveScoreUpdatePlayerMinuteRecordAction(data) {
  return {
    type: ApiConstants.API_LIVE_SCORE_UPDATE_PLAYER_MINUTE_RECORD,
    data,
  };
}

export {
  liveScorePlayerMinuteRecordAction,
  liveScorePlayerMinuteTrackingListAction,
  liveScoreUpdatePlayerMinuteRecordAction
};
