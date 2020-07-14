import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/shopHttp/shopAxios";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    console.log("failSaga", result.result.data.message)
    yield put({
        type: ApiConstants.API_SHOP_PRODUCT_FAIL,
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
        type: ApiConstants.API_SHOP_PRODUCT_ERROR,
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

//////////product listing get API 
export function* getProductListingSaga(action) {
    try {
        const result = yield call(AxiosApi.getProductListing, action.sorterBy, action.order, action.offset, action.filter, action.limit);
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
export function* addProductSaga(action) {
    try {
        const result = yield call(AxiosApi.addProduct, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ADD_SHOP_PRODUCT_SUCCESS,
                result: result.result.data,
                status: result.status
            });
            message.success(AppConstants.productAddedMessage);
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//////////get reference type in the add product screen
export function* getTypesOfProductSaga(action) {
    try {
        const result = yield call(AxiosApi.getTypesOfProduct);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_SUCCESS,
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

//////////////////delete product from the product listing API 
export function* deleteProductSaga(action) {
    try {
        const result = yield call(AxiosApi.deleteProduct, action.productId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DELETE_SHOP_PRODUCT_SUCCESS,
                result: result.result.data,
                status: result.status
            });
            message.success(AppConstants.productDeletedMessage);
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

////////////////////delete product variant API
export function* deleteProductVariantSaga(action) {
    try {
        const result = yield call(AxiosApi.deleteProductVariant, action.optionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DELETE_SHOP_PRODUCT_VARIANT_SUCCESS,
                result: result.result.data,
                status: result.status,
                index: action.index,
                subIndex: action.subIndex
            });
            message.success(AppConstants.variantDeletedMessage);
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

/////////////////add type in the typelist array in from the API
export function* addNewTypeSaga(action) {
    try {
        const result = yield call(AxiosApi.addNewType, action.typeName);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SHOP_ADD_TYPE_IN_TYPELIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.success(AppConstants.typeAddedMessage);
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

///////////////////product details on id API
export function* getProductDetailsByIdSaga(action) {
    try {
        const result = yield call(AxiosApi.getProductDetailsById, action.productId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}