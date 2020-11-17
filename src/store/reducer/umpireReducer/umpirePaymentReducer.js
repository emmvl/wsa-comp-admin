import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpirePaymentList: [],
    totalCount: null,
    currentPage: null,
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
            let data = action.data.data
            let key = action.data.key
            let index = action.data.index
            let umpirePaymentArr = state.umpirePaymentList
            let array = []
            if (key === 'allCheckBox') {
                for (let i in umpirePaymentArr) {
                    if (umpirePaymentArr[i].paymentStatus === "unpaid") {
                        umpirePaymentArr[i]["selectedValue"] = data
                    }

                    if (data) {
                        if (umpirePaymentArr[i].paymentStatus == "unpaid") {
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
                let userId = action.data.allData.userId
                let matchUmpireId = action.data.allData.id
                let stripeId = action.data.allData.user ? action.data.allData.user.stripeAccountId : null

                if (data) {

                    let obj = {
                        userId: userId,
                        matchUmpireId: matchUmpireId,
                        stripeId: stripeId
                    }

                    state.paymentTransferPostData.push(obj)
                } else {

                    let postData = state.paymentTransferPostData
                    let userId = action.data.allData.userId
                    for (let i in postData) {
                        if (postData[i].userId == userId) {
                            postData.splice(i, 1);
                            break;
                        }
                    }
                    state.paymentTransferPostData = postData
                }


                for (let i in umpirePaymentArr) {
                    if (i == index) {
                        umpirePaymentArr[i]["selectedValue"] = data
                    }
                }

                for (let j in umpirePaymentArr) {
                    if (umpirePaymentArr[j][key] === true) {
                        array.push(umpirePaymentArr[j])
                    }
                }

                if (umpirePaymentArr.length === array.length) {
                    state.paymentStatus = true
                } else {
                    state.paymentStatus = false
                }

                state.umpirePaymentList = umpirePaymentArr

            } else if (key === "hoverVisible") {
                let paymentData = state.umpirePaymentList
                if (data) {
                    for (let i in paymentData) {
                        if (i == index) {
                            paymentData[i][key] = data
                        }
                    }
                } else {
                    for (let i in paymentData) {
                        if (i == index) {
                            paymentData[i][key] = data
                        }
                    }
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

        default:
            return state;
    }
}

export default umpirePaymentState;
