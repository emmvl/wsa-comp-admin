import React, { Component } from 'react';
import DashboardLayout from '../pages/dashboardLayout';
import AppConstants from '../themes/appConstants';

class Dashboard extends Component {
  render() {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout menuHeading={AppConstants.dashboard} menuName={AppConstants.home} />
      </div>
    );
  }
}

export default Dashboard;
