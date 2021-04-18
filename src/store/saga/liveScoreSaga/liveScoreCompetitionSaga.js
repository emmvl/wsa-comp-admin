import { call, put, takeEvery } from 'redux-saga/effects';
import { message } from 'antd';

import ApiConstants from 'themes/apiConstants';
import AppConstants from 'themes/appConstants';
import LiveScoreAxiosApi from '../../http/liveScoreHttp/liveScoreAxiosApi';

function* liveScoreCompetitionSaga({ payload, year, orgKey, recordUmpires, sortBy, sortOrder }) {
  try {
    const result = yield call(
      LiveScoreAxiosApi.liveScoreCompetition,
      payload,
      year,
      orgKey,
      recordUmpires,
      sortBy,
      sortOrder,
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_COMPETITION_SUCCESS,
        payload: result.result.data,
      });
    } else {
      const msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong;
      message.config({
        duration: 1.5,
        maxCount: 1,
      });
      message.error(msg);
    }
  } catch (error) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_COMPETITION_ERROR, payload: error });
    message.config({
      duration: 1.5,
      maxCount: 1,
    });
    message.error(AppConstants.somethingWentWrong);
  }
}

function* liveScoreCompetitionDeleteSaga({ payload, key }) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreCompetitionDelete, payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_COMPETITION_DELETE_SUCCESS,
        payload: { id: payload },
        key,
      });
      message.success('Deleted Successfully');
    } else {
      setTimeout(() => {
        message.error(result.result.message || 'Something Went Wrong ');
      }, 800);
      yield put({ type: ApiConstants.API_LIVE_SCORE_COMPETITION_DELETE_ERROR });
    }
  } catch (e) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_COMPETITION_DELETE_ERROR, payload: e });
    setTimeout(() => {
      message.error('Something Went Wrong');
    }, 800);
  }
}

function* liveScoreOwnPartCompetitionListSaga({
  payload,
  orgKey,
  sortBy,
  sortOrder,
  key,
  yearRefId,
}) {
  try {
    const result = yield call(
      LiveScoreAxiosApi.liveScoreOwnPartCompetitionList,
      payload,
      orgKey,
      sortBy,
      sortOrder,
      yearRefId,
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_SUCCESS,
        payload: result.result.data,
        key,
      });
    } else {
      const msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong;
      message.config({
        duration: 1.5,
        maxCount: 1,
      });
      message.error(msg);
    }
  } catch (error) {
    yield put({ type: ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_ERROR, payload: error });
    message.config({
      duration: 1.5,
      maxCount: 1,
    });
    message.error(AppConstants.somethingWentWrong);
  }
}

export default function* rootLiveScoreCompetitionSaga() {
  yield takeEvery(ApiConstants.API_LIVE_SCORE_COMPETITION_INITIATE, liveScoreCompetitionSaga);
  yield takeEvery(
    ApiConstants.API_LIVE_SCORE_COMPETITION_DELETE_INITIATE,
    liveScoreCompetitionDeleteSaga,
  );
  yield takeEvery(
    ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_LOAD,
    liveScoreOwnPartCompetitionListSaga,
  );
}
