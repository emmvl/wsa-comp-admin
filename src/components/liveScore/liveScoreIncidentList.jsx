import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination, Input, Icon, message } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from 'react-router-dom';
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreIncidentList } from '../../store/actions/LiveScoreAction/liveScoreIncidentAction'
import { liveScore_formateDate, liveScore_MatchFormate } from '../../themes/dateformate'
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty } from "../../util/helpers";
import ValidationConstants from "../../themes/validationConstant";

function getIncidentPlayer(incidentPlayers) {
    let playerId = incidentPlayers.length > 0 ? incidentPlayers[0].playerId : ""
    return playerId
}

function getFirstName(incidentPlayers) {
    let firstName = incidentPlayers.length > 0 ? incidentPlayers[0].player.firstName : ""
    return firstName
}

function getLastName(incidentPlayers) {
    let lastName = incidentPlayers.length > 0 ? incidentPlayers[0].player.lastName : ""
    return lastName
}

function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}


const { Content } = Layout;
let this_obj = null;
////columens data
const columns = [

    {
        title: 'Date',
        dataIndex: 'incidentTime',
        key: 'incidentTime',
        sorter: (a, b) => checkSorting(a, b, 'matchId'),
        render: (incidentTime, record) =>
            <NavLink to={{
                pathname: "/liveScoreIncidentView",
                state: { item: record, screenName: 'incident' }
            }}>
                <span className="input-heading-add-another pt-0">{liveScore_MatchFormate(incidentTime)}</span>
            </NavLink>
    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => checkSorting(a, b, 'matchId'),
        render: (matchId, record) =>
            <NavLink to={{
                pathname: "/liveScoreMatchDetails",
                state: { matchId: matchId, screenName: 'incident' }
            }}>
                <span className="input-heading-add-another pt-0">{matchId}</span>
            </NavLink>
    },
    {
        title: 'Player ID',
        dataIndex: 'incidentPlayers',
        key: 'incident Players',
        // render: (incidentPlayers, record) => {
        //     isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item) => (
        //         <span onClick={() => this_obj.checkUserId(record)} className="input-heading-add-another pt-0">{item.playerId}</span>
        //     ))
        // },
        render: (incidentPlayers, record) =>

            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item, index) => (
                // <NavLink to={{
                //     pathname: '/liveScorePlayerView',
                //     state: { tableRecord: incidentPlayers ? incidentPlayers[0].player : null, screenName: 'incident' }
                // }}>
                <span onClick={() => this_obj.checkUserId(item)} key={`playerId${index}` + item.playerId} style={{ color: '#ff8237', cursor: 'pointer' }} className="desc-text-style side-bar-profile-data" >{item.playerId}</span>
                // </NavLink>
            ))

    },
    {
        title: 'First Name',
        dataIndex: 'incidentPlayers',
        key: 'Incident Players First Name',
        sorter: (a, b) => a.incidentPlayers.player.firstName.length - b.incidentPlayers.player.firstName.length,
        // render: (incidentPlayers, record) =>
        //     <NavLink to={{
        //         pathname: '/liveScorePlayerView',
        //         state: { tableRecord: incidentPlayers ? incidentPlayers[0].player : null }
        //     }}>
        //         <span className="input-heading-add-another pt-0">{getFirstName(incidentPlayers)}</span>
        //     </NavLink>

        render: (incidentPlayers, record) =>

            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item, index) => (


                // <NavLink to={{
                //     pathname: '/liveScorePlayerView',
                //     state: { tableRecord: incidentPlayers ? incidentPlayers[0].player : null, screenName: 'incident' }
                // }}>
                <span onClick={() => this_obj.checkUserId(item)} key={`playerFirstName${index}` + item.playerId} style={{ color: '#ff8237', cursor: 'pointer' }} className="desc-text-style side-bar-profile-data" >{item.player.firstName}</span>
                // </NavLink>

            ))


    },
    {
        title: 'Last Name',
        dataIndex: 'incidentPlayers',
        key: 'Incident Players Last Name',
        // sorter: (a, b) => a.lastName.length - b.lastName.length,
        // render: (incidentPlayers, record) =>
        //     <NavLink to={{
        //         pathname: '/liveScorePlayerView',
        //         state: { tableRecord: incidentPlayers ? incidentPlayers[0].player : null }
        //     }}>
        //         <span className="input-heading-add-another pt-0">{getLastName(incidentPlayers)}</span>
        //     </NavLink>
        render: (incidentPlayers, record) =>

            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item, index) => (

                // <NavLink to={{
                //     pathname: '/liveScorePlayerView',
                //     state: { tableRecord: incidentPlayers ? incidentPlayers[0].player : null, screenName: 'incident' }
                // }}>
                <span onClick={() => this_obj.checkUserId(item)} key={`playerLastName${index}` + item.playerId} style={{ color: '#ff8237', cursor: 'pointer' }} className="desc-text-style side-bar-profile-data" >{item.player.lastName}</span>
                // </NavLink>
            ))


    },
    {
        title: 'Type',
        dataIndex: 'incidentType',
        key: 'incidentType',
        render: (incidentType, record) =>
            <span >{incidentType.name}</span>,
        sorter: (a, b) => checkSorting(a, b, 'incidentType')

    },
    // {
    //     title: "Action",
    //     dataIndex: 'action',
    //     key: 'action',
    //     render: (data, record) => <Menu
    //         className="action-triple-dot-submenu"
    //         theme="light"
    //         mode="horizontal"
    //         style={{ lineHeight: '25px' }}
    //     >
    //         <Menu.SubMenu
    //             key="sub1"
    //             style={{ borderBottomStyle: "solid", borderBottom: 0 }}
    //             title={
    //                 <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
    //             }
    //         >
    //             <Menu.Item key={'1'}>
    //                 <NavLink to={{
    //                     pathname: '/liveScoreAddIncident',
    //                     state: { isEdit: true, tableRecord: record }
    //                 }}><span >Edit</span></NavLink>
    //             </Menu.Item>
    //         </Menu.SubMenu>
    //     </Menu>
    // }
];


class LiveScoreIncidentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ""
        };
        this_obj = this
    }

    componentDidMount() {

        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.liveScoreIncidentList(id, this.state.searchText);
        } else {
            history.push('/')
        }
    }

    checkUserId(record) {
        if (record.player.userId == null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.playerMessage)
        }
        else {
            history.push("/userPersonal", { userId: record.player.userId, screenKey: "livescore", screen: "/liveScoreIncidentList" })
        }
    }


    // on change search text
    onChangeSearchText = (e) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ searchText: e.target.value })
        if (e.target.value === null || e.target.value === "") {
            this.props.liveScoreIncidentList(id, e.target.value);
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (code === 13) { //13 is the enter keycode
            this.props.liveScoreIncidentList(id, e.target.value);
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (this.state.searchText === null || this.state.searchText === "") {
        }
        else {
            this.props.liveScoreIncidentList(id, this.state.searchText);
        }
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}  >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.incidents}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                        <div className="row">


                            <div className="col-sm">
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <NavLink to="/liveScoreAddIncident">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addIncident}
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

                                    <Button className="primary-add-comp-form" type="primary">

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
                                    <NavLink to="/liveScoreIncidentImport">
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
                {/* search box */}
                <div className="col-sm pt-4 ml-3 " style={{ display: "flex", justifyContent: 'flex-end', }} >
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
        )
    }

    ////////tableView view for Umpire list
    tableView = () => {
        const { liveScoreIncidentState } = this.props;
        const DATA = liveScoreIncidentState.liveScoreIncidentResult;

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreIncidentState.onLoad === true ? true : false}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={DATA}
                        pagination={false}
                        rowKey={(record, index) => "incident" + record.id + index}
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
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            defaultCurrent={1}
                            total={8}
                        // onChange={this.handleTableChange}
                        />
                    </div>
                </div>
            </div>
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"17"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreIncidentList }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreIncidentState: state.LiveScoreIncidentState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((LiveScoreIncidentList));
