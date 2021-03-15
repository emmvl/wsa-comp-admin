import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table } from 'antd';
import './liveScore.css';
// import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import history from "../../util/history";

const { Content } = Layout;

////columns data
const columns = [
    {
        title: AppConstants.start,
        dataIndex: 'start',
        key: 'start',
        sorter: (a, b) => a.start.length - b.start.length,
    },
    {
        title: AppConstants.home,
        dataIndex: 'home',
        key: 'home',
        sorter: (a, b) => a.home.length - b.home.length,
    },
    {
        title: AppConstants.away,
        dataIndex: 'away',
        key: 'away',
        sorter: (a, b) => a.away.length - b.away.length,
    },
    {
        title: AppConstants.venue,
        dataIndex: 'venue',
        key: 'venue',
        sorter: (a, b) => a.venue.length - b.venue.length,
    },
    {
        title: AppConstants.results,
        dataIndex: 'results',
        key: 'results',
        sorter: (a, b) => a.results.length - b.results.length,
    },
];

////array data
const data = [
    {
        key: '1',
        start: "20/1/20 05:00 PM",
        home: "WSA 2",
        away: 'WSA 1',
        venue: 'Court 1',
        results: 'H : - : A'
    },
    {
        key: '2',
        start: "20/1/20 04:53 PM",
        home: "WSA 2",
        away: 'WSA 1',
        venue: 'Court 1',
        results: 'H : - : A'
    },
];

class LiveScoreManagerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.location.state ? props.location.state.tableRecord : null
        }
    }

    ////view for profile image
    profileImageView = () => {
        let data = this.state.data

        return (
            <div className="fluid-width mt-2">
                {/* <span className="live-score-profile-user-name">{AppConstants.managerProfile}</span>
                <img className="user-image" src={'https://content.fortune.com/wp-content/uploads/2019/12/GettyImages-1187428380.jpg'} alt="" height="80" width="80" />
                <span className="live-score-profile-user-name">{this.myDada}</span> */}

                <div className='profile-image-view mr-5'>
                    <span className="user-contact-heading">{AppConstants.managerProfile}</span>
                    <img className="user-image" src={'https://content.fortune.com/wp-content/uploads/2019/12/GettyImages-1187428380.jpg'} alt="" height="80" width="80" />
                    <span className="user-contact-heading">{data && (data.firstName + " " + data.lastName)}</span>
                </div>

                <span className="desc-text-style side-bar-profile-data pt-0">{AppConstants.aboutManager}</span>

                <div className="profile-img-view-style">
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className="year-select-heading ml-3">{AppConstants.emailAddress}</span>
                        </div>
                        <span className="desc-text-style side-bar-profile-data">{data && data.email}</span>
                    </div>

                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">{AppConstants.contactNumber}</span>
                        </div>
                        <span className="desc-text-style side-bar-profile-data">{data && data.mobileNumber}</span>
                    </div>

                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className="year-select-heading ml-3">{AppConstants.team}</span>
                        </div>

                        {data && data.linkedEntity.map((item) => (
                            <span className="desc-text-style side-bar-profile-data">{item.name}</span>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.activity}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm w-100 d-flex flex-row align-items-center justify-content-end">
                        <div className="row">
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                    {/* <NavLink to={{
                                        pathname: "/matchDayAddManagers",
                                        state: { isEdit: true, tableRecord: this.state.data }
                                    }}> */}
                                    <Button className="primary-add-comp-form" type="primary">
                                        + {AppConstants.edit}
                                    </Button>
                                    {/* </NavLink> */}
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">

                                    <Button className="primary-add-comp-form" type="primary">
                                        {AppConstants.delete}
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    ////////tableView view for Team list
    tableView = () => {
        return (
            <div className="comp-dash-table-view">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.matchDay} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./matchDayCompetitions")} />
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="4" />
                <Layout className="live-score-player-profile-layout">
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width">
                            <div className="row">
                                <div className="col-sm-3" style={{ marginBottom: "7%" }}>
                                    {this.profileImageView()}
                                </div>
                                <div className="col-sm-9 default-bg" style={{ paddingBottom: 10 }}>
                                    {this.headerView()}
                                    {this.tableView()}
                                </div>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default LiveScoreManagerView;
