/* eslint-disable max-len */
const flavour = process.env.REACT_APP_FLAVOUR || 'netball';
const { default: CommonAppConstants } = require('./common/appConstants');
const { default: FlavouredAppConstants } = require('./' + flavour + '/appConstants');

const AppConstants = { ...CommonAppConstants, ...FlavouredAppConstants };

export default AppConstants;
