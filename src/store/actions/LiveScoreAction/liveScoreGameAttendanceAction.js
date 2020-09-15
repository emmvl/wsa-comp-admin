import ApiConstants from "../../../themes/apiConstants";

function liveScoreExportGameAttendanceAction(matchId, teamId, payload) {
  const action = {
    type: ApiConstants.API_LIVE_SCORE_EXPORT_ATTENDANCE_LOAD,
    matchId,
    teamId,
    payload,
  };

  return action;
}

export {
  liveScoreExportGameAttendanceAction,
}
