import ApiConstants from 'themes/apiConstants';

// Banners action
function getliveScoreBanners(competitionID, organisationID = null) {
    return {
        type: ApiConstants.API_LIVE_SCORE_BANNERS_LOAD,
        competitionID,
        organisationID,
    };
}

// Banners Add
function liveScoreAddBanner(organisationID, competitionID, bannerImage, showOnHome, showOnDraws, showOnLadder, showOnNews, showOnChat, format, bannerLink, bannerId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_BANNER_LOAD,
        organisationID,
        competitionID,
        bannerImage,
        showOnHome,
        showOnDraws,
        showOnLadder,
        showOnNews,
        showOnChat,
        format,
        bannerLink,
        bannerId,
    };
}

// Banners Add
function liveScoreRemoveBanner(bannerId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_REMOVE_BANNER_LOAD,
        bannerId,
    };
}

function liveScoreAddBannerUpdate(data, key) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_BANNER_UPDATE,
        data,
        key,
    };
}

function clearEditBannerAction() {
    return {
        type: ApiConstants.API_LIVE_SCORE_CLEAR_BANNER_REDUCER,
    };
}

export {
    getliveScoreBanners,
    liveScoreAddBanner,
    liveScoreRemoveBanner,
    liveScoreAddBannerUpdate,
    clearEditBannerAction,
};
