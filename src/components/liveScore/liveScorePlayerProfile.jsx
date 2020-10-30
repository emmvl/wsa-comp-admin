import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import history from "../../util/history";
const { Content } = Layout;
const { Option } = Select;
const columns = [
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        sorter: (a, b) => a.state.length - b.state.length,
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.length - b.affiliate.length,
    },
    {
        title: 'Competition',
        dataIndex: 'competition',
        key: 'competition',
        sorter: (a, b) => a.competition.length - b.competition.length,
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.length - b.team.length,
    },
    {
        title: 'Success',
        dataIndex: 'success',
        key: 'success',
        sorter: (a, b) => a.success.length - b.success.length,
    },
    {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
        sorter: (a, b) => a.fee.length - b.fee.length,
    },

];

const data = [
    {
        key: '1',
        state: "NSW",
        affiliate: "MWNA",
        competition: "2019 Winter",
        team: "Peninsula 16",
        success: "3",
        fee: "$190.00",

    },
    {
        key: '2',
        state: "NSW",
        affiliate: "MWNA",
        competition: "2019 Spring",
        team: "Peninsula Top Guns",
        success: "1",
        fee: "$85.00",
    },

];


class LiveScorePlayerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
        }
        this.playerName = this.props.location.state ? this.props.location.state.playerName : ''
    }


    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.playerProfile}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }


    ////view for profile image
    profileImageView = () => {
        return (
            <div className="fluid-width mt-2" >
                {/* <img className="live-score-user-image" src={AppImages.playerDp} alt="" height="80" width="80" />
                <span className="live-score-profile-user-name">{AppConstants.josefineMartinez}</span> */}
                <div className='profile-image-view mr-5' >
                    <span className="user-contact-heading">{AppConstants.playerProfile}</span>
                    <img className="live-score-user-image" src={AppImages.playerDp} alt="" height="80" width="80" />
                    <span className="user-contact-heading">{this.playerName}</span>
                </div>

                <div className="profile-img-view-style">
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.calendar} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">{AppConstants.dateOfBirth}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{AppConstants.Date03032000}</span>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">{AppConstants.contactNumber}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{AppConstants.no0456765765}</span>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className="year-select-heading ml-3">{AppConstants.team}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{AppConstants.belrose08}</span>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.circleOutline} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">{AppConstants.division}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">12a</span>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.circleOutline} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">{AppConstants.competition}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{AppConstants.winter2019}</span>
                    </div>
                </div>
            </div>
        )
    }



    //////// tableView
    tableView = () => {
        return (
            <div>
                <div className="heading-text-view">
                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm">
                                <span className="heading-text">{AppConstants.activity}</span>
                            </div>
                            <div className="col-sm">
                                <span className="heading-text">{AppConstants.statistics}</span>
                            </div>
                            <div className="col-sm">
                                <span className="heading-text" >{AppConstants.personalDetails}</span>
                            </div>
                            <div className="col-sm">
                                <span className="heading-text">{AppConstants.medical}</span>
                            </div>
                            <div className="col-sm">
                                <span className="heading-text">{AppConstants.registration}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: "#ffffff", marginTop: "5%" }}>
                    <div className="inside-table-view" >
                        <div className="fluid-width">
                            <div className="row">
                                <div className="col-sm-2" >
                                    <div style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginLeft: 7,
                                        paddingBottom: 10
                                    }}>
                                        <span className="year-select-heading">{AppConstants.year}:</span>
                                        <Select
                                            className="year-select"
                                            // style={{ width: 75 }}
                                            onChange={(year) => this.setState({ year })}
                                            value={this.state.year}
                                        >
                                            <Option value="2019">{AppConstants.year2019}</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="table-responsive home-dash-table-view">
                            <Table className="home-dashboard-table" columns={columns} dataSource={data} pagination={false}
                            />
                        </div>
                        <div className="fluid-width" style={{ marginTop: 10 }}>
                            <div className="row">
                                <div className="col-sm">
                                    <span className="input-heading-add-another">+ {AppConstants.addAnotherDetail}</span>
                                </div>
                                <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
                                    <Button className='primary-reg-live-score' type='primary'>{AppConstants.register}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.footerView()}
            </div>
        )
    }



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" style={{ marginTop: "5%", marginBottom: "5%" }}>
                <div className="row">
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button type="cancel-button">{AppConstants.cancel}</Button>
                        </div>
                    </div>
                    <div className="col-sm-9" >
                        <div className="comp-buttons-view">
                            <Button className="live-score-edit" type="primary">{AppConstants.edit}</Button>
                            <Button className="open-reg-button" type="primary">{AppConstants.save}</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="2" />
                <Layout className="live-score-player-profile-layout">
                    {/* {this.headerView()} */}
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width">
                            <div className="row">
                                <div className="col-sm-3" >
                                    {this.profileImageView()}
                                </div>
                                <div className="col-sm-9" style={{ backgroundColor: "#f7fafc", paddingBottom: 10 }}>
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
export default LiveScorePlayerProfile;

