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

  async saveAffiliate(payload) {
    let userId = await getUserId()
    var url = `api/affiliates/save?userId=${userId}`;
    return Method.dataPost(url, token, payload);
  },
  async affiliateByOrganisationId(organisationId) {
    let userId = await getUserId()
    var url = `api/affiliate/${organisationId}?userId=${userId}`;
    return Method.dataGet(url, token);
  },
  async affiliatesListing(payload) {
    let userId = await getUserId()
    var url = `api/affiliateslisting?userId=${userId}`;
    return Method.dataPost(url, token, payload);
  },
  async affiliateToOrganisation(organisationId) {
    let userId = await getUserId()
    var url = `api/affiliatedtoorganisation/${organisationId}?userId=${userId}`;
    return Method.dataGet(url, token);
  },
  async getVenueOrganisation() {
    let userId = await getUserId()
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
  async getUserOrganisation() {
    const user_Id = await getUserId()
    const Auth_token = await getAuthToken()
    var url = `api/userorganisation?userId=${user_Id}`;
    return Method.dataGet(url, Auth_token)
  },
  getUserDashboardTextualListing(payload) {
    var url = `api/user/dashboard/textual`;
    return Method.dataPost(url, token, payload);
  },
  getUserModulePersonalData(payload) {
    var url = `api/user/personaldetails?userId=${payload.userId}&organisationId=${payload.organisationId}`;
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

  liveScoreSearchManager(data, competition_Id) {
    console.log(data, 'liveScoreSearchManager')
    let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
    if (data) {
      var url = `users/byRole?roleId=5&entityTypeId=1&entityId=${competition_Id}&userName=${data}`;
      return Method.dataGet(url, token);
    }
  },

  // Search scorer 
  scorerSearchApi(functionId, entityTypeId, competitionId, searchText) {
    
    if(searchText && searchText.length>0){
      var url = `users/byFunction?functionId=${functionId}&entityTypeId=${entityTypeId}&entityId=${competitionId}&userName=${searchText}`
 
      return Method.dataGet(url, token)
    }
},
getUserFriendList(payload) {
  var url = `api/user/dashboard/friend`;
  return Method.dataPost(url, token, payload);
},

getUserReferFriendList(payload) {
  var url = `api/user/dashboard/referfriend`;
  return Method.dataPost(url, token, payload);
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