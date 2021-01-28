
import http from "./commonHttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

// let userId = getUserId();
let token = getAuthToken();

let AxiosApi = {
    // /login Api call
    Login(payload) {
        var base64 = require("base-64");
        var md5 = require("md5");
        let authorization = base64.encode(
            payload.userName + ":" + md5(payload.password)
        );
        var url = "/users/loginWithEmailPassword";
        return Method.dataGet(url, authorization);
    },

    //role Api
    role() {
        var url = "/ref/roles";
        return Method.dataGet(url, token);
    },

    // User Role Entity Api
    ure() {
        var url = "/ure";
        return Method.dataGet(url, token);
    },

    /////get the common year list reference
    getYearList() {
        var url = `/common/reference/year`;
        return Method.dataGet(url, token);
    },

    /////get the common membership product validity type list reference
    getProductValidityList() {
        var url = `/common/reference/MembershipProductValidity`;
        return Method.dataGet(url, token);
    },

    /////get the common Competition type list reference
    getCompetitionTypeList(year) {
        var url = `/api/orgregistration/competitionyear/${year}`;
        return Method.dataGet(url, token);
    },

    async getVenue(action) {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        // if (action.key === "all") {
        //     organisationId = '';
        // }
        var url = `/api/venue/all?organisationUniqueKey=${organisationId}`;
        return Method.dataGet(url, token);
    },
    getRegFormSetting() {
        var url = "/common/reference/RegistrationSettings";
        return Method.dataGet(url, token);
    },
    getRegFormMethod() {
        var url = "/common/reference/RegistrationMethod";
        return Method.dataGet(url, token);
    },
    getMatchTypes() {
        var url = "/common/reference/MatchType";
        return Method.dataGet(url, token);
    },
    getCompetitionFormatTypes() {
        var url = `/common/reference/CompetitionFormat`;
        return Method.dataGet(url, token);
    },
    getTypesOfCompetition() {
        var url = `/common/reference/CompetitionType`;
        return Method.dataGet(url, token);
    },
    getCommonTimeSlotInit(payload) {
        let body = {
            ApplyToVenue: "ApplyToVenue",
            TimeslotRotation: "TimeslotRotation",
            TimeslotGeneration: "TimeslotGeneration",
            Day: "Day"
        }
        var url = "/common/references";
        return Method.dataPost(url, token, body);
    },
    getRegistrationInvitees() {
        var url = "/common/reference/RegistrationInvitees";
        return Method.dataGet(url, token)
    },
    getPaymentOption() {
        var url = "/common/reference/PaymentOption";
        return Method.dataGet(url, token)
    },

    ////get Common Api
    getCommonData() {
        let body = {
            State: "State",
            Day: "Day",
            CourtRotation: "CourtRotation",
            HomeTeamRotation: "HomeTeamRotation",
        }
        var url = "/common/references";
        return Method.dataPost(url, token, body);
    },
    getGender() {
        var url = '/common/reference/gender';
        return Method.dataGet(url, token)
    },
    getCommonReferenceCall(body) {
        var url = "/common/references";
        return Method.dataPost(url, token, body);
    },

    ////Add Venue Api
    async addVenue(venuData) {
        let userId = await getUserId()
        let organisationId = await getOrganisationData().organisationUniqueKey;
        let body = {
            competitionUniqueKey: venuData.competitionUniqueKey,
            organisationId: organisationId,
            yearRefId: venuData.yearRefId,
            competitionMembershipProductDivisionId: venuData.competitionMembershipProductDivisionId,
            "venueId": venuData.venueId,
            "lng": venuData.lng,
            "lat": venuData.lat,
            name: venuData.name,
            "shortName": venuData.shortName,
            "street1": venuData.street1,
            "street2": venuData.street2,
            "suburb": venuData.suburb,
            "stateRefId": venuData.stateRefId,
            "postalCode": venuData.postalCode,
            "statusRefId": venuData.statusRefId,
            "contactNumber": venuData.contactNumber,
            "organisations": venuData.organisations,
            "gameDays": venuData.gameDays,
            "venueCourts": venuData.venueCourts

        }
        var url = `/api/venue/save?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    // Check Venue address duplication
    async checkVenueDuplication(venueAddress) {
        const url = '/api/venue/duplicate';
        const body = venueAddress ? {
            venueId: venueAddress.venueId,
            lng: venueAddress.lng,
            lat: venueAddress.lat,
        } : null;

        return Method.dataPost(url, token, body);
    },

    ////own Competition venue list
    async getVenueList(competitionID, search) {
        var url = ""
        let organisationId = await getOrganisationData().organisationUniqueKey;
        if (competitionID) {
            if (search) {
                url = `/api/venue/competitionmgmnt?search=${search}&competitionId=${competitionID}&organisationUniqueKey=${organisationId}`;
            } else {
                url = `/api/venue/competitionmgmnt?competitionId=${competitionID}&organisationUniqueKey=${organisationId}`;
            }

        } else {
            url = `/api/venue/competitionmgmnt?organisationUniqueKey=${organisationId}`;
        }

        return Method.dataGet(url, token);
    },
    // <common server baseurl>/api/venue/competitionmgmnt?search=asma&competitionId=1
    /////////get the grades reference data
    gradesReferenceList() {
        let url = `common/reference/grade`;
        return Method.dataGet(url, token);
    },
    getCommonReference(referenceName) {
        let url = `/common/reference/${referenceName}`;
        return Method.dataGet(url, token)
    },

    /// All Venues Listing
    async getVenuesList(payload, sortBy, sortOrder) {
        let userId = await getUserId()
        let url
        url = `/api/venue/list?userId=${userId}`;

        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataPost(url, token, payload);
    },
    /// Get Venue by Id
    async getVenueById(payload) {
        let userId = await getUserId()
        let url = `/api/venue/edit?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },
    async venueDelete(payload) {
        let userId = await getUserId()
        let url = `/api/venue/delete?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    //// Get Org Venue list
    async getOrgVenue(search) {
        // let userId = await getUserId()
        let url = null
        if (search.length > 0) {
            url = `/api/venue/organisationVenue?organisationUniquekey=b6eb9c7b-6c74-4657-bc6d-e2222b23c965&search=${search}`
        } else {
            url = `/api/venue/organisationVenue?organisationUniquekey=b6eb9c7b-6c74-4657-bc6d-e2222b23c965&search=`;
        }
        return Method.dataGet(url, token);
    },
    getCourtList(venueId) {
        let url = `/api/venueCourt?venueId=${venueId}`;
        return Method.dataGet(url, token)
    },

    getCommonInit(body) {
        var url = "/common/references";
        return Method.dataPost(url, token, body);
    },

    getActionBoxList(payload) {
        let url = `/api/actions`;
        return Method.dataPost(url, token, payload)
    },
    updateActionBox(payload) {
        let url = `/api/actions/update`;
        return Method.dataPost(url, token, payload)
    },

    getStateReference(body) {
        var url = "/common/references";
        return Method.dataPost(url, token, body);
    },
    getMatchPrintTemplateType() {
        const body = {
            MatchPrintTemplate: 'MatchPrintTemplate',
        };
        const url = '/common/references';

        return Method.dataPost(url, token, body);
    },
    getRefOrderStatus() {
        let body = {
            ShopFulfilmentStatus: "ShopFulfilmentStatus",
            ShopPaymentStatus: "ShopPaymentStatus",
        }
        const url = '/common/references';
        return Method.dataPost(url, token, body);
    },
    getCombinedUmpireCoachAccreditationReference() {
        let body = {
            accreditationUmpire: "accreditationUmpire",
            accreditationCoach: "accreditationCoach",
            State: "State"
        }
        let url = `/common/references`;
        return Method.dataPost(url, token, body)
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
                    }
                    else if (result.status === 212) {
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
                            if (err.response.status === 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus === 401) {
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
                    }
                    else if (result.status === 212) {
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
                            if (err.response.status === 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus === 401) {
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
                    }
                    else if (result.status === 212) {
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
                            if (err.response.status === 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus === 401) {
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
    }
};


export default AxiosApi;
