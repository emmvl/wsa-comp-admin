// set competition id
const setCompetitionID = competitionId => {
    console.log(competitionId, " is id");
    localStorage.setItem("competitionId", competitionId)

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
    // console.log(token, 'token')
    localStorage.setItem("token", token);
}
// get Auth Token
const getAuthToken = token => {
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
/// get own competition
const getOwn_competition = () => {
    return localStorage.own_competition
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

// get Participating  Year
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
}