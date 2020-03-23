import ApiConstants from '../../../themes/apiConstants'
import { actionChannel } from '@redux-saga/core/effects'
const initialState = {
    loader: false,
    form: {
        id: 0,
        competitionName: "",
        competitionLogo: '',
        Logo: "",
        venue: [],
        scoring: '',
        ladderSetting: [],
        record1: [],
        record2: [],
        attendanceRecordingType: '',
        attendanceRecordingPeriod: '',
        timerType: '',
        allVenue: [],
        venueData: []

    }
}
export default function liveScoreSettingsViewReducer(state = initialState, { type, payload, }) {

    switch (type) {
        case ApiConstants.LiveScore_SETTING_VIEW_INITITAE:
            return {
                ...state,
                loader: true
            }
        case ApiConstants.LiveScore_SETTING_VIEW_SUCCESS:

            const arraymaped = [{ ...payload }]
            const record1 = arraymaped.reduce((memo, data) => {
                console.log(data)
                if (data.recordUmpire === 1) {
                    memo.push('recordUmpire')
                }
                if (data.gameTimeTracking) {
                    memo.push('gameTimeTracking')
                }
                if (data.positionTracking) {
                    memo.push('positionTracking')
                }
                return memo
            }, [])
            const record2 = arraymaped.reduce((memo, data) => {
                if (data.recordGoalAttempts === true) {
                    memo.push('recordGoalAttempts')
                }
                if (data.centrePassEnabled) {
                    memo.push('centrePassEnabled')
                }
                if (data.incidentsEnabled) {
                    memo.push('incidentsEnabled')
                }
                return memo
            }, [])
            const venueData = payload.competitionVenues.map(item => (item.venueId))
            return {
                ...state,
                loader: false,
                form: {
                    ...state.form,
                    id: payload.id,
                    competitionName: payload.longName,
                    competitionLogo: payload.logoUrl,
                    Logo: payload.logoUrl,
                    scoring: payload.scoringType,
                    venue: venueData,
                    allVenue: payload.competitionVenues,
                    record1,
                    record2,
                    attendanceRecordingType: payload.attendanceRecordingType,
                    attendanceRecordingPeriod: payload.attendanceRecordingPeriod,
                    timerType: payload.timerType

                },
                data: payload,

            }
        case ApiConstants.LiveScore_SETTING_VIEW_ERROR:
            return {
                ...state,
                // error: payload
            }
        case ApiConstants.LiveScore_SETTING_CHANGE_FORM:
            const keys = payload.key
            const Data = payload.data
            return {
                ...state,
                form: {
                    ...state.form,
                    [keys]: Data
                }
            }
        case ApiConstants.LiveScore_SETTING_DATA_POST_INITATE:
            return {
                ...state,
                loader: false
            }
        case ApiConstants.LiveScore_SETTING_DATA_POST_SUCCESS:
            return {
                ...state,
                loader: false
            }
        case ApiConstants.LiveScore_SETTING_DATA_POST_ERROR:
            return {
                ...state,
                loader: false
            }
        case ApiConstants.API_LIVE_SCORE_COMPETITION_VENUES_LIST_SUCCESS:


            return {
                ...state,
                venueData: payload
            }
        case ApiConstants.LiveScore_CLEAR_SETTING:
            console.log('cleared')
            return {
                ...state,
                form: {
                    ...initialState.form,
                    id: 0,
                    competitionName: "",
                    competitionLogo: '',
                    Logo: "",
                    venue: [],
                    scoring: '',
                    ladderSetting: [],
                    record1: [],
                    record2: [],
                    attendanceRecordingType: '',
                    attendanceRecordingPeriod: '',
                    timerType: '',
                    allVenue: [],
                    // venueData: []

                }
            }
        default: return state
    }
}