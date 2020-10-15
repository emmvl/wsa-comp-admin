// import { DataManager } from './../../Components';
import competitionHttp from "./competitionHttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
// let userId = getUserId()
let CompetitionAxiosApi = {
    // get year
    competitionYear() {
        var url = "/common/reference/year";
        return Method.dataGet(url, token);
    },

    /////get the common Competition type list reference
    getCompetitionTypeList(year) {
        var url = `/api/orgregistration/competitionyear/${year}`;
        return Method.dataGet(url, token);
    },

    //get time slot
    async getTimeSlotData(yearRefId, competitionId) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            // organisationId: organisationUniqueKey
            organisationId: organisationUniqueKey
        };
        var url = `/api/competitiontimeslot?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    /////competition part player grade calculate player grading summary get API
    async getCompPartPlayerGradingSummary(yearRefId, competitionId) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey

        };
        var url = `/api/playergrading/summary?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////competition own proposed team grading get api
    async getCompOwnProposedTeamGrading(yearRefId, competitionId, divisionId, gradeRefId) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            divisionId,
            organisationId: organisationUniqueKey,
            gradeRefId: gradeRefId
        };
        var url = `/api/teamgrading?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////save the own competition final grading api
    async saveOwnFinalTeamGradingData(payload) {
        let userId = await getUserId()
        let organisationId = await getOrganisationData().organisationUniqueKey;
        payload['organisationId'] = organisationId;

        var url = `/api/teamgrading/save?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    //////competition part proposed team grading get api
    async getCompPartProposedTeamGrading(yearRefId, competitionId, divisionId) {
        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            divisionId,
            organisationId: organisationUniqueKey,
        };
        var url = `api/proposedteamgrading?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    //////competition save own final team grading table data
    async savePartProposedTeamGradingData(payload) {
        let userId = await getUserId()
        var url = `/api/proposedteamgrading/save?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    //post TIme Slot
    async postTimeSlotData(payload) {
        let userId = await getUserId()
        var url = `/api/competitiontimeslot/save?userId=${userId}`
        return Method.dataPost(url, token, payload)
    },

    ///////////save the competition part player grade calculate player grading summary or say proposed player grading toggle
    async saveCompPartPlayerGradingSummary(payload) {
        let userId = await getUserId()
        var url = `api/playergrading/summary/save?userId=${userId}`
        return Method.dataPost(url, token, payload)
    },

    ///////get the own team grading summary listing data
    async getTeamGradingSummary(yearRefId, competitionId) {
        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
        };
        var url = `api/teamgrading/summary?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    //////competition part player grading get API
    async getCompPartPlayerGrading(yearRefId, competitionId, divisionId) {
        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            organisationId: organisationUniqueKey
        };
        var url = `api/proposedplayerlist?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////competition draws get
    async getCompetitionDraws(yearRefId, competitionId, venueId, roundId, orgId, startDate, endDate) {

        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            filterOrganisationId: orgId != null ? orgId : -1,
            startDate: startDate,
            endDate: endDate,
            // organisationId: "sd-gdf45df-09486-sdg5sfd-546sdf",
            venueId: venueId,
            roundId
        };
        var url = `/api/draws?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////////competition draws rounds
    async getDrawsRounds(yearRefId, competitionId) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
            // organisationId: "sd-gdf45df-09486-sdg5sfd-546sdf"
        };
        var url = `/api/rounds?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    //get date range
    async getDateRange() {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            organisationId: organisationUniqueKey
        };
        var url = `/api/draws/daterange`
        return Method.dataPost(url, token, body);
    },

    ////own competition venue constraint list in the venue and times
    async venueConstraintList(yearRefId, competitionId, organisationId) {
        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
        };
        var url = `/api/venueconstraints?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    //////save the venueConstraints in the venue and times
    async venueConstraintPost(data) {
        let body = data
        let userId = await getUserId()
        var url = `/api/venueconstraint/save?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ///////save the changed grade name in own competition team grading summary data
    async saveUpdatedGradeTeamSummary(payload) {
        let userId = await getUserId()
        var url = `/api/teamgrading/summary/grade?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    ////////team grading summary publish
    async publishGradeTeamSummary(yearRefId, competitionId,publishToLivescore) {
        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let payload = {
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            yearRefId,
            publishToLivescore: publishToLivescore
        }
        var url = `/api/teamgrading/summary/publish?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    ///////competition dashboard get api call
    async competitionDashboard(yearId) {
        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            "yearRefId": yearId,
            "organisationId": organisationUniqueKey
        }
        var url = `/api/competitionmanagement/dashboard?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ///// update Draws
    async updateDraws(data) {
        let body = data
        let userId = await getUserId()
        var url = `/api/draws/update?userId=${userId}`
        return Method.dataPut(url, token, body);
    },

    /// Save Draws
    async saveDrawsApi(yearId, competitionId, drawsId) {
        let userId = await getUserId()
        let body = {
            "competitionUniqueKey": competitionId,
            "yearRefId": 1,
            "drawsMasterId": 0,
        }
        var url = `/api/draws/save?userId=${userId}`
        return Method.dataPut(url, token, body);
    },

    ////////////get the competition final grades on the basis of competition and division
    async getCompFinalGradesList(yearRefId, competitionId, divisionId) {
        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            divisionId,
            organisationId: organisationUniqueKey,
        };
        var url = `/api/competitiongrades?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    async updateCourtTimingsDrawsAction(body) {
        let userId = await getUserId()
        var url = `/api/draws/update/courttiming?userId=${userId}`
        return Method.dataPut(url, token, body);
    },

    // add new team  in part player grading
    async addCompetitionTeam(competitionId, divisionId, name) {
        let orgItem = await getOrganisationData()
        let userId = await getUserId()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            organisationId: organisationUniqueKey,
            // organisationId: "sd-gdf45df-09486-sdg5sfd-546sdf",

            teamName: name
        };
        var url = `/api/team/save?userId=${userId}`
        return Method.dataPost(url, token, body)

    },

    async dragAndDropAxios(competitionId, teamId, player) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            teamId: teamId,
            playerId: player

        };
        var url = `/api/player/assign?userId=${userId}`
        return Method.dataPost(url, token, body)

    },
    //Generate Draw
    async competitionGenerateDraw(payload) {
        let userId = await getUserId()
        var url = `/api/generatedraw?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    //player grading comment
    async playerGradingComment(competitionId, divisionId, comment, playerId) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            organisationId: organisationUniqueKey,
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            comments: comment,
            playerId: playerId
        }
        var url = `api/playergrading/comment?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    //player grading comment
    async playerGradingSummaryComment(year, competitionId, divisionId, gradingOrgId, comment) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            organisationId: organisationUniqueKey,
            yearRefId: year,
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            playerGradingOrganisationId: gradingOrgId,
            comments: comment,
        }
        var url = `api/playergrading/summary/comment?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },
    //team grading comment
    async teamGradingComment(year, competitionId, divisionId, gradeRefId, teamId, comment) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            organisationId: organisationUniqueKey,
            yearRefId: year,
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            gradeRefId: gradeRefId,
            teamId: teamId,
            comments: comment,
        }
        var url = `/api/teamgrading/comment?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    //part proposed team grading comment

    async partTeamGradingComment(competitionId, divisionId, teamId, comment) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            organisationId: organisationUniqueKey,
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            teamId: teamId,
            comments: comment,
        }
        var url = `/api/proposedteamgrading/comment?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    async importCompetitionPlayer(payload) {
        let body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", payload.csvFile, payload.csvFile.name);
        body.append("competitionUniqueKey", payload.competitionUniqueKey);
        body.append("organisationId", payload.organisationUniqueKey);
        body.append("competitionMembershipProductDivisionId", payload.competitionMembershipProductDivisionId);
        body.append("isProceed", payload.isProceed);
        var url = `/api/create/player`;
        return Method.dataPost(url, token, body)
    },

    async importCompetitionTeams(payload) {
        let body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", payload.csvFile, payload.csvFile.name);
        body.append("competitionUniqueKey", payload.competitionUniqueKey);
        body.append("organisationId", payload.organisationUniqueKey);
        var url = `/api/import/teams`;
        return Method.dataPost(url, token, body)
    },

    async getDivisionGradeNameList(competitionId, startDate, endDate) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            competitionUniqueKey: competitionId,
            organisationUniqueKey: organisationUniqueKey,
            startDate: startDate,
            endDate: endDate
        };
        var url = `/api/division/grades?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    publishDrawsApi(action) {
        var url = `/api/draws/publish?competitionUniquekey=${action.competitionId}`
        return Method.dataPost(url, token, action.payload);
    },

    async deleteTeam(payload) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        payload.organisationId = organisationId;
        var url = `/api/team/delete`
        return Method.dataPost(url, token, payload);
    },
    async deleteTeamAction(payload) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        payload.organisationId = organisationId;
        var url = `/api/team/action`
        return Method.dataPost(url, token, payload);
    },
    drawsMatchesListApi(competitionId) {
        var url = `/api/draws/matches/export?competitionUniqueKey=${competitionId}`
        return Method.dataGetDownload(url, token, "MatchesList");
    },
    async finalTeamsExportApi(payload) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let competitionId = payload.competitionId;
        let yearRefId = payload.yearRefId;
        var url = `/api/export/teams/final?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}&organisationUniqueKey=${organisationId}`
        return Method.dataGetDownload(url, token, "Teams");
    },
    async proposedTeamsExportApi(payload) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let competitionId = payload.competitionId;
        let yearRefId = payload.yearRefId;
        var url = `/api/export/teams/proposed?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}&organisationUniqueKey=${organisationId}`
        return Method.dataGetDownload(url, token, "Teams");
    },
    async finalPlayersExportApi(payload) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let competitionId = payload.competitionId;
        let yearRefId = payload.yearRefId;
        var url = `/api/export/player/final?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}&organisationUniqueKey=${organisationId}`
        return Method.dataGetDownload(url, token, "Players");
    },
    async proposedPlayersExportApi(payload) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let competitionId = payload.competitionId;
        let yearRefId = payload.yearRefId;
        var url = `/api/export/player/proposed?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}&organisationUniqueKey=${organisationId}`
        return Method.dataGetDownload(url, token, "Players");
    },

    async getFixtureData(yearId, competitionId, competitionDivisionGradeId) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let body = {
            yearRefId: yearId,
            competitionUniqueKey: competitionId,
            organisationId: organisationId,
            competitionDivisionGradeId: competitionDivisionGradeId
        };
        var url = `/api/fixtures`
        return Method.dataPost(url, token, body);
    },
    ///// update Draws
    async updateFixture(data) {
        let body = data
        var url = `/api/draws/team/update`
        return Method.dataPut(url, token, body);
    },
    async teamChangeDivisionApi(payload) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        payload.organisationUniqueKey = organisationId;
        var url = `/api/team/division/update`
        return Method.dataPost(url, token, payload);
    },
    async playerChangeDivisionApi(payload) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        payload.organisationUniqueKey = organisationId;
        var url = `/api/player/division/update`
        return Method.dataPost(url, token, payload);
    },

    async updateDrawsLock(drawsId) {
        let body = {
            "drawsId": drawsId
        }
        var url = `/api/draws/unlock`
        return Method.dataPost(url, token, body);
    },

    async getCommentList(competitionId, entityId, commentType) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let body = {
            "competitionUniqueKey": competitionId,
            "organisationUniqueKey": organisationId,
            "entityId": entityId,
            "commentType": commentType
        }
        var url = `/api/grading/comments`
        return Method.dataPost(url, token, body);
    },
    async fixtureTemplateRounds() {
        var url = `/api/fixturetemplate/rounds`
        return Method.dataGet(url, token);
    },
    // get own competition list
    async getQuickCompetitionList(year) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem.organisationUniqueKey
        var url = `api/quickcompetition/${year}?organisationId=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },
    //////post/save quick competition division
    async saveQuickCompDivision(competitionUniqueKey, divisions) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let body = {
            "competitionUniqueKey": competitionUniqueKey,
            "organisationUniqueKey": organisationId,
            "divisions": divisions
        }
        var url = `/api/quickcompetition/division`
        return Method.dataPost(url, token, body);
    },
    async createQuickComptition(year, comptitionName, competitionDate) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let body = {
            "competitionName": comptitionName,
            "organisationId": organisationId,
            "yearRefId": year,
            "startDate": competitionDate
        }
        var url = `/api/quickcompetition/create`
        return Method.dataPost(url, token, body);
    },

    async getQuickCompetiitonDetails(competitionUniqueKey) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let body = {
            "competitionId": competitionUniqueKey,
            "organisationId": organisationId
        }
        var url = `/api/quickcompetition/details`
        return Method.dataPost(url, token, body);
    },

    //////update quick competition
    async updateQuickCompetition(payload) {
        let body = payload
        var url = `/api/quickcompetition/update`
        return Method.dataPost(url, token, body);
    },
    //Generate Draw quick competition
    async quickCompetitionGenerateDraw(yearRefId, competitionUniqueKey) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let userId = await getUserId()
        let body = {
            "yearRefId": yearRefId,
            "competitionUniqueKey": competitionUniqueKey,
            "organisationId": organisationId
        }
        var url = `/api/generatedraw?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },
    //importQuickCompetitionPlayer
    importQuickCompetitionPlayer(payload) {
        let body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", payload.csvFile, payload.csvFile.name);
        body.append("competitionUniqueKey", payload.competitionUniqueKey);
        body.append("organisationId", payload.organisationUniqueKey);
        body.append("isProceed", payload.isProceed);
        var url = `/api/quickcompetition/import/player`;
        return Method.dataPost(url, token, body);
    },
    ////////competition draws rounds
    async getActiveDrawsRounds(yearRefId, competitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
        };
        var url = `/api/activerounds`
        return Method.dataPost(url, token, body);
    },

    async addVenueQuickCompetition(payload) {
        var url = `/api/quickcompetitions/venues`
        return Method.dataPost(url, token, payload);
    },

    async getMergeCompetitionApi() {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/merge/competitions?organisationId=${organisationUniqueKey}`
        return Method.dataGet(url, token);
    },

    async validateMergeCompetitionApi(payload) {
        var url = `/api/quickcompetitions/merge/validate`
        return Method.dataPost(url, token, payload);
    },

    async mergeCompetitionProceedApi(payload) {
        var url = `/api/quickcompetitions/merge`
        return Method.dataPost(url, token, payload)
    },
    async competitionDashboardDelete(competitionId,targetValue)
    {
      var url = `/api/competition/delete?competitionId=${competitionId}&deleteOptionId=${targetValue}`;
      return Method.dataDelete(url, token);
    },

    async replicateSave(replicateData){
        var url = `api/replicate/review`
        return Method.dataPost(url, token, replicateData)
    }
};

const Method = {
    async dataPost(newurl, authorization, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            competitionHttp
                .post(url, body, {
                    timeout: 180000,
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
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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



    // Method to GET response

    async dataGet(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            competitionHttp
                .get(url, {
                    timeout: 180000,
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
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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

    async dataGetDownload(newurl, authorization, fileName) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            competitionHttp
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
                        link.setAttribute('download', fileName + '.csv'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
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
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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
            competitionHttp
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
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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

    //Put Method
    async dataPut(newurl, authorization, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            competitionHttp
                .put(url, body, {
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
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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

};

export default CompetitionAxiosApi;
