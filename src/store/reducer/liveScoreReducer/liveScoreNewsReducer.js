import ApiConstants from '../../../themes/apiConstants'
import moment from 'moment';
import { isArrayNotEmpty, isNullOrEmptyString } from '../../../util/helpers';
import { getLiveScoreCompetiton } from '../../../util/sessionStorage';

var object = {
    id: '',
    title: "",
    newsImage: null,
    newsVideo: null,
    deleteNewsImage: null,
    deleteNewsVideo: null,
    isActive: 1,
    isNotification: 0,
    body: "",
    updated_at: "",
    published_at: null,
    deleted_at: null,
    entityId: 1,
    entityTypeId: 1,
    author: null,
    created_at: "",
    toUserRoleIds: "",
    toRosterRoleIds: null,
    toUserIds: null,
    recipients: [],
    news_expire_date: null,
    expire_date: "",
    expire_time: "",
    recipientRefId: null
}
const initialState = {
    onLoad: false,
    onLoad_2: false,
    error: null,
    result: null,
    status: 0,
    liveScoreNewsListData: [],
    addEditNews: object,
    editData: [],
    addNewsResult: [],
    news_expire_date: "",
    news_expire_time: "",
    expire_date: null,
    expire_time: null,
    notificationResult: [],
    deleteNews: [],
    newExpiryDate : null,
    newExpiryTime : null,
    newsBody : null
};

function liveScoreNewsState(state = initialState, action) {
    switch (action.type) {

        //LIVESCORE News LIST
        case ApiConstants.API_LIVE_SCORE_NEWS_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_NEWS_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                liveScoreNewsListData: action.result,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_NEWS_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status

            };
        case ApiConstants.API_LIVE_SCORE_NEWS_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_ADD_NEWS_DETAILS:
            let news_data = action.addNewItemDetail
            let authorData = JSON.parse(getLiveScoreCompetiton())
         
            state.addEditNews = news_data
            state.addEditNews["author"] = authorData.longName
         
            state.news_expire_date = moment(news_data.news_expire_date).format("YYYY-MM-DD")
            state.expire_date = moment(news_data.news_expire_date,"YYYY-MM-DD")
            state.newExpiryDate = moment(news_data.news_expire_date, "YYYY-MM-DD")
            state.expire_time = news_data.news_expire_date
            state.newExpiryTime = news_data.news_expire_date
           
    
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_REFRESH_NEWS:
            let emptyData = object
            state.addEditNews = emptyData
            state.addEditNews['recipients'] = []
            state.expire_date = null
            state.expire_time = null
            state.news_expire_date = null

            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_UPDATE_NEWS:
            
            let news_object = state.addEditNews
            let dateFormat = null
            let utcTimestamp = null
            if (action.key === "expire_date") {
                state[action.key] = action.data
                state.newExpiryDate =  moment(action.data , "YYYY-MM-DD")
                state.news_expire_date  = moment(action.data).format("YYYY-MM-DD")
                // state.addEditNews['news_expire_date'] = action.data + " " + state['expire_time']

                // if (state.expire_time) {
                //     dateFormat = moment(state.expire_date).format('MM/DD/YYYY') + " " + state.expire_time
                //     utcTimestamp = new Date(dateFormat).toISOString();

                //     state.addEditNews['news_expire_date'] = utcTimestamp
                // }

            } else if (action.key === "expire_time") {

                state[action.key] = action.data


                // if (state.expire_date) {
                //     dateFormat = moment(state.expire_date).format('MM/DD/YYYY') + " " + state.expire_time
                // }
                // utcTimestamp = new Date(dateFormat).toISOString();
                // state.addEditNews['news_expire_date'] = utcTimestamp

            }else if(action.key == "body"){
                console.log(action.data)
                state.newsBody = action.data
            } 
            else {
                state.addEditNews[action.key] = action.data
            }

            return {
                ...state
            }

        case ApiConstants.API_LIVE_SCORE_ADD_NEWS_LOAD:
            return {
                ...state, onLoad_2: true
            }
        case ApiConstants.API_LIVE_SCORE_ADD_NEWS_SUCCESS:
            // history.push('/liveScoreNewsList')
            let data = action.result
            return {
                ...state,
                onLoad_2: false,
                addNewsResult: action.result,
                status: action.status
            };
        case ApiConstants.API_NEWS_SAGA_FAIL:
            return {
                ...state,
                onLoad_2: false,
                notifyLoad: false,
                error: action.error,
                status: action.status,
                onLoad: false,
            };
        case ApiConstants.API_NEWS_SAGA_ERROR:
            return {
                ...state,
                onLoad_2: false,
                notifyLoad: false,
                error: action.error,
                status: action.status,
                onLoad: false,
            };

        case ApiConstants.API_LIVESCORE_NEWS_NOTIFICATION_LOAD:
            return { ...state, onLoad_2: true, notifyLoad: true };

        case ApiConstants.API_LIVESCORE_NEWS_NOTIFICATION_SUCCESS:
            return {
                ...state,
                onLoad_2: false,
                notifyLoad: false,
                notificationResult: action.result,
                error: null,
                status: action.status
            }


        case ApiConstants.API_LIVESCORE_DELETE_NEWS_LOAD:
            return { ...state, onLoad_2: true, notifyLoad: true }

        case ApiConstants.API_LIVESCORE_DELETE_NEWS_SUCCESS:
            return {
                ...state,
                onLoad_2: false,
                notifyLoad: false,
                deleteNews: action.result,
                error: null,
                status: action.status
            }


        case ApiConstants.API_DEFAULT_NEWS_IMAGE_VIDEO:
            console.log(action.payload)
            
            return {
                ...state,
                addEditNews: {
                    // ...state.addEditNews,
                    newsImage: action.payload.newsImage,
                    newsVideo: action.payload.newsVideo,
                    author: action.payload.author
                }
            }

        default:
            return state;
    };
}

export default liveScoreNewsState;
