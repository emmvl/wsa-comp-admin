import ApiConstants from "../../../themes/apiConstants";

function liveScoreUmpiresListAction(competitionId, body) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_LOAD,
        competitionId: competitionId,
        body: body
    }

    return action
}

function liveScoreUmpireImportAction(payload){
    const action = {
        type:ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_LOAD,
       payload
    }
    console.log(payload,"impAct");
    
    return action
}

export {
    liveScoreUmpiresListAction,
    liveScoreUmpireImportAction
}
