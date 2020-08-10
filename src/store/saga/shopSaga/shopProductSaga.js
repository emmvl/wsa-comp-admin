import { put, call, takeEvery } from "redux-saga/effects";
import { message } from "antd";

import AppConstants from "../../../themes/appConstants";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/shopHttp/shopAxios";

function* failSaga(result) {
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

// Product listing get API
function* getProductListingSaga(action) {
  try {
    const result = yield call(AxiosApi.getProductListing, action.sorterBy, action.order, action.offset, action.filter, action.limit);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_SHOP_PRODUCT_LISTING_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Add product
function* addProductSaga(action) {
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
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get reference type in the add product screen
function* getTypesOfProductSaga(/* action */) {
  try {
    const result = yield call(AxiosApi.getTypesOfProduct);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Delete product from the product listing API
function* deleteProductSaga(action) {
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
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Delete product variant API
function* deleteProductVariantSaga(action) {
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
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Add type in the type list array in from the API
function* addNewTypeSaga(action) {
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
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Product details on id API
function* getProductDetailsByIdSaga(action) {
  try {
    const result = yield call(AxiosApi.getProductDetailsById, action.productId);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_SUCCESS,
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

export default function* rootShopProductSaga() {
  yield takeEvery(ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD, getProductListingSaga);
  yield takeEvery(ApiConstants.API_ADD_SHOP_PRODUCT_LOAD, addProductSaga);
  yield takeEvery(ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_LOAD, getTypesOfProductSaga);
  yield takeEvery(ApiConstants.API_DELETE_SHOP_PRODUCT_LOAD, deleteProductSaga);
  yield takeEvery(ApiConstants.API_DELETE_SHOP_PRODUCT_VARIANT_LOAD, deleteProductVariantSaga);
  yield takeEvery(ApiConstants.API_SHOP_ADD_TYPE_IN_TYPELIST_LOAD, addNewTypeSaga);
  yield takeEvery(ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_LOAD, getProductDetailsByIdSaga);
}
