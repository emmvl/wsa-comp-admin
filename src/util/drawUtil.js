import moment from 'moment';
const getDate = date => {
  return date.slice(0, -5);
}

const checkDate =(date, index, dateArray)=> {
  if (index == 0) {
      return moment(date).format('DD MMM, ddd')
  } else {
      if (moment(dateArray[index].date).format('DD-MM-YYYY') == moment(dateArray[(index - 1)].date).format('DD-MM-YYYY')) {
          return moment(date).format('ddd')
      } else {
          return moment(date).format('DD MMM, ddd')
      }
  }
}
const getDiffBetweenStartAndEnd = eventObj => {
  const startTime = moment(eventObj.matchDate);
  const endTime = moment(getDate(eventObj.matchDate) + eventObj.endTime);
  const diffTime = endTime.diff(startTime, 'minutes');

  return diffTime;
}
const getNextEventForSwap = (data, date, eventIndex) => {
  const dataFiltered = data.filter(slot => getDate(slot.matchDate) === date);

  const nextEvent = data.find((slot, index) => (index > eventIndex && slot.drawsId && dataFiltered.includes(slot)));
  return nextEvent;
}
const getNextEventForSubCourtSwap = (data, date, eventIndex) => {
  const dataFiltered = data.filter(slot => getDate(slot.matchDate) === date);

  const nextEvent = data.find((slot, index) =>{ 
    let hasEvent=index > eventIndex && slot.drawsId && dataFiltered.includes(slot);
    if(slot.subCourt){
      hasEvent= hasEvent && moment(slot.matchDate).isAfter(moment(data[eventIndex].matchDate));
    }
    return hasEvent;
  });
  return nextEvent;
}
const checkUnavailableTime = (workingSchedule, startDayTime, endDayTime, date) => {
  const startTime = workingSchedule && workingSchedule.startTime;
  const endTime = workingSchedule && workingSchedule.endTime;

  const newStartTime = startTime && startTime !== startDayTime
      ? moment(date + startTime)
      : moment(date + startDayTime);

  const newEndTime = endTime && endTime !== endDayTime
      ? moment(date + endTime)
      : moment(date + endDayTime);

  return {
      startTime: newStartTime,
      endTime: newEndTime,
  };
}
const sortSlot=(slotArray)=>{
  slotArray.sort((a,b)=>{ 
      let dateDiff=moment(a.matchDate)-moment(b.matchDate); 
      if(dateDiff==0 && a.subCourt && b.subCourt){
          if (a.subCourt < b.subCourt) {
              return -1;
          }
          if (a.subCourt > b.subCourt) {
              return 1;
          }
          return 0;    
      }else {
          return dateDiff;
      }  
  });
  return slotArray;
}
const getEndTime=(matchDate, minutes)=>{
  return moment(matchDate).add(minutes, 'minutes').format('HH:mm');
}

export {
  getDate,
  checkDate,
  getDiffBetweenStartAndEnd,
  getNextEventForSwap,
  checkUnavailableTime,
  getNextEventForSubCourtSwap,
  sortSlot,
  getEndTime,
}
