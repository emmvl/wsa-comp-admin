import ApiConstants from "../../../themes/apiConstants";
import { deepCopyFunction, isArrayNotEmpty } from "../../../util/helpers";
import ColorsArray from "../../../util/colorsArray";

const replicateObj = {
	"details": {
		"oldYearRefId": null,
		"oldCompetitionId": null,
		"newYearRefId": null,
		"competitionName": null,
		"competitionDates": null,
		"competitionStartDate": null,
		"competitionEndDate": null,
		"registrationCloseDate": null,
		"replicateSettings": {
			"competitionLogo": 1,
			"competitionDetails": 1,
			"competitionType": 1,
			"nonPlayingDates": 1,
			"registrationTypes": 1,
			"registrationFees": 1,
			"venues": 1,
			"fixtures": {
                "divisions": 1,
                "grades": 1,
                "teams": 1,
                "venuePreferneces": 1,
                "timeslots": 1
            }
		}
	},
	"membershipProducts":[
		{
			"competitionMembershipProductId": 0,
			"membershipProductUniqueKey":"",
			"membershipProductTypes":[
				{
					"competitionMembershipProductId":0,
					"competitionMembershipProductTypeId":1,
					"membershipProductTypeMappingId":22
				}
			]
		}
	]
}

const fixtures = {
    "divisions": null,
    "grades": null,
    "teams": null,
    "venuePreferneces": null,
    "timeslots": null
}


const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    ownedCompetitions: [],
    participatingInComptitions: [],
    updateLoad: false,
    deleteCompLoad: false,
    replicateSave: deepCopyFunction(replicateObj),
    replicateSaveOnLoad: false,
    replicateSaved: false,
    competitionId: null,
    yearRefId: null
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
        
        case ApiConstants.API_COMPETITION_DASHBOARD_DELETE_LOAD:
            return { ...state, deleteCompLoad: true };

        case ApiConstants.API_COMPETITION_DASHBOARD_DELETE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                result: action.result,
                status: action.status,
                deleteCompLoad: false 
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

        case ApiConstants.UPDATE_REPLICATE_SAVE_OBJ:
            let replicateData = action.data;
            let replicateKey = action.key;
            let replicateSubKey = action.subKey;
            if(replicateKey == "details"){
                state.replicateSave[replicateKey][replicateSubKey] = replicateData;
            }else if(replicateKey == "replicateSettings"){
                let fixtures = state.replicateSave.details.replicateSettings.fixtures;
                if(fixtures){
                    if(replicateSubKey == "registrationTypes" && replicateData == 0){
                        state.replicateSave.details.replicateSettings.registrationFees = 0;
                            fixtures.divisions = 0;
                            fixtures.grades = 0;
                            fixtures.teams = 0;
                    }
                    if(replicateSubKey == "venues" && replicateData == 0){
                        fixtures.venuePreferneces = 0;
                    }
                }
                state.replicateSave.details[replicateKey][replicateSubKey] = replicateData;
            }else if(replicateKey == "fixtures"){
                if(replicateSubKey == "fixtures"){
                    if(replicateData == 1){
                        state.replicateSave.details.replicateSettings[replicateKey] = deepCopyFunction(fixtures);
                    }else{
                        state.replicateSave.details.replicateSettings[replicateKey] = null;
                    }
                }else{
                    state.replicateSave.details.replicateSettings[replicateKey][replicateSubKey] = replicateData;
                }
            }
            return{
                ...state
            }

        case ApiConstants.API_REPLICATE_SAVE_LOAD:
            return {...state,replicateSaveOnLoad: true}

        case ApiConstants.API_REPLICATE_SAVE_SUCCESS:
            let responseData = action.result;
            return{
                ...state,
                status: action.status,
                replicateSaveOnLoad: false,
                competitionId: responseData.competitionId,
                yearRefId: responseData.yearRefId,
                replicateSaved: true 
            }

        default:
            return state;
    }
}

export default CompetitionDashboardState;
