import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";
import ColorsArray from "../../../util/colorsArray";


const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    ownedCompetitions: [],
    participatingInComptitions: [],
    updateLoad: false
};



///// Generate Owned Competition Array

function genrateOwnedCompArray(dashboardList) {

    let ownedCompetitions = JSON.parse(JSON.stringify(dashboardList.ownedCompetitions))

    for (let i in ownedCompetitions) {
        let ownDivisionList = ownedCompetitions[i].divisions
        if (isArrayNotEmpty(ownDivisionList)) {
            ownDivisionList.map((item, index) => {
                item.color = index <= 38 ? ColorsArray[index] : "#a3a3b1";
            })
        }
    }
    return ownedCompetitions

}


///// Create Participating In competition Array

function genratePaticipatingArray(dashboardList) {

    let participatingComptitions = JSON.parse(JSON.stringify(dashboardList.participatingInComptitions))

    for (let i in participatingComptitions) {
        let divisionList = participatingComptitions[i].divisions
        if (isArrayNotEmpty(divisionList)) {
            divisionList.map((item, index) => {
                item.color = index <= 38 ? ColorsArray[index] : "#a3a3b1";
            })
        }
    }
    return participatingComptitions

}

function CompetitionDashboardState(state = initialState, action) {

    switch (action.type) {


        case ApiConstants.API_COMPETITION_DASHBOARD_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_COMPETITION_DASHBOARD_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        ////Competition Dashboard Case
        case ApiConstants.API_COMPETITION_DASHBOARD_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_COMPETITION_DASHBOARD_SUCCESS:
            let ownCompetionArray = genrateOwnedCompArray(action.result)
            let participatingComptitions = genratePaticipatingArray(action.result)
            return {
                ...state,
                onLoad: false,
                ownedCompetitions: ownCompetionArray,
                participatingInComptitions: participatingComptitions,
                status: action.status
            };

        case ApiConstants.API_COMPETITION_STATUS_UPDATE_LOAD:
            return { ...state, updateLoad: true }

        case ApiConstants.API_COMPETITION_STATUS_UPDATE_SUCCESS:
            let ownCompetion_Array = genrateOwnedCompArray(action.updateDashboardResult)
            let participating_Comptitions = genratePaticipatingArray(action.updateDashboardResult)
            return {
                ...state,
                updateLoad: false,
                ownedCompetitions: ownCompetion_Array,
                participatingInComptitions: participating_Comptitions,
            }

        default:
            return state;
    }
}

export default CompetitionDashboardState;
