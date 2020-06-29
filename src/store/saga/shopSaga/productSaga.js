import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/shopHttp/shopAxios";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_SHOP_API_FAIL,
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
        type: ApiConstants.API_SHOP_API_ERROR,
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

//////////product listing get API 
export function* getProductListingSaga(action) {
    try {
        const result = yield call(AxiosApi.getProductListing, action.sorterBy, action.order, action.offset, action.filter);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_SHOP_PRODUCT_LISTING_SUCCESS,
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

/////////////Add product 
export function* addProductActionSaga(action) {
    try {
        const result = yield call(AxiosApi.addProduct);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ADD_SHOP_PRODUCT_SUCCESS,
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

