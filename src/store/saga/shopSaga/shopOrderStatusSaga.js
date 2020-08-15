import { put, call, takeEvery } from "redux-saga/effects";
import { message } from "antd";

import AppConstants from "../../../themes/appConstants";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/shopHttp/shopAxios";

function* failSaga(result) {
  yield put({
    type: ApiConstants.API_SHOP_ORDER_STATUS_FAIL,
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
    type: ApiConstants.API_SHOP_ORDER_STATUS_ERROR,
    error: error,
    status: error.status
  });

  setTimeout(() => {
    message.config({
      duration: 1.5,
      maxCount: 1
    })
    message.error(AppConstants.somethingWentWrong);
  }, 800);
}

// //order status status listing get API 
function* getOrderStatusListingSaga(action) {
  try {
    const result = yield call(AxiosApi.getOrderStatusListing, action.params);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_ORDER_STATUS_LISTING_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

// ////////update order status API  
function* updateOrderStatusSaga(action) {
  try {
    const result = yield call(AxiosApi.updateOrderStatus, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_UPDATE_ORDER_STATUS_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

export default function* rootShopOrderStatusSaga() {
  yield takeEvery(ApiConstants.API_GET_ORDER_STATUS_LISTING_LOAD, getOrderStatusListingSaga);
  yield takeEvery(ApiConstants.API_UPDATE_ORDER_STATUS_LOAD, updateOrderStatusSaga);
}
