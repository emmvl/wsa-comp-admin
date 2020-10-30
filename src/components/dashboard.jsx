import React, { Component } from 'react';
import DashboardLayout from "../pages/dashboardLayout";
import AppConstants from "../themes/appConstants";

class Dashboard extends Component {


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.dashboard} menuName={AppConstants.home} />
            </div>
        )
    }
}


export default Dashboard;
