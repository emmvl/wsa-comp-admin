import ApiConstants from "../../../themes/apiConstants";

function getliveScoreTeams(competitionID, divisionId) {

    const action = {
        type: ApiConstants.API_LIVE_SCORE_TEAM_LOAD,
        competitionID,
        divisionId
    };

    return action;
}

// Team View action
function getTeamViewPlayerList(teamId) {

    const action = {
        type: ApiConstants.API_GET_TEAM_VIEW_PLAYER_LIST_LOAD,
        teamId
    };

    return action;
}

// Team View action
function liveScoreDeleteTeam(teamId) {

    const action = {
        type: ApiConstants.API_LIVE_SCORE_DELETE_TEAM_LOAD,
        teamId
    };

    return action;
}
function liveScoreAddTeamform(data) {
  
    return {
        type: ApiConstants.LIVE_SCORE_TEAM_EDIT,
        payload: data
    }


}
function liveScoreGetDivision(data) {
    return {
        type: ApiConstants.GET_DIVISION_TEAM,
        payload: data
    }
}
function liveScoreGetaffilate(data) {
    return {
        type: ApiConstants.GET_AFFILATE_TEAM,
        payload: data
    }
}
function liveAddNewTeam(data, teamId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_TEAM_LOAD,
        payload: data,
        teamId
    }
}

function liveScoreTeamImportAction(data) {
    return {
        type: ApiConstants.API_LIVE_SCORE_TEAM_IMPORT_LOAD,
        payload: data
    }
}

function liveScoreGetTeamDataAction(teamId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_GET_TEAM_LOAD,
        teamId
    }
}

export {
    getliveScoreTeams,
    getTeamViewPlayerList,
    liveScoreDeleteTeam,
    liveScoreAddTeamform,
    liveScoreGetDivision,
    liveScoreGetaffilate,
    liveAddNewTeam,
    liveScoreTeamImportAction,
    liveScoreGetTeamDataAction
};
