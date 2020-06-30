// import { DataManager } from './../../Components';
import http from "./registrationhttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
// let organisationUniqueKey = "sd-gdf45df-09486-sdg5sfd-546sdf"
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

    ////registrationMembershipFeeList in membership table in the registration tab
    async registrationCompetitionFeeList(offset, yearRefId, searchText) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            paging: {
                offset: offset,
                limit: 10
            }
        };
        var url = `/api/competitionfee/listing/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}&search=${searchText}`;
        // var url = `/api/competitionfee/listing/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}&search=${"umpire"}`;
        return Method.dataPost(url, token, body);
    },

    ////registrationMembershipFeeList in membership table in the registration tab
    async registrationMembershipFeeList(offset, yearRefId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            paging: {
                offset: offset,
                limit: 10
            }
        };
        var url = `/api/membershipproductfee/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, body);
    },



    ///registration Competition fee list product delete
    async  registrationCompetitionFeeListDelete(competitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/competitionfee/${competitionId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataDelete(url, token);
    },

    ///registration membership fee list product delete
    async registrationMembershipFeeListDelete(payload) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let productId = payload.productId;
        var url = `/api/membershipproduct/${productId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataDelete(url, token);
    },

    //////get the membership  product details
    regGetMembershipProductDetails(payload) {
        let productId = payload.productId;
        var url = `/api/membershipproduct/${productId}`;
        return Method.dataGet(url, token);
    },


    //////get the membership  product details
    async regGetMembershipProductDetails(payload) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let productId = payload.productId
        var url = `api/membershipproduct/details/${productId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },

    //////save the membership  product details
    async regSaveMembershipProductDetails(payload) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/membershipproduct?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
    },
    // post regsitration form save
    async regSaveRegistrationForm(payload) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/orgregistration?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
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
    async  getCompetitionTypeList(year) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem.organisationUniqueKey
        // var url = `/api/orgregistration/competitionyear/${year}`;
        var url = `/api/orgregistration/competitionyear/${year}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },
    // get own competition list
    async  getOwnCompetitionList(year) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem.organisationUniqueKey
        // var url = `/api/orgregistration/competitionyear/${year}`;
        var url = `/api/orgregistration/owncompetition/${year}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },
    // get participate competition list
    async  getParticipateCompetitionList(year) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem.organisationUniqueKey
        // var url = `/api/orgregistration/competitionyear/${year}`;
        var url = `/api/orgregistration/affiliatedcompetition/${year}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },


    // get venue for registration form
    async getVenue() {
        let organisationId = await getOrganisationData().organisationUniqueKey;
        var url = `/api/venue/all?organisationUniqueKey=${organisationId}`;
        return Method.dataGet(url, token);
    },
    // get reg form settings
    getRegFormSetting() {
        var url = "/common/reference/RegistrationSettings";
        return Method.dataGet(url, token);
    },
    //get registration form registration method
    getRegFormMethod() {
        var url = "/common/reference/RegistrationMethod";
        return Method.dataGet(url, token);
    },
    // get membership products in registration products
    getMembershipProductList(CompetitionId) {
        var url = `/api/details/membershipproduct/${CompetitionId}`;
        return Method.dataGet(url, token);
    },

    // get registration form  data
    async   getRegistrationForm(year, CompetitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: year,
            competitionUniqueKey: CompetitionId
        };
        var url = `/api/orgregistration/details?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, body);
    },
    ///////////get the default membership  product types in registartion membership fees
    regDefaultMembershipProductTypes() {
        var url = `api/membershipproducttype/default`;
        return Method.dataGet(url, token);
    },

    //////save the membership  product Fees
    async regSaveMembershipProductFee(payload) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/membershipproduct/fees?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
    },
    //////save the membership  product Discount
    async  regSaveMembershipProductDiscount(payload) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/membershipproduct/discount?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
    },
    /////get the membership product discount Types
    membershipProductDiscountTypes() {
        var url = `/api/membershipproductdiscounttype/default`;
        return Method.dataGet(url, token);
    },

    /////get the common Membership Product Fees Type
    getMembershipProductFeesType() {
        var url = `/common/reference/MembershipProductFeesType`;
        return Method.dataGet(url, token);
    },
    ////get commom reference discount type
    getCommonDiscountTypeType() {
        var url = `/common/reference/discountType`;
        return Method.dataGet(url, token);
    },

    /////types of competition in competition fees section from reference table
    getTypesOfCompetition() {
        var url = `/common/reference/CompetitionType`;
        return Method.dataGet(url, token);
    },

    ////////competition format types in the competition fees section from the reference table
    getCompetitionFormatTypes() {
        var url = `/common/reference/CompetitionFormat`;
        return Method.dataGet(url, token);
    },
    //get registration invitees
    getRegistrationInvitees() {
        var url = "/common/reference/RegistrationInvitees";
        return Method.dataGet(url, token)
    },
    //get charity round up
    getCharityRoundUp() {
        var url = "/common/reference/CharityRoundUp";
        return Method.dataGet(url, token)
    },
    ///get payment option
    getPaymentOption() {
        var url = "/common/reference/PaymentOption";
        return Method.dataGet(url, token)
    },
    // get government vouchers
    getGovtVouchers() {
        var url = '/common/reference/GovernmentVoucher';
        return Method.dataGet(url, token)
    },

    ////get the competition fees all the data in one API
    async getAllCompetitionFeesDeatils(competitionId, sourceModule) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        // if (userId !== user_Id) {
        //     history.push("/")
        // }
        var url = `/api/competitionfee/competitiondetails?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}&sourceModule=${sourceModule}`;
        return Method.dataGet(url, token);
    },

    ///////////save the competition fees deatils 
    async saveCompetitionFeesDetails(payload, sourceModule) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/competitionfee/detail?organisationUniqueKey=${organisationUniqueKey}&sourceModule=${sourceModule}`;
        return Method.dataPost(url, token, payload);
    },

    /////save the competition membership tab details
    async  saveCompetitionFeesMembershipTab(payload, competitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `api/competitionfee/membership?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
    },

    ////get default competition membershipproduct tab details
    async getDefaultCompFeesMembershipProduct(hasRegistration) {
        let orgItem = await getOrganisationData();
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/competitionfee/membershipdetails?organisationUniqueKey=${organisationUniqueKey}&hasRegistration=${hasRegistration}`;
        return Method.dataGet(url, token);
    },

    /////save the division table data  in the competition fees section
    async  saveCompetitionFeesDivisionAction(payload, competitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let sourceModule = payload.sourceModule != undefined ? payload.sourceModule : "REG";
        var url = `/api/competitionfee/division?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}&sourceModule=${sourceModule}`;
        return Method.dataPost(url, token, payload);
    },
    //casual PaymentOption
    getCasualPayment() {
        var url = "/common/reference/CasualPaymentOption";
        return Method.dataGet(url, token)
    },

    //seasonal PaymentOption
    getSeasonalPayment() {
        var url = "/common/reference/SeasonalPaymentOption";
        return Method.dataGet(url, token)
    },

    //post payment
    async postCompetitionPayment(payload, competitionId, organisationKey) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/competitionfee/paymentoption?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}`
        return Method.dataPost(url, token, payload)
    },


    // Post competition fee section
    async postCompetitionFeeSection(payload, competitionId, organisationKey) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/competitionfee/fees?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}`
        return Method.dataPost(url, token, payload)
    },
    //post competition fee discount 
    async postCompetitonFeeDiscount(payload, competitionId, organisationKey) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/competitionfee/discount?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}`
        return Method.dataPost(url, token, payload)
    },

    /////get the membership product discount Types
    competitionFeeDiscountTypes() {
        var url = `/api/competitionfee/competitiondiscounttype/default`;
        return Method.dataGet(url, token);
    },

    ///////get the default competition logo api
    async getDefaultCompFeesLogo() {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/competitionfee/getOrganisationLogo/${organisationUniqueKey}`;
        // var url = `/api/competitionfee/getOrganisationLogo/${"sd-gdf45df-09486-sdg5sfd-546sdf"}`;
        return Method.dataGet(url, token);
    },

    //////get the divisions list on the basis of year and competition
    async getDivisionsList(yearRefId, competitionId, sourceModule) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let payload = {
            organisationUniqueKey: organisationUniqueKey,
            sourceModule: sourceModule
        }
        var url = `/api/competitionfee/divisionsByCompetition?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}`;
        return Method.dataPost(url, token, payload);
    },

    ///// Get Competition Venue 
    getCompetitionVenue(competitionId) {
        var url = `/api/competitionfee/getVenues/${competitionId}`;
        return Method.dataGet(url, token);
    },
    // save end user registration
    saveEndUserRegistration(payload) {
        var url = `/api/registration/save`;
        return Method.dataPost(url, token, payload);
    },
    // save end user registration
    async  getOrgRegistrationRegistrationSettings(payload) {
        let userId = await getUserId()
        var url = `/api/registration/registrationsettings?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },
    //get end user membership products
    async  getEndUserRegMembershipProducts(payload) {
        let userId = await getUserId()
        var url = `/api/registration/membershipproducts?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },


    //registration dash list 
    async registrationDashboardList(offset, yearRefId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            paging: {
                offset: offset,
                limit: 10
            }
        };
        var url = `/api/orgregistration/dashboard/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, body);
    },

    async homeDashboardApi(yearRefId) {
        let userId = await getUserId()
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem.organisationUniqueKey
        let body = {
            organisationUniqueKey: organisationUniqueKey,
            yearRefId: yearRefId,
            userId: userId
        }
        var url = `api/homedashboard/usercount`;
        // var url = `/api/home/registrations?yearRefId=${yearRefId}`
        return Method.dataPost(url, token, body);
    },

    //// Search Invitee
    async onInviteeSearch(action) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem.organisationUniqueKey
        let body = {
            organisationId: organisationUniqueKey,
            invitorId: action.inviteesType,
            search: action.value
        }
        var url = `api/affiliates/affiliatedOrganisation`;
        return Method.dataPost(url, token, body);
    },
    endUserRegDashboardList(payload) {
        var url = `/api/registration/dashboard`;
        return Method.dataPost(url, token, payload);
    },

    ///////////Delete Competition Division
    async deleteCompetitionDivision(payload) {
        var url = `/api/competitionfee/competitiondivision/delete`;
        return Method.dataPost(url, token, payload);
    },

    ///registration wizard 
    async getAllCompetitionList(yearId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem.organisationUniqueKey
        // var url = `/api/orgregistration/competitionyear/${year}`;
        var url = `/api/competitionfee/registrationWizard?organisationUniqueKey=${organisationUniqueKey}&yearId=${yearId}`;
        return Method.dataGet(url, token);
    },

    ////////////get the membership fee list in registration
    async registrationMainDashboardList(yearId) {
        let orgItem = await getOrganisationData()
        let organisationKey = orgItem.organisationUniqueKey
        let body = {
            organisationUniqueKey: organisationKey,
            yearRefId: yearId
        }
        var url = `/api/homedashboard/registration`;
        return Method.dataPost(url, token, body);
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
                    console.log(err.response)
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
                    console.log(err.response)
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
                    console.log(err.response)
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
    }
};


export default AxiosApi;
