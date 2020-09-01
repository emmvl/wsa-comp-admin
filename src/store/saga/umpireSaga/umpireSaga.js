import { put, call } from "redux-saga/effects"
import ApiConstants from "../../../themes/apiConstants";
import UserAxiosApi from "../../http/userHttp/userAxiosApi";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_UMPIRE_FAIL });
    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_UMPIRE_ERROR,
        error: error,
        status: error.status
    });
    if (error.status == 400) {

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

export function* umpireListSaga(action) {
    try {
        const result = yield call(UserAxiosApi.umpireList, action.data);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_UMPIRE_LIST_SUCCESS,
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

export function* addEditUmpireSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.addEditUmpire, action.data, action.affiliateId, action.exsitingUmpireId);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_ADD_UMPIRE_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.success(action.extraData.isEdit ? 'Edit Umpire - Successfully Edited' : 'Add Umpire - Successfully Added')
            history.push(action.extraData.screenName == 'umpireDashboard' ? '/umpireDashboard' : '/umpire')

        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* getAffiliateSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGetAffiliate, action.data);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_GET_UMPIRE_AFFILIATE_LIST_SUCCESS,
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

export function* umpireSearchSaga(action) {
    try {
        const result = yield call(UserAxiosApi.umpireList, action.data);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_UMPIRE_SEARCH_SUCCESS,
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