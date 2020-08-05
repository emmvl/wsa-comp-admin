import { message } from "antd";
import { put, call } from "redux-saga/effects";

import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_BANNERS_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_BANNERS_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        // message.error(error.result.data.message);
        message.error("Something went wrong.");
    }, 800);
}

export function* liveScoreBannerSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreBannerList, action.competitionID);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_BANNERS_SUCCESS,
                result: result.result.data,
                status: result.status,
                navigation: action.navigation
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* liveScoreAddBannerSaga(action) {
    try {
        const result = yield call(
            LiveScoreAxiosApi.liveScoreAddBanner,
            action.competitionID,
            action.bannerImage,
            action.showOnHome,
            action.showOnDraws,
            action.showOnLadder,
            action.showOnNews,
            action.showOnChat,
            action.format,
            action.bannerLink,
            action.bannerId
        );

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ADD_BANNER_SUCCESS,
                result: result.result.data,
                status: result.status,
                navigation: action.navigation
            });
            message.success('Banner Added Successfully.');
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* liveScoreRemoveBannerSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreRemoveBanner, action.bannerId);
        if (result.status === 1) {
            const result = yield call(LiveScoreAxiosApi.liveScoreBannerList, action.competitionID);
            yield put({
                type: ApiConstants.API_LIVE_SCORE_BANNERS_SUCCESS,
                result: result.result.data,
                status: result.status,
                navigation: action.navigation
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}