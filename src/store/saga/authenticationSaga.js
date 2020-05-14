import { put, call } from "redux-saga/effects";
import ApiConstants from "../../themes/apiConstants";
import userAxiosApi from "../http/userHttp/userAxiosApi";
import { message } from "antd";
import AppConstants from "../../themes/appConstants";


export function* loginApiSaga(action) {
  try {
    const result = yield call(userAxiosApi.Login, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LOGIN_SUCCESS,
        result: result.result.data,
        status: result.status,
        loginData: action
      });
    } else {
      yield put({ type: ApiConstants.API_LOGIN_FAIL });
      setTimeout(() => {
        alert(result.data.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.API_LOGIN_ERROR,
      error: error,
      status: error.status
    });
    message.error(AppConstants.usernamePasswordIncorrect, 0.8);
  }
}

////forgot password
export function* forgotPasswordSaga(action) {
  try {
    const result = yield call(userAxiosApi.forgotPassword, action.email);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_FORGOT_PASSWORD_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield put({ type: ApiConstants.API_LOGIN_FAIL });
      setTimeout(() => {
        message.config({
          duration: 1.5,
          maxCount: 1
        })
        message.error(result.result.data.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.API_LOGIN_ERROR,
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
}
