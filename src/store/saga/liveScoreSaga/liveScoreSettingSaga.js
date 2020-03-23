import { put, call } from '../../../../node_modules/redux-saga/effects';
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import ApiConstants from '../../../themes/apiConstants';
import { message } from "antd";

export function* liveScoreSettingSaga({ payload }) {
    try {

        const result = yield call(LiveScoreAxiosApi.liveScoreSettingView, payload)
        console.log('saga', result)
        if (result.status === 1) {
            yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_SUCCESS, payload: result.result.data })
        } else {
            yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: result })
            setInterval(() => {
                message.error('Something Went Wrong')
            }, 800)
        }
    } catch (e) {
        yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: e })
        setTimeout(() => {
            message.error('Something Went Wrong')
        }, 800)
    }
}

export function* liveScorePostSaga({ payload }) {
    yield console.log('Saga', payload)

    // const result = yield call(LiveScoreAxiosApi.liveScoreSettingPost, payload)
    // console.log('resultSaga', result)
    // yield call(LiveScoreAxiosApi.liveScoreSettingPost, payload)
    try {

        const result = yield call(LiveScoreAxiosApi.liveScoreSettingPost, payload)
        // console.log('saga', result)
        if (result.status === 1) {
            message.success('Successfully Updated')
            // yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_SUCCESS, payload: result.result.data })
        } else {
            // yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: result })
            setInterval(() => {
                message.error('Something Went Wrong')
            }, 800)
        }
    } catch (e) {
        // yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: e })
        setTimeout(() => {
            message.error('Something Went Wrong')
        }, 800)
    }
}