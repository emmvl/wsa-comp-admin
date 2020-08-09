import { put, call } from "redux-saga/effects"
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_FAIL });
    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_ERROR,
        error: error,
        status: error.status
    });
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(AppConstants.somethingWentWrong);
}

export function* liveScoreDivisionSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGetDivision, action.competitionID);
        if (result.status === 1) {
            let divisionId = result.result.data[0]

            const listResult = yield call(LiveScoreAxiosApi.liveScoreLadderList, divisionId.id, action.competitionID);

            if (listResult.status === 1) {
                const teamResult = yield call(LiveScoreAxiosApi.liveScoreTeam, action.competitionID);
                if (teamResult.status === 1) {
                    const roundResult = yield call(LiveScoreAxiosApi.liveScoreRound, action.competitionID);
                    if (roundResult.status === 1) {
                        yield put({
                            type: ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS,
                            divisionList: result.result.data,
                            ladderList: listResult.result.data,
                            teamResult: teamResult.result.data,
                            roundResult: roundResult.result.data,
                            status: listResult.status,
                        });
                    }

                }
            }
        } else {
            yield put({ type: ApiConstants.API_LIVE_SCORE_DIVISION_FAIL });
            setTimeout(() => {
                alert(result);
            }, 800);
        }

    } catch (error) {
        yield put({
            type: ApiConstants.API_LIVE_SCORE_DIVISION_ERROR,
            error: error,
            status: error.status
        });
    }
}

//// get manager list
export function* getLiveScoreScorerSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.getLiveScoreScorerList, action.competitionId, action.roleId)
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_GET_SCORER_LIST_SUCCESS,
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