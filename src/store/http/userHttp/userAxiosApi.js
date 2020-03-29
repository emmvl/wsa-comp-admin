// import userHttp from './userHttp';
import userHttp from "./userHttp";
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"


let token = getAuthToken();
let userId = getUserId()

async function logout() {
  await localStorage.clear();
  history.push("/");
}

let userHttpApi = {


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

  saveAffiliate(payload) {
    var url = `api/affiliates/save?userId=${userId}`;
    return Method.dataPost(url, token, payload);
  },
  affiliateByOrganisationId(organisationId) {
    var url = `api/affiliate/${organisationId}?userId=${userId}`;
    return Method.dataGet(url, token);
  },
  affiliatesListing(payload) {
    var url = `api/affiliateslisting?userId=${userId}`;
    return Method.dataPost(url, token, payload);
  },
  affiliateToOrganisation(organisationId) {
    var url = `api/affiliatedtoorganisation/${organisationId}?userId=${userId}`;
    return Method.dataGet(url, token);
  },
  getVenueOrganisation() {
    var url = `api/organisation?userId=${userId}`;
    return Method.dataGet(url, token)
  },
  liveScoreManagerList(roleId, entityTypeId, entityId) {
    let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
    var url = `/users/byRole?roleId=${roleId}&entityTypeId=${entityTypeId}&entityId=${id}`;
    return Method.dataGet(url, token)
  },

  affiliateDelete(affiliateId) {
    var url = `api/affiliate/delete?userId=${userId}`;
    let payload = { affiliateId: affiliateId };
    return Method.dataPost(url, token, payload);
  },

  //// get particular user organisation 
  getUserOrganisation() {
    var url = `api/userorganisation?userId=${userId}`;
    return Method.dataGet(url, token)
  },
  getUserDashboardTextualListing(payload) {
    var url = `api/user/dashboard/textual`;
    return Method.dataPost(url, token, payload);
  },
  getUserModulePersonalData(payload) {
    var url = `api/user/personaldetails?userId=${payload}`;
    return Method.dataGet(url, token);
  },
  getUserModulePersonalByCompData(payload) {
    var url = `api/user/personaldetails/competition`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleMedicalInfo(payload) {
    var url = `api/user/medical`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleRegistrationData(payload) {
    var url = `api/user/registration`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleActivityPlayer(payload) {
    var url = `api/user/activity/player`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleActivityParent(payload) {
    var url = `api/user/activity/parent`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleActivityScorer(payload) {
    var url = `api/user/activity/scorer`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleActivityManager(payload) {
    var url = `api/user/activity/manager`;
    return Method.dataPost(url, token, payload);
  },

  liveScoreSearchManager(data) {
    console.log(data, 'liveScoreSearchManager')
    let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
    if (data) {
      var url = `users/byRole?roleId=5&entityTypeId=1&entityId=${1}&userName=${data}`;
      return Method.dataGet(url, token);
    }

  }
}

let Method = {
  async dataPost(newurl, authorization, body) {
    const url = newurl;
    return await new Promise((resolve, reject) => {
      userHttp
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
      userHttp
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
      userHttp
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
};

export default userHttpApi;