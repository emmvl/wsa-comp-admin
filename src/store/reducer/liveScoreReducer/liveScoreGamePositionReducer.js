import ApiConstants from '../../../themes/apiConstants'
import { getLiveScoreCompetiton, getUmpireCompetitonData } from '../../../util/sessionStorage';

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  positionList: []
};

function getFilterPositionData(positionData) {
  let competition = null

  if (getLiveScoreCompetiton()) {
    competition = JSON.parse(getLiveScoreCompetiton());
  } else {
    competition = JSON.parse(getUmpireCompetitonData());
  }

  let positionArray = []
  if (competition.gameTimeTracking === false) {
    for (let i in positionData) {
      if (positionData[i].isPlaying === true && positionData[i].isVisible === true) {
        positionArray.push(positionData[i])
      }
    }
  } else {
    for (let i in positionData) {
      if (positionData[i].isVisible === true) {
        positionArray.push(positionData[i])
      }
    }
  }
  return positionArray
}

function liveScoreGamePositionState(state = initialState, action) {

  switch (action.type) {

    case ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_SUCCESS:

      let filterPositionListData = getFilterPositionData(action.result)
      return {
        ...state,
        onLoad: false,
        positionList: filterPositionListData
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
