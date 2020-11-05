import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpirePaymentList: [],
    totalCount: null,
    currentPage: null,
    paymentStatus: false
};
function umpirePaymentState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_LOAD:


            return { ...state, onLoad: true };

        case ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_SUCCESS:
            let result = action.result.players
            let pages = action.result.page
            state.paymentStatus = false
            return {
                ...state,
                onLoad: false,
                umpirePaymentList: result,
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
                    umpirePaymentArr[i]["paymentStatus"] = data ? data : 'unpaid'
                }
                state.paymentStatus = data
                state.umpirePaymentList = umpirePaymentArr

            } else if (key === 'paymentStatus') {

                for (let i in umpirePaymentArr) {
                    if (i == index) {
                        umpirePaymentArr[i][key] = data ? data : 'unpaid'
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

            }
            return {
                ...state,
            };

        case ApiConstants.API_UMPIRE_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_UMPIRE_ERROR:
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

export default umpirePaymentState;
