import ApiConstants from '../../../themes/apiConstants'
import { actionChannel } from '@redux-saga/core/effects'
const initialState = {
    loader: false,
    form: {
        id: 0,
        competitionName: "",
        shortName: "",
        competitionLogo: '',
        Logo: "",
        venue: [],
        scoring: '',
        ladderSetting: [],
        record1: [],
        record2: [],
        attendanceRecordingType: null,
        attendanceRecordingPeriod: null,
        timerType: '',
        allVenue: [],
        venueData: [],
        mainVenueList: [],

    },
    buzzerEnabled: false,
    warningBuzzerEnabled: false,
    recordUmpire: [],
    affiliateSelected: null,
    anyOrgSelected: null,
    otherSelected: null,
    nonSelected: null,
    invitedTo: [],
    invitedOrganisation: [],
    associationLeague: [],
    clubSchool: [],
    affiliateNonSelected: null,
    anyOrgNonSelected: null
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
                if (data.recordUmpire === 1) {
                    memo.push('recordUmpire')
                }
                if (data.gameTimeTracking) {
                    memo.push('gameTimeTracking')
                }
                if (data.positionTracking) {
                    memo.push('positionTracking')
                }
                if (data.recordGoalAttempts === true) {
                    memo.push('recordGoalAttempts')
                }
                return memo
            }, [])
            const record2 = arraymaped.reduce((memo, data) => {
                // if (data.recordGoalAttempts === true) {
                //     memo.push('recordGoalAttempts')
                // }
                if (data.centrePassEnabled) {
                    memo.push('centrePassEnabled')
                }
                if (data.incidentsEnabled) {
                    memo.push('incidentsEnabled')
                }
                return memo
            }, [])
            const venueData = payload.competitionVenues.map(item => (item.venueId))
            console.log(payload, 'payload')
            return {
                ...state,
                loader: false,
                form: {
                    ...state.form,
                    id: payload.id,
                    competitionName: payload.longName,
                    shortName: payload.name,
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
                buzzerEnabled: payload.buzzerEnabled,
                warningBuzzerEnabled: payload.warningBuzzerEnabled,
                recordUmpire: payload.recordUmpireType

            }
        case ApiConstants.LiveScore_SETTING_VIEW_ERROR:
            return {
                ...state,
                loader: false
                // error: payload
            }

        case ApiConstants.LiveScore_SETTING_VIEW_FAIL:
            return {
                ...state,
                loader: false
                // error: payload
            }
        case ApiConstants.LiveScore_SETTING_CHANGE_FORM:
            console.log(payload, 'LiveScore_SETTING_CHANGE_FORM')

            const keys = payload.key
            const Data = payload.data

            if (keys == 'buzzerEnabled' || keys == 'warningBuzzerEnabled') {
                state[keys] = Data
            } else if (keys == 'recordUmpire') {
                state.recordUmpire = Data
            } else if (keys == 'affiliateSelected' || keys == 'anyOrgSelected' || keys == 'otherSelected' || keys == 'affiliateNonSelected' || keys == 'anyOrgNonSelected') {
                state.invitedOrganisation = []
                state.associationLeague = []
                state.clubSchool = []

                if (keys == 'affiliateSelected') {
                    state.affiliateSelected = Data
                    state.otherSelected = null
                    state.affiliateNonSelected = null
                    // state.anyOrgNonSelected = null
                    state.invitedTo.splice(0, 1, Data)
                }
                if (keys == 'anyOrgSelected') {
                    state.anyOrgSelected = Data
                    state.otherSelected = null
                    // state.affiliateNonSelected = null
                    state.anyOrgNonSelected = null
                    state.invitedTo.splice(1, 1, Data)
                }

                if (keys == 'otherSelected') {
                    state.otherSelected = Data
                    state.affiliateSelected = null
                    state.anyOrgSelected = null
                    state.affiliateNonSelected = null
                    state.anyOrgNonSelected = null
                    state.invitedTo = []
                    state.invitedTo.push(Data)
                }
                if (keys == 'affiliateNonSelected') {
                    state.invitedTo = []
                    state.affiliateSelected = []
                    // state.anyOrgSelected = []
                    state.otherSelected = null
                    state.affiliateNonSelected = Data
                    // state.anyOrgNonSelected = null
                    console.log(state.invitedTo, 'state.invitedTo')
                }
                if (keys == 'anyOrgNonSelected') {
                    state.invitedTo = []
                    // state.affiliateSelected = []
                    state.anyOrgSelected = []
                    state.otherSelected = null
                    // state.affiliateNonSelected = null
                    state.anyOrgNonSelected = Data

                }

            } else if (keys == 'associationAffilite' || keys == 'clubAffilite') {

                if (keys == 'associationAffilite') {
                    console.log(Data, 'Data~~~~~~')
                    state.associationLeague = Data
                    let inviteeArray = []
                    for (let i in Data) {
                        let associationAffiliteObj = {
                            organisationId: Data[i]
                        }
                        inviteeArray.push(associationAffiliteObj)

                    }

                    state.invitedOrganisation = inviteeArray

                }

                if (keys == 'clubAffilite') {
                    state.clubSchool = Data
                    let inviteeArray = []
                    for (let i in Data) {
                        let clubAffiliteObj = {
                            organisationId: Data[i]
                        }
                        inviteeArray.push(clubAffiliteObj)

                    }

                    state.invitedOrganisation = inviteeArray
                }
                console.log(state.invitedOrganisation, 'LiveScore_SETTING_CHANGE_FORM', Data)
            }
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
                loader: true
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
                venueData: payload,
                mainVenueList: payload
            }
        case ApiConstants.LiveScore_CLEAR_SETTING:
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
                    attendanceRecordingType: [],
                    attendanceRecordingPeriod: [],
                    timerType: [],
                    allVenue: [],
                    // venueData: []

                }
            }

        case ApiConstants.LIVESCORE_SEARCH__SETTING:

            return { ...state, venueData: payload }

        case ApiConstants.CLEAR_FILTER_SEARCH:
            state.venueData = state.mainVenueList
            return {
                ...state

            }

        default: return state
    }
}