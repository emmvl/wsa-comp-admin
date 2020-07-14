import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import UserAxiosApi from "../../http/userHttp/userAxiosApi";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";

function* failSaga(result) {
    console.log("failSaga", result.message)
    yield put({ type: ApiConstants.API_UMPIRE_FAIL });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    console.log("errorSaga", error)
    yield put({
        type: ApiConstants.API_UMPIRE_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(error.error);
    }, 800);

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
            message.success('Add Umpire - Successfully Added')
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
        const result = yield call(LiveScoreAxiosApi.liveScoreGetAffilate, action.data);
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