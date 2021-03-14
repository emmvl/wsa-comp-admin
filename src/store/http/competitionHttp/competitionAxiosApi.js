/* eslint-disable no-param-reassign */
import { message } from "antd";
import * as moment from 'moment';

import { getAuthToken, getOrganisationData, getUserId } from "util/sessionStorage";
import history from "util/history";
import ValidationConstants from "themes/validationConstant";
import competitionHttp from "./competitionHttp";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

const token = getAuthToken();
// const userId = getUserId();

const Method = {
    async dataPost(newurl, authorization, body) {
        const url = newurl;
        return new Promise((resolve, reject) => {
            competitionHttp
                .post(url, body, {
                    timeout: 180000,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `BWSA ${authorization}`,
                        SourceSystem: "WebAdmin",
                    },
                })
                .then((result) => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result,
                        });
                    }
                    if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    }
                    if (result) {
                        return reject({
                            status: 3,
                            error: result.data.message,
                        });
                    }
                    return reject({
                        status: 4,
                        error: "Something went wrong.",
                    });
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status === 401) {
                                logout()
                                message.error(ValidationConstants.messageStatus401)
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                })
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err,
                        });
                    }
                });
        });
    },

    // Method to GET response
    async dataGet(newurl, authorization) {
        const url = newurl;
        return new Promise((resolve, reject) => {
            competitionHttp
                .get(url, {
                    timeout: 180000,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `BWSA ${authorization}`,
                        "Access-Control-Allow-Origin": "*",
                        SourceSystem: "WebAdmin",
                    },
                })
                .then((result) => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result,
                        });
                    }
                    if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    }
                    if (result) {
                        return reject({
                            status: 3,
                            error: result.data.message,
                        });
                    }
                    return reject({
                        status: 4,
                        error: "Something went wrong.",
                    });
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status === 401) {
                                logout()
                                message.error(ValidationConstants.messageStatus401)
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                })
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err,
                        });
                    }
                });
        });
    },

    async dataGetDownload(newurl, authorization, fileName) {
        const url = newurl;
        return new Promise((resolve, reject) => {
            competitionHttp
                .get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/csv",
                        Authorization: `BWSA ${authorization}`,
                        "Access-Control-Allow-Origin": "*",
                        SourceSystem: "WebAdmin",
                    },
                })
                .then((result) => {
                    if (result.status === 200) {
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(new Blob([result.data]));
                        link.setAttribute('download', `${fileName}.csv`); // or any other extension
                        document.body.appendChild(link);
                        link.click();
                        return resolve({
                            status: 1,
                            result,
                        });
                    }
                    if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    }
                    if (result) {
                        return reject({
                            status: 3,
                            error: result.data.message,
                        });
                    }
                    return reject({
                        status: 4,
                        error: "Something went wrong.",
                    });
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status === 401) {
                                logout()
                                message.error(ValidationConstants.messageStatus401)
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                })
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err,
                        });
                    }
                });
        });
    },

    async dataDeconste(newurl, authorization) {
        const url = newurl;
        return new Promise((resolve, reject) => {
            competitionHttp
                .deconste(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `BWSA ${authorization}`,
                        "Access-Control-Allow-Origin": "*",
                        SourceSystem: "WebAdmin",
                    },
                })
                .then((result) => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result,
                        });
                    }
                    if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    }
                    if (result) {
                        return reject({
                            status: 3,
                            error: result.data.message,
                        });
                    }
                    return reject({
                        status: 4,
                        error: "Something went wrong.",
                    });
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status === 401) {
                                logout()
                                message.error(ValidationConstants.messageStatus401)
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                })
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err,
                        });
                    }
                });
        });
    },

    // Put Method
    async dataPut(newurl, authorization, body) {
        const url = newurl;
        return new Promise((resolve, reject) => {
            competitionHttp
                .put(url, body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `BWSA ${authorization}`,
                        SourceSystem: "WebAdmin",
                    },
                })
                .then((result) => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result,
                        });
                    }
                    if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    }
                    if (result) {
                        return reject({
                            status: 3,
                            error: result.data.message,
                        });
                    }
                    return reject({
                        status: 4,
                        error: "Something went wrong.",
                    });
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status === 401) {
                                logout()
                                message.error(ValidationConstants.messageStatus401)
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                })
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err,
                        });
                    }
                });
        });
    },

    async dataPatch(newUrl, authorization, body) {
        const url = newUrl;
        return new Promise((resolve, reject) => {
            competitionHttp
                .patch(url, body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `BWSA ${authorization}`,
                        SourceSystem: "WebAdmin",
                    },
                })
                .then((result) => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result,
                        });
                    }
                    if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    }
                    if (result) {
                        return reject({
                            status: 3,
                            error: result.data.message,
                        });
                    }
                    return reject({
                        status: 4,
                        error: "Something went wrong.",
                    });
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status !== null || err.response.status !== undefined) {
                            if (err.response.status === 401) {
                                logout();
                                message.error(ValidationConstants.messageStatus401)
                            } else if (err.response.status === 400) {
                                message.config({
                                    duration: 1.5,
                                    maxCount: 1,
                                });
                                message.error(err.response.data.message);
                                return reject({
                                    status: 5,
                                    error: err.response.data.message,
                                });
                            } else {
                                return reject({
                                    status: 5,
                                    error: err.response && err.response.data.message,
                                });
                            }
                        }
                    } else {
                        return reject({
                            status: 5,
                            error: err.response && err.response.data.message,
                        });
                    }
                });
        });
    },
};

const CompetitionAxiosApi = {
    // get year
    competitionYear() {
        const url = "/common/reference/year";
        return Method.dataGet(url, token);
    },

    // get the common Competition type list reference
    getCompetitionTypeList(year) {
        const url = `/api/orgregistration/competitionyear/${year}`;
        return Method.dataGet(url, token);
    },

    // get time slot
    async getTimeSlotData(yearRefId, competitionId) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            // organisationId: organisationUniqueKey
            organisationId: organisationUniqueKey,
        };
        const url = `/api/competitiontimeslot?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // get competition teams
    competitionTeamsGet(id) {
        const url = `/api/competitions/${id}/teams`;
        return Method.dataGet(url, token);
    },

    // get competition timeslots
    competitionTeamsTimeslotsGet(id) {
        const url = `/api/competitions/${id}/teams/available-timeslots`;
        return Method.dataGet(url, token);
    },

    // get team timeslots preferences
    teamsTimeslotsPreferencesGet(id) {
        const url = `/api/competitions/${id}/teams/timeslots-preferences`;
        return Method.dataGet(url, token);
    },

    // competition save own final team grading table data
    teamsTimeslotsPreferencesSave(id, organisationId, payload) {
        const url = `/api/competitions/${id}/teams/timeslots-preferences?organisationId=${organisationId}`;
        return Method.dataPatch(url, token, payload);
    },

    // competition part player grade calculate player grading summary get API
    async getCompPartPlayerGradingSummary(yearRefId, competitionId) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
        };
        const url = `/api/playergrading/summary?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // competition own proposed team grading get api
    async getCompOwnProposedTeamGrading(yearRefId, competitionId, divisionId, gradeRefId) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            divisionId,
            organisationId: organisationUniqueKey,
            gradeRefId,
        };
        const url = `/api/teamgrading?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // save the own competition final grading api
    async saveOwnFinalTeamGradingData(payload) {
        const userId = await getUserId()
        payload.organisationId = await getOrganisationData().organisationUniqueKey;

        const url = `/api/teamgrading/save?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    // competition part proposed team grading get api
    async getCompPartProposedTeamGrading(yearRefId, competitionId, divisionId) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            divisionId,
            organisationId: organisationUniqueKey,
        };
        const url = `api/proposedteamgrading?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // competition save own final team grading table data
    async savePartProposedTeamGradingData(payload) {
        const userId = await getUserId()
        const url = `/api/proposedteamgrading/save?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    // post TIme Slot
    async postTimeSlotData(payload) {
        const userId = await getUserId()
        const url = `/api/competitiontimeslot/save?userId=${userId}`
        return Method.dataPost(url, token, payload)
    },

    // save the competition part player grade calculate player grading summary or say proposed player grading toggle
    async saveCompPartPlayerGradingSummary(payload) {
        const userId = await getUserId()
        const url = `api/playergrading/summary/save?userId=${userId}`
        return Method.dataPost(url, token, payload)
    },

    // get the own team grading summary listing data
    async getTeamGradingSummary(yearRefId, competitionId) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
        };
        const url = `api/teamgrading/summary?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // competition part player grading get API
    async getCompPartPlayerGrading(yearRefId, competitionId, divisionId) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            organisationId: organisationUniqueKey,
        };
        const url = `api/proposedplayerlist?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // competition draws get
    async getCompetitionDraws(yearRefId, competitionId, venueId, roundId, orgId, startDate, endDate) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            filterOrganisationId: orgId != null ? orgId : -1,
            startDate,
            endDate,
            // organisationId: "sd-gdf45df-09486-sdg5sfd-546sdf",
            venueId,
            roundId,
        };
        const url = `/api/draws?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    // competition draws rounds
    async getDrawsRounds(yearRefId, competitionId) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            // organisationId: "sd-gdf45df-09486-sdg5sfd-546sdf",
        };
        const url = `/api/rounds?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // get date range
    async getDateRange() {
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            organisationId: organisationUniqueKey,
        };
        const url = `/api/draws/daterange`
        return Method.dataPost(url, token, body);
    },

    // own competition venue constraint list in the venue and times
    async venueConstraintList(yearRefId, competitionId, organisationId) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
        };
        const url = `/api/venueconstraints?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // save the venueConstraints in the venue and times
    async venueConstraintPost(data) {
        const body = data
        const userId = await getUserId()
        const url = `/api/venueconstraint/save?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // save the changed grade name in own competition team grading summary data
    async saveUpdatedGradeTeamSummary(payload) {
        const userId = await getUserId()
        const url = `/api/teamgrading/summary/grade?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    // team grading summary publish
    async publishGradeTeamSummary(yearRefId, competitionId, publishToLivescore) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const payload = {
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            yearRefId,
            publishToLivescore,
        }
        const url = `/api/teamgrading/summary/publish?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    // competition dashboard get api call
    async competitionDashboard(yearId) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId: yearId,
            organisationId: organisationUniqueKey,
        }
        const url = `/api/competitionmanagement/dashboard?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    // update Draws
    async updateDraws(data) {
        const body = data
        const userId = await getUserId()
        const url = `/api/draws/update?userId=${userId}`
        return Method.dataPut(url, token, body);
    },

    // Save Draws
    async saveDrawsApi(yearId, competitionId, drawsId) {
        const userId = await getUserId()
        const body = {
            competitionUniqueKey: competitionId,
            yearRefId: 1,
            drawsMasterId: 0,
        }
        const url = `/api/draws/save?userId=${userId}`
        return Method.dataPut(url, token, body);
    },

    // get the competition final grades on the basis of competition and division
    async getCompFinalGradesList(yearRefId, competitionId, divisionId) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            divisionId,
            organisationId: organisationUniqueKey,
        };
        const url = `/api/competitiongrades?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    async updateCourtTimingsDrawsAction(body) {
        const userId = await getUserId()
        const url = `/api/draws/update/courttiming?userId=${userId}`
        return Method.dataPut(url, token, body);
    },

    // add new team  in part player grading
    async addCompetitionTeam(competitionId, divisionId, name) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            organisationId: organisationUniqueKey,
            // organisationId: "sd-gdf45df-09486-sdg5sfd-546sdf",
            teamName: name,
        };
        const url = `/api/team/save?userId=${userId}`
        return Method.dataPost(url, token, body)
    },

    async dragAndDropAxios(competitionId, teamId, playerId) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            teamId,
            playerId,
        };
        const url = `/api/player/assign?userId=${userId}`
        return Method.dataPost(url, token, body)
    },

    // Generate Draw
    async competitionGenerateDraw(payload) {
        const userId = await getUserId()
        const url = `/api/generatedraw?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    // player grading comment
    async playerGradingComment(competitionId, divisionId, comments, playerId) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            organisationId: organisationUniqueKey,
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            comments,
            playerId,
        }
        const url = `api/playergrading/comment?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    // player grading comment
    async playerGradingSummaryComment(year, competitionId, divisionId, gradingOrgId, comments) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            organisationId: organisationUniqueKey,
            yearRefId: year,
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            playerGradingOrganisationId: gradingOrgId,
            comments,
        }
        const url = `api/playergrading/summary/comment?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    // team grading comment
    async teamGradingComment(year, competitionId, divisionId, gradeRefId, teamId, comments) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            organisationId: organisationUniqueKey,
            yearRefId: year,
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            gradeRefId,
            teamId,
            comments,
        }
        const url = `/api/teamgrading/comment?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    // part proposed team grading comment
    async partTeamGradingComment(competitionId, divisionId, teamId, comments) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            organisationId: organisationUniqueKey,
            competitionUniqueKey: competitionId,
            competitionMembershipProductDivisionId: divisionId,
            teamId,
            comments,
        }
        const url = `/api/proposedteamgrading/comment?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    async importCompetitionPlayer(payload) {
        const body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", payload.csvFile, payload.csvFile.name);
        body.append("competitionUniqueKey", payload.competitionUniqueKey);
        body.append("organisationId", payload.organisationUniqueKey);
        body.append("competitionMembershipProductDivisionId", payload.competitionMembershipProductDivisionId);
        body.append("isProceed", payload.isProceed);
        const url = `/api/create/player`;
        return Method.dataPost(url, token, body)
    },

    async importCompetitionTeams(payload) {
        const body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", payload.csvFile, payload.csvFile.name);
        body.append("competitionUniqueKey", payload.competitionUniqueKey);
        body.append("organisationId", payload.organisationUniqueKey);
        const url = `/api/import/teams`;
        return Method.dataPost(url, token, body)
    },

    async getDivisionGradeNameList(competitionId, startDate, endDate) {
        const userId = await getUserId()
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            competitionUniqueKey: competitionId,
            organisationUniqueKey,
            startDate,
            endDate,
        };
        const url = `/api/division/grades?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    publishDrawsApi(action) {
        const url = `/api/draws/publish?competitionUniquekey=${action.competitionId}`
        return Method.dataPost(url, token, action.payload);
    },

    async deleteTeam(payload) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        payload = { ...payload, organisationId };
        const url = `/api/team/delete`;
        return Method.dataPost(url, token, payload);
    },

    async deleteTeamAction(payload) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        payload = { ...payload, organisationId };
        const url = `/api/team/action`;
        return Method.dataPost(url, token, payload);
    },

    drawsMatchesListApi(competitionId) {
        const url = `/api/draws/matches/export?competitionUniqueKey=${competitionId}`
        let _now = moment().utc().format('Y-MM-DD');
        return Method.dataGetDownload(url, token, `matchesList-${_now}`);
    },

    importDraws(payload) {
        const { competitionId, organisationId } = payload;
        const body = new FormData();
        body.append('file', payload.csvFile, payload.csvFile.name);
        body.append("competitionUniqueKey", competitionId);
        body.append("organisationId", organisationId);

        const url = `/api/draws/import`;
        return Method.dataPost(url, token, body);
    },

    async finalTeamsExportApi(payload) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const { competitionId, yearRefId } = payload;
        const url = `/api/export/teams/final?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}&organisationUniqueKey=${organisationId}`
        let _now = moment().utc().format('Y-MM-DD');
        return Method.dataGetDownload(url, token, `finalTeams-${_now}`);
    },

    async proposedTeamsExportApi(payload) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const { competitionId, yearRefId } = payload;
        const url = `/api/export/teams/proposed?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}&organisationUniqueKey=${organisationId}`
        let _now = moment().utc().format('Y-MM-DD');
        return Method.dataGetDownload(url, token, `competitionPartProposedTeamGrading-${_now}`);
    },

    async finalPlayersExportApi(payload) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const { competitionId, yearRefId } = payload;
        const url = `/api/export/player/final?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}&organisationUniqueKey=${organisationId}`
        let _now = moment().utc().format('Y-MM-DD');
        return Method.dataGetDownload(url, token, `finalPlayers-${_now}`);
    },

    async proposedPlayersExportApi(payload) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const { competitionId, yearRefId } = payload;
        const url = `/api/export/player/proposed?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}&organisationUniqueKey=${organisationId}`
        let _now = moment().utc().format('Y-MM-DD');
        return Method.dataGetDownload(url, token, `proposedPlayers-${_now}`);
    },

    async getFixtureData(yearId, competitionId, competitionDivisionGradeId) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const body = {
            yearRefId: yearId,
            competitionUniqueKey: competitionId,
            organisationId,
            competitionDivisionGradeId,
        };
        const url = `/api/fixtures`
        return Method.dataPost(url, token, body);
    },

    // update Draws
    async updateFixture(data) {
        const body = data
        const url = `/api/draws/team/update`
        return Method.dataPut(url, token, body);
    },

    async teamChangeDivisionApi(payload) {
        payload.organisationUniqueKey = await getOrganisationData().organisationUniqueKey;
        const url = `/api/team/division/update`
        return Method.dataPost(url, token, payload);
    },

    async playerChangeDivisionApi(payload) {
        payload.organisationUniqueKey = await getOrganisationData().organisationUniqueKey;
        const url = `/api/player/division/update`
        return Method.dataPost(url, token, payload);
    },

    async updateDrawsLock(drawsId) {
        const body = {
            drawsId,
        }
        const url = `/api/draws/unlock`
        return Method.dataPost(url, token, body);
    },

    async getCommentList(competitionId, entityId, commentType) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const body = {
            competitionUniqueKey: competitionId,
            organisationUniqueKey: organisationId,
            entityId,
            commentType,
        }
        const url = `/api/grading/comments`
        return Method.dataPost(url, token, body);
    },

    async fixtureTemplateRounds() {
        const url = `/api/fixturetemplate/rounds`
        return Method.dataGet(url, token);
    },

    // get own competition list
    async getQuickCompetitionList(year) {
        const orgItem = await getOrganisationData()
        const { organisationUniqueKey } = orgItem
        const url = `api/quickcompetition/${year}?organisationId=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },

    // post/save quick competition division
    async saveQuickCompDivision(competitionUniqueKey, divisions) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const body = {
            competitionUniqueKey,
            organisationUniqueKey: organisationId,
            divisions,
        }
        const url = `/api/quickcompetition/division`
        return Method.dataPost(url, token, body);
    },

    async createQuickCompetition(year, competitionName, competitionDate) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const body = {
            competitionName,
            organisationId,
            yearRefId: year,
            startDate: competitionDate,
        }
        const url = `/api/quickcompetition/create`
        return Method.dataPost(url, token, body);
    },

    async getQuickCompetitionDetails(competitionUniqueKey) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const body = {
            competitionId: competitionUniqueKey,
            organisationId,
        }
        const url = `/api/quickcompetition/details`
        return Method.dataPost(url, token, body);
    },

    // update quick competition
    async updateQuickCompetition(payload) {
        const body = payload
        const url = `/api/quickcompetition/update`
        return Method.dataPost(url, token, body);
    },

    // Generate Draw quick competition
    async quickCompetitionGenerateDraw(yearRefId, competitionUniqueKey) {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const userId = await getUserId()
        const body = {
            yearRefId,
            competitionUniqueKey,
            organisationId,
        }
        const url = `/api/generatedraw?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    // importQuickCompetitionPlayer
    importQuickCompetitionPlayer(payload) {
        const body = new FormData();
        // body.append('file', new File([data.csvFile], { type: 'text/csv' }));
        body.append("file", payload.csvFile, payload.csvFile.name);
        body.append("competitionUniqueKey", payload.competitionUniqueKey);
        body.append("organisationId", payload.organisationUniqueKey);
        body.append("isProceed", payload.isProceed);
        const url = `/api/quickcompetition/import/player`;
        return Method.dataPost(url, token, body);
    },

    // competition draws rounds
    async getActiveDrawsRounds(yearRefId, competitionId) {
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
        };
        const url = `/api/activerounds`
        return Method.dataPost(url, token, body);
    },

    async addVenueQuickCompetition(payload) {
        const url = `/api/quickcompetitions/venues`
        return Method.dataPost(url, token, payload);
    },

    async getMergeCompetitionApi() {
        const orgItem = await getOrganisationData()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/merge/competitions?organisationId=${organisationUniqueKey}`
        return Method.dataGet(url, token);
    },

    async validateMergeCompetitionApi(payload) {
        const url = `/api/quickcompetitions/merge/validate`
        return Method.dataPost(url, token, payload);
    },

    async mergeCompetitionProceedApi(payload) {
        const url = `/api/quickcompetitions/merge`
        return Method.dataPost(url, token, payload)
    },

    async competitionDashboardDeconste(competitionId, targetValue) {
        const url = `/api/competition/deconste?competitionId=${competitionId}&deconsteOptionId=${targetValue}`;
        return Method.dataDeconste(url, token);
    },

    async replicateSave(replicateData) {
        const url = `api/replicate/review`
        return Method.dataPost(url, token, replicateData)
    },

    // update team name for competition module also
    updateCompTeamName(payload) {
        const url = `api/teamName`
        return Method.dataPut(url, token, payload)
    },

    async exportPlayerGrading(competition, division) {
        const orgItem = await getOrganisationData()
        const userId = await getUserId()
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/proposedplayerlist/export?userId=${userId}&competitionMembershipProductDivisionId=${division}&competitionUniqueKey=${competition}&organisationId=${organisationUniqueKey}`

        let _now = moment().utc().format('Y-MM-DD');
        return Method.dataGetDownload(url, token, `competitionPlayerGrades-${_now}`);
    },

    saveCompetitionDivisions(competitionId, organisationId, payload) {
        const url = `api/competition/${competitionId}/competitionDivisions?organisationId=${organisationId}`
        return Method.dataPatch(url, token, payload)
    },
};

export default CompetitionAxiosApi;
