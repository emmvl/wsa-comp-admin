import ApiConstants from "../../../themes/apiConstants";

var umpireObj = {
    id: null,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    affiliates: null
}

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireList: [],
    umpireRadioBtn: 'new',
    umpireData: umpireObj,
    affiliateId: null,
    exsitingUmpireId: null,
    affilateList: [],
    umpireListResult: [],
    onLoadSearch: false,
    selectedAffiliate: null,
    onAffiliateLoad: false,
    selectedAffiliateId: null,
    onSaveLoad: false,
    totalCount: null,
    currentPage: null,
    coachList: [],
    umpireCoachCheckBox: false,
    coachList_Data: [],
    umpireList_Data: [],
    umpireListResult_Data: [],
    currentPage_Data: null,
    totalCount_Data: null,
    umpireListActionObject: null,
    umpireListData: []
};

function isUmpireCoachCheck(data, key) {
    if (data.userRoleEntities) {
        let checkCoach = data.userRoleEntities
        for (let i in checkCoach) {
            if (checkCoach[i].roleId == key) {
                return true
            }
        }
    }
    else {
        return false
    }
}


function createUmpireArray(result) {
    let umpireArray = []
    for (let i in result) {
        let userRoleCheck = result[i].userRoleEntities
        for (let j in userRoleCheck) {
            if (userRoleCheck[j].roleId == 15 || userRoleCheck[j].roleId == 19) {
                umpireArray.push(result[i])
                break
            }
        }
    }
    return umpireArray
}

function createUmpireCoachArray(result) {
    let umpireArray = []
    for (let i in result) {
        let userRoleCheck = result[i].userRoleEntities
        for (let j in userRoleCheck) {
            if (userRoleCheck[j].roleId == 15 || userRoleCheck[j].roleId == 20) {
                umpireArray.push(result[i])
                break
            }
        }
    }
    return umpireArray
}


function createCoachArray(result) {
    console.log(result)
    let coachArray = []
    for (let i in result) {
        let userRole = result[i].userRoleEntities
        for (let j in userRole) {
            if (userRole[j].roleId == 20) {
                coachArray.push(result[i])
                break
            }
        }
    }
    return coachArray
}

function getAffiliateData(selectedAffiliateId, affiliateArray) {
    let affiliateObj = []
    let obj = ''
    for (let i in affiliateArray) {
        for (let j in selectedAffiliateId) {
            if (selectedAffiliateId[j] === affiliateArray[i].id) {
                obj = {
                    name: affiliateArray[i].name,
                    id: affiliateArray[i].id
                }
                affiliateObj.push(obj)
                break;
            }
        }
    }
    return affiliateObj;
}

function genrateAffiliateId(affiliateIdArr) {
    let affiliateId = []
    for (let i in affiliateIdArr) {
        affiliateId.push(affiliateIdArr[i].entityId)
    }
    return affiliateId
}

//// get umpire selected Affiliate
function getumpireAffiliate(selectedUmpireId, umpireListArr) {
    let selectedAffiliate
    for (let i in umpireListArr) {
        if (selectedUmpireId === umpireListArr[i].id) {
            selectedAffiliate = umpireListArr[i].linkedEntity
        }
    }
    return selectedAffiliate
}

function genrateSelectedAffiliateId(linkedEntityArr, affiliateArr) {
    let affiliateIds = []
    for (let i in affiliateArr) {
        for (let j in linkedEntityArr) {
            if (linkedEntityArr[j].entityId === affiliateArr[i].id) {
                affiliateIds.push(linkedEntityArr[j].entityId)
            }
        }
    }
    return affiliateIds
}

