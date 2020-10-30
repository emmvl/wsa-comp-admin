import ApiConstatnts from '../../../themes/apiConstants'

function liveScoreIncidentList(competitionId, search, limit, offset, sortBy, sortOrder) {
    const action = {
        type: ApiConstatnts.API_LIVE_SCORE_INCIDENT_LIST_LOAD,
        competitionId,
        search: search,
        limit, offset, sortBy, sortOrder
    };
    return action;
}


function liveScoreUpdateIncident(data, key) {
    const action = {
        type: ApiConstatnts.API_LIVE_SCORE_UPDATE_INCIDENT,
        key,
        data
    };
    return action;
}

// function liveScoreClearIncident() {
//     const action = {
//         type: ApiConstatnts.API_LIVE_SCORE_CLEAR_INCIDENT,
//     };
//     return action;
// }


export const liveScoreClearIncident = () => {
    return {
        type: ApiConstatnts.API_LIVE_SCORE_CLEAR_INCIDENT
    }
}

function liveScoreUpdateIncidentData(data, key) {
    const action = {
        type: ApiConstatnts.API_LIVE_SCORE_UPDATE_INCIDENT_DATA,
        key,
        data
    };

    return action;
}

function liveScoreAddEditIncident(data) {
    const action = {
        type: ApiConstatnts.API_LIVE_SCORE_ADD_EDIT_INCIDENT_LOAD,
        data
    };

    return action;
}

function liveScoreIncidentTypeAction() {
    const action = {
        type: ApiConstatnts.API_LIVE_SCORE_INCIDENT_TYPE_LOAD,
    };

    return action;
}



export {
    liveScoreIncidentList,
    liveScoreUpdateIncident,
    liveScoreUpdateIncidentData,
    liveScoreAddEditIncident,
    liveScoreIncidentTypeAction
}
