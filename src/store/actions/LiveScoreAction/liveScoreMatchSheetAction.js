import ApiConstants from '../../../themes/apiConstants';

const liveScoreMatchSheetPrintAction = () => {
    const action = {
        type: ApiConstants.API_MATCH_SHEET_PRINT_LOAD,
    };

    return action
};

export {
    liveScoreMatchSheetPrintAction,
};
