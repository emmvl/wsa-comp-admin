import { message } from "antd";

import http from "./liveScoreHttp";
import ValidationConstants from "../../../themes/validationConstant";
import { getUserId, getAuthToken, getLiveScoreCompetiton } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { isArrayNotEmpty } from "../../../util/helpers";
import { regexNumberExpression } from "../../../util/helpers";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
// let userId = getUserId();

function checlfixedDurationForBulkMatch(data) {
    let url = ""

    if (data.hours || data.minutes || data.seconds) {
        if (data.hours && data.minutes && data.seconds) {
            url = `&hours=${data.hours}&minutes=${data.minutes}&seconds=${data.seconds}`;
        } else if (data.hours && data.minutes) {
            url = `&hours=${data.hours}&minutes=${data.minutes}`;
        } else if (data.hours && data.seconds) {
            url = `&hours=${data.hours}&seconds=${data.seconds}`;
        } else if (data.minutes && data.seconds) {
            url = `&minutes=${data.minutes}&seconds=${data.seconds}`;
        } else if (data.hours) {
            url = `&hours=${data.hours}`;
        } else if (data.minutes) {
            url = `&minutes=${data.minutes}`;
        } else {
            url = `&seconds=${data.seconds}`;
        }
    }

    return url
}

function checkVenueCourdId(data) {
    let courtId = isArrayNotEmpty(data.courtId) ? data.courtId : []
    let url
    if (data.venueId) {
        if (data.venueId && courtId.length > 0) {
            url = `&venueId=${data.venueId}&courtId=${data.courtId}`;
        } else {
            url = `&venueId=${data.venueId}`;
        }
    } else {
        url = null
    }

    return url
}

