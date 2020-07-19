import { message } from "antd";

import userHttp from "./userHttp";
import history from "../../../util/history";
import ValidationConstants from "../../../themes/validationConstant";
import { getUserId, getAuthToken /* , getOrganisationData */ } from "../../../util/sessionStorage"

let token = getAuthToken();
let userId = getUserId();

// const internetStatus = navigator.onLine ? true : false;

async function logout() {
  await localStorage.clear();
  history.push("/");
}

let userHttpApi = {
  Login(payload) {
    const base64 = require("base-64");
    const md5 = require("md5");
    let authorization = base64.encode(
      payload.userName + ":" + md5(payload.password)
    );
    const url = "/users/loginWithTfa";
    return Method.dataGet(url, authorization);
  },

  QrCode(payload) {
    const base64 = require("base-64");
    const md5 = require("md5");
    let authorization = base64.encode(
      payload.userName + ":" + md5(payload.password) + ":" + payload.code
    );
    const url = "/users/confirmTfa";
    return Method.dataGet(url, authorization);
  },

  //role Api
  role() {
    const url = "/ref/roles";
    return Method.dataGet(url, token);
  },

  // User Role Entity Api
  ure() {
    const url = "/ure";
    return Method.dataGet(url, token);
  },

  async saveAffiliate(payload) {
    let userId = await getUserId()
    const url = `api/affiliates/save?userId=${userId}`;
    return Method.dataPost(url, token, payload);
  },

  async affiliateByOrganisationId(organisationId) {
    let userId = await getUserId()
    const url = `api/affiliate/${organisationId}?userId=${userId}`;
    return Method.dataGet(url, token);
  },

  async affiliatesListing(payload) {
    let userId = await getUserId()
    const url = `api/affiliateslisting?userId=${userId}`;
    return Method.dataPost(url, token, payload);
  },

  async affiliateToOrganisation(organisationId) {
    let userId = await getUserId()
    const url = `api/affiliatedtoorganisation/${organisationId}?userId=${userId}`;
    return Method.dataGet(url, token);
  },

  async getVenueOrganisation() {
    let userId = await getUserId()
    const url = `api/organisation?userId=${userId}`;
    return Method.dataGet(url, token)
  },

  liveScoreManagerList(roleId, entityTypeId, entityId, searchText) {
    // let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))

    let url = ''
    if (searchText) {
      url = `/users/byRole?roleId=${roleId}&entityTypeId=${entityTypeId}&entityId=${entityId}&userName=${searchText}`;
    } else {
      url = `/users/byRole?roleId=${roleId}&entityTypeId=${entityTypeId}&entityId=${entityId}`;
    }
    return Method.dataGet(url, token)
  },

  affiliateDelete(affiliateId) {
    const url = `api/affiliate/delete?userId=${userId}`;
    let payload = { affiliateId: affiliateId };
    return Method.dataPost(url, token, payload);
  },

  //// get particular user organisation
  async getUserOrganisation() {
    const user_Id = await getUserId()
    const Auth_token = await getAuthToken()
    const url = `api/userorganisation?userId=${user_Id}`;
    return Method.dataGet(url, Auth_token)
  },

  getUserDashboardTextualListing(payload) {
    const url = `api/user/dashboard/textual`;
    return Method.dataPost(url, token, payload);
  },

  getUserModulePersonalData(payload) {
    const url = `api/user/personaldetails?userId=${payload.userId}&organisationId=${payload.organisationId}`;
    return Method.dataGet(url, token);
  },

  getUserModulePersonalByCompData(payload) {
    const url = `api/user/personaldetails/competition`;
    return Method.dataPost(url, token, payload);
  },

  getUserModuleMedicalInfo(payload) {
    const url = `api/user/medical`;
    return Method.dataPost(url, token, payload);
  },

  getUserModuleRegistrationData(payload) {
    const url = `api/user/registration`;
    return Method.dataPost(url, token, payload);
  },

  getUserModuleActivityPlayer(payload) {
    const url = `api/user/activity/player`;
    return Method.dataPost(url, token, payload);
  },

  getUserModuleActivityParent(payload) {
    const url = `api/user/activity/parent`;
    return Method.dataPost(url, token, payload);
  },

  getUserModuleActivityScorer(payload) {
    const url = `api/user/activity/scorer`;
    return Method.dataPost(url, token, payload);
  },

  getUserModuleActivityManager(payload) {
    const url = `api/user/activity/manager`;
    return Method.dataPost(url, token, payload);
  },

  liveScoreSearchManager(data, competition_Id) {
    // let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
    if (data) {
      const url = `users/byRole?roleId=5&entityTypeId=1&entityId=${competition_Id}&userName=${data}`;
      return Method.dataGet(url, token);
    }
  },

  // Search scorer
  scorerSearchApi(functionId, entityTypeId, competitionId, searchText) {
    if (searchText && searchText.length > 0) {
      const url = `users/byFunction?functionId=${functionId}&entityTypeId=${entityTypeId}&entityId=${competitionId}&userName=${searchText}`
      return Method.dataGet(url, token)
    }
  },

  getUserFriendList(payload) {
    const url = `users/dashboard/friend`;
    return Method.dataPost(url, token, payload);
  },

  getUserReferFriendList(payload) {
    const url = `users/dashboard/referfriend`;
    return Method.dataPost(url, token, payload);
  },

  async getOrgPhotosList(payload) {
    // let organisationUniqueKey = await getOrganisationData().organisationUniqueKey;
    const url = `api/organisationphoto/list?organisationUniqueKey=${payload.organisationId}`;
    return Method.dataGet(url, token, payload);
  },

  saveOrgPhoto(payload) {
    // let organisationUniqueKey = await getOrganisationData().organisationUniqueKey;
    const url = `api/organisationphoto/save`;
    return Method.dataPost(url, token, payload);
  },

  deleteOrgPhoto(payload) {
    // let organisationUniqueKey = await getOrganisationData().organisationUniqueKey;
    const url = `api/organisationphoto/delete/${payload.id}`;
    return Method.dataDelete(url, token);
  },

  ////forgot password
  forgotPassword(email, resetType) {
    const param = encodeURIComponent(email);
    const url = `password/forgot?email=${param}&type=${resetType}`;
    return Method.dataGet(url, token);
  },

  //liveScore coaches list
  liveScoreCoachesList(roleId, entityTypeId, entityId, search) {
    let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
    let url = `/users/byRole?roleId=${roleId}&entityTypeId=1&entityId=${id}&userName=${search}`
    return Method.dataGet(url, localStorage.token);
  },

  deleteOrgContact(payload) {
    // let organisationUniqueKey = await getOrganisationData().organisationUniqueKey;
    const url = `api/affiliate/user/delete/${payload.id}?organisationUniqueKey=${payload.organisationId}`;
    return Method.dataDelete(url, token);
  },

  exportOrgRegQuestions(payload) {
    const url = `api/export/registration/questions`;
    return Method.dataPostDownload(url, token, payload, "RegistrationQuestions");
  },

  async affiliateDirectory(payload) {
    const url = `api/affiliatedirectory`;
    return Method.dataPost(url, token, payload);
  },

  exportAffiliateDirectory(payload) {
    const url = `api/export/affiliatedirectory`;
    return Method.dataPostDownload(url, token, payload, "AffiliateDirectory");
  },

  umpireList(data) {
    let url = ''
    if (data.userName) {
      url = `/users/byRole?roleId=${data.refRoleId}&entityTypeId=${data.entityTypes}&entityId=${data.compId}&userName=${data.userName}&offset=${data.offset}&limit=${10}`
    } else {
      url = `/users/byRole?roleId=${data.refRoleId}&entityTypeId=${data.entityTypes}&entityId=${data.compId}&offset=${0}&limit=${10}`
    }

    return Method.dataGet(url, localStorage.token);
  },

  updateUserProfile(payload) {
    const url = `api/userprofile/update?section=${payload.section}`;
    return Method.dataPost(url, token, payload);
  },

  userExportFiles(url) {
    return Method.dataGetDownload(url, localStorage.token);
  },

  getUserHistory(payload) {
    const url = `api/user/history`;
    return Method.dataPost(url, token, payload);
  },

  saveUserPhoto(payload) {
    const url = `users/photo`;
    return Method.dataPost(url, token, payload);
  },

  getUserDetail() {
    const url = `users/profile`;
    return Method.dataGet(url, token);
  },

  saveUserDetail(payload) {
    const url = `users/profile`;
    return Method.dataPatch(url, token, payload);
  },

  updateUserPassword(payload) {
    const url = `users/updatePassword`;
    return Method.dataPatch(url, token, payload);
  }
}

