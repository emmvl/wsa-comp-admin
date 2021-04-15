import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpirePaymentList: [],
    totalCount: 1,
    currentPage: 1,
    pageSize: 10,
    paymentStatus: false,
    paymentTransferPostData: [],
    onPaymentLoad: false,
    allSelectedData: [],
    umpirePaymentObject: null,
    umpireDataPayement: [],
    paymentArr: []
};

function getFilterUmpirePayment(umpirePaymentArr) {
    let arr = []
    for (let i in umpirePaymentArr) {

        if (umpirePaymentArr[i].umpireType === "USERS") {
            let obj = {
                approvedByUser: umpirePaymentArr[i].approvedByUser,
                approved_at: umpirePaymentArr[i].approved_at,
                approvedByUserId: umpirePaymentArr[i].approvedByUserId,
                id: umpirePaymentArr[i].id,
                match: umpirePaymentArr[i].match,
                matchId: umpirePaymentArr[i].matchId,
                organisationId: umpirePaymentArr[i].organisationId,
                paymentStatus: umpirePaymentArr[i].paymentStatus,
                sequence: umpirePaymentArr[i].sequence,
                umpireName: umpirePaymentArr[i].umpireName,
                umpireType: umpirePaymentArr[i].umpireType,
                user: umpirePaymentArr[i].user,
                userId: umpirePaymentArr[i].userId,
                verifiedBy: umpirePaymentArr[i].verifiedBy,
                selectedValue: umpirePaymentArr[i].paymentStatus === "paid" || umpirePaymentArr[i].paymentStatus === "approved" ? true : false,
                hoverVisible: false
            }
            arr.push(obj)
        }
    }
    return arr;
}

function getPayementTransferFilterData(umpirePaymentArr) {
    let arr = []
    for (let i in umpirePaymentArr) {

        if (umpirePaymentArr[i].paymentStatus === "approved") {

            let obj = {
                userId: umpirePaymentArr[i].user.id,
                matchUmpireId: umpirePaymentArr[i].id,
                stripeId: umpirePaymentArr[i].user.stripeAccountId
            }
            arr.push(obj)
        }
    }
    return arr;
}

function getAllSelectedBoxData(umpirePaymentArr) {
    let arr = []
    for (let i in umpirePaymentArr) {

        if (umpirePaymentArr[i].paymentStatus === "approved" || umpirePaymentArr[i].paymentStatus === "approved") {

            arr.push(umpirePaymentArr[i])
        }
    }
    return arr;
}

