import ApiConstants from '../../../themes/apiConstants';

export const liveScoreCompetitionActionInitiate = (
  data,
  year,
  orgKey,
  recordUmpires,
  sortBy,
  sortOrder,
) => {
  return {
    type: ApiConstants.API_LIVE_SCORE_COMPETITION_INITIATE,
    payload: data,
    year: year,
    orgKey: orgKey,
    sortBy,
    sortOrder,
  };
};
export const liveScoreCompetionActionSuccess = data => {
  return {
    type: ApiConstants.API_LIVE_SCORE_COMPETITION_SUCCESS,
  };
};
export const liveScoreCompetionActionError = data => {
  return {
    type: ApiConstants.API_LIVE_SCORE_COMPETITION_ERROR,
    payload: data,
  };
};

export const liveScoreCompetitionDeleteInitiate = (data, key) => {
  return {
    type: ApiConstants.API_LIVE_SCORE_COMPETITION_DELETE_INITIATE,
    payload: data,
    key,
  };
};
export const liveScoreCompetitionDeleteSuccess = data => {
  return {
    type: ApiConstants.API_LIVE_SCORE_COMPETITION_DELETE_SUCCESS,
    payload: data,
  };
};
export const liveScoreCompetitionDeleteError = data => {
  return {
    type: ApiConstants.API_LIVE_SCORE_COMPETITION_DELETE_ERROR,
    payload: data,
  };
};

export const setParticipatePageSizeAction = pageSize => {
  return {
    type: ApiConstants.SET_LIVE_SCORE_PARTICIPATE_PAGE_SIZE,
    pageSize,
  };
};

export const setParticipatePageNumberAction = pageNum => {
  return {
    type: ApiConstants.SET_LIVE_SCORE_PARTICIPATE_PAGE_CURRENT_NUMBER,
    pageNum,
  };
};

export const setOwnedPageSizeAction = pageSize => {
  return {
    type: ApiConstants.SET_LIVE_SCORE_OWNED_PAGE_SIZE,
    pageSize,
  };
};

export const setOwnedPageNumberAction = pageNum => {
  return {
    type: ApiConstants.SET_LIVE_SCORE_OWNED_PAGE_CURRENT_NUMBER,
    pageNum,
  };
};

export const liveScoreOwnPartCompetitionList = (
  data,
  orgKey,
  sortBy,
  sortOrder,
  key,
  yearRefId,
) => {
  return {
    type: ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_LOAD,
    payload: data,
    orgKey,
    sortBy,
    sortOrder,
    key,
    yearRefId,
  };
};
