import ApiConstants from "../../../themes/apiConstants";

//Banners action
function getliveScoreBanners(competitionID) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_BANNERS_LOAD,
        competitionID: competitionID,
    };

    return action;
}

//Banners Add
function liveScoreAddBanner(competitionID, bannerImage, showOnHome, showOnDraws, showOnLadder, showOnNews, showOnChat, format, bannerLink, bannerId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_BANNER_LOAD,
        competitionID: competitionID,
        bannerImage: bannerImage,
        showOnHome: showOnHome,
        showOnDraws: showOnDraws,
        showOnLadder: showOnLadder,
        showOnNews: showOnNews,
        showOnChat: showOnChat,
        format: format,
        bannerLink: bannerLink,
        bannerId: bannerId
    };

    return action;
}

//Banners Add
function liveScoreRemoveBanner(bannerId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_REMOVE_BANNER_LOAD,
        bannerId: bannerId
    };

    return action;
}

function liveScoreAddBannerUpdate(data, key) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_BANNER_UPDATE,
        data,
        key,
    };

    return action;
}

function clearEditBannerAction() {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_CLEAR_BANNER_REDUCER
    };

    return action;
}

export {
    getliveScoreBanners,
    liveScoreAddBanner,
    liveScoreRemoveBanner,
    liveScoreAddBannerUpdate,
    clearEditBannerAction
};
