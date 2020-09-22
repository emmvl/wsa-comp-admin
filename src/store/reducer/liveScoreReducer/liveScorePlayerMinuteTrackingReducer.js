import ApiConstants from '../../../themes/apiConstants'

const initialState = {
  onLoad: false,
  recordLoad: false,
  trackingList: [],
  error: null,
  result: null,
  status: 0,
};

function liveScorePlayerMinuteTrackingState(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_RECORD_LOAD:
      return {
        ...state,
        recordLoad: true,
        status: action.status
      };

    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_RECORD_SUCCESS:
      return {
        ...state,
        recordLoad: false,
        status: action.status,
      };

    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_TRACKING_LIST_LOAD:
      return {
        ...state,
        onLoad: true,
        status: action.status
      };

    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_TRACKING_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        trackingList: action.result.data,
        status: action.status
      };

    default:
      return state;
  }
}

export default liveScorePlayerMinuteTrackingState;
