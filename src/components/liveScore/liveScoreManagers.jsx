import React, { Component } from "react";
import { Layout, Button, Table, Pagination, Input, Icon, Menu } from 'antd';
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
import { getLiveScoreCompetiton, getUserId } from '../../util/sessionStorage'
import history from "../../util/history";
import { exportFilesAction } from "../../store/actions/appAction"
import { teamListData } from "../../util/helpers";


const { Content } = Layout;
let userId = getUserId();

//// table columns
const columns = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.firstName.length - b.firstName.length,
        render: (firstName, record) =>
            <NavLink to={{
                // pathname: '/liveScoreManagerView',
                // state: { tableRecord: record }
                pathname: '/userPersonal',
                state: { userId: record.id, screenKey: "livescore", screen: "/liveScoreManagerList" }
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
                pathname: '/userPersonal',
                state: { userId: record.id, screenKey: "livescore", screen: "/liveScoreManagerList" }
                // pathname: '/liveScoreManagerView',
                // state: { tableRecord: record }
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
        render: (linkedEntity, record) => {
            // return (
            //     teamListArr(linkedEntity.length > 0 && linkedEntity.map((item) => item.entityId)) ?
            //         <NavLink to={{
            //             // pathname: '/liveScoreManagerView',
            //             // state: { tableRecord: record }
            //             pathname: '/userPersonal',
            //             state: { userId: record.id, screenKey: "livescore" }
            //         }}>
            //             {linkedEntity.length > 0 && linkedEntity.map((item) => (
            //                 <span style={{ color: '#ff8237', cursor: 'pointer' }} className="live-score-desc-text side-bar-profile-data" >{item.name}</span>
            //             ))
            //             }
            //         </NavLink>
            //         : linkedEntity.length > 0 && linkedEntity.map((item) => (
            //             <span style={{ color: 'red', cursor: 'pointer' }} className="live-score-desc-text side-bar-profile-data" >{item.name}</span>
            //         ))
            // )
            return (
                <div>
                    {linkedEntity.length > 0 && linkedEntity.map((item) => (
                        teamListData(item.entityId) ?
                            <NavLink to={{
                                // pathname: '/liveScoreManagerView',
                                // state: { tableRecord: record }
                                pathname: '/userPersonal',
                                state: { userId: record.id, screenKey: "livescore" }
                            }}>
                                <span style={{ color: '#ff8237', cursor: 'pointer' }} className="live-score-desc-text side-bar-profile-data" >{item.name}</span>
                            </NavLink>
                            :
                            <span  >{item.name}</span>
                    ))
                    }
                </div>)
        }
    },
    {
        title: "Action",
        render: (data, record) => <Menu
            className="action-triple-dot-submenu"
            theme="light"
            mode="horizontal"
            style={{ lineHeight: '25px' }}
        >
            <Menu.SubMenu
                key="sub1"
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                <Menu.Item key={'1'}>
                    <NavLink to={{
                        pathname: '/liveScoreAddManagers',
                        state: { isEdit: true, tableRecord: record }
                    }}><span >Edit</span></NavLink>
                </Menu.Item>
                {/* <Menu.Item key="2" >
                    <NavLink to={{
                        pathname: "./liveScoreAssignMatch",
                        state: { record: record }
                    }}><span >Assign to match</span></NavLink>
                </Menu.Item> */}
            </Menu.SubMenu>
        </Menu>
    }

];

class LiveScoreManagerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            scorerTableData: scorerData.scorerData,
            searchText: '',
            competitionId: null
        }
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ competitionId: id })
        this.props.liveScoreManagerListAction(3, 1, id, this.state.searchText)
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

    // on Export
    onExport = () => {
        // let url = AppConstants.managerExport + this.state.competitionId
        let url = AppConstants.managerExport + this.state.competitionId
        this.props.exportFilesAction(url)
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

                                        <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">

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
                                {/* <div className="col-sm">
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
                                </div> */}
                            </div>

                        </div>

                    </div>
                    {/* search box */}
                    <div className="col-sm pt-5 ml-3" style={{ display: "flex", justifyContent: 'flex-end', }} >
                        <div className="comp-product-search-inp-width" >
                            <Input className="product-reg-search-input"
                                onChange={(e) => this.onChangeSearchText(e)}
                                placeholder="Search..."
                                onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                    onClick={() => this.onClickSearchIcon()}
                                />}
                                allowClear
                            />
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    // on change search text
    onChangeSearchText = (e) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            // this.props.getTeamsWithPagging(this.state.conpetitionId, 0, 10, e.target.value)

            this.props.liveScoreManagerListAction(3, 1, id, e.target.value)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (code === 13) { //13 is the enter keycode
            // this.props.getTeamsWithPagging(this.state.conpetitionId, 0, 10, this.state.searchText)
            this.props.liveScoreManagerListAction(3, 1, id, this.state.searchText)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            // this.props.getTeamsWithPagging(this.state.conpetitionId, 0, 10, this.state.searchText)
            this.props.liveScoreManagerListAction(3, 1, id, this.state.searchText)
        }
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
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
    return bindActionCreators({ liveScoreManagerListAction, exportFilesAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreMangerState: state.LiveScoreMangerState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreManagerList));
