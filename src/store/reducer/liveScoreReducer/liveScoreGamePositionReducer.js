import ApiConstants from '../../../themes/apiConstants'


const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  positionList: []
};

function liveScoreGamePositionState(state = initialState, action) {

  switch (action.type) {

    case ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        positionList:action.result
      };

    case ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };

    case ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };

    default:
      return state;
  }

}

export default liveScoreGamePositionState;
