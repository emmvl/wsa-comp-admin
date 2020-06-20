import ApiConstatnts from '../../../themes/apiConstants'

function liveScoreIncidentList(competitionId, search) {
    const action = {
        type: ApiConstatnts.API_LIVE_SCORE_INCIDENT_LIST_LOAD,
        competitionId: competitionId,
        search:search
    };
    return action;
}


function liveScoreUpdateIncident(data, key) {
    const action = {
        type: ApiConstatnts.API_LIVE_SCORE_UPDATE_INCIDENT,
        key: key,
        data: data
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
        key: key,
        data: data
    };

    return action;
} 



export {
    liveScoreIncidentList,
    liveScoreUpdateIncident,
    liveScoreUpdateIncidentData
}