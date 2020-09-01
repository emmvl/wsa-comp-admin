import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../../util/helpers";

let obj = {
    userName: null,
    userRegister: null,
    competitionName: null,
    competitionAdministrator: null,
    regDate: null,
    compDate: null,
    regChangeType: null,
    courtGame: null,
    reasonToDeRegister: null
}


const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    detailsData: obj,
    onDeRegisterLoad: false,
    onSaveLoad: false,

    registrationSelection: [
        { id: 1, value: "De-register", helpMsg: "What is de-registration? I am leaving netball and no longer want to participate in Netball.I have not taken the court in training, grading or competition games." },
        { id: 2, value: "Transfer", helpMsg: "What is a transfer? I am wanting to move to another Netball Club or Association for the upcoming season." }
    ],
    DeRegistionMainOption: [
        { id: 1, value: "Yes" },
        { id: 2, value: "No" }
    ],
    deRegistionOption: [
        { id: 1, value: "I am over committed with other activities and can't fit in time for netball" },
        { id: 2, value: "I have been injured or health reason(not netball related" },
        { id: 3, value: "Decided not to participant in netball" },
        { id: 4, value: "Moving to a different geographical area" },
        { id: 5, value: "Other" },
    ],
    transferOption: [
        { id: 1, value: "Moving to another Netball Club or Association for the upcoming season" },
        { id: 2, value: "No team available in current Club or Association" },
        { id: 3, value: "Other" },

    ],
    reloadFormData:0,
    saveData : {
        regChangeTypeRefId: 0,         // DeRegister/ Transfer
        deRegistrationOptionId: 0,   /// Yes/No
        reasonTypeRefId: 0,      
        deRegisterOther: null,
        transfer: {
            transferOther: null,
            reasonTypeRefId: 0, 
            organisationId: null,
            competitionId: null
        }
    },
    regChangeDashboardListData: [], ////////registration change Dashboard list
    regChangeDashboardListPage: 1,
    regChangeDashboardListTotalCount: 1,
    regChangeCompetitions: []
}


function regChangeReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_UPDATE_REG_REVIEW:

            let key = action.data.key
            let data = action.data.data

            state.detailsData[key] = data
            return {
                ...state,

            };

        case ApiConstants.API_SAVE_DE_REGISTRATION_LOAD:
            return {...state, onSaveLoad: true}

        case ApiConstants.API_SAVE_DE_REGISTRATION_SUCCESS:
            return {
                ...state,
                onSaveLoad: false,
                status: action.status,
            }

        case ApiConstants.API_UPDATE_DE_REGISTRATION:
            if(action.subKey == "deRegister"){
                if(action.key == "regChangeTypeRefId"){
                    state.saveData[action.key] = action.value;
                    state.saveData["deRegistrationOptionId"] = 1;
                }
                else {
                    state.saveData[action.key] = action.value;
                }
            }
            else if(action.subKey == "transfer"){
                state.saveData.transfer[action.key] = action.value;
            }
            else{
                state.reloadFormData = 0;
            }
            
            return {
                ...state,
                onLoad: false,
            }
        
        case ApiConstants.API_GET_REGISTRATION_CHANGE_DASHBOARD_LOAD:
            return {...state, onLoad: true}

        case ApiConstants.API_GET_REGISTRATION_CHANGE_DASHBOARD_SUCCESS:
            let dashboardListData = action.result;
            return {
                ...state,
                onLoad: false,
                regChangeDashboardListData: dashboardListData.registrationChanges,
                regChangeDashboardListTotalCount: dashboardListData.page.totalCount,
                regChangeDashboardListPage: dashboardListData.page
                    ? dashboardListData.page.currentPage
                    : 1,
                    regChangeCompetitions: dashboardListData.competitions ? dashboardListData.competitions : [],
                status: action.status,
                error: null
            }

        default:
            return state;
    }
}

export default regChangeReducer;