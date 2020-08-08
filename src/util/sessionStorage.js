// set competition id
const setCompetitionID = competitionId => {
  localStorage.setItem("competitionId", competitionId);

}

// get competition id
const getCompetitonId = key => {
  return localStorage.competitionId
}

const getLiveScoreCompetiton = () => {
  return localStorage.LiveScoreCompetiton
}

// Set Auth Token
const setAuthToken = token => {
  localStorage.setItem("token", token);
}

// get Auth Token
const getAuthToken = () => {
  return localStorage.token
}

// Set User Id
const setUserId = userId => {
  localStorage.setItem("userId", userId)
}

// get User Id
const getUserId = () => {
  return localStorage.userId
}

// Set Own  Year
const setOwnCompetitionYear = own_year => {
  localStorage.setItem("own_year", own_year)
}

// get Own  Year
const getOwnCompetitionYear = () => {
  return localStorage.own_year
}

// Set  own competition 
const setOwn_competition = own_competition => {
  localStorage.setItem("own_competition", own_competition)
}

// get own competition 
const getOwn_competition = () => {
  return localStorage.own_competition
}
// Set  own competition  Status
const setOwn_competitionStatus = own_competitionStatus => {
  localStorage.setItem("own_competitionStatus", own_competitionStatus)
}

// get own competition status
const getOwn_competitionStatus = () => {
  return localStorage.own_competitionStatus
}

const setOrganisationData = (organisationData) => {
  let data = JSON.stringify(organisationData)
  localStorage.setItem("setOrganisationData", data)
}

const getOrganisationData = () => {
  return localStorage.setOrganisationData ? JSON.parse(localStorage.setOrganisationData) : null
}

// set Participating Year
const setParticipatingYear = Participate_year => {
  localStorage.setItem("Participate_year", Participate_year)
}

// get Participating Year
const getParticipatingYear = () => {
  return localStorage.Participate_year
}

// Set  Participating competition 
const setParticipating_competition = Participating_competition => {
  localStorage.setItem("Participating_competition", Participating_competition)
}

// get Participating competition
const getParticipating_competition = () => {
  return localStorage.Participating_competition
}
// Set  Participating competition  status
const setParticipating_competitionStatus = Participating_competitionStaus => {
  localStorage.setItem("Participating_competitionStaus", Participating_competitionStaus)
}

// get Participating competition status
const getParticipating_competitionStatus = () => {
  return localStorage.Participating_competitionStaus
}

const setDraws_venue = draws_venue => {
  localStorage.setItem("draws_venue", draws_venue)
}

const getDraws_venue = () => {
  return localStorage.draws_venue
}

const setDraws_round = draws_round => {
  localStorage.setItem("draws_round", draws_round)
}

const getDraws_round = () => {
  return localStorage.draws_round
}

const setDraws_roundTime = draws_roundTime => {
  localStorage.setItem("draws_roundTime", draws_roundTime)
}

const getDraws_roundTime = () => {
  return localStorage.draws_roundTime
}

const setDraws_division_grade = draws_division_grade => {
  localStorage.setItem("draws_division_grade", draws_division_grade)
}

const getDraws_division_grade = () => {
  return localStorage.draws_division_grade
}

const getUmpireCompetiton = () => {
  return localStorage.umpireCompetitionId
}

const setUmpireCompition = umpireCompetitionId => {
  localStorage.setItem("umpireCompetitionId", umpireCompetitionId)
}

const getUmpireCompetitonData = () => {
  return localStorage.umpireCompetitionData
}

const setUmpireCompitionData = umpireCompetitionData => {
  localStorage.setItem("umpireCompetitionData", umpireCompetitionData)
}

const getUmpireCompId = () => {
  return localStorage.umpireCompId
}

const setUmpireCompId = umpireCompId => {
  localStorage.setItem("umpireCompId", umpireCompId)
}

const clearUmpireStorage = () => {
  let keysToRemove = ["umpireCompId", "umpireCompetitionData", "umpireCompetitionId"];
  for (let key of keysToRemove) {
    localStorage.removeItem(key);
  }
}

const getLiveScoreUmpireCompitionData = () => {
  return localStorage.liveScoreUmpireCompetitionData
}

const setLiveScoreUmpireCompitionData = liveScoreUmpireCompetitionData => {
  localStorage.setItem("liveScoreUmpireCompetitionData", liveScoreUmpireCompetitionData)
}

const setLiveScoreUmpireCompition = liveScoreUmpireCompetitionId => {
  localStorage.setItem("liveScoreUmpireCompetitionId", liveScoreUmpireCompetitionId)
}

const getLiveScoreUmpireCompition = () => {
  return localStorage.liveScoreUmpireCompetitionId
}

const setKeyForStateWideMessage = stateWideMessege => {
  localStorage.setItem("stateWideMessege", stateWideMessege)
  console.log(stateWideMessege, 'stateWideMessege')
}

const getKeyForStateWideMessage = () => {
  return localStorage.stateWideMessege
}

const setImpersonation = (impersonationOrgData) => {
  const data = JSON.stringify(impersonationOrgData)
  localStorage.setItem('impersonation', data);
};

const getImpersonation = async () => {
  const dataStr = await localStorage.getItem('impersonation');

  if (dataStr !== 'undefined') {
    return JSON.parse(dataStr);
  }

  return null;
};

module.exports = {
  setCompetitionID, getCompetitonId,
  setAuthToken, getAuthToken,
  setUserId, getUserId,
  setOwnCompetitionYear,
  getOwnCompetitionYear,
  setOwn_competition,
  getOwn_competition,
  setOrganisationData,
  getOrganisationData,
  setParticipatingYear,
  getParticipatingYear,
  setParticipating_competition,
  getParticipating_competition,
  getLiveScoreCompetiton,
  setDraws_venue,
  getDraws_venue,
  setDraws_round,
  getDraws_round,
  setDraws_roundTime,
  getDraws_roundTime,
  setDraws_division_grade,
  getDraws_division_grade,
  getUmpireCompetiton,
  setUmpireCompition,
  setUmpireCompitionData,
  getUmpireCompetitonData,
  getUmpireCompId,
  setUmpireCompId,
  clearUmpireStorage,
  getLiveScoreUmpireCompitionData,
  setLiveScoreUmpireCompitionData,
  setLiveScoreUmpireCompition,
  getLiveScoreUmpireCompition,
  setKeyForStateWideMessage,
  getKeyForStateWideMessage,
  setOwn_competitionStatus,
  getOwn_competitionStatus,
  getParticipating_competitionStatus,
  setParticipating_competitionStatus,
  setImpersonation,
  getImpersonation,
}
