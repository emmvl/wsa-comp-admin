import ApiConstants from "themes/apiConstants";

function liveScorePlayerMinuteTrackingListAction(matchId, teamId, playerId) {
  return {
    type: ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_TRACKING_LIST_LOAD,
    matchId,
    teamId,
    playerId,
  };
}

function liveScorePlayerMinuteRecordAction(data) {
  return {
    type: ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_RECORD_LOAD,
    data
  };
}

export {
  liveScorePlayerMinuteRecordAction,
  liveScorePlayerMinuteTrackingListAction,
};
