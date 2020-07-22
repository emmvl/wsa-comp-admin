import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/shopHttp/shopAxios";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    console.log("failSaga", result.result.data.message)
    yield put({
        type: ApiConstants.API_SHOP_SETTINGS_FAIL,
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
    console.log("errorSaga", error)
    yield put({
        type: ApiConstants.API_SHOP_SETTINGS_ERROR,
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

//////////shop setting get API
export function* getShopSettingSaga(action) {
    try {
        const result = yield call(AxiosApi.getShopSetting);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_SHOP_SETTING_SUCCESS,
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

////////shop setting create address API
export function* createAddressSaga(action) {
    try {
        const result = yield call(AxiosApi.createAddress, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_CREATE_SHOP_SETTING_ADDRESS_SUCCESS,
                result: result.result.data,
                status: result.status
            });
            if (action.key == "add") {
                message.success(AppConstants.addressAddedMessage);
            }
            else {
                message.success(AppConstants.addressUpdatedMessage);
            }
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