function umpireState(state = initialState, action) {
    switch (action.type) {
        //// Umpire List
        case ApiConstants.API_UMPIRE_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_UMPIRE_LIST_SUCCESS:
            let user_Data = action.result.userData ? action.result.userData : action.result
            if (action.key === "data") {
                let coachData = createCoachArray(JSON.parse(JSON.stringify(user_Data)))
                state.coachList = coachData
            }
            let checkUserData = createUmpireArray(JSON.parse(JSON.stringify(user_Data)))
            return {
                ...state,
                onLoad: false,
                umpireList: checkUserData,
                umpireListResult: checkUserData,
                currentPage: action.result.page ? action.result.page.currentPage : null,
                totalCount: action.result.page ? action.result.page.totalCount : null,
                status: action.status
            };

        ////Main Umpire List
        case ApiConstants.API_UMPIRE_MAIN_LIST_LOAD:
            return { ...state, onLoad: true, umpireListActionObject: action.data };

        case ApiConstants.API_UMPIRE_MAIN_LIST_SUCCESS:
            let userMain_Data = action.result.userData ? action.result.userData : action.result
            if (action.key === "data") {
                let coachData = createCoachArray(JSON.parse(JSON.stringify(userMain_Data)))
                state.coachList_Data = coachData
            }
            let checkUser_Data = createUmpireCoachArray(JSON.parse(JSON.stringify(userMain_Data)))
            return {
                ...state,
                onLoad: false,
                umpireList_Data: checkUser_Data,
                umpireListResult_Data: checkUser_Data,
                currentPage_Data: action.result.page ? action.result.page.currentPage : null,
                totalCount_Data: action.result.page ? action.result.page.totalCount : null,
                status: action.status
            };

        //// Add Umpire
        case ApiConstants.API_ADD_UMPIRE_LOAD:
            return { ...state, onSaveLoad: true };
        case ApiConstants.API_ADD_UMPIRE_SUCCESS:
            return {
                ...state,
                onSaveLoad: false,
                status: action.status
            };
        //// Get Affiliate List
        case ApiConstants.API_GET_UMPIRE_AFFILIATE_LIST_LOAD:
            return { ...state, onAffiliateLoad: true };
        case ApiConstants.API_GET_UMPIRE_AFFILIATE_LIST_SUCCESS:
            state.affilateList = action.result
            return {
                ...state,
                onAffiliateLoad: false,
                status: action.status
            };
        //// Update Add Umpire Data
        case ApiConstants.UPDATE_ADD_UMPIRE_DATA:
            let key = action.key
            let data = action.data
            if (key === 'umpireRadioBtn') {
                state.umpireRadioBtn = data
                state.affiliateId = []
            }
            else if (key === 'affiliateId') {
                state.affiliateId = data
                let affiliateObj = getAffiliateData(data, state.affilateList)
                state.umpireData['affiliates'] = affiliateObj
            } else if (key === 'umnpireSearch') {
                state.exsitingUmpireId = data
                state.selectedAffiliateId = getumpireAffiliate(data, state.umpireListResult)
                let getAffiliateId = genrateSelectedAffiliateId(state.selectedAffiliateId, state.affilateList)
                state.affiliateId = getAffiliateId
            } else if (action.key === 'isEditUmpire') {
                state.umpireData.id = data.id
                state.umpireData.firstName = data.firstName
                state.umpireData.lastName = data.lastName
                state.umpireData.mobileNumber = data.mobileNumber
                state.umpireData.email = data.email
                let getAffiliateId = genrateAffiliateId(data.linkedEntity)
                state.affiliateId = getAffiliateId
                let umpireAffiliateObj = getAffiliateData(state.affiliateId, state.affilateList)
                state.umpireData['affiliates'] = umpireAffiliateObj
                state.umpireRadioBtn = 'new'
                state.umpireCoachCheckBox = isUmpireCoachCheck(data, 20)
                state.umpireCheckbox = isUmpireCoachCheck(data, 15)
            } else if (action.key === 'isAddUmpire') {
                state.umpireData = umpireObj
                state.umpireData.id = null
                state.affiliateId = []
                state.umpireRadioBtn = 'new'
                state.umpireCoachCheckBox = false
                state.umpireCheckbox = false
            } else {
                state.umpireData[action.key] = action.data
            }
            return {
                ...state,
                onLoad: false,
                status: action.status
            };
        ////Umpire Search
        case ApiConstants.API_UMPIRE_SEARCH_LOAD:
            return { ...state, onLoadSearch: true };

        case ApiConstants.API_UMPIRE_SEARCH_SUCCESS:
            return {
                ...state,
                onLoadSearch: false,
                umpireListResult: action.result,
                umpireListData: action.result,
                status: action.status,
            }
        case ApiConstants.CLEAR_UMPIRE_SEARCH:
            console.log("CLEAR_UMPIRE_SEARCH")
            state.umpireListResult = []
            return {
                ...state,
                // umpireListResult: state.umpireListResult
                // umpireListResult: []
            }
        //// Fail and Error case
        case ApiConstants.API_UMPIRE_FAIL:
            return {
                ...state,
                onLoad: false,
                onSaveLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_UMPIRE_ERROR:
            return {
                ...state,
                onLoad: false,
                onSaveLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.umpireListActionObject = null
            return { ...state, onLoad: false };

        default:
            return state;
    }
}
export default umpireState;
