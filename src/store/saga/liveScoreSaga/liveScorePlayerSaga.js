import { put, call, takeEvery } from "redux-saga/effects";
import { message } from "antd";

import AppConstants from "themes/appConstants";
import ApiConstants from "themes/apiConstants";
import history from "util/history";
import { receiptImportResult } from "util/showImportResult";
import LiveScoreAxiosApi from "store/http/liveScoreHttp/liveScoreAxiosApi";

function* failSaga(result) {
  yield put({
    type: ApiConstants.API_LIVE_SCORE_PLAYER_FAIL,
    error: result,
    status: result.status,
  });

  let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong;
  message.config({
    duration: 1.5,
    maxCount: 1,
  });
  message.error(msg);
}

function* errorSaga(error) {
  yield put({
    type: ApiConstants.API_LIVE_SCORE_PLAYER_ERROR,
    error: error,
    status: error.status,
  });

  if (error.status === 400) {
    message.config({
      duration: 1.5,
      maxCount: 1,
    });
    message.error((error && error.error) ? error.error : AppConstants.somethingWentWrong);
  } else {
    message.config({
      duration: 1.5,
      maxCount: 1,
    });
    message.error(AppConstants.somethingWentWrong);
  }
}

// Player list saga
function* liveScorePlayerSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScorePlayerList, action.competitionID);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_PLAYER_LIST_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Add/Edit player saga
function* liveScoreAddEditPlayerSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreAddEditPlayer, action.data);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_SUCCESS,
        result: result.result.data,
        status: result.status,
      });

      message.config({
        duration: 1.5,
        maxCount: 1,
      });
      message.success(action.playerId ? "Player Edited Successfully." : "Player Added Successfully.");

      // history.push(action.temaViewPlayer ? "/liveScoreTeamView" : "/liveScorePlayerList", { tableRecord: action.data.teamId });
      history.push(action.propsData.screenName === "fromMatchList" || action.propsData.screenName === "fromTeamList" ? "/liveScoreTeamView" : "/liveScorePlayerList", { ...action.propsData });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Match Import
function* liveScorePlayerImportSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScorePlayerImport, action.competitionId, action.csvFile);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_SUCCESS,
        result: result.result.data,
      });

      // history.push("/liveScorePlayerList");
      // message.success("Player Imported Successfully.");

      receiptImportResult(result.result);
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Player list pagination
function* getPlayerListPaginationSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.getPlayerWithPaggination, action.competitionID, action.offset, action.limit, action.search, action.sortBy, action.sortOrder);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

export default function* rootLiveScorePlayerSaga() {
  yield takeEvery(ApiConstants.API_LIVE_SCORE_PLAYER_LIST_LOAD, liveScorePlayerSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_LOAD, liveScoreAddEditPlayerSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_LOAD, liveScorePlayerImportSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_LOAD, getPlayerListPaginationSaga);
}