function umpirePaymentState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_LOAD:


            return { ...state, onLoad: true, umpirePaymentObject: action };

        case ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_SUCCESS:
            let result = action.result.players
            let filterUmpirePayment = getFilterUmpirePayment(result)
            let payementTransferFilterData = getPayementTransferFilterData(result)
            let filterDataForAllSelectedBox = getAllSelectedBoxData(result)
            state.allSelectedData = filterDataForAllSelectedBox

            if ((state.allSelectedData.length > 0 && result.length > 0) && (state.allSelectedData.length === result.length)) {
                state.paymentStatus = true
            } else {
                state.paymentStatus = false
            }
            state.paymentTransferPostData = JSON.parse(JSON.stringify(payementTransferFilterData))
            state.paymentArr = JSON.parse(JSON.stringify(payementTransferFilterData))
            let pages = action.result.page

            return {
                ...state,
                onLoad: false,
                umpirePaymentList: filterUmpirePayment,
                totalCount: pages.totalCount,
                currentPage: pages.currentPage,
                status: action.status
            };

        case ApiConstants.API_UPDATE_UMPIRE_PAYMENT_DATA:
            const { data, key, index = null, allData = {} } = action.data;
            let umpirePaymentArr = state.umpirePaymentList;
            let postData = state.paymentTransferPostData;
            if (key === 'allCheckBox') {
                for (let i in umpirePaymentArr) {
                    if (umpirePaymentArr[i].paymentStatus === "unpaid") {
                        umpirePaymentArr[i]["selectedValue"] = data
                    }

                    if (data) {
                        if (umpirePaymentArr[i].paymentStatus === "unpaid") {
                            state.umpireDataPayement.push(umpirePaymentArr[i])
                        }
                    } else {
                        state.umpireDataPayement = []
                    }


                    // if (data && umpirePaymentArr[i].paymentStatus === 'unpaid' && umpirePaymentArr[i].user && umpirePaymentArr[i].user.stripeAccountId) {
                    //     let obj = {
                    //         userId: umpirePaymentArr[i].user.id,
                    //         matchUmpireId: umpirePaymentArr[i].id,
                    //         stripeId: umpirePaymentArr[i].user.stripeAccountId
                    //     }

                    //     state.paymentTransferPostData.push(obj)
                    // } else {

                    //     if (umpirePaymentArr[i].paymentStatus === 'unpaid') {
                    //         state.paymentTransferPostData.splice(i, 1)
                    //     }
                    // }

                }
                let payData = state.umpireDataPayement
                if (payData.length > 0) {
                    for (let i in payData) {

                        if (payData[i].user && payData[i].user.stripeAccountId) {
                            let obj = {
                                userId: payData[i].user.id,
                                matchUmpireId: payData[i].id,
                                stripeId: payData[i].user.stripeAccountId
                            }
                            state.paymentTransferPostData.push(obj)
                        }
                    }
                } else {
                    state.paymentTransferPostData = state.paymentArr
                }


                state.paymentStatus = data
                state.umpirePaymentList = umpirePaymentArr


            } else if (key === 'selectedValue') {
                console.log(allData);
                let userId = allData.userId
                let matchUmpireId = allData.id
                let stripeId = allData.user ? allData.user.stripeAccountId : null

                const targetIndex = postData.findIndex(record => record.id === matchUmpireId)
                // Update paymentTransferPostData
                if (data) { 
                    postData.push({ userId, matchUmpireId, stripeId});
                } else {
                    if (targetIndex > -1) {
                        postData.splice(targetIndex, 1)
                    }
                }

                // Update umpirePaymentList
                const umpireIndex = umpirePaymentArr.findIndex(record => record.id === matchUmpireId);
                if (umpireIndex > -1) umpirePaymentArr[umpireIndex].selectedValue = data;
                const newPaymentStatus = umpirePaymentArr.every(payment => !!payment.selectedValue);

                return {
                    ...state,
                    umpirePaymentList: umpirePaymentArr,
                    paymentTransferPostData: postData,
                    paymentStatus: newPaymentStatus
                }

            } else if (key === "clearData") {
                state.paymentTransferPostData = []
                state.paymentStatus = null
                for (let i in state.umpirePaymentList) {
                    if (state.umpirePaymentList[i].paymentStatus === "unpaid") {
                        state.umpirePaymentList[i]['selectedValue'] = false
                    }

                }
            }
            return {
                ...state,
            };

        case ApiConstants.API_UMPIRE_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                onPaymentLoad: false
            };
        case ApiConstants.API_UMPIRE_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                onPaymentLoad: false
            };

        case ApiConstants.API_UMPIRE_PAYMENT_TRANSFER_DATA_LOAD:


            return { ...state, onPaymentLoad: true };

        case ApiConstants.API_UMPIRE_PAYMENT_TRANSFER_DATA_SUCCESS:
            return {
                ...state,
                onPaymentLoad: false,

            };

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.umpirePaymentObject = null
            return { ...state, onLoad: false };

        case ApiConstants.API_UMPIRE_PAYMENT_EXPORT_FILE_LOAD:


            return { ...state, onPaymentLoad: true };

        case ApiConstants.API_UMPIRE_PAYMENT_EXPORT_FILE_SUCCESS:
            return {
                ...state,
                onPaymentLoad: false,
            };

        case ApiConstants.SET_UMPIRE_PAYMENT_LIST_PAGE_SIZE:
            return {
                ...state,
                pageSize: action.pageSize,
            }
        
        case ApiConstants.SET_UMPIRE_ROSTER_LIST_PAGE_CURRENT_NUMBER:
            return {
                ...state,
                currentPage: action.pageNum,
            }

        default:
            return state;
    }
}

export default umpirePaymentState;
