import AppConstants from 'themes/appConstants';

const applyTo1 = [
  { label: 'Game Time Tracking', value: 'gameTimeTracking' },
  { label: 'Position Tracking', value: 'positionTracking' },
  { label: 'Record Goal Attempts', value: 'recordGoalAttempts' },
];

const applyTo2 = [{ label: 'Incidents Enabled', value: 'incidentsEnabled' }];
if (+process.env.REACT_APP_BALL_POSSESSION === 1) {
  applyTo2.unshift({
    label: 'Centre Pass Enabled',
    value: 'centrePassEnabled',
  });
}

const trackFullPeriod = [
  { value: 0, name: 'Track Full Period' },
  { value: 1, name: 'Track End of Period' },
];

const mediumSelectStyles = {
  width: '100%',
  paddingRight: 1,
  minWidth: 182,
  maxWidth: 300,
};

const extraTimeTypeValues = {
  single: 'single',
  halves: 'halves',
  quarters: 'quarters',
};
const extraTimeTypes = [
  { label: 'Single Period', value: extraTimeTypeValues.single },
  { label: 'Halves', value: extraTimeTypeValues.halves },
  { label: 'Quarters', value: extraTimeTypeValues.quarters },
];

const buzzerCheckboxes = [
  {
    key: 'buzzerEnabled',
    label: AppConstants.buzzer,
  },
  {
    key: 'warningBuzzerEnabled',
    label: AppConstants.turnOff_30Second,
  },
];

export {
  applyTo1,
  applyTo2,
  trackFullPeriod,
  mediumSelectStyles,
  extraTimeTypeValues,
  extraTimeTypes,
  buzzerCheckboxes,
};
