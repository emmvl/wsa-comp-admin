function getGoalListData(data) {
  var goalArray = [];
  for (let i in data) {
    var object = this.getGoalListObject(data[i]);
    goalArray.push(object);
  }
  return goalArray;
}

//// Goal Type Match

function getGoalListObject(data) {
  return {
    matchId: data.matchId,
    startTime: data.startTime,
    teamId: data.teamId,
    teamName: data.teamName,
    playerId: data.playerId,
    firstName: data.firstName,
    lastName: data.lastName,
    gamePositionName: data.gamePositionName,
    goal: data.goal,
    miss: data.miss,
    penalty_miss: data.penalty_miss,
    goal_percent: (data.goal_percent * 100).toFixed(2) + '%',
    attempts: Number(data.goal) + Number(data.miss),
  };
}

//// Goal Type All

function getGoalTypeAllData(data) {
  var goalArray = [];
  for (let i in data) {
    var object = this.getGoalTypeAllObject(data[i]);
    goalArray.push(object);
  }
  return goalArray;
}

function getGoalTypeAllObject(data) {
  return {
    teamId: data.teamId,
    teamName: data.teamName,
    playerId: data.playerId,
    firstName: data.firstName,
    lastName: data.lastName,
    gamePositionName: data.gamePositionName,
    goal: data.goal,
    miss: data.miss,
    penalty_miss: data.penalty_miss,
    goal_percent: (data.goal_percent * 100).toFixed(2) + '%',
    attempts: Number(data.goal) + Number(data.miss),
  };
}

module.exports = { getGoalListData, getGoalListObject, getGoalTypeAllData, getGoalTypeAllObject };
