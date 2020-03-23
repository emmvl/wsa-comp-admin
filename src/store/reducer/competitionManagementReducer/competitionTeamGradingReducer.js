import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";


const initialState = {
    onLoad: false,
    updateGradeOnLoad: false,
    error: null,
    result: [],
    status: 0,
    getCompOwnProposedTeamGradingData: [],
    compFinalTeamGradingFinalGradesData: [],
    getPartProposedTeamGradingData: [],
    ownTeamGradingSummaryGetData: [],
    finalsortOrderArray: [],
    getFinalGradesListData: []

};

function checkGradesValue(gradeId, gradingData) {

    let object = {
        status: false,
        result: null
    }
    for (let j in gradingData) {
        if (gradingData[j].sortOrder == gradeId) {

            object = {
                status: true,
                result: gradingData[j]
            }


            break;
        }

    }

    return object

}


function ownTeamGradingSummaryFunction(ownTeamGradingSummaryData, sortOrderArray) {
    let defaultObj = {
        competitionDivisionGradeId: null,
        gradeName: null,
        teamCount: null,
        sortOrder: null,
    }
    for (let i in ownTeamGradingSummaryData) {
        let gradesArray = []
        for (let j in sortOrderArray) {
            let checkGradesArray = checkGradesValue(sortOrderArray[j], ownTeamGradingSummaryData[i].grades)
            if (checkGradesArray.status) {
                defaultObj = {
                    competitionDivisionGradeId: checkGradesArray.result.competitionDivisionGradeId,
                    gradeName: checkGradesArray.result.gradeName,
                    teamCount: checkGradesArray.result.teamCount,
                    sortOrder: checkGradesArray.result.sortOrder,
                }
            } else {
                defaultObj = {
                    competitionDivisionGradeId: null,
                    gradeName: null,
                    teamCount: null,
                    sortOrder: null,
                }
            }

            gradesArray.push(defaultObj)
        }
        ownTeamGradingSummaryData[i].grades = gradesArray
        for (let k in gradesArray) {
            ownTeamGradingSummaryData[i][`grades${k}`] = gradesArray[k]
        }

    }
    console.log(ownTeamGradingSummaryData)
    return ownTeamGradingSummaryData
}


function sortOrderArray(ownTeamGradingSummaryData) {
    let sortOrderArray = []
    if (ownTeamGradingSummaryData.length > 0) {
        ownTeamGradingSummaryData.map((item) => {
            let grades = item.grades
            grades.map((gradeItem) => {
                let sortOrder = gradeItem.sortOrder
                sortOrderArray.indexOf(sortOrder) === -1 && sortOrderArray.push(sortOrder)
            })
        })
    }
    return sortOrderArray
}

function CompetitionOwnTeamGrading(state = initialState, action) {

    switch (action.type) {

        case ApiConstants.API_COMPETITION_OWN_TEAM_GRADING_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_COMPETITION_OWN_TEAM_GRADING_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        //competition  own final team grading data get api
        case ApiConstants.API_GET_COMPETITION_OWN_PROPOSED_TEAM_GRADING_LIST_LOAD:
            return { ...state, onLoad: true, error: null }


        case ApiConstants.API_GET_COMPETITION_OWN_PROPOSED_TEAM_GRADING_LIST_SUCCESS:
            let finalTeamGradingData = action.result
            return {
                ...state,
                getCompOwnProposedTeamGradingData: isArrayNotEmpty(finalTeamGradingData.teamGradings) ? finalTeamGradingData.teamGradings : [],
                compFinalTeamGradingFinalGradesData: isArrayNotEmpty(finalTeamGradingData.finalGrades) ? finalTeamGradingData.finalGrades : [],
                onLoad: false,
                error: null
            }

        ////////competition own final team grading data on Change table 
        case ApiConstants.ONCHANGE_COMPETITION_OWN_PROPOSED_TEAM_GRADING_DATA:
            let finalGradingOnChangeData = JSON.parse(JSON.stringify(state.getCompOwnProposedTeamGradingData))
            if (action.key == "finalGradeId") {
                finalGradingOnChangeData[action.index]["finalGradeId"] = action.value
            }
            state.getCompOwnProposedTeamGradingData = finalGradingOnChangeData
            return {
                ...state,
                onLoad: false,
                error: null
            }

        ////////competition save own final team grading table data
        case ApiConstants.API_SAVE_COMPETITION_OWN_FINAL_TEAM_GRADING_LOAD:
            return { ...state, onLoad: true, error: null }


        case ApiConstants.API_SAVE_COMPETITION_OWN_FINAL_TEAM_GRADING_SUCCESS:
            return {
                ...state,
                onLoad: false,
                error: null
            }

        //////// /clear competition  team grading reducer data

        case ApiConstants.OWN_COMP_TEAM_GRADING_CLEARING_PARTICULAR_REDUCER_DATA:
            console.log(action)
            if (action.key == "finalTeamGrading") {
                state.getCompOwnProposedTeamGradingData = []
                state.compFinalTeamGradingFinalGradesData = []
            }
            if (action.key == "getPartProposedTeamGradingData") {
                state.getPartProposedTeamGradingData = []
            }
            if (action.key == "ownTeamGradingSummaryGetData") {
                state.ownTeamGradingSummaryGetData = []
                state.finalsortOrderArray = []
            }

            return {
                ...state,
                onLoad: false,
                error: null
            }

        //competition  own final team grading data get api
        case ApiConstants.API_GET_COMPETITION_PART_PROPOSED_TEAM_GRADING_LIST_LOAD:
            return { ...state, onLoad: true, error: null }


        case ApiConstants.API_GET_COMPETITION_PART_PROPOSED_TEAM_GRADING_LIST_SUCCESS:
            let partProposedTeamGradingData = action.result
            return {
                ...state,
                getPartProposedTeamGradingData: isArrayNotEmpty(partProposedTeamGradingData) ? partProposedTeamGradingData : [],
                onLoad: false,
                error: null
            }

        ////////competition participate in proposed team grading data on Change table 
        case ApiConstants.ONCHANGE_COMPETITION_PART_PROPOSED_TEAM_GRADING_DATA:
            let partProposedTeamGradingOnchangeData = JSON.parse(JSON.stringify(state.getPartProposedTeamGradingData))
            if (action.key == "proposedGradeRefId") {
                partProposedTeamGradingOnchangeData[action.index]["proposedGradeRefId"] = action.value
            }
            if (action.key == "teamName") {
                partProposedTeamGradingOnchangeData[action.index]["teamName"] = action.value
            }
            state.getPartProposedTeamGradingData = partProposedTeamGradingOnchangeData
            return {
                ...state,
                onLoad: false,
                error: null
            }


        ////////competition save own final team grading table data
        case ApiConstants.API_SAVE_COMPETITION_PART_PROPOSED_TEAM_GRADING_LOAD:
            return { ...state, onLoad: true, error: null }


        case ApiConstants.API_SAVE_COMPETITION_PART_PROPOSED_TEAM_GRADING_SUCCESS:
            return {
                ...state,
                onLoad: false,
                error: null
            }


        ///////save the changed grade name in own competition team grading summary data
        case ApiConstants.API_SAVE_UPDATED_GRADE_NAME_TEAM_GRADING_SUMMARY_LOAD:
            return { ...state, onLoad: true, error: null, updateGradeOnLoad: true }


        case ApiConstants.API_SAVE_UPDATED_GRADE_NAME_TEAM_GRADING_SUMMARY_SUCCESS:
            return {
                ...state,
                onLoad: false,
                error: null,
                updateGradeOnLoad: false
            }



        ///////////////team grading summmary publish
        case ApiConstants.API_PUBLISH_TEAM_GRADING_SUMMARY_LOAD:
            return { ...state, onLoad: true, error: null }


        case ApiConstants.API_PUBLISH_TEAM_GRADING_SUMMARY_SUCCESS:
            return {
                ...state,
                onLoad: false,
                error: null
            }


        ///////get the own team grading summary listing data
        case ApiConstants.API_GET_COMPETITION_OWN_TEAM_GRADING_SUMMARY_LIST_LOAD:
            return { ...state, onLoad: true, error: null }


        case ApiConstants.API_GET_COMPETITION_OWN_TEAM_GRADING_SUMMARY_LIST_SUCCESS:
            let ownTeamGradingSummaryData = isArrayNotEmpty(action.result) ? action.result : []
            let finalsortOrderArray = sortOrderArray(ownTeamGradingSummaryData)
            let teamGradingFinalData = ownTeamGradingSummaryFunction(ownTeamGradingSummaryData, finalsortOrderArray)
            state.ownTeamGradingSummaryGetData = teamGradingFinalData
            state.finalsortOrderArray = finalsortOrderArray
            return {
                ...state,
                onLoad: false,
                error: null
            }


        ////////competition own team grading summary listing  data on Change table 
        case ApiConstants.ONCHANGE_COMPETITION_TEAM_GRADING_SUMMARY_DATA:
            let ownTeamGradingSummaryGetTableData = JSON.parse(JSON.stringify(state.ownTeamGradingSummaryGetData))
            if (action.key == "ownTeamGradingSummaryGetData") {
                ownTeamGradingSummaryGetTableData.length > 0 && ownTeamGradingSummaryGetTableData.map((item, index) => {
                    let gradeIndex = item.grades.findIndex(x => x.competitionDivisionGradeId == action.index)
                    if (gradeIndex >= 0) {
                        let gradesParameter = `grades${gradeIndex}`
                        item[gradesParameter].gradeName = action.value
                    }
                })
            }
            state.ownTeamGradingSummaryGetData = ownTeamGradingSummaryGetTableData
            return {
                ...state,
                onLoad: false,
                error: null
            }



        ////////////get the competition final grades on the basis of competition and division
        case ApiConstants.API_GET_COMPETITION_FINAL_GRADES_LIST_LOAD:
            return { ...state, onLoad: true, error: null }


        case ApiConstants.API_GET_COMPETITION_FINAL_GRADES_LIST_SUCCESS:
            return {
                ...state,
                getFinalGradesListData: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            }
        default:
            return state;
    }
}



export default CompetitionOwnTeamGrading;
