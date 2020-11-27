import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Tag } from 'antd';
import './liveScore.css';
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import history from "../../util/history";

const { Content } = Layout;

////columns data
const columns = [
    {
        title: 'Start',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => a.startTime.length - b.startTime.length,
    },
    {
        title: 'Match',
        dataIndex: 'match',
        key: 'homatchme',
        sorter: (a, b) => a.match.length - b.match.length,
        render: (text, record) =>
            <NavLink to={{
                pathname: '/matchDayMatchDetails',
                state: { matchId: record.match }
            }}>
                <span className="input-heading-add-another pt-0">{text}</span>
            </NavLink>
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.length - b.team.length,
        render: text =>
            <div className="d-flex justify-content-center">
                <span className="mt-1">{text} {" "}</span><Tag
                    className="comp-dashboard-table-tag ml-2 mt-1"
                    color={"#5CD88D"}
                >1</Tag>
            </div>
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.length - b.status.length,
    },
];

////array data
const data = [
    {
        key: '1',
        startTime: "20/1/20 16:53",
        match: "1794",
        team: 'WSA 9',
        status: 'Invited',
    },
    {
        key: '2',
        startTime: "28/11/20 10:29",
        match: "1795",
        team: 'WSA 9',
        status: 'Accepted',
    },
];

class LiveScorerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.location.state ? props.location.state.tableRecord : null
        }
    }

    ////view for profile image
    profileImageView = () => {
        let data = this.state.data
        if (data) {
            return (
                <div className="fluid-width mt-2">
                    {/* <img className="user-image" src={'https://content.fortune.com/wp-content/uploads/2019/12/GettyImages-1187428380.jpg'} alt="" height="80" width="80" />
                    <span className="live-score-profile-user-name">{this.scorerName}</span> */}

                    <div className="profile-image-view mr-5">
                        <span className="user-contact-heading">{AppConstants.scorerProfile}</span>
                        <img className="user-image" src={'https://content.fortune.com/wp-content/uploads/2019/12/GettyImages-1187428380.jpg'} alt="" height="80" width="80" />
                        <span className="user-contact-heading">{data.firstName} {data.lastName}</span>
                    </div>

                    <span className="desc-text-style side-bar-profile-data pt-0">{AppConstants.aboutScorer}</span>

                    <div className="profile-img-view-style">
                        <div className="live-score-side-desc-view">
                            <div className="live-score-title-icon-view">
                                <div className="live-score-icon-view">
                                    <img src={AppImages.group} height="16" width="16" alt="" />
                                </div>
                                <span className="year-select-heading ml-3">{AppConstants.emailAddress}</span>
                            </div>
                            <span className="desc-text-style side-bar-profile-data">{data.email}</span>
                        </div>

                        <div className="live-score-side-desc-view">
                            <div className="live-score-title-icon-view">
                                <div className="live-score-icon-view">
                                    <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                                </div>
                                <span className="year-select-heading ml-3">{AppConstants.contactNumber}</span>
                            </div>
                            <span className="desc-text-style side-bar-profile-data">{data.mobileNumber}</span>
                        </div>

                        <div className="live-score-side-desc-view">
                            <div className="live-score-title-icon-view">
                                <div className="live-score-icon-view">
                                    <img src={AppImages.group} height="16" width="16" alt="" />
                                </div>
                                <span className="year-select-heading ml-3">{AppConstants.team}</span>
                            </div>
                            <span className="desc-text-style side-bar-profile-data">{data.team}</span>
                        </div>
                    </div>
                </div>
            )
        } else {
            history.push('/matchDayCompetitions')
        }
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

                    <div className="col-sm d-flex justify-content-end w-100 flex-row align-items-center">
                        <div className="row">
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                    <Button className="primary-add-comp-form" type="primary">
                                        {AppConstants.assignToMatch}
                                    </Button>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                    <NavLink to={{
                                        pathname: "/matchDayAddScorer",
                                        state: { isEdit: true, tableRecord: this.state.data }
                                    }}>
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.edit}
                                        </Button>
                                    </NavLink>
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
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="5" />
                <Layout className="live-score-player-profile-layout">
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width">
                            <div className="row">
                                <div className="col-sm-3" style={{ marginBottom: "6%" }}>
                                    {this.profileImageView()}
                                </div>
                                <div className="col-sm-9 default-bg">
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

export default LiveScorerView;
