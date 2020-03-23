import ApiConstatnts from '../../../themes/apiConstants'

function liveScoreIncidentList(competitionId) {
    const action = {
        type: ApiConstatnts.API_LIVE_SCORE_INCIDENT_LIST_LOAD,
        competitionId: competitionId
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




export {
    liveScoreIncidentList,
    liveScoreUpdateIncident,
    // liveScoreClearIncident
}