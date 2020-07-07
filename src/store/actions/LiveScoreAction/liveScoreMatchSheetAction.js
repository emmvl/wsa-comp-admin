import ApiConstants from '../../../themes/apiConstants';

const liveScoreMatchSheetPrintAction = (competitionId, divisionId, teamId) => {
    const action = {
        type: ApiConstants.API_MATCH_SHEET_PRINT_LOAD,
        competitionId,
        divisionId,
        teamId,
    };

    return action
};

export {
    liveScoreMatchSheetPrintAction,
};
