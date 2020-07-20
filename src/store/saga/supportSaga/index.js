import { message } from "antd";
import { put, call } from "redux-saga/effects";

import ApiConstants from "../../../themes/apiConstants";
import supportHttpApi from "../../http/supportHttp/supportHttpApi";

function* failSaga(result) {
  yield put({
    type: ApiConstants.API_SUPPORT_FAIL,
    error: result,
    status: result.status
  });

  setTimeout(() => {
    message.config({
      duration: 1.5,
      maxCount: 1
    })
    message.error(result.result.data.message);
  }, 800);
}

function* errorSaga(error) {
  yield put({
    type: ApiConstants.API_SUPPORT_ERROR,
    error: error,
    status: error.status
  });

  setTimeout(() => {
    message.config({
      duration: 1.5,
      maxCount: 1
    })
    message.error("Something went wrong.");
  }, 800);
}

export function* getSupportContentSaga(action) {
  try {
    const result = yield call(supportHttpApi.getSupportContent, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_SUPPORT_CONTENT_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      failSaga(result);
    }
  } catch (error) {
    errorSaga(error);
  }
}