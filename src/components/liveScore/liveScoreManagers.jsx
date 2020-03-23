import React, { Component } from "react";
import { Layout, Button, Table, Pagination } from 'antd';
import './liveScore.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import scorerData from '../../mocks/managersList'
import AppImages from "../../themes/appImages";
import { liveScoreManagerListAction } from '../../store/actions/LiveScoreAction/liveScoreManagerAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { Content } = Layout;

//// table columns
const columns = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.firstName.length - b.firstName.length,
        render: (firstName, record) =>
            <NavLink to={{
                pathname: '/liveScoreManagerView',
                state: { tableRecord: record }
            }}>
                <span class="input-heading-add-another pt-0" >{firstName}</span>
            </NavLink>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.lastName.length - b.lastName.length,
        render: (lastName, record) =>
            <NavLink to={{
                pathname: '/liveScoreManagerView',
                state: { tableRecord: record }
            }}>
                <span class="input-heading-add-another pt-0" >{lastName}</span>
            </NavLink>

    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.length - b.email.length,
    },
    {
        title: 'Contact No',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
        sorter: (a, b) => a.mobileNumber.length - b.mobileNumber.length,
    },
    {
        title: 'Team',
        dataIndex: 'linkedEntity',
        key: 'linkedEntity',
        sorter: (a, b) => a.linkedEntity.length - b.linkedEntity.length,
        render: (linkedEntity, record) =>
            <NavLink to={{
                pathname: '/liveScoreManagerView',
                state: { tableRecord: record }
            }}>
                {linkedEntity.length > 0 && linkedEntity.map((item) => (
                    <span class="input-heading-add-another pt-0" >{item.name}</span>
                ))
                }
            </NavLink>
    },

];

class LiveScoreManagerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            scorerTableData: scorerData.scorerData
        }
    }

    componentDidMount() {
        this.props.liveScoreManagerListAction(3, 1, 1)
    }

    ////////form content view
    contentView = () => {
        const { liveScoreMangerState } = this.props;
        let managerListData = liveScoreMangerState.managerListResult
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table" columns={columns} dataSource={managerListData}
                        pagination={false}
                        loading={this.props.liveScoreMangerState.onLoad == true && true}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }} >
                        <Pagination
                            className="auto-pagination"
                            defaultCurrent={1}
                            total={8} />
                    </div>
                </div>
            </div>
        )
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <span className="form-heading">
                                {AppConstants.managersList}
                            </span>
                        </div>
                        <div className="col-sm"
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-end"
                            }}>
                            <div className="row">
                                <div className="col-sm">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <NavLink to={`/liveScoreAddManagers`} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                + {AppConstants.addManager}
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="col-sm">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >

                                        <Button onclick="window.open('file.doc')" className="primary-add-comp-form" type="primary">

                                            <div className="row">
                                                <div className="col-sm">
                                                    <img
                                                        src={AppImages.export}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.export}
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-sm">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <NavLink to={`/liveScorerManagerImport`} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                <div className="row">
                                                    <div className="col-sm">
                                                        <img
                                                            src={AppImages.import}
                                                            alt=""
                                                            className="export-image"
                                                        />
                                                        {AppConstants.import}
                                                    </div>
                                                </div>
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"4"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}


function mapDispatchtoprops(dispatch) {
    return bindActionCreators({ liveScoreManagerListAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreMangerState: state.LiveScoreMangerState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreManagerList));
