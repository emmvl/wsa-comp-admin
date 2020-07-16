import ApiConstants from '../../../themes/apiConstants';

const liveScoreMatchSheetPrintAction = (competitionId, divisionId, teamId, templateType) => {
    const action = {
        type: ApiConstants.API_MATCH_SHEET_PRINT_LOAD,
        competitionId,
        divisionId,
        teamId,
        templateType,
    };

    return action
};

const liveScoreMatchSheetDownloadsAction = () => {
    const action = {
        type: ApiConstants.API_MATCH_SHEET_DOWNLOADS_LOAD,
    };

    return action
};

export {
    liveScoreMatchSheetPrintAction,
    liveScoreMatchSheetDownloadsAction,
};
