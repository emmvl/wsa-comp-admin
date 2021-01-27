import ApiConstants from '../../../themes/apiConstants'

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
        lineupSelectionMins: null,
        gameTimeTrackingType: 0
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
    inputNumberValue: null,
    anyOrgId: null,
    checkBoxSelection: [],
    viewSelection: null,
    associationChecked: false,
    clubChecked: false,
    associationOrg: [],
    clubOrg: [],
    editLoader: false,
    yearRefId: null,
    affiliateArray: [],
    anyOrgArray: [],
    invitedAnyAssoc: [],
    invitedAnyClub: [],
    competitionInvitees: [],
    gameTimeTrackingType: 0,
    isInvitorsChanged: false,
    radioSelectionArr: [],
    invitedAnyAssocArr: [],
    invitedAnyClubArr: [],
    disabled: false,
}

//minutes to hour (and days) converter
function recordingTimeDays(num) {
    let d
    if (num != null) {
        d = Math.floor(num / 1440); // 60*24
    }
    return d
}

//minutes to hour (and days) converter
function recordingTimeHours(num) {
    let d, h
    if (num != null) {
        d = Math.floor(num / 1440); // 60*24
        h = Math.floor((num - (d * 1440)) / 60);
    }
    return h
}

//minutes to hour (and days) converter
function recordingTimeMins(num) {
    let m
    if (num != null) {
        m = Math.round(num % 60);
    }
    return m
}

////remove Selected Element From Array
function removeElementFromArray(array, data, keys) {
    let findData = (array) => array === data;
    let index = array.findIndex(findData)
    array.splice(index, 1)

    return array;
}

function getAffiliateValue(compInviteesArr, regInviteArr) {
    let affiliateSelectedValue = null
    for (let i in compInviteesArr) {
        for (let j in regInviteArr) {
            for (let k in regInviteArr[j].subReferences) {
                if (compInviteesArr[i].inviteesRefId === regInviteArr[0].subReferences[k].id) {
                    affiliateSelectedValue = compInviteesArr[i].inviteesRefId
                }
            }
        }
    }
    return affiliateSelectedValue
}

function getAnyOrgValue(compInviteesArr, regInviteArr) {
    let anyOrgSelectedValue = []
    for (let i in compInviteesArr) {
        for (let j in regInviteArr) {
            for (let k in regInviteArr[j].subReferences) {
                if (compInviteesArr[i].inviteesRefId == regInviteArr[1].subReferences[k].id) {
                    anyOrgSelectedValue.push(compInviteesArr[i])
                    break;
                }
            }
            break;
        }
    }
    return anyOrgSelectedValue
}

function getanyOrgArray(data) {
    let arr = []
    for (let i in data) {
        if (data[i].inviteesRefId)
            arr.push(data[i].inviteesRefId)
    }
    // let filteredArr = arr.filter(function (item, index) {
    //     if (arr.indexOf(item) == index)
    //         return item;
    // });
    return arr
}

function getCheckBoxSelection(compInvitess) {
    let associationLeague = false
    let clubLeage = false
    // let assocLeage = null
    for (let i in compInvitess) {
        if (compInvitess[i].inviteesRefId === 7) {
            associationLeague = true
        }
        if (compInvitess[i].inviteesRefId === 8) {
            clubLeage = true
            break;
        }
    }
    return { assocLeage: associationLeague, club: clubLeage }
}

function getSelectedOrganization(data, compInviteesArr) {
    let associationLeageOrg = []
    let clubLeageOrg = []
    for (let i in compInviteesArr) {
        if (compInviteesArr[i].inviteesRefId === 7) {
            associationLeageOrg.push(compInviteesArr[i].invitedOrganisationId)
        }
        if (compInviteesArr[i].inviteesRefId === 8) {
            clubLeageOrg.push(compInviteesArr[i].invitedOrganisationId)
        }
    }
    return { associationLeageOrg: associationLeageOrg, clubLeageOrg: clubLeageOrg }
}

