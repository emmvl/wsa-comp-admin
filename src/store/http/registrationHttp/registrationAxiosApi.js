// import { DataManager } from './../../Components';
import { message } from "antd";
import moment from 'moment';
import http from "./registrationHttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage";
import history from "../../../util/history";
import ValidationConstants from "../../../themes/validationConstant";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

const token = getAuthToken();
// let organisationUniqueKey = "sd-gdf45df-09486-sdg5sfd-546sdf"
const AxiosApi = {
    // /login Api call
    Login(payload) {
        const base64 = require("base-64");
        const md5 = require("md5");
        const authorization = base64.encode(
            `${payload.userName}:${md5(payload.password)}`,
        );
        const url = "/users/loginWithEmailPassword";
        return Method.dataGet(url, authorization);
    },

    // role Api
    role() {
        const url = "/ref/roles";
        return Method.dataGet(url, token);
    },

    // User Role Entity Api
    ure() {
        const url = "/ure";
        return Method.dataGet(url, token);
    },

    /// /registrationMembershipFeeList in membership table in the registration tab
    async registrationCompetitionFeeList(offset, limit, yearRefId, searchText, sortBy, sortOrder) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            paging: {
                offset,
                limit,
            },
        };
        let url = `/api/competitionfee/listing/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}&search=${searchText}`;
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        // var url = `/api/competitionfee/listing/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}&search=${"umpire"}`;
        return Method.dataPost(url, token, body);
    },

    /// /registrationMembershipFeeList in membership table in the registration tab
    async registrationMembershipFeeList(offset, limit, yearRefId, sortBy, sortOrder) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            paging: {
                offset,
                limit,
            },
        };
        let url = `/api/membershipproductfee/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}`;
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        return Method.dataPost(url, token, body);
    },

    /// registration Competition fee list product delete
    async registrationCompetitionFeeListDelete(competitionId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/competitionfee/${competitionId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataDelete(url, token);
    },

    /// registration membership fee list product delete
    async registrationMembershipFeeListDelete(payload) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const { productId } = payload;
        const url = `/api/membershipproduct/${productId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataDelete(url, token);
    },

    /// ///get the membership  product details
    // regGetMembershipProductDetails(payload) {
    //     let productId = payload.productId;
    //     var url = `/api/membershipproduct/${productId}`;
    //     return Method.dataGet(url, token);
    // },

    /// ///get the membership  product details
    async regGetMembershipProductDetails(payload) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const { productId } = payload;
        const url = `api/membershipproduct/details/${productId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },

    /// ///save the membership  product details
    async regSaveMembershipProductDetails(payload) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/membershipproduct?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
    },
    // post regsitration form save
    async regSaveRegistrationForm(payload) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/orgregistration?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
    },

    /// //get the common year list reference
    getYearList() {
        const url = `/common/reference/year`;
        return Method.dataGet(url, token);
    },

    /// //get the common membership product validity type list reference
    getProductValidityList() {
        const url = `/common/reference/MembershipProductValidity`;
        return Method.dataGet(url, token);
    },

    /// //get the common Competition type list reference
    async getCompetitionTypeList(year) {
        const orgItem = await getOrganisationData();
        const { organisationUniqueKey } = orgItem;
        // var url = `/api/orgregistration/competitionyear/${year}`;
        const url = `/api/orgregistration/competitionyear/${year}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },
    // get own competition list
    async getOwnCompetitionList(year) {
        const orgItem = await getOrganisationData();
        const { organisationUniqueKey } = orgItem;
        // var url = `/api/orgregistration/competitionyear/${year}`;
        const url = `/api/orgregistration/competition/${year}?organisationUniqueKey=${organisationUniqueKey}&listedCompetitions=owned`;
        return Method.dataGet(url, token);
    },
    // get participate competition list
    async getParticipateCompetitionList(year) {
        const orgItem = await getOrganisationData();
        const { organisationUniqueKey } = orgItem;
        // var url = `/api/orgregistration/competitionyear/${year}`;
        const url = `/api/orgregistration/competition/${year}?organisationUniqueKey=${organisationUniqueKey}&listedCompetitions=participating`;
        return Method.dataGet(url, token);
    },

    // get venue for registration form
    async getVenue() {
        const organisationId = await getOrganisationData().organisationUniqueKey;
        const url = `/api/venue/all?organisationUniqueKey=${organisationId}`;
        return Method.dataGet(url, token);
    },
    // get reg form settings
    getRegFormSetting() {
        const url = "/common/reference/RegistrationSettings";
        return Method.dataGet(url, token);
    },
    // get registration form registration method
    getRegFormMethod() {
        const url = "/common/reference/RegistrationMethod";
        return Method.dataGet(url, token);
    },
    // get membership products in registration products
    getMembershipProductList(CompetitionId) {
        const url = `/api/details/membershipproduct/${CompetitionId}`;
        return Method.dataGet(url, token);
    },

    // get registration form  data
    async getRegistrationForm(year, CompetitionId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            yearRefId: year,
            competitionUniqueKey: CompetitionId,
        };
        const url = `/api/orgregistration/details?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, body);
    },
    /// ////////get the default membership  product types in registartion membership fees
    regDefaultMembershipProductTypes() {
        const url = `api/membershipproducttype/default`;
        return Method.dataGet(url, token);
    },

    /// ///save the membership  product Fees
    async regSaveMembershipProductFee(payload) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/membershipproduct/fees?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
    },
    /// ///save the membership  product Discount
    async regSaveMembershipProductDiscount(payload) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/membershipproduct/discount?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, payload);
    },
    /// //get the membership product discount Types
    membershipProductDiscountTypes() {
        const url = `/api/membershipproductdiscounttype/default`;
        return Method.dataGet(url, token);
    },

    /// //get the common Membership Product Fees Type
    getMembershipProductFeesType() {
        const url = `/common/reference/MembershipProductFeesType`;
        return Method.dataGet(url, token);
    },
    /// /get commom reference discount type
    getCommonDiscountTypeType() {
        const url = `/common/reference/discountType`;
        return Method.dataGet(url, token);
    },

    /// //types of competition in competition fees section from reference table
    getTypesOfCompetition() {
        const url = `/common/reference/CompetitionType`;
        return Method.dataGet(url, token);
    },

    /// /////competition format types in the competition fees section from the reference table
    getCompetitionFormatTypes() {
        const url = `/common/reference/CompetitionFormat`;
        return Method.dataGet(url, token);
    },
    // get registration invitees
    getRegistrationInvitees() {
        const url = "/common/reference/RegistrationInvitees";
        return Method.dataGet(url, token);
    },
    // get charity round up
    getCharityRoundUp() {
        const url = "/common/reference/CharityRoundUp";
        return Method.dataGet(url, token);
    },
    /// get payment option
    getPaymentOption() {
        const url = "/common/reference/PaymentOption";
        return Method.dataGet(url, token);
    },
    // get government vouchers
    getGovtVouchers() {
        const url = '/common/reference/GovernmentVoucher';
        return Method.dataGet(url, token);
    },

    /// /get the competition fees all the data in one API
    async getAllCompetitionFeesDeatils(competitionId, sourceModule, affiliateOrgId) {
        // const userId = await getUserId();
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        // if (userId !== user_Id) {
        //     history.push("/")
        // }
        const url = `/api/competitionfee/competitiondetails?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}&sourceModule=${sourceModule}&affiliateOrgId=${affiliateOrgId}`;
        return Method.dataGet(url, token);
    },

    /// ////////save the competition fees deatils
    async saveCompetitionFeesDetails(payload, sourceModule, affiliateOrgId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/competitionfee/detail?organisationUniqueKey=${organisationUniqueKey}&sourceModule=${sourceModule}&affiliateOrgId=${affiliateOrgId}`;
        return Method.dataPost(url, token, payload);
    },

    /// //save the competition membership tab details
    async saveCompetitionFeesMembershipTab(payload, competitionId, affiliateOrgId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `api/competitionfee/membership?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}&affiliateOrgId=${affiliateOrgId}`;
        return Method.dataPost(url, token, payload);
    },

    /// /get default competition membershipproduct tab details
    async getDefaultCompFeesMembershipProduct(hasRegistration, yearRefId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/competitionfee/membershipdetails?organisationUniqueKey=${organisationUniqueKey}&hasRegistration=${hasRegistration}&yearRefId=${yearRefId}`;
        return Method.dataGet(url, token);
    },

    /// //save the division table data  in the competition fees section
    async saveCompetitionFeesDivisionAction(payload, competitionId, affiliateOrgId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const sourceModule = payload.sourceModule !== undefined ? payload.sourceModule : "REG";
        const url = `/api/competitionfee/division?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}&sourceModule=${sourceModule}&affiliateOrgId=${affiliateOrgId}`;
        return Method.dataPost(url, token, payload);
    },
    // casual PaymentOption
    getCasualPayment() {
        const url = "/common/reference/CasualPaymentOption";
        return Method.dataGet(url, token);
    },

    // seasonal PaymentOption
    getSeasonalPayment() {
        const url = "/common/reference/SeasonalPaymentOption";
        return Method.dataGet(url, token);
    },

    // post payment
    async postCompetitionPayment(payload, competitionId, affiliateOrgId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/competitionfee/paymentoption?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}&affiliateOrgId=${affiliateOrgId}`;
        return Method.dataPost(url, token, payload);
    },

    // Post competition fee section
    async postCompetitionFeeSection(payload, competitionId, affiliateOrgId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/competitionfee/fees?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}&affiliateOrgId=${affiliateOrgId} `;
        return Method.dataPost(url, token, payload);
    },
    // post competition fee discount
    async postCompetitonFeeDiscount(payload, competitionId, affiliateOrgId) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/competitionfee/discount?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}&affiliateOrgId=${affiliateOrgId}`;
        return Method.dataPost(url, token, payload);
    },

    /// //get the membership product discount Types
    competitionFeeDiscountTypes() {
        const url = `/api/competitionfee/competitiondiscounttype/default`;
        return Method.dataGet(url, token);
    },

    /// ////get the default competition logo api
    async getDefaultCompFeesLogo() {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const url = `/api/competitionfee/getOrganisationLogo/${organisationUniqueKey}`;
        // var url = `/api/competitionfee/getOrganisationLogo/${"sd-gdf45df-09486-sdg5sfd-546sdf"}`;
        return Method.dataGet(url, token);
    },

    /// ///get the divisions list on the basis of year and competition
    async getDivisionsList(yearRefId, competitionId, sourceModule) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const payload = {
            organisationUniqueKey,
            sourceModule,
        };
        const url = `/api/competitionfee/divisionsByCompetition?competitionUniqueKey=${competitionId}&yearRefId=${yearRefId}`;
        return Method.dataPost(url, token, payload);
    },

    /// // Get Competition Venue
    async getCompetitionVenue(competitionId, startDate, endDate) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const payload = {
            competitionUniqueKey: competitionId,
            organisationUniqueKey,
            startDate,
            endDate,
        };
        const url = `/api/competitionfee/getVenues`;
        return Method.dataPost(url, token, payload);
    },
    // save end user registration
    saveEndUserRegistration(payload) {
        const url = `/api/registration/save`;
        return Method.dataPost(url, token, payload);
    },
    // save end user registration
    async getOrgRegistrationRegistrationSettings(payload) {
        const userId = await getUserId();
        const url = `/api/registration/registrationsettings?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },
    // get end user membership products
    async getEndUserRegMembershipProducts(payload) {
        payload.currentDate = moment(new Date()).format('YYYY-MM-DD');
        const url = `/api/registration/membershipproducts`;
        return Method.dataPost(url, token, payload);
    },

    // registration dash list
    async registrationDashboardList(offset, limit, yearRefId, sortBy, sortOrder) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = {
            paging: {
                offset,
                limit,
            },
        };
        let url = `/api/orgregistration/dashboard/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}`;
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        return Method.dataPost(url, token, body);
    },

    async homeDashboardApi(yearRefId) {
        const userId = await getUserId();
        const orgItem = await getOrganisationData();
        const { organisationUniqueKey } = orgItem;
        const body = {
            organisationUniqueKey,
            yearRefId,
            userId,
        };
        const url = `api/homedashboard/usercount`;
        // var url = `/api/home/registrations?yearRefId=${yearRefId}`
        return Method.dataPost(url, token, body);
    },

    /// / Search Invitee
    async onInviteeSearch(action) {
        const orgItem = await getOrganisationData();
        const { organisationUniqueKey } = orgItem;
        const body = {
            organisationId: organisationUniqueKey,
            invitorId: action.inviteesType,
            search: action.value,
        };
        const url = `api/affiliates/affiliatedOrganisation`;
        return Method.dataPost(url, token, body);
    },
    endUserRegDashboardList(payload, sortBy, sortOrder) {
        let url = `/api/registration/dashboard`;
        if (sortBy && sortOrder) {
            url += `?sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        return Method.dataPost(url, token, payload);
    },

    /// ////////Delete Competition Division
    async deleteCompetitionDivision(payload) {
        const url = `/api/competitionfee/competitiondivision/delete`;
        return Method.dataPost(url, token, payload);
    },

    /// registration wizard
    async getAllCompetitionList(yearId) {
        const orgItem = await getOrganisationData();
        const { organisationUniqueKey } = orgItem;
        // var url = `/api/orgregistration/competitionyear/${year}`;
        const url = `/api/competitionfee/registrationWizard?organisationUniqueKey=${organisationUniqueKey}&yearId=${yearId}`;
        return Method.dataGet(url, token);
    },

    /// /////////get the membership fee list in registration
    async registrationMainDashboardList(yearId, sortBy, sortOrder) {
        const orgItem = await getOrganisationData();
        const organisationKey = orgItem.organisationUniqueKey;
        const body = {
            organisationUniqueKey: organisationKey,
            yearRefId: yearId,
        };
        let url = `/api/homedashboard/registration`;
        if (sortBy && sortOrder) {
            url += `?sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        return Method.dataPost(url, token, body);
    },
    updateCompetitionStatus(payload) {
        const body = payload;
        const url = `/api/competitionfee/status/update`;
        return Method.dataPost(url, token, body);
    },
    getTeamRegistrations(payload, sortBy, sortOrder) {
        let url;
        if (sortBy && sortOrder) {
            url = `/api/teamregistration/dashboard?sortBy=${sortBy}&sortOrder=${sortOrder}`;
        } else {
            url = `/api/teamregistration/dashboard`;
        }
        const body = payload;
        return Method.dataPost(url, token, body);
    },
    exportTeamRegistrations(payload) {
        const body = payload;
        const url = `/api/teamregistration/export`;
        return Method.dataPostDownload(url, token, body, "TeamRegistration");
    },
    saveDeRegister(payload) {
        const url = `/api/deregister`;
        return Method.dataPost(url, token, payload);
    },
    getRegistrationChangeDashboard(payload) {
        const url = `/api/registrationchange/dashboard`;
        return Method.dataPost(url, token, payload);
    },
    getRegistrationChangeReview(payload) {
        const url = `/api/registrationchange/review`;
        return Method.dataPost(url, token, payload);
    },
    saveRegistrationChangeReview(payload) {
        const url = `/api/registrationchange/review/save`;
        return Method.dataPost(url, token, payload);
    },
    getTransferOrganisationsData(payload) {
        const url = `/api/transfer/competitions?`;
        return Method.dataPost(url, token, payload);
    },
    async getOldMembershipProductsByCompId(payload) {
        const { competitionUniqueKey } = payload;
        const { organisationUniqueKey } = payload;
        const url = `api/competitionfee/membership?competitionUniqueKey=${competitionUniqueKey}&organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },

    async getNewMembershipProductsByYear(payload) {
        const { yearRefId } = payload;
        const { organisationUniqueKey } = payload;
        const url = `api/membershipproduct/all/${yearRefId}?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },
    updateRegTransaction(payload) {
        const url = `/api/registration/transaction/update`;
        return Method.dataPost(url, token, payload);
    },
    umpirePaymentTransfer(data) {
        const { postData } = data;
        const url = `/api/payments/umpireTransfer`;
        return Method.dataPost(url, token, postData);
    },
    getMembershipFeeCapList(organisationUniqueKey, yearRefId) {
        const url = `/api/membershipcap?organisationUniqueKey=${organisationUniqueKey}&yearRefId=${yearRefId}`;
        return Method.dataGet(url, token);
    },
    updateMembershipFeeCap(organisationUniqueKey, yearRefId, payload) {
        const url = `/api/membershipcap?organisationUniqueKey=${organisationUniqueKey}&yearRefId=${yearRefId}`;
        return Method.dataPost(url, token, payload);
    },
    getSingleGameList(payload) {
        const url = `/api/singlegame/list`;
        return Method.dataPost(url, token, payload);
    },
    singleGameRedeemPay(payload) {
        const url = `/api/singlegame/redeempay`;
        return Method.dataPost(url, token, payload);
    },
    teamMembersSave(payload) {
        const url = `api/registration/teamparticipant`;
        return Method.dataPost(url, token, payload);
    },

    getTeamMembers(teamMemberRegId) {
        const url = `api/registration/teamparticipantdata?teamMemberRegId=${teamMemberRegId}`;
        return Method.dataGet(url, token);
    },
    getTeamMembersReview(payload) {
        const url = `api/registration/teamparticipant/review?registrationId=${payload.registrationId}&teamMemberRegId=${payload.teamMemberRegId}`;
        return Method.dataGet(url, token);
    },
    updateTeamMembers(payload) {
        const url = `api/registration/teamparticipant/removeoradd?userRegUniqueKey=${payload.userRegUniqueKey}&processType=${payload.processType}`;
        return Method.dataPost(url, token, payload);
    },
    getPlayersToPayList(payload) {
        const url = `api/playerstopay/list`;
        return Method.dataPost(url, token, payload);
    },
    playersToPayRetryPayment(payload) {
        const url = `api/playerstopay/pay`;
        return Method.dataPost(url, token, payload);
    },
    playersToPayCashReceived(payload) {
        const url = `api/playerstopay/cash`;
        return Method.dataPost(url, token, payload);
    },
    cancelDeRegistration(payload) {
        const url = `/api/deregisterortransfer/cancel`;
        return Method.dataPost(url, token, payload);
    },
    async exportRegistraion(params) {
        const body = {
            ...params,
        };
        console.log('body for export', body);
        const url = `/api/registration/export`;
        return Method.dataPostDownload(url, token, body, "registrations");
    },

    updateRegistrationFailedStatus(payload) {
        const body = payload;
        const url = `/api/registration/status/update`;
        return Method.dataPost(url, token, body);
    },
    registrationRetryPayment(payload){
        const url = `api/payments/regitrations/retry`;
        return Method.dataPost(url, token, payload);
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
                    } if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    } if (result) {
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
                                const unauthorizedStatus = err.response.status;
                                if (unauthorizedStatus === 401) {
                                    logout();
                                    message.error(ValidationConstants.messageStatus401);
                                }
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                });
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
        return await new Promise((resolve, reject) => {
            http
                .get(url, {
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
                    } if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    } if (result) {
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
                                const unauthorizedStatus = err.response.status;
                                if (unauthorizedStatus === 401) {
                                    logout();
                                    message.error(ValidationConstants.messageStatus401);
                                }
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                });
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

    async dataDelete(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .delete(url, {
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
                    } if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    } if (result) {
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
                                const unauthorizedStatus = err.response.status;
                                if (unauthorizedStatus === 401) {
                                    logout();
                                    message.error(ValidationConstants.messageStatus401);
                                }
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                });
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
    async dataPostDownload(newUrl, authorization, body, fileName) {
        const url = newUrl;
        return await new Promise((resolve, reject) => {
            http
                .post(url, body, {
                    responseType: 'arraybuffer',
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Accept: "application/csv",
                        Authorization: `BWSA ${authorization}`,
                        SourceSystem: "WebAdmin",
                    },
                })
                .then((result) => {
                    if (result.status === 200) {
                        const url = window.URL.createObjectURL(new Blob([result.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${fileName}.csv`); // or any other extension
                        document.body.appendChild(link);
                        link.click();
                        return resolve({
                            status: 1,
                            result,
                        });
                    } if (result.status === 212) {
                        return resolve({
                            status: 4,
                            result,
                        });
                    } if (result) {
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
                                const unauthorizedStatus = err.response.status;
                                if (unauthorizedStatus === 401) {
                                    logout();
                                    message.error(ValidationConstants.messageStatus401);
                                }
                            } else {
                                return reject({
                                    status: 5,
                                    error: err,
                                });
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
};

export default AxiosApi;
