import ApiConstants from '../../../themes/apiConstants';

function getLiveScoreGamePositionsList() {
  const action = {
    type: ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_LOAD,
  };

  return action;
}

export { getLiveScoreGamePositionsList };