let Method = {
  async dataPost(newUrl, authorization, body) {
    const url = newUrl;
    return await new Promise((resolve, reject) => {
      userHttp
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
            if (err.response.status !== null && err.response.status !== undefined) {
              if (err.response.status === 401) {
                let unauthorizedStatus = err.response.status
                if (unauthorizedStatus === 401) {
                  logout();
                  message.error(ValidationConstants.messageStatus401);
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

  async dataPostDownload(newUrl, authorization, body, fileName) {
    const url = newUrl;
    return await new Promise((resolve, reject) => {
      userHttp
        .post(url, body, {
          responseType: 'arraybuffer',
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Accept: "application/csv",
            Authorization: "BWSA " + authorization,
            "SourceSystem": "WebAdmin"
          }
        })
        .then(result => {
          if (result.status === 200) {
            console.log("*************" + JSON.stringify(result.data));
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

  async dataPatch(newUrl, authorization, body) {
    const url = newUrl;
    return await new Promise((resolve, reject) => {
      userHttp
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
                  status: 5,
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
  async dataGet(newUrl, authorization) {
    const url = newUrl;
    return await new Promise((resolve, reject) => {
      userHttp
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
              } else if (err.response.status === 404) {
                return reject({
                  status: 6,
                  error: err
                })
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

  async dataDelete(newUrl, authorization) {
    const url = newUrl;
    return await new Promise((resolve, reject) => {
      userHttp
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
                  logout();
                  message.error(ValidationConstants.messageStatus401);
                }
              } else {
                return reject({
                  status: 5,
                  error: err
                });
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

  async dataGetDownload(newUrl, authorization) {
    const url = newUrl;
    return await new Promise((resolve, reject) => {
      userHttp
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
            console.log("*************" + JSON.stringify(result.data));
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
};

export default userHttpApi;