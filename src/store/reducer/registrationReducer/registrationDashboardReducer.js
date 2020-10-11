import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";
import ColorsArray from "../../../util/colorsArray";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    regDashboardListData: [], ////////registration Dashboard list
    regDashboardListPage: 1,
    regDashboardListTotalCount: 1,
    competitionTypeList: [],
    ownedRegistrations: [],////////ownedRegistrations main dashboard listing
    participatingInRegistrations: [], ////////participatingInRegistrations main dashboard listing
    regFormListAction: null,
    regDashboardListAction: null
};

///// Generate owned Registrations Array

function generateOwnedRegistrations(dashboardList) {
    let ownedCompetitions = JSON.parse(JSON.stringify(dashboardList.ownedCompetitions))
    if (isArrayNotEmpty(ownedCompetitions)) {
        for (let i in ownedCompetitions) {
            let ownDivisionList = ownedCompetitions[i].divisions
            if (isArrayNotEmpty(ownDivisionList)) {
                ownDivisionList.map((item, index) => {
                    item.color = index <= 38 ? ColorsArray[index] : "#a3a3b1";
                })
            }
        }
    }
    return ownedCompetitions
}


///// Create participating In Registrations Array

function generateParticipatingInRegistrations(dashboardList) {
    let participatingComptitions = JSON.parse(JSON.stringify(dashboardList.participatingInComptitions))
    if (isArrayNotEmpty(participatingComptitions)) {
        for (let i in participatingComptitions) {
            let divisionList = participatingComptitions[i].divisions
            if (isArrayNotEmpty(divisionList)) {
                divisionList.map((item, index) => {
                    item.color = index <= 38 ? ColorsArray[index] : "#a3a3b1";
                })
            }
        }
    }
    return participatingComptitions
}


function registrationDashboard(state = initialState, action) {
    switch (action.type) {
        //////get the Dashboard list in registration
        case ApiConstants.API_REG_DASHBOARD_LIST_LOAD:
            return { ...state, onLoad: true, error: null, regFormListAction: action };

        case ApiConstants.API_REG_DASHBOARD_LIST_SUCCESS:
            let dashboardListData = action.result;
            return {
                ...state,
                onLoad: false,
                regDashboardListData: dashboardListData.orgReg,
                regDashboardListTotalCount: dashboardListData.page.totalCount,
                regDashboardListPage: dashboardListData.page
                    ? dashboardListData.page.currentPage
                    : 1,
                status: action.status,
                error: null
            };


        ///******fail and error handling */
        case ApiConstants.API_REG_DASHBOARD_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_REG_DASHBOARD_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        /////get the Competition type list 
        case ApiConstants.API_GET_ALL_COMPETITION_LOAD:
            state.competitionTypeList = [];
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_ALL_COMPETITION_SUCCESS:
            let competitionData = JSON.parse(JSON.stringify(action.result))
            let competitionObject = {
                competitionId: 0,
                competitionName: "New Competition ",
                competitionStatus: "draft",
                competitionStatusId: 0,
                id: 0,
                isDirect: false,
                registrationCloseDate: "",
                yearId: "",
                orgRegistratinId: 0,
                competitionCreatorOrganisation: 0,
                inviteeStatus: 0
            }
            competitionData.unshift(competitionObject)
            return {
                ...state,
                onLoad: false,
                competitionTypeList: competitionData,
                status: action.status
            };

        /////////////////registration main dashboard listing owned and participate registration
        case ApiConstants.API_GET_REGISTRATION_MAIN_DASHBOARD_LISTING_LOAD:
            return { ...state, onLoad: true, error: null, regDashboardListAction: action };

        case ApiConstants.API_GET_REGISTRATION_MAIN_DASHBOARD_LISTING_SUCCESS:
            let ownRegArray = generateOwnedRegistrations(action.result)
            let participatingReg = generateParticipatingInRegistrations(action.result)
            state.ownedRegistrations = ownRegArray
            state.participatingInRegistrations = participatingReg
            state.onLoad = false
            return {
                ...state,
                status: action.status,
                error: null
            };

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.regFormListAction = null
            state.regDashboardListAction = null
            return { ...state, onLoad: false };

        default:
            return state;
    }
}

export default registrationDashboard;
