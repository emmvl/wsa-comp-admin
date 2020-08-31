import ApiConstants from "themes/apiConstants";

const divisionObj = {
    divisionName: "",
    gradeName: "",
};

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    liveScoreDivisionList: [],
    divisionName: "",
    gradeName: "",
    name: "",
    divisionData: divisionObj,
    mainDivisionList: [],
    totalCount: null,
    currentPage: null,
    positionTracking: "null",
    recordGoalAttempts: "null"
};

function liveScoreDivisionState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                liveScoreDivisionList: action.result,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_UPDATE_DIVISION:
            if (action.key === "divisionName") {
                state.divisionName = action.data;
            } else if (action.key === "gradeName") {
                state.gradeName = action.data;
            } else if (action.key === "name") {
                state.name = action.data;
            } else if (action.key === "isEditDivision") {
                console.log(action)
                state.divisionName = action.data.divisionName;
                state.gradeName = action.data.grade;
                state.name = action.data.name;
                state.positionTracking = action.data.positionTracking
                state.recordGoalAttempts = action.data.recordGoalAttempts

            } else if (action.key === "isAddDivision") {
                state.divisionData = divisionObj;
            }
            else if (action.key == "positionTracking") {
                state.positionTracking = action.data
            }
            else if (action.data == "recordGoalAttempts") {
                state.recordGoalAttempts = action.data
            }
            return {
                ...state,
                onLoad: false,
                state: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_CREATE_DIVISION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_CREATE_DIVISION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_DELETE_DIVISION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DELETE_DIVISION_SUCCESS:
            return { ...state, onLoad: false };

        case ApiConstants.API_LIVE_SCORE_DIVISION_IMPORT_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DIVISION_IMPORT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                importResult: action.result,
            };

        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_FAIL:
            return { ...state, onLoad: false, printLoad: false };

        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_ERROR:
            return {
                ...state,
                onLoad: false,
                printLoad: false,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_MAIN_DIVISION_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_MAIN_DIVISION_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                mainDivisionList: action.result.divisions,
                totalCount: action.result.page.totalCount,
                currentPage: action.result.page.currentPage,
                status: action.status,
            };

        default:
            return state;
    }
}

export default liveScoreDivisionState;