let LiveScoreAxiosApi = {
    livescoreMatchDetails(data, isLineup) {
        let url = `/matches/admin/${data}?lineups=${isLineup}`
        // let url = `/matches/admin/${data}`
        return Method.dataGet(url, null)
    },

    liveScoreGetDivision(data, compKey, sortBy, sortOrder) {
        let url = null
        if (compKey) {
            url = `/division?competitionKey=${compKey}`
        } else {
            url = `/division?competitionId=${data}`
        }

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataGet(url, null)
    },

    liveScoreGetAffilate(data) {
        let url = ''
        if (data.name) {
            url = `organisation/name=${data.name}&competitionId=${data.id}`
        } else {
            url = `organisation?competitionId=${data.id}`
        }
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
        const url = `/competitions/id/${data}`;
        return Method.dataGet(url, null)
    },

    liveScoreCompetitionDelete(data) {
        const url = `/competitions/id/${data}`
        return Method.dataDelete(url, localStorage.token)
    },

    liveScoreCompetition(data, year, orgKey, recordUmpireTypes, sortBy, sortOrder) {
        console.log(data, year, orgKey, recordUmpireTypes, sortBy, sortOrder)
        let url = null;
        if (orgKey) {
            if (recordUmpireTypes) {
                url = `/competitions/admin?organisationId=${orgKey}&recordUmpireType=${recordUmpireTypes}`;
            } else {
                url = `/competitions/admin?organisationId=${orgKey}`;
            }
        } else {
            url = `/competitions/admin`;
        }

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        if (data) {
            return Method.dataPost(url, null, data)
        } else {
            return Method.dataPost(url, null)
        }
    },

    liveScorePlayerList(competitionID) {
        const url = `/players?competitionId=${competitionID}`;
        return Method.dataGet(url, localStorage.token);
    },

    // liveScoreDivision(competitionID) {
    //     const url = `/division?competitionId=${competitionID}`;
    //     return Method.dataGet(url, localStorage.token);
    // },

    // liveScoreLadderDivision(competitionID) {
    //     const url = `/division?competitionId=${competitionID}`;
    //     return Method.dataGet(url, token)
    // },

    liveScoreLadderList(divisionId, competitionID, compKey) {
        // let url = null
        // if (compKey) {
        //     url = `/teams/ladder?divisionIds=${divisionId}&competitionKey=${compKey}`;
        // } else {
        //     url = `/teams/ladder?divisionIds=${divisionId}&competitionIds=${competitionID}`;
        // }

        // return Method.dataGet(url, localStorage.token)

        let payload = {
            competitionId: compKey,
            divisionId: divisionId
        }

        let url = `/teams/ladder/web`
        return Method.dataPost(url, localStorage.token, payload)
    },

    liveScoreMatchList(competitionID, start, offset, search, divisionId, roundName, teamId, sortBy, sortOrder) {
        let url;

        if (teamId !== undefined) {
            url = `/matches?competitionId=${competitionID}&divisionIds=${divisionId}&teamIds=${teamId}`;
        } else if (divisionId && roundName) {
            url = `/matches?competitionId=${competitionID}&start=${start}&offset=${offset}&limit=${10}&search=${search}&divisionIds=${divisionId}&roundName=${roundName}`;
        } else if (divisionId) {
            url = `/matches?competitionId=${competitionID}&start=${start}&offset=${offset}&limit=${10}&search=${search}&divisionIds=${divisionId}`;
        } else if (roundName) {
            url = `/matches?competitionId=${competitionID}&start=${start}&offset=${offset}&limit=${10}&search=${search}&roundName=${roundName}`;
        } else {
            url = `/matches?competitionId=${competitionID}&start=${start}&offset=${offset}&limit=${10}&search=${search}`;
        }

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataGet(url, localStorage.token)
    },

    liveScoreMatchSheetDownloadList(competitionId) {
        const url = `/matches/downloads?competitionId=${competitionId}`;
        return Method.dataGet(url, token)
    },

    liveScoreTeam(competitionID, divisionId) {
        let url;
        if (divisionId) {
            url = `/teams/list?competitionId=${competitionID}&divisionId=${divisionId}&includeBye=1`;
        } else {
            url = `/teams/list?competitionId=${competitionID}`;
        }
        return Method.dataGet(url, localStorage.token)
    },

    liveScoreRound(competitionID, divisionId) {
        let url;
        if (divisionId) {
            url = `/round?competitionId=${competitionID}&divisionId=${divisionId}`;
        } else {
            url = `/round?competitionId=${competitionID}`;
        }

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

        const url = "/round";
        return Method.dataPost(url, localStorage.token, body)
    },

    liveScoreAddEditMatch(id) {
        const url = `/matches/id/${id}`;
        return Method.dataGet(url, localStorage.token)
    },

    liveScoreIncidentList(competitionID, search) {
        const url = `/incident?competitionId=${competitionID}&search=${search}`;
        return Method.dataGet(url, token)
    },

    liveScoreCreateMatch(data, competitionId, key, isEdit, team1resultId, team2resultId, matchStatus, endTime, umpireArr, scorerData, recordUmpireType) {
        let body;

        if (recordUmpireType === 'NAMES') {
            if (isEdit) {
                body = {
                    "id": data.id ? data.id : 0,
                    "startTime": data.startTime,
                    "divisionId": data.divisionId,
                    "type": data.type,
                    "competitionId": competitionId,
                    "mnbMatchId": data.mnbMatchId,
                    "team1Id": data.team1id,
                    "team2Id": data.team2id,
                    "venueCourtId": data.venueId,
                    "roundId": data.roundId,
                    "matchDuration": data.matchDuration,
                    "mainBreakDuration": data.mainBreakDuration,
                    "breakDuration": (data.type === 'TWO_HALVES' || data.type === 'SINGLE') ? data.mainBreakDuration : data.qtrBreak,
                    "team1Score": data.team1Score,
                    "team2Score": data.team2Score,
                    "resultStatus": data.resultStatus,
                    "team1ResultId": team1resultId,
                    "team2ResultId": team2resultId,
                    "matchStatus": matchStatus,
                    "endTime": endTime,
                    "matchUmpires": umpireArr,
                    "rosters": scorerData
                    // "breakDuration": data.breakDuration
                }
            } else {
                body = {
                    "id": data.id ? data.id : 0,
                    "startTime": data.startTime,
                    "divisionId": data.divisionId,
                    "type": data.type,
                    "competitionId": competitionId,
                    "mnbMatchId": data.mnbMatchId,
                    "team1Id": data.team1id,
                    "team2Id": data.team2id,
                    "venueCourtId": data.venueId,
                    "roundId": data.roundId,
                    "matchDuration": data.matchDuration,
                    "mainBreakDuration": data.mainBreakDuration,
                    "breakDuration": (data.type === 'TWO_HALVES' || data.type === 'SINGLE') ? data.mainBreakDuration : data.qtrBreak,
                    "team1Score": data.team1Score,
                    "team2Score": data.team2Score,
                    "matchUmpires": umpireArr,
                    "rosters": scorerData
                    // "breakDuration": data.breakDuration
                }
            }
        } else {
            if (isEdit) {
                body = {
                    "id": data.id ? data.id : 0,
                    "startTime": data.startTime,
                    "divisionId": data.divisionId,
                    "type": data.type,
                    "competitionId": competitionId,
                    "mnbMatchId": data.mnbMatchId,
                    "team1Id": data.team1id,
                    "team2Id": data.team2id,
                    "venueCourtId": data.venueId,
                    "roundId": data.roundId,
                    "matchDuration": data.matchDuration,
                    "mainBreakDuration": data.mainBreakDuration,
                    "breakDuration": (data.type === 'TWO_HALVES' || data.type === 'SINGLE') ? data.mainBreakDuration : data.qtrBreak,
                    "team1Score": data.team1Score,
                    "team2Score": data.team2Score,
                    "resultStatus": data.resultStatus,
                    "team1ResultId": team1resultId,
                    "team2ResultId": team2resultId,
                    "matchStatus": matchStatus,
                    "endTime": endTime,
                    "rosters": umpireArr,
                    // "scorers": scorerData
                    // "breakDuration": data.breakDuration
                }
            } else {
                body = {
                    "id": data.id ? data.id : 0,
                    "startTime": data.startTime,
                    "divisionId": data.divisionId,
                    "type": data.type,
                    "competitionId": competitionId,
                    "mnbMatchId": data.mnbMatchId,
                    "team1Id": data.team1id,
                    "team2Id": data.team2id,
                    "venueCourtId": data.venueId,
                    "roundId": data.roundId,
                    "matchDuration": data.matchDuration,
                    "mainBreakDuration": data.mainBreakDuration,
                    "breakDuration": (data.type === 'TWO_HALVES' || data.type === 'SINGLE') ? data.mainBreakDuration : data.qtrBreak,
                    "team1Score": data.team1Score,
                    "team2Score": data.team2Score,
                    "rosters": umpireArr,
                    // "scorers": scorerData
                    // "breakDuration": data.breakDuration
                }
            }
        }

        const url = `/matches`
        return Method.dataPost(url, token, body)
    },

    liveScoreBannerList(competitionID) {
        // var url = `/banners?&competitionIds=${competitionID}&pageType=${1}`;
        // let competitionId = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/banners?competitionIds=${id}`;
        return Method.dataGet(url, token)
    },

    liveScoreAddBanner(competitionID, bannerImage, showOnHome, showOnDraws, showOnLadder, showOnNews, showOnChat, format, bannerLink, bannerId) {
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        let body = new FormData();
        if (bannerImage !== null) {
            body.append("bannerImage", bannerImage)
        }
        body.append('competitionId', id)
        body.append('id', bannerId)
        body.append('showOnHome', showOnHome)
        body.append("showOnDraws", showOnDraws)
        body.append("showOnLadder", showOnLadder)
        body.append("showOnNews", showOnNews)
        body.append("showOnChat", showOnChat)
        body.append('format', format)
        body.append('bannerLink', bannerLink)
        const url = `/banners?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreRemoveBanner(bannerId) {
        const url = "/banners/id/" + bannerId;
        return Method.dataDelete(url, token)
    },

    liveScoreNewsList(competitionId) {
        const url = `/news/admin?entityId=${competitionId}&entityTypeId=1`;
        return Method.dataGet(url, token)
    },

    liveScoreAddNews(data) {
        let body = new FormData();
        let authorData = null

        if (JSON.parse(getLiveScoreCompetiton())) {
            authorData = JSON.parse(getLiveScoreCompetiton())
        }

        body.append('id', data.newsId ? data.newsId : 0)
        body.append('title', data.editData.title)
        body.append('body', data.editData.body);
        body.append("entityId", data.compId);
        body.append("author", data.editData.author ? data.editData.author : authorData ? authorData.longName : 'World sport actioa');
        body.append("recipients", data.editData.recipients);
        body.append("news_expire_date", data.editData.news_expire_date);
        body.append("recipientRefId", 12)
        body.append("entityTypeId", 1)

        if (data.newsImage) {
            body.append("newsImage", data.newsImage)
        }

        if (data.newsVideo) {

            body.append("newsVideo", data.newsVideo)
        }


        if (data.mediaArry !== []) {
            for (let i in data.mediaArry) {
                body.append(`newsMedia`, data.mediaArry[i]);
            }
        }

        let url = null;
        url = "/news";
        return Method.dataPost(url, token, body)
    },

    liveScoreGoalList(compId, goaltype, search, offset, sortBy, sortOrder) {
        let url = null
        if (goaltype === "By Match") {
            url = `/stats/scoringByPlayer?competitionId=${compId}&aggregate=MATCH&search=${search}&offset=${offset}&limit=${10}`
        } else if (goaltype === "Total") {
            url = `/stats/scoringByPlayer?competitionId=${compId}&aggregate=ALL&search=${search}&offset=${offset}&limit=${10}`
        }

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataGet(url, token)
    },

    liveScoreManagerList(roleId, entityTypeId, entityId) {
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/users/byRole?roleId=${roleId}&entityTypeId=${entityTypeId}&entityId=${id}`;
        return Method.dataGet(url, token)
    },

    liveScoreScorerList(comID, roleId, body, search, sortBy, sortOrder) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))

        let url = `/roster/admin?competitionId=${id}&roleId=${roleId}`;
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataPost(url, token, body)
    },

    bulkMatchPushBack(data, startTime, endTime, bulkRadioBtn, formatedNewDate) {
        let url = ''
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))

        let extendParam = checkVenueCourdId(data)

        if (bulkRadioBtn === 'specificTime') {
            if (extendParam) {
                url = `/matches/bulk/time?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&type=${"backward"}&newDate=${formatedNewDate}` + extendParam;
            } else {
                url = `/matches/bulk/time?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&type=${"backward"}&newDate=${formatedNewDate}`;
            }
        } else {
            let HMS = checlfixedDurationForBulkMatch(data)
            if (extendParam) {
                url = `/matches/bulk/time?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&type=${"backward"}` + HMS + extendParam;
            } else {
                url = `/matches/bulk/time?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&type=${"backward"}` + HMS;
            }
        }

        return Method.dataPost(url, token)
    },

    liveScoreBringForward(competition_ID, data, startDate, endDate, bulkRadioBtn, formatedNewDate) {
        let url = ''
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        let extendParam = checkVenueCourdId(data)

        if (bulkRadioBtn === 'specificTime') {
            if (extendParam) {
                url = `/matches/bulk/time?startTimeStart=${startDate}&startTimeEnd=${endDate}&competitionId=${id}&type=${"forward"}&newDate=${formatedNewDate}` + extendParam;
            } else {
                url = `/matches/bulk/time?startTimeStart=${startDate}&startTimeEnd=${endDate}&competitionId=${id}&type=${"forward"}&newDate=${formatedNewDate}`;
            }
        } else {
            let HMS = checlfixedDurationForBulkMatch(data)
            if (extendParam) {
                url = `/matches/bulk/time?startTimeStart=${startDate}&startTimeEnd=${endDate}&competitionId=${id}&type=${"forward"}` + HMS + extendParam;
            } else {
                url = `/matches/bulk/time?startTimeStart=${startDate}&startTimeEnd=${endDate}&competitionId=${id}&type=${"forward"}` + HMS;
            }
        }
        return Method.dataPost(url, token)
    },

    liveScoreEndMatches(data, startTime, endTime) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))

        let extendParam = checkVenueCourdId(data)

        let url;
        if (extendParam) {
            url = `/matches/bulk/end?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}` + extendParam;
        } else {
            url = `/matches/bulk/end?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}`;
        }
        return Method.dataPost(url, token)
    },

    liveScoreDoubleHeader(data) {
        let competitionID = localStorage.getItem("competitionId");
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/matches/bulk/doubleheader?competitionId=${id}&round1=${data.round_1}&round2=${data.round_2}`
        return Method.dataPost(url, token)
    },

    liveScoreAddEditPlayer(data, playerId, playerImage) {
        // let competitionID = localStorage.getItem("competitionId");
        // let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        // let body = new FormData();
        // body.append('id', playerId ? playerId : 0)
        // body.append('firstName', data.firstName)
        // body.append('lastName', data.lastName);
        // body.append("dateOfBirth", data.dateOfBirth);
        // body.append("phoneNumber", data.phoneNumber);
        // body.append("mnbPlayerId", data.mnbPlayerId);
        // body.append("teamId", data.teamId);
        // body.append("competitionId", id)

        // if (playerImage) {
        //     body.append("photo", playerImage)
        // }
        const url = "/players";
        return Method.dataPost(url, localStorage.token, data)
    },

    liveScoreDashboard(competitionID, startDay, currentTime) {
        const url = `/dashboard/newsIncidentMatch?competitionId=${competitionID}&startDay=${startDay}&currentTime=${currentTime}`;
        return Method.dataGet(url, token)
    },

    async liveScoreAddEditManager(data, teamId, existingManagerId) {
        let body = data
        let userId = await getUserId()
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/users/manager?userId=${userId}&competitionId=${id}`;
        return Method.dataPost(url, token, body)

        // if (existingManagerId) {
        //     let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        //     const url = `/users/manager?userId=${existingManagerId}&competitionId=${id}`;
        //     return Method.dataPost(url, token)
        // } else {
        //     let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        //     const url = `/users/manager?userId=${userId}&competitionId=${id}`;
        //     return Method.dataPost(url, token, body)
        // }
    },

    // deleta match
    liveScoreDeleteMatch(matchId) {
        const url = `/matches/id/${matchId}`;
        return Method.dataDelete(url, token)
    },

    // view team
    liveScoreTeamViewPlayerList(teamId) {
        const url = `/teams/id/${teamId}`;
        return Method.dataGet(url, token)
    },

    // delete team
    liveScoreDeleteTeam(teamId) {
        const url = `/teams/id/${teamId}`;
        return Method.dataDelete(url, token)
    },

    /// fetch competition venue
    liveScoreCompetitionVenue(competitionId) {
        const url = `/api/venue/competitionmgmnt${competitionId}`;
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
        const url = `/news/publish?id=${data.id}&silent=${value}`
        return Method.dataGet(url, token, body)
    },

    /// delete news
    liveScoreDeleteNews(id) {
        const url = `/news/id/${id}`
        return Method.dataDelete(url, token)
    },

    //create/edit division
    liveScoreCreateDivision(name, divisionName, gradeName, competitionId, divisionId, positionTracking, recordGoalAttempts) {
        const body = {
            "name": name,
            "divisionName": divisionName,
            "grade": gradeName,
            "competitionId": competitionId,
            "id": divisionId,
            "positionTracking": positionTracking == "null" ? null : positionTracking,
            "recordGoalAttempts": recordGoalAttempts == "null" ? null : recordGoalAttempts
        }
        const url = `/division`
        return Method.dataPost(url, token, body)
    },

    // delete division
    liveScoreDeleteDivision(divisionId) {
        const url = `/division/id/${divisionId}`;
        return Method.dataDelete(url, token)
    },

    /// get Game Time statistics api
    gameTimeStatistics(competitionId, aggregate, offset, searchText, sortBy, sortOrder) {
        let Body = {
            "paging": {
                "limit": 10,
                "offset": `${offset}`
            },
            "search": searchText
        }
        let url
        if (aggregate) {
            url = `/stats/gametime?competitionId=${competitionId}&aggregate=${aggregate.toUpperCase()}`;
        } else {
            url = `/stats/gametime?competitionId=${competitionId}&aggregate=""`;
        }

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        return Method.dataPost(url, localStorage.token, Body)
    },

    ///live score match result
    liveScoreMatchResult() {
        const url = `/ref/matchResult`
        return Method.dataGet(url, localStorage.token)
    },

    /// get Game Time statistics api
    umpiresList(competitionId, body) {
        const url = `/matchUmpire/admin?competitionId=${competitionId}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreAbandonMatch(data, startTime, endTime) {
        let extendParam = checkVenueCourdId(data)
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'));
        let url;
        if (extendParam) {
            url = `/matches/bulk/end?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&resultTypeId=${data.resultType}` + extendParam;
        } else {
            url = `/matches/bulk/end?startTimeStart=${startTime}&startTimeEnd=${endTime}&competitionId=${id}&resultTypeId=${data.resultType}`
        }
        return Method.dataPost(url, token)
    },

    liveScoreMatchImport(competitionId, csvFile) {
        let body = new FormData();
        // body.append('file', new File([csvFile], { type: 'text/csv' }));
        body.append("file", csvFile, csvFile.name);

        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/matches/import?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    getLiveScoreScorerList(comID, roleId, body) {
        // let competitionID = localStorage.getItem("competitionId");
        // let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/roster/users?competitionId=${comID}&roleId=${roleId}`;
        return Method.dataGet(url, token, body)
    },

    liveScoreTeamImport(data) {
        let body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", data.csvFile, data.csvFile.name);

        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/teams/import?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreDivisionImport(data) {
        let body = new FormData();
        body.append("file", data.csvFile, data.csvFile.name);

        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/division/import?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreAttendanceList(competitionId, body, select_status) {
        let url
        if (select_status === 'All') {
            url = `/players/activity?competitionId=${competitionId}&status=${""}`
        } else {
            url = `/players/activity?competitionId=${competitionId}&status=${select_status}`
        }
        return Method.dataPost(url, token, body)
    },

    liveScoreGetTeamData(teamId) {
        const url = `/teams/id/${teamId}`;
        return Method.dataGet(url, token)
    },

    liveScorePlayerImport(competitionId, csvFile) {
        let body = new FormData();
        body.append("file", csvFile, csvFile.name);

        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/players/import?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreAddEditScorer(scorerData, existingScorerId, scorerRadioBtn) {
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))

        let body = null
        if (scorerRadioBtn === "new") {
            if (scorerData.id) {
                body = {
                    "id": scorerData.id,
                    "firstName": scorerData.firstName,
                    "lastName": scorerData.lastName,
                    "mobileNumber": regexNumberExpression(scorerData.mobileNumber),
                    "email": scorerData.email,
                }
            } else {
                body = {
                    "firstName": scorerData.firstName,
                    "lastName": scorerData.lastName,
                    "mobileNumber": regexNumberExpression(scorerData.contactNo),
                    "email": scorerData.emailAddress,
                }
            }
        } else if (scorerRadioBtn === "existing") {
            body = {
                "id": existingScorerId,
            }
        }

        const url = `/users/member?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    /// Assign Matches list
    getAssignMatchesList(competitionID, teamId, body) {
        let url;
        if (teamId) {
            url = `/matches/admin?competitionId=${competitionID}&teamId=${teamId}`;
        } else {
            url = `/matches/admin?competitionId=${competitionID}`;
        }

        return Method.dataPost(url, token, body)
    },

    //change assign status
    changeAssignStatus(roleId, records, teamID, teamKey, scorer_Id) {
        let body = JSON.stringify({
            "matchId": records.id,
            "roleId": roleId,
            "teamId": records[teamKey].id,
            "userId": scorer_Id
        })

        const url = `/roster/admin/assign`
        //  const url = `https://livescores-api-dev.worldsportaction.com/roster`;
        return Method.dataPost(url, token, body)
    },

    // Unassign status 
    unAssignMatcheStatus(records) {
        const url = `/roster/admin?id=${records.rosterId}`
        return Method.dataDelete(url, token)
    },

    // Match club list
    liveScoreClubList(competitionId) {
        const url = `/organisation?competitionId=${competitionId}`
        return Method.dataGet(url, token)
    },

    ladderSettingMatchResult() {
        const url = `/ref/matchResult`
        return Method.dataGet(url, token)
    },

    laddersSettingGetData(competitionId) {
        let { uniqueKey } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/competitions/ladderSettings?competitionId=${uniqueKey}`
        return Method.dataGet(url, token)
    },

    laddersSettingPostData(data) {
        let { uniqueKey } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        let body = data

        const url = `/competitions/ladderSettings?competitionId=${uniqueKey}`
        return Method.dataPost(url, token, body)
    },

    // Get Teams with pagination
    getTeamWithPagging(competitionID, offset, limit, search, sortBy, sortOrder) {
        let url = null
        if (search && search.length > 0) {
            url = `/teams/list?competitionId=${competitionID}&offset=${offset}&limit=${limit}&search=${search}`;
        } else {
            url = `/teams/list?competitionId=${competitionID}&offset=${offset}&limit=${limit}&search=${search}`;
        }

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataGet(url, localStorage.token)
    },

    /// Get Player list with paging
    getPlayerWithPaggination(competitionID, offset, limit, search, sortBy, sortOrder) {
        let url = null
        if (search && search.length > 0) {
            url = `/players/admin?competitionId=${competitionID}&offset=${offset}&limit=${limit}&search=${search}`;
        } else {
            url = `/players/admin?competitionId=${competitionID}&offset=${offset}&limit=${limit}&search=`;
        }

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataGet(url, localStorage.token);
    },

    //// Export Files
    exportFiles(url) {
        return Method.dataGetDownload(url, localStorage.token);
    },

    //// venue Change 
    venueChangeApi(competitionId, details, start, end) {
        let courtArray = JSON.stringify(details.courtId)
        let url = `/matches/bulk/courts?competitionId=${competitionId}&startTime=${start}&endTime=${end}&fromCourtIds=${courtArray}&toCourtId=${details.changeToCourtId}`
        let body = null
        return Method.dataPost(url, localStorage.token, body);
    },

    //Get Fixture Competition List
    getFixtureCompList(orgId) {
        const url = `/competitions/list?organisationId=${orgId}`
        return Method.dataGet(url, localStorage.token);
    },

    liveScoreAddCoach(data, teamId, exsitingManagerId) {
        let body = data
        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `/users/coach?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    addEditUmpire(data, teamId, exsitingManagerId) {
        let body = data
        let id = JSON.parse(localStorage.getItem('umpireCompetitionId'))
        const url = `/users/umpire?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    liveScoreCoachImport(data) {
        let body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", data.csvFile, data.csvFile.name);

        let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
        const url = `users/importCoach?competitionId=${id}`;
        return Method.dataPost(url, token, body)
    },

    umpireRoasterList(competitionID, status, refRoleId, paginationBody, sortBy,
        sortOrder) {
        let url = null
        let body = paginationBody

        if (status === "All") {
            url = `/roster/list?competitionId=${competitionID}&roleId=${refRoleId}`;
        }
        else {
            url = `/roster/list?competitionId=${competitionID}&status=${status}&roleId=${refRoleId}`;
        }
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        return Method.dataPost(url, token, body)
    },

    umpireRoasterActionPerform(data) {
        const url = `/roster?rosterId=${data.roasterId}&status=${data.status}&category=${data.category}`;
        return Method.dataPatch(url, token)
    },

    umpireRoasterDeleteAction(data) {
        const url = `/roster?id=${data.roasterId}`
        return Method.dataDelete(url, localStorage.token)
    },

    umpireListDashboard(data) {
        let body = data.pageData
        let url
        if (data.roundId) {
            const round = JSON.stringify(data.roundId)
            url = `/matchUmpire/dashboard?competitionId=${data.compId}&divisionId=${data.divisionid}&venueId=${data.venueId}&organisationId=${data.orgId}&roundIds=${round}`;
        } else {
            url = `/matchUmpire/dashboard?competitionId=${data.compId}&divisionId=${data.divisionid}&venueId=${data.venueId}&organisationId=${data.orgId}`;
        }
        if (data.sortBy && data.sortOrder) {
            url += `&sortBy=${data.sortBy}&sortOrder=${data.sortOrder}`;
        }
        // const url = `/matchUmpire/dashboard?competitionId=${1}&divisionId=${3}&venueId=${233}&organisationId=${3}`;
        return Method.dataPost(url, token, body)
    },

    umpireImport(data) {
        let body = new FormData();
        let url;
        body.append("file", data.csvFile, data.csvFile.name);

        if (data.screenName === 'umpireDashboard') {
            url = `/matchUmpire/dashboard/import?competitionId=${data.id}`;
        } else if (data.screenName === 'umpire') {
            url = `/users/import?competitionId=${data.id}&roleId=${15}`;
        } else if (data.screenName === 'liveScoreUmpireList') {
            url = `/users/import?competitionId=${data.id}&roleId=${15}`;
        }

        return Method.dataPost(url, token, body)
    },

    ///////get all the assign umpire list on the basis of competitionId
    getAssignUmpiresList(competitionId, body) {
        const url = `/matches/admin?competitionId=${competitionId}&roleId=15`
        return Method.dataPost(url, token, body)
    },

    /////////////assign umpire to a match
    assignUmpire(payload) {
        let body = payload
        const url = `/roster/admin/assign`
        return Method.dataPost(url, token, body)
    },

    /////////unassign umpire from the match(delete)
    unassignUmpire(rosterId) {
        const url = `/roster/admin?id=${rosterId}`
        return Method.dataDelete(url, token)
    },

    playerLineUpApi(payload) {
        let body = [{
            "teamId": payload.teamId,
            "matchId": payload.matchId,
            "playing": payload.value,
            "borrowed": false,
            "playerId": payload.record.playerId,
            "competitionId": payload.competitionId
        }]
        // body.playing = value
        const url = `/matches/lineup/update?matchId=${payload.matchId}&teamId=${payload.teamId}&updateMatchEvents=1`
        return Method.dataPatch(url, token, body)
    },

    bulkScoreChangeApi(data) {
        let body = data
        const url = `/matches/bulk/update`;
        return Method.dataPost(url, token, body)
    },

    liveScoreAddEditIncident(data) {
        let body = data.body
        let players = JSON.stringify(data.playerIds)

        if (data.isEdit) {
            const url = `/incident/edit?playerIds=${players}`;
            return Method.dataPatch(url, token, body)
        } else {
            const url = `/incident?playerIds=${players}`;
            return Method.dataPost(url, token, body)
        }

        // if (data.key === 'media') {
        //     let media = data.mediaArry
        //     let body = new FormData()
        //
        //     for (let i in media) {
        //         body.append("media", media[i])
        //     }
        //     if (data.isEdit) {
        //         const url = `/incident/media/edit?incidentId=${data.incidentId}`;
        //         return Method.dataPatch(url, token, body)
        //     } else {
        //         const url = `/incident/media?incidentId=${data.incidentId}`;
        //         return Method.dataPost(url, token, body)
        //     }
        // } else {
        //     // let body = { "incident": data.body }
        //     let body = data.body
        //     let players = JSON.stringify(data.playerIds)
        //     if (data.isEdit) {
        //         const url = `/incident/edit?playerIds=${players}`;
        //         return Method.dataPatch(url, token, body)
        //     } else {
        //         const url = `/incident?playerIds=${players}`;
        //         return Method.dataPost(url, token, body)
        //     }
        // }
    },

    liveScoreIncidentType() {
        const url = `/ref/incidentTypes`;
        return Method.dataGet(url, token)
    },

    liveScoreAddEditIncidentMedia(data, incidentId) {
        let media = data.mediaArry
        let body = new FormData()

        for (let i in media) {
            body.append("media", media[i])
        }

        if (data.isEdit) {
            if (data.incidentMediaIds.length > 0) {
                let incidentMediaId = JSON.stringify(data.incidentMediaIds)
                if (media) {
                    const url = `/incident/media/edit?incidentId=${incidentId}&incidentMediaIds=${incidentMediaId}`;
                    return Method.dataPatch(url, token, body)
                } else {
                    const url = `/incident/media/edit?incidentId=${incidentId}&incidentMediaIds=${incidentMediaId}`;
                    return Method.dataPatch(url, token)
                }
            } else {
                const url = `/incident/media/edit?incidentId=${incidentId}`;
                return Method.dataPatch(url, token, body)
            }

        } else {
            const url = `/incident/media?incidentId=${incidentId}`;
            return Method.dataPost(url, token, body)
        }
    },

    liveScoreMatchSheetPrint(competitionId, divisionId, teamId, templateType, roundName) {
        const url = `/matches/print?competitionId=${competitionId}&divisionIds=${divisionId}&teamIds=${teamId}&templateType=${templateType}&roundName=${roundName}`;
        return Method.dataGet(url, token)
    },

    ladderAdjustmentPostData(data) {
        const url = `/teams/ladder/adjustment`;
        return Method.dataPost(url, token, data.body)
    },

    ladderAdjustmentGetData(data) {
        const url = `/teams/ladder/adjustment?competitionUniqueKey=${data.uniqueKey}&divisionId=${data.divisionId}`;
        return Method.dataGet(url, token)
    },

    liveScoreManagerImport(data) {
        let body = new FormData();
        body.append("file", data.csvFile, data.csvFile.name);
        const url = `users/import?competitionId=${data.id}&roleId=3`;
        return Method.dataPost(url, token, body)
    },

    umpireRoundList(competitionID, divisionId) {
        let url;
        if (divisionId) {
            url = `/round?competitionId=${competitionID}&divisionId=${divisionId}`;
        } else {
            url = `/round?competitionId=${competitionID}&divisionId=${divisionId}`;
        }

        return Method.dataGet(url, localStorage.token)
    },

    innerHorizontalCompList(organisationId) {

        let url = `/competitions/admin?organisationId=${organisationId}`;

        return Method.dataPost(url, null)
    },

    liveScorePositionTrackList(data) {
        let body = data.pagination
        let url
        if (data.reporting === 'PERCENT') {
            url = `/stats/positionTracking?aggregate=${data.aggregate}&reporting=${'MINUTE'}&competitionId=${data.compId}&search=${data.search}`;
        } else {
            url = `/stats/positionTracking?aggregate=${data.aggregate}&reporting=${data.reporting}&competitionId=${data.compId}&search=${data.search}`;
        }

        if (data.sortBy && data.sortOrder) {
            url += `&sortBy=${data.sortBy}&sortOrder=${data.sortOrder}`;
        }

        return Method.dataPost(url, token, body)
    },
    liveScoreGetMainDivisionList(compId, offset, sortBy, sortOrder) {

        let url

        url = `/division?competitionId=${compId}&offset=${offset}&limit=${10}`

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataGet(url, null)
    },
    /////livescore own part competition listing
    liveScoreOwnPartCompetitionList(data, orgKey, sortBy, sortOrder) {
        let url = null;
        if (orgKey) {
            url = `/competitions/adminDashboard?organisationId=${orgKey}`;
        } else {
            url = `/competitions/adminDashboard`;
        }
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        if (data) {
            return Method.dataPost(url, null, data)
        } else {
            return Method.dataPost(url, null)
        }
    },

    liveScoreAddLiveStream(data) {
        let body = data.body
        let url = `/matches/livestreamURL`;
        return Method.dataPost(url, token, body)
    },
    resetLadderPoints(payload) {
        const url = `/teams/ladder/reset`
        return Method.dataPost(url, token, payload)
    },

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
                        Authorization: "BWSA " + authorization,
                        "SourceSystem": "WebAdmin"
                    }
                })
                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    } else if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    } else {
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
                            if (err.response.status === 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus === 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            } else if (err.response.status === 400) {
                                message.config({
                                    duration: 1.5,
                                    maxCount: 1,
                                });
                                message.error(err.response.data.message)
                                return reject({
                                    status: 400,
                                    error: err.response.data.message
                                });
                            } else {
                                return reject({
                                    status: 5,
                                    error: err.response && err.response.data.message
                                });
                            }
                        }
                    } else {
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
                        "Access-Control-Allow-Origin": "*",
                        "SourceSystem": "WebAdmin"
                    }
                })
                .then(result => {

                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    } else if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    } else {
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
                            if (err.response.status === 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus === 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            } else if (err.response.status === 500) {
                                message.error(err.response.data.message)
                            }
                        }
                    } else {
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
                        "Access-Control-Allow-Origin": "*",
                        "SourceSystem": "WebAdmin"
                    }
                })
                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    } else if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    } else {
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
                            if (err.response.status === 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus === 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err
                        });
                    }
                });
        });
    },

    async dataGetDownload(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/csv",
                        Authorization: "BWSA " + authorization,
                        "Access-Control-Allow-Origin": "*",
                        "SourceSystem": "WebAdmin"
                    }
                })
                .then(result => {
                    if (result.status === 200) {
                        const url = window.URL.createObjectURL(new Blob([result.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'filecsv.csv'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        return resolve({
                            status: 1,
                            result: result
                        });
                    } else if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    } else {
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
                            if (err.response.status === 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus === 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            } else {
                                return reject({
                                    status: 5,
                                    error: err
                                })
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err
                        });
                    }
                });
        });
    },

    //// Method to patch response
    async dataPatch(newurl, authorization, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .patch(url, body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: "BWSA " + authorization,
                        "SourceSystem": "WebAdmin"
                    }
                })
                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    } else if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    } else {
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
                            if (err.response.status === 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus === 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            } else if (err.response.status === 400) {
                                message.config({
                                    duration: 1.5,
                                    maxCount: 1,
                                });
                                message.error(err.response.data.message)
                                return reject({
                                    status: 400,
                                    error: err.response.data.message
                                });
                            } else {
                                return reject({
                                    status: 5,
                                    error: err.response && err.response.data.message
                                });
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err.response && err.response.data.message
                        });
                    }
                });
        });
    },
};

export default LiveScoreAxiosApi;