export default function liveScoreSettingsViewReducer(state = initialState, { type, payload, }) {
    switch (type) {
        case ApiConstants.LiveScore_SETTING_VIEW_INITITAE:
            return {
                ...state,
                editLoader: true
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
            if (payload.yearRefId) {
                state.yearRefId = payload.yearRefId
            }

            let compInvitees = payload.competitionInvitees
            state.invitedTo = []
            state.anyOrgArray = []
            state.associationChecked = false
            state.clubChecked = false
            state.associationLeague = []
            state.clubSchool = []
            state.affiliateSelected = null
            state.affiliateNonSelected = []
            state.anyOrgSelected = []
            state.otherSelected = []
            state.invitedAnyAssoc = []
            state.invitedAnyClub = []
            state.radioSelectionArr = []
            state.orgSelectionArr = []
            state.invitedAnyAssocArr = []
            state.invitedAnyClubArr = []

            if (compInvitees.length > 0) {
                if (compInvitees.length === 1) {
                    if (compInvitees[0].inviteesRefId === 2 || compInvitees[0].inviteesRefId === 3 || compInvitees[0].inviteesRefId === 5 || compInvitees[0].inviteesRefId === 6 || compInvitees[0].inviteesRefId === 7 || compInvitees[0].inviteesRefId === 8) {
                        if (compInvitees[0].inviteesRefId === 5 || compInvitees[0].inviteesRefId === 6) {
                            state.otherSelected = compInvitees[0].inviteesRefId
                            state.invitedTo = [compInvitees[0].inviteesRefId]
                            state.radioSelectionArr = [compInvitees[0].inviteesRefId]
                        } else {
                            state.invitedTo = [compInvitees[0].inviteesRefId]
                            state.radioSelectionArr = [compInvitees[0].inviteesRefId]
                            state.anyOrgArray = [compInvitees[0].inviteesRefId]
                            let anyOrgValue = getAnyOrgValue(payload.competitionInvitees, state.registrationInvitees)
                            let anyOrgArray = getanyOrgArray(anyOrgValue)
                            let anyOrgCheckBoxSelection = getCheckBoxSelection(payload.competitionInvitees)
                            state.associationChecked = anyOrgCheckBoxSelection.assocLeage
                            state.clubChecked = anyOrgCheckBoxSelection.club
                            let selectedOrganization = getSelectedOrganization(anyOrgArray, payload.competitionInvitees)
                            state.associationLeague = selectedOrganization.associationLeageOrg
                            state.clubSchool = selectedOrganization.clubLeageOrg
                            let assocArray = []
                            for (let i in selectedOrganization.associationLeageOrg) {
                                let associationAffiliteObj = {
                                    organisationId: selectedOrganization.associationLeageOrg[i]
                                }
                                assocArray.push(associationAffiliteObj)
                            }
                            state.invitedAnyAssoc = assocArray
                            state.invitedAnyAssocArr = assocArray
                            let clubArray = []
                            for (let i in selectedOrganization.clubLeageOrg) {
                                let clubAffiliteObj = {
                                    organisationId: selectedOrganization.clubLeageOrg[i]
                                }
                                clubArray.push(clubAffiliteObj)
                            }
                            state.invitedAnyClub = clubArray
                            state.invitedAnyClubArr = clubArray
                        }
                    }
                } else {
                    let affiliateValue = getAffiliateValue(payload.competitionInvitees, state.registrationInvitees)
                    state.affiliateSelected = affiliateValue

                    if (affiliateValue) {
                        if (affiliateValue == 2 || affiliateValue == 3) {
                            state.affiliateArray = [affiliateValue]
                            state.invitedTo = [affiliateValue]
                            state.radioSelectionArr = [affiliateValue]
                        }
                        state.invitedTo = [affiliateValue]
                        state.radioSelectionArr = [affiliateValue]
                    }
                    let anyOrgValue = getAnyOrgValue(payload.competitionInvitees, state.registrationInvitees)

                    let anyOrgSelectedArr = getanyOrgArray(anyOrgValue, anyOrgValue)

                    for (let i in anyOrgSelectedArr) {
                        state.invitedTo.push(anyOrgSelectedArr[i])
                        state.radioSelectionArr.push(anyOrgSelectedArr[i])
                        state.anyOrgArray.push(anyOrgSelectedArr[i])
                    }
                    let anyOrgCheckBoxSelection = getCheckBoxSelection(payload.competitionInvitees)
                    state.associationChecked = anyOrgCheckBoxSelection.assocLeage
                    state.clubChecked = anyOrgCheckBoxSelection.club
                    let selectedOrganization = getSelectedOrganization(anyOrgSelectedArr, payload.competitionInvitees)
                    state.associationLeague = selectedOrganization.associationLeageOrg
                    state.clubSchool = selectedOrganization.clubLeageOrg
                    let assocArray = []

                    for (let i in selectedOrganization.associationLeageOrg) {
                        let associationAffiliteObj = {
                            organisationId: selectedOrganization.associationLeageOrg[i]
                        }
                        assocArray.push(associationAffiliteObj)
                    }

                    state.invitedAnyAssoc = assocArray
                    state.invitedAnyAssocArr = assocArray

                    let clubArray = []

                    for (let i in selectedOrganization.clubLeageOrg) {
                        let clubAffiliteObj = {
                            organisationId: selectedOrganization.clubLeageOrg[i]
                        }
                        clubArray.push(clubAffiliteObj)
                    }
                    state.invitedAnyClub = clubArray
                    state.invitedAnyClubArr = clubArray
                }
            } else {
                state.invitedTo = []
                state.radioSelectionArr = []
                state.associationChecked = false
                state.clubChecked = false
                state.associationLeague = []
                state.clubSchool = []
                state.affiliateSelected = null
                state.anyOrgSelected = null
                state.otherSelected = null
                state.invitedAnyAssoc = []
                state.invitedAnyClub = []
                state.invitedAnyAssocArr = []
                state.invitedAnyClubArr = []
            }
            return {
                ...state,
                editLoader: false,
                form: {
                    ...state.form,
                    id: payload.id,
                    gameTimeTrackingType: payload.gameTimeTrackingType != null ? payload.gameTimeTrackingType : 0,
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
                    attendanceRecordingPeriod: payload.gameTimeTracking ? "PERIOD" : payload.attendanceRecordingPeriod,
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
                inputNumberValue: payload.gamesBorrowedThreshold,
                disabled: payload.gameTimeTracking,
            }
        case ApiConstants.LiveScore_SETTING_VIEW_ERROR:
            return {
                ...state,
                loader: false
            }

        case ApiConstants.LiveScore_SETTING_VIEW_FAIL:
            return {
                ...state,
                loader: false
            }
        case ApiConstants.LiveScore_SETTING_CHANGE_FORM:
            const keys = payload.key
            const Data = payload.data

            if (keys === 'buzzerEnabled' || keys === 'warningBuzzerEnabled' || keys === "lineupSelection" || keys === 'premierCompLink') {
                state[keys] = Data

                if (keys === 'premierCompLink') {
                    if (Data === false) {
                        state.linkedCompetitionId = null
                    }
                }
            } else if (keys === "borrowedPlayer") {
                state[keys] = Data

                if (Data === 'MINUTES') {
                    state.gamesBorrowedThreshold = state.inputNumberValue
                }
            } else if (keys === 'number') {
                state.gamesBorrowedThreshold = Data
            } else if (keys === 'yearRefId') {
                state.yearRefId = Data
            } else if (keys === 'linkedCompetitionId') {
                state.linkedCompetitionId = Data
            } else if (keys === 'recordUmpire') {
                state.recordUmpire = Data
            } else if (keys === 'affiliateSelected' || keys === 'anyOrgSelected' || keys === 'otherSelected' || keys === 'affiliateNonSelected' || keys === 'anyOrgNonSelected') {
                state.invitedOrganisation = []
                if (keys === 'affiliateSelected') {
                    state.affiliateSelected = Data
                    state.otherSelected = null
                    state.affiliateNonSelected = null
                    state.affiliateArray.splice(0, 1, Data)
                    state.invitedTo = [...state.affiliateArray, ...state.anyOrgArray]
                }
                if (keys === 'anyOrgSelected') {
                    state.anyOrgSelected = Data
                    state.otherSelected = null
                    state.anyOrgNonSelected = null
                    state.affiliateArray.splice(0, 1, Data)
                    state.invitedTo = [...state.affiliateArray, ...state.anyOrgArray]
                }
                if (keys === 'otherSelected') {
                    state.otherSelected = Data
                    state.affiliateSelected = null
                    state.anyOrgSelected = null
                    state.affiliateNonSelected = null
                    state.anyOrgNonSelected = null
                    state.invitedTo = []
                    state.invitedTo.push(Data)
                    state.associationChecked = false
                    state.clubChecked = false
                    state.invitedAnyAssoc = []
                    state.invitedAnyClub = []
                    state.associationLeague = []
                    state.clubSchool = []
                    state.affiliateArray = []
                    state.anyOrgArray = []
                }
                if (keys === 'affiliateNonSelected') {
                    state.affiliateSelected = []
                    state.otherSelected = null
                    state.affiliateNonSelected = Data
                    state.affiliateArray = []
                    state.invitedTo = [...state.affiliateArray, ...state.anyOrgArray]
                }
                if (keys === 'anyOrgNonSelected') {
                    state.invitedTo = []
                    state.anyOrgSelected = []
                    state.otherSelected = null
                    state.associationChecked = false
                    state.clubChecked = false
                    state.anyOrgNonSelected = Data
                    state.invitedAnyAssoc = []
                    state.invitedAnyClub = []
                    state.associationLeague = []
                    state.clubSchool = []
                    state.anyOrgArray = []
                }
            } else if (keys === 'associationAffilite' || keys === 'clubAffilite') {
                if (keys === 'associationAffilite') {
                    state.associationLeague = Data
                    let inviteeArray = []
                    for (let i in Data) {
                        let associationAffiliteObj = {
                            organisationId: Data[i]
                        }
                        inviteeArray.push(associationAffiliteObj)
                    }
                    state.invitedAnyAssoc = inviteeArray
                }
                if (keys === 'clubAffilite') {
                    state.clubSchool = Data
                    let inviteeArray = []
                    for (let i in Data) {
                        let clubAffiliteObj = {
                            organisationId: Data[i]
                        }
                        inviteeArray.push(clubAffiliteObj)
                    }
                    state.invitedAnyClub = inviteeArray
                }
            } else if (keys === 'record1') {
                let posTracking = false
                for (let i in Data) {
                    if (Data[i] === "positionTracking") {
                        posTracking = true
                        break;
                    }
                }

                if (Data.length > 0) {
                    for (let i in Data) {
                        if (Data[i] === "gameTimeTracking") {
                            state.disabled = true
                            state.form.attendanceRecordingPeriod = 'PERIOD'
                            break;
                        } else {
                            state.disabled = false
                        }
                    }
                } else {
                    state.disabled = false
                }

                if (posTracking) {
                } else {
                    state.lineupSelection = false
                    state.form.lineupSelectionDays = null
                    state.form.lineupSelectionHours = null
                    state.form.lineupSelectionMins = null
                }
            } else if (keys === 'associationChecked') {
                state.anyOrgNonSelected = null
                state[keys] = payload.data
                state.otherSelected = null
                if (Data === true) {
                    state.anyOrgArray.push(payload.checkBoxId)
                    state.invitedTo = [...state.affiliateArray, ...state.anyOrgArray]
                } else {
                    let removeElement = removeElementFromArray(state.anyOrgArray, payload.checkBoxId, 'associationChecked')
                    state.anyOrgArray = removeElement
                    state.invitedAnyAssoc = []
                    state.associationLeague = []
                    state.invitedTo = [...state.affiliateArray, ...state.anyOrgArray]
                }
            } else if (keys === 'clubChecked') {
                state.anyOrgNonSelected = null
                state[keys] = payload.data
                state.otherSelected = null
                if (Data === true) {
                    state.anyOrgArray.push(payload.checkBoxId)
                    state.invitedTo = [...state.affiliateArray, ...state.anyOrgArray]
                } else {
                    let removeElement = removeElementFromArray(state.anyOrgArray, payload.checkBoxId, 'clubChecked')
                    state.anyOrgArray = removeElement
                    state.invitedAnyClub = []
                    state.clubSchool = []
                    state.invitedTo = [...state.affiliateArray, ...state.anyOrgArray]
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
            if (payload.isEdit === 'edit') {
                return {
                    ...state,
                    editLoader: true
                }
            } else {
                return {
                    ...state,
                    loader: true
                }
            }

        case ApiConstants.LiveScore_SETTING_DATA_POST_SUCCESS:
            return {
                ...state,
                loader: false,
                editLoader: false
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
            state.lineupSelection = null
            state.inputNumberValue = null
            state.premierCompLink = false
            state.gamesBorrowedThreshold = null
            state.buzzerEnabled = false
            state.warningBuzzerEnabled = false
            state.recordUmpire = []
            state.affiliateSelected = null
            state.affiliateNonSelected = null
            state.anyOrgNonSelected = null
            state.anyOrgSelected = null
            state.otherSelected = null
            state.nonSelected = null
            state.associationChecked = false
            state.clubChecked = false
            state.borrowedPlayer = 'GAMES'
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

        default:
            return state
    }
}
