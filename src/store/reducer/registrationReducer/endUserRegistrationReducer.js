import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";


let registrationObj = {
    organisationUniqueKey: "",
	registrationId: 0,
	orgRegistrationId: 0,
	postalCode: "",
	alternativeLocation: "",
	countryRefId: null,
	nationalityRefId: null,
	languages: "",
	volunteers:[],
    competitionUniqueKey: "",
    childrenCheckNumber: "",
    userRegistrations:[],
    vouchers: []
}

let membershipProdInfoObj = {
    specialNote: "",
    training: "",
    competitionName: "",
    membershipProducts: []
}


const initialState = {
    onLoad: false,
    onUserRegDashboardLoad: false,
    error: null,
    result: null,
    status: 0,
    registrationDetail: registrationObj,
    registrationSettings: [],
    membershipProductInfo: membershipProdInfoObj,
    userRegDashboardListData: [], 
    userRegDashboardListPage: 1,
    userRegDashboardListTotalCount: 1,
    competitions:[],
    membershipProductTypes: [],
    membershipProducts:[],
    postalCodes: []
}


function  endUserRegistrationReducer(state = initialState, action)
{
    switch(action.type)
    {
        case ApiConstants.API_END_USER_REGISTRATION_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_END_USER_REGISTRATION_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_SAVE_END_USER_REGISTRATION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_END_USER_REGISTRATION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.UPDATE_END_USER_REGISTRATION:

            let oldData = state.registrationDetail;
            let updatedValue = action.updatedData;
            let getKey = action.key;
            oldData[getKey] = updatedValue;
            return { ...state, error: null };  

        case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_SUCCESS:
            let data = action.result;
            return {
                ...state,
                onLoad: false,
                status: action.status,
                membershipProductInfo: data
            };

        case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_SUCCESS:
            let orgData = action.result;
            return {
                ...state,
                onLoad: false,
                status: action.status,
                registrationSettings: orgData
            };

        case ApiConstants.API_USER_REG_DASHBOARD_LIST_LOAD:
            return { ...state, onUserRegDashboardLoad: true, error: null };

        case ApiConstants.API_USER_REG_DASHBOARD_LIST_SUCCESS:
            let dashboardListData = action.result;
            return {
                ...state,
                onUserRegDashboardLoad: false,
                userRegDashboardListData: dashboardListData.registrations,
                userRegDashboardListTotalCount: dashboardListData.page.totalCount,
                userRegDashboardListPage: dashboardListData.page
                    ? dashboardListData.page.currentPage
                    : 1,
                competitions: dashboardListData.competitions,
                membershipProductTypes: dashboardListData.membershipProductTypes,
                membershipProducts: dashboardListData.membershipProducts,
                postalCodes: dashboardListData.postalCodes,
                status: action.status,
                error: null
            };

            case ApiConstants.API_USER_REG_DASHBOARD_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_USER_REG_DASHBOARD_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        default:
            return state;
    }
}

export default endUserRegistrationReducer;