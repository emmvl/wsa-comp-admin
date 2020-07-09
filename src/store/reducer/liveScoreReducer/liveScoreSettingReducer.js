import ApiConstants from '../../../themes/apiConstants'
import { actionChannel } from '@redux-saga/core/effects'
import { stat } from 'fs';
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
        days: null,
        hours: null,
        minutes: null,
        lineupSelectionDays: null,
        lineupSelectionHours: null,
        lineupSelectionMins: null

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
    anyOrgNonSelected: null,
    registrationInvitees: [],
    lineupSelection: false,
    gameborrowed: false,
    minutesBorrowed: true,
    premierCompLink: false,
    playerBorrowed: '',
    borrowedPlayer: 'GAMES',
    gamesBorrowedThreshold: null,
    linkedCompetitionId: null,
    inputNumberValue: null
}


//minutes to hour (and days) converter
function recordingTimeDays(num) {
    let d, h, m
    if (num != null) {
        d = Math.floor(num / 1440); // 60*24
        h = Math.floor((num - (d * 1440)) / 60);
        m = Math.round(num % 60);
    }
    return d
}

//minutes to hour (and days) converter
function recordingTimeHours(num) {
    let d, h, m
    if (num != null) {

        d = Math.floor(num / 1440); // 60*24
        h = Math.floor((num - (d * 1440)) / 60);
        m = Math.round(num % 60);

    }
    return h
}

//minutes to hour (and days) converter
function recordingTimeMins(num) {
    let d, h, m
    if (num != null) {

        d = Math.floor(num / 1440); // 60*24
        h = Math.floor((num - (d * 1440)) / 60);
        m = Math.round(num % 60);

    }
    return m
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

            if (payload.linkedCompetitionId) {
                state.premierCompLink = true
            } else {
                state.premierCompLink = false
            }

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
                    timerType: payload.timerType,
                    days: recordingTimeDays(payload.attendanceSelectionTime),
                    hours: recordingTimeHours(payload.attendanceSelectionTime),
                    minutes: recordingTimeMins(payload.attendanceSelectionTime),
                    lineupSelectionDays: recordingTimeDays(payload.lineupSelectionTime),
                    lineupSelectionHours: recordingTimeHours(payload.lineupSelectionTime),
                    lineupSelectionMins: recordingTimeMins(payload.lineupSelectionTime),


                },
                data: payload,
                buzzerEnabled: payload.buzzerEnabled,
                warningBuzzerEnabled: payload.warningBuzzerEnabled,
                recordUmpire: payload.recordUmpireType,
                lineupSelection: payload.lineupSelectionEnabled,
                borrowedPlayer: payload.playerBorrowingType,
                gamesBorrowedThreshold: payload.gamesBorrowedThreshold,
                linkedCompetitionId: payload.linkedCompetitionId,
                inputNumberValue: payload.gamesBorrowedThreshold

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


            const keys = payload.key
            const Data = payload.data

            if (keys == 'buzzerEnabled' || keys == 'warningBuzzerEnabled' || keys == "lineupSelection" || keys == 'premierCompLink') {
                state[keys] = Data

                if (keys == 'premierCompLink') {
                    if (Data === false) {
                        state.linkedCompetitionId = null
                    }
                }
            } else if (keys == "borrowedPlayer") {
                state[keys] = Data

                if (Data == 'MINUTES') {
                    state.gamesBorrowedThreshold = state.inputNumberValue
                }

            } else if (keys == 'number') {
                state.gamesBorrowedThreshold = Data

            } else if (keys == 'linkedCompetitionId') {
                console.log(Data, 'linkedCompetitionId')
                state.linkedCompetitionId = Data

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

            } else if (keys == 'record1') {

                let posTracking = false
                for (let i in Data) {
                    if (Data[i] == "positionTracking") {
                        posTracking = true
                        break;
                    }
                }

                if (posTracking) {
                    // state.lineupSelection = true
                } else {
                    state.lineupSelection = false
                    state.form.lineupSelectionDays = null
                    state.form.lineupSelectionHours = null
                    state.form.lineupSelectionMins = null
                }



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

        case ApiConstants.SETTING_REGISTRATION_INVITEES_LOAD:

            return { ...state, loader: false }

        case ApiConstants.SETTING_REGISTRATION_INVITEES_SUCCESS:

            return {
                ...state,
                loader: false,
                registrationInvitees: payload

            }

        default: return state
    }
}