// import { DataManager } from './../../Components';
import http from "./liveScorehttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";
import { getCompetitonId, getLiveScoreCompetiton } from '../../../util/sessionStorage';

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
let userId = getUserId();

let LiveScoreAxiosApi = {
    livescoreMatchDetails(data) {
        const url = `/matches/admin/${data}`
        console.log(url)
        return Method.dataGet(url, null)
    },
    liveScoreGetDivision(data) {
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/division?competitionId=${id}`
        return Method.dataGet(url, null)
    },
    liveScoreGetAffilate(data) {
        const url = `clubs?name=${data.name}&competitionId=${data.id}`
        return Method.dataGet(url, null)
    },
    liveScoreAddNewTeam(data) {
        const url = '/teams/add'
        return Method.dataPost(url, null, data)
    },
    liveScoreSettingPost(data) {
        const venueString = JSON.stringify(data.venue)
        const url = `competitions?venues=${venueString}`
        return Method.dataPost(url, null, data.body)
    },
    liveScoreSettingView(data) {
        const url = `/Competitions/id/${data}`;
        return Method.dataGet(url, null)

    },
    liveScoreCompetitionDelete(data) {
        const url = `/competitions/id/${data}`
        // return { status: 1 }
        return Method.dataDelete(url, localStorage.token)
    },
    liveScoreCompetition(data) {
        const url = '/competitions/admin';
        return Method.dataPost(url, null, data)
    },
    liveScorePlayerList(competitionID) {
        var url = `/players?competitionId=${competitionID}`;
        return Method.dataGet(url, localStorage.token);
    },

    // liveScoreDivision(competitionID) {
    //     var url = `/division?competitionId=${competitionID}`;
    //     return Method.dataGet(url, localStorage.token);
    // },

    // liveScoreLadderDivision(competitionID) {
    //     var url = `/division?competitionId=${competitionID}`;
    //     return Method.dataGet(url, token)
    // },

    liveScoreLadderList(divisionId, competitionID) {
        var url = `/teams/ladder?divisionIds=${divisionId}&competitionIds=${competitionID}`;
        return Method.dataGet(url, localStorage.token)
    },

    liveScoreMatchList(competitionID, start) {
        var url = `/matches?competitionId=${competitionID}&start=${start}`;
        return Method.dataGet(url, localStorage.token)
    },

    liveScoreTeam(competitionID) {
        var url = `/teams/list?competitionId=${competitionID}`;
        return Method.dataGet(url, localStorage.token)
    },

    liveScoreRound(competitionID) {
        var url = `/round?competitionId=${competitionID}`;
        return Method.dataGet(url, localStorage.token)
    },
    liveScoreCreateRound(roundName, sequence, competitionID, divisionId) {
        let body = JSON.stringify(
            {
                "name": roundName,
                "sequence": sequence,
                "competitionId": competitionID,
                "divisionId": divisionId,
            }
        )
        var url = "/round";
        return Method.dataPost(url, localStorage.token, body)
    },

    liveScoreAddEditMatch(id) {
        var url = `/matches/id/${id}`;
        return Method.dataGet(url, localStorage.token)
    },

    liveScoreIncidentList(competitionID) {
        var url = `/incident?competitionId=${competitionID}`;
        return Method.dataGet(url, token)
    },

    liveScoreCreateMatch(data, competitionId) {

        console.log(data, 'liveScoreCreateMatch')

        let body = {
            "id": data.id ? data.id : 0,
            "startTime": data.startTime,
            "divisionId": data.divisionId,
            "type": data.type,
            "competitionId": 1,
            "mnbMatchId": data.mnbMatchId,
            "team1Id": data.team1id,
            "team2Id": data.team2id,
            "venueCourtId": data.venueId,
            "roundId": data.roundId,
            "matchDuration": data.matchDuration,
            "mainBreakDuration": data.mainBreakDuration,
            // "breakDuration": data.breakDuration,
            "team1Score": data.team1Score,
            "team2Score": data.team2Score,
            // "breakDuration": data.breakDuration
        }

        let url = `/matches`
        return Method.dataPost(url, token, body)
    },

    liveScoreBannerList(competitionID) {
        // var url = `/banners?&competitionIds=${competitionID}&pageType=${1}`;
        // let competitionId = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/banners?&competitionIds=${id}`;
        return Method.dataGet(url, token)
    },

    liveScoreAddBanner(competitionID, bannerImage, showOnHome, showOnDraws, showOnLadder, bannerLink, bannerId) {
        console.log(bannerLink, 'bannerLinkbannerLink')
        let competitionId = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        let body = new FormData();
        if (bannerImage !== null) {
            body.append("bannerImage", bannerImage)
        }
        body.append('competitionId', id)
        body.append('showOnHome', showOnHome)
        body.append('id', bannerId)
        body.append("showOnDraws", showOnDraws)
        body.append("showOnLadder", showOnLadder)
        body.append('bannerLink', bannerLink)
        var url = `/banners?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreRemoveBanner(bannerId) {
        var url = "/banners/id/" + bannerId;
        return Method.dataDelete(url, token)
    },

    liveScoreNewsList() {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        // var url = `/news?&competitionIds=${competitionId}`;
        var url = `/news/admin?&entityId=${id}&entityTypeId=1`;
        return Method.dataGet(url, token)
    },
    liveScoreAddNews(data, imageData, newsId) {
        let mediaArray = [imageData]
        let body = new FormData();
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const authorData = JSON.parse(getLiveScoreCompetiton())
        body.append('id', newsId ? newsId : 0)
        body.append('title', data.title)
        body.append('body', data.body);
        body.append("entityId", id);
        body.append("author", data.author ? data.author : authorData.longName);
        body.append("recipients", data.recipients);
        body.append("news_expire_date", data.news_expire_date);
        body.append("recipientRefId", 12)
        //body.append("id", 20)
        // body.append("newsMedia", imageData)
        body.append("entityTypeId", 1)
        if (imageData !== []) {
            for (let i in imageData)
                body.append("newsMedia", imageData[i])
        }
        let url = null;
        url = "/news";
        return Method.dataPost(url, token, body)
    },

    liveScoreGoalList(data, goaltype) {
        if (goaltype === "By Match") {
            let competitionID = localStorage.getItem("competitionId");
            let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
            var url = `/stats/scoringByPlayer?&competitionId=${id}&aggregate=MATCH`
            return Method.dataGet(url, token)
        }
        if (goaltype === "Total") {
            let competitionID = localStorage.getItem("competitionId");
            let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
            var url = `/stats/scoringByPlayer?&competitionId=${id}&aggregate=ALL`
            return Method.dataGet(url, token)
        }
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/stats/scoringByPlayer?&competitionId=${id}`;

    },
    liveScoreManagerList(roleId, entityTypeId, entityId) {
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/users/byRole?roleId=${roleId}&entityTypeId=${entityTypeId}&entityId=${id}`;
        return Method.dataGet(url, token)
    },
    liveScoreScorerList(comID, roleId, body) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/roster/admin?competitionId=${id}&roleId=${roleId}`;
        return Method.dataPost(url, token, body)
    },

    bulkMatchPushBack(data, startTime, endTime) {
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/matches/bulk/time?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&type=${"backward"}&venueId=${data.venueId}`;
        return Method.dataPost(url, token)
    },
    liveScoreBringForward(competition_ID, data, startDate, endDate) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/matches/bulk/time?startTimeStart=${startDate}&startTimeEnd=${endDate}&competitionId=${id}&type=${"forward"}&venueId=${data.venueId}`;
        return Method.dataPost(url, token)
    },

    liveScoreEndMatches(data, startTime, endTime) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/matches/bulk/end?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&venueId=${data.venueId}`;
        return Method.dataPost(url, token)
    },
    liveScoreDoubleHeader(data) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/matches/bulk/doubleheader?competitionId=${id}&round1=${data.round_1}&round2=${data.round_2}`
        return Method.dataPost(url, token)
    },
    liveScoreAddEditPlayer(data, playerId, playerImage) {

        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        let body = new FormData();
        body.append('id', playerId ? playerId : 0)
        body.append('firstName', data.firstName)
        body.append('lastName', data.lastName);
        body.append("dateOfBirth", data.dateOfBirth);
        body.append("phoneNumber", data.phoneNumber);
        body.append("mnbPlayerId", data.mnbPlayerId);
        body.append("teamId", data.teamId);
        body.append("competitionId", id)

        if (playerImage) {
            body.append("photo", playerImage)
        }
        // if (imageData !== []) {
        //     for (let i in imageData)
        //         body.append("photo", imageData[i])
        // }
        var url = "/players";
        return Method.dataPost(url, localStorage.token, body)
    },

    liveScoreDashboard() {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/dashboard/newsIncidentMatch?competitionId=${id}`;
        return Method.dataGet(url, token)
    },

    liveScoreAddEditManager(data, teamId, exsitingManagerId) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        let body = {
            "firstName": data.firstName,
            "lastName": data.lastName,
            "mobileNumber": data.mobileNumber,
            "email": data.email
        }
        if (exsitingManagerId) {
            let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
            var url = `/users/manager?teamId=${teamId}&userId=${exsitingManagerId}&competitionId=${id}`;
            return Method.dataPost(url, token)
        } else {
            let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
            var url = `/users/manager?teamId=${teamId}&userId=${userId}&competitionId=${id}`;
            return Method.dataPost(url, token, body)
        }
    },

    // deleta match
    liveScoreDeleteMatch(matchId) {
        var url = `/matches/id/${matchId}`;
        return Method.dataDelete(url, token)
    },

    // view team
    liveScoreTeamViewPlayerList(teamId) {
        var url = `/teams/id/${teamId}`;
        return Method.dataGet(url, token)
    },

    // delete team
    liveScoreDeleteTeam(teamId) {
        var url = `/teams/id/${teamId}`;
        return Method.dataDelete(url, token)
    },

    /// fetch competition venue 

    liveScoreCompetitionVenue(competitionId) {
        var url = `/api/venue/competitionmgmnt${competitionId}`;
        return Method.dataGet(url, token)
    },

    //publish and notify
    liveScorePublish_Notify(data, value) {
        let body = {
            "title": data.title,
            "entityId": data.entityId,
            "entityTypeId": data.entityTypeId,
            "id": data.id
        }
        var url = `/news?id=${data.id}&silent=${value}`
        return Method.dataPost(url, token, body)
    },

    /// delete news
    liveScoreDeleteNews(id) {
        var url = `/news/id/${id}`
        return Method.dataDelete(url, token)
    },

    //create/edit division
    liveScoreCreateDivision(name, divisionName, gradeName, competitionId, divisionId) {

        let body = {
            "name": name,
            "divisionName": divisionName,
            "grade": gradeName,
            "competitionId": competitionId,
            "id": divisionId,
        }

        let url = `/division`
        return Method.dataPost(url, token, body)
    },
    // delete division
    liveScoreDeleteDivision(divisionId) {
        var url = `/division/id/${divisionId}`;
        return Method.dataDelete(url, token)
    },

    /// get Game Time statistics api
    gameTimeStatistics(competitionId, aggregate, offset) {
        let Body = {
            "paging": {
                "limit": 10,
                "offset": `${offset}`
            }
        }
        var url = `/stats/gametime?competitionId=${competitionId}&aggregate=${aggregate.toUpperCase()}`;
        return Method.dataPost(url, localStorage.token, Body)
    },
    ///live score match result
    liveScoreMatchResult() {
        var url = `/ref/matchResult`
        return Method.dataGet(url, localStorage.token)
    },
    /// get Game Time statistics api
    umpiresList(competitionId, offset) {
        let Body = {
            "paging": {
                "limit": 10,
                "offset": `${offset}`
            }
        }
        var url = `/matchUmpires/admin?competitionId=${competitionId}`;
        return Method.dataPost(url, token, Body)
    },

    liveScoreAbandonMatch(data, startTime, endTime) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/matches/bulk/end?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&resultTypeId=${data.resultType}&venueId=${data.venueId}`;
        return Method.dataPost(url, token)
    },

    liveScoreMatchImport(competitionId, csvFile) {

        let body = new FormData();

        // body.append('file', new File([csvFile], { type: 'text/csv' }));
        body.append("file", csvFile, csvFile.name);

        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/matches/import?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    getLiveScoreScorerList(comID, roleId, body) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/roster/users?competitionId=${id}&roleId=${roleId}`;
        return Method.dataGet(url, token, body)
    },

    liveScoreTeamImport(data) {

        let body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", data.csvFile, data.csvFile.name);

        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/teams/import?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreDivisionImport(data) {
        let body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", data.csvFile, data.csvFile.name);


        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        var url = `/division/import?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreAttendanceList(competitionId, body) {
        let url = `/players/activity?competitionId=${competitionId}`
        return Method.dataPost(url, token, body)
    },
    liveScoreGetTeamData(teamId) {
        var url = `/teams/id/${teamId}`;
        return Method.dataGet(url, token)
    }

};


const Method = {
    async dataPost(newurl, authorization, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .post(url, body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: "BWSA " + authorization
                    }
                })

                .then(result => {

                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {

                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {

                    if (err.response) {

                        if (err.response.status !== null || err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else if (err.response.status == 400) {
                                message.config({
                                    duration: 1.5,
                                    maxCount: 1,
                                });
                                message.error(err.response.data.message)
                                return reject({
                                    status: 5,
                                    error: err.response.data.message
                                });
                            }
                            else {
                                return reject({

                                    status: 5,
                                    error: err.response && err.response.data.message
                                });

                            }
                        }
                    }
                    else {
                        console.log(err.response, 'catch')
                        return reject({
                            status: 5,
                            error: err.response && err.response.data.message
                        });

                    }
                });
        });
    },



    // Method to GET response

    async dataGet(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .get(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "BWSA " + authorization,
                        "Access-Control-Allow-Origin": "*"
                    }
                })

                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {
                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                        }
                    }
                    else {
                        return reject({
                            status: 5,
                            error: err
                        });

                    }
                });
        });
    },

    async dataDelete(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .delete(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "BWSA " + authorization,
                        "Access-Control-Allow-Origin": "*"
                    }
                })

                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {
                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                        }
                    }
                    else {
                        return reject({
                            status: 5,
                            error: err
                        });

                    }
                });
        });
    }
};
export default LiveScoreAxiosApi;
