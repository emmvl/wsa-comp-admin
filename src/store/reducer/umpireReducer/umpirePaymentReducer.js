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
    return umpirePaymentArr.map(payment => ({
        ...payment, 
        selectedValue: payment.paymentStatus === "paid" || payment.paymentStatus === "approved"
    }));
}

function getPaymentTransferFilterData(umpirePaymentArr) {
    return umpirePaymentArr
        .filter(umpirePayment => umpirePayment.paymentStatus === "approved")
        .map(umpirePayment => ({ 
            userId:  umpirePayment.userId,
            matchUmpireId: umpirePayment.id,
            stripeId: umpirePayment.user.stripeAccountId
        }));
}

function getAllSelectedBoxData(umpirePaymentArr) {
    return umpirePaymentArr.filter(payment => payment.paymentStatus === "approved");
}

function umpirePaymentState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_LOAD:
            return { ...state, onLoad: true, umpirePaymentObject: action };

        case ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_SUCCESS:
            let result = action.result.players
            let filterUmpirePayment = getFilterUmpirePayment(result)
            let paymentTransferFilterData = getPaymentTransferFilterData(result)
            let filterDataForAllSelectedBox = getAllSelectedBoxData(result)

            return {
                ...state,
                onLoad: false,
                umpirePaymentList: filterUmpirePayment,
                paymentTransferPostData: paymentTransferFilterData,
                paymentArr: paymentTransferFilterData,
                totalCount: action.result?.page?.totalCount,
                currentPage: action.result?.page?.currentPage,
                status: action.status,
                allSelectedData: filterDataForAllSelectedBox,
                paymentStatus: filterDataForAllSelectedBox.length && result.length && (filterDataForAllSelectedBox.length === result.length)
            };

        case ApiConstants.API_UPDATE_UMPIRE_PAYMENT_DATA:
            const { data, key, index = null, allData = {} } = action.data;
            let umpirePaymentArr = [...state.umpirePaymentList];
            let postData = [...state.paymentTransferPostData];
            switch (key) {
                case 'allCheckBox':
                    const selectedPayments = umpirePaymentArr.map(
                        payment => payment.paymentStatus === 'unpaid' 
                            ? ({ ...payment, selectedValue: data })
                            : payment
                    )
                    const unpaidPayments = selectedPayments.filter(
                        payment => payment.paymentStatus === 'unpaid'
                    );
                    const payData = data ? unpaidPayments : [];
    
                    const newPaymentTransfer = !!payData.length 
                        ? payData.filter(payment => payment.user && payment.user.stripeAccountId)
                            .map(payment => ({
                                userId: payment.userId || payment.user?.id,
                                matchUmpireId: payment?.id,
                                stripeId: payment.user.stripeAccountId
                            }))
                        : [...state.paymentArr];
    
                    return {
                       ...state,
                       umpireDataPayement: payData,
                       paymentTransferPostData: newPaymentTransfer,
                       umpirePaymentList: selectedPayments,
                       paymentStatus: data,
                    }

                case 'selectedValue':
                    let userId = allData.userId
                    let matchUmpireId = allData.id
                    let stripeId = allData.user ? allData.user.stripeAccountId : null

                    const targetIndex = postData.findIndex(record => record.matchUmpireId === matchUmpireId)
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

                case 'clearData':
                    const clearedPayments = umpirePaymentArr.map(
                        payment => payment.paymentStatus === 'unpaid' 
                            ? ({ ...payment, selectedValue: false })
                            : payment
                    )

                    return {
                        ...state,
                        paymentTransferPostData: [],
                        paymentStatus: false,
                        umpirePaymentList: clearedPayments
                    }

                default: return {...state} ;
            }

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
            return { ...state, onPaymentLoad: false };

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.umpirePaymentObject = null
            return { ...state, onLoad: false };

        case ApiConstants.API_UMPIRE_PAYMENT_EXPORT_FILE_LOAD:
            return { ...state, onPaymentLoad: true };

        case ApiConstants.API_UMPIRE_PAYMENT_EXPORT_FILE_SUCCESS:
            return { ...state, onPaymentLoad: false };

        case ApiConstants.SET_UMPIRE_PAYMENT_LIST_PAGE_SIZE:
            return { ...state, pageSize: action.pageSize || 10 }
        
        case ApiConstants.SET_UMPIRE_ROSTER_LIST_PAGE_CURRENT_NUMBER:
            return { ...state, currentPage: action.pageNum }

        default:
            return state;
    }
}

export default umpirePaymentState;
