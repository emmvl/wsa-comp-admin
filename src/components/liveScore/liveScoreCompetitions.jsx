import React, { Component } from "react";
import { Layout, Button, Table, Select, Tag, Menu, Modal, Pagination } from 'antd';
import './liveScore.css';
import ColorsArray from '../../util/colorsArray'
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { getOrganisationData, setLiveScoreUmpireCompition, setLiveScoreUmpireCompitionData, setKeyForStateWideMessage } from "../../util/sessionStorage"
import { connect } from 'react-redux';
import { liveScoreOwnPartCompetitionList, liveScoreCompetitionDeleteInitate } from '../../store/actions/LiveScoreAction/liveScoreCompetitionAction';
import AppImages from "../../themes/appImages";
import { isArrayNotEmpty } from "../../util/helpers";
import { checkOrganisationLevel } from "../../util/permissions";
import Tooltip from 'react-png-tooltip'

const { Option } = Select;
const { confirm } = Modal
let this_Obj = null

//listeners for sorting
const listeners = (key, tableName) => ({
    onClick: () => tableSort(key, tableName),
});

function tableSort(key, tableName) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }

    this_Obj.setState({ sortBy: sortBy, sortOrder: sortOrder });

    const body = {
        "paging": {
            "offsetOwned": this_Obj.state.ownOffset,
            "offsetParticipating": this_Obj.state.partOffset,
            "limitOwned": 10,
            "limitParticipating": 10
        }
    }
    this_Obj.props.liveScoreOwnPartCompetitionList(body, this_Obj.state.orgKey, sortBy, sortOrder, tableName)
}


const columnsOwned = [
    {
        title: "Name",
        dataIndex: "longName",
        key: "longName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('oname', "own"),
        render: (longName, record) => {
            return (

                <span style={{ cursor: "pointer" }} onClick={() => {
                    this_Obj.setCompetitionID(record)
                    this_Obj.props.history.push('/liveScoreDashboard')
                }} className="input-heading-add-another pt-0" >{longName}</span>

            )
        }
    },
    {
        title: "Divisions/Age",
        dataIndex: "divisions",
        key: "divisions",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('odivisions', "own"),
        render: divisions => {
            if (divisions != null) {
                var divisionArray = divisions.split(",")
                return (
                    <span>
                        {divisionArray != null ? divisionArray.map((data, index) => (
                            index <= 38 ? data ? <Tag
                                className="comp-dashboard-table-tag"
                                color={ColorsArray[index]}
                                key={data}
                            >
                                {data}
                            </Tag> : '' : <Tag
                                className="comp-dashboard-table-tag"
                                color={"#c2c2c2"}
                                key={data}
                            >
                                    {data}
                                </Tag>
                        )) : <></>}
                    </span>)
            } else {
                var divisionArray = []
            }

        }
    },

    {
        title: "Teams",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('oteams', "own"),
        render: (teamCount, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{teamCount}</span>
    },
    {
        title: "Players",
        dataIndex: "playerCount",
        key: "playerCount",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('oplayers', "own"),
        render: (playerCount, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{playerCount}</span>
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('ostatus', "own"),
        render: (status, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{status}</span>
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
                <Menu.Item onClick={() => this_Obj.setCompetitionID(record)} key={'1'}>
                    <NavLink to={{ pathname: "/liveScoreSettingsView", state: 'edit' }} ><span >Edit</span></NavLink>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(record, "own")}>
                    <span >Delete</span>
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    }
];

const columnsParticipate = [
    {
        title: "Name",
        dataIndex: "longName",
        key: "longName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('pname', "part"),
        render: (longName, record) => {
            return (

                <span style={{ cursor: "pointer" }} onClick={() => {
                    this_Obj.setCompetitionID(record)
                    this_Obj.props.history.push('/liveScoreDashboard')
                }} className="input-heading-add-another pt-0" >{longName}</span>

            )
        }
    },
    {
        title: "Divisions/Age",
        dataIndex: "divisions",
        key: "divisions",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('pdivisions', "part"),
        render: divisions => {
            if (divisions != null) {
                var divisionArray = divisions.split(",")
                return (
                    <span>
                        {divisionArray != null ? divisionArray.map((data, index) => (
                            index <= 38 ? data ? <Tag
                                className="comp-dashboard-table-tag"
                                color={ColorsArray[index]}
                                key={data}
                            >
                                {data}
                            </Tag> : '' : <Tag
                                className="comp-dashboard-table-tag"
                                color={"#c2c2c2"}
                                key={data}
                            >
                                    {data}
                                </Tag>
                        )) : <></>}
                    </span>)
            } else {
                var divisionArray = []
            }

        }
    },

    {
        title: "Teams",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('pteams', "part"),
        render: (teamCount, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{teamCount}</span>
    },
    {
        title: "Players",
        dataIndex: "playerCount",
        key: "playerCount",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('pplayers', "part"),
        render: (playerCount, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{playerCount}</span>
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('pstatus', "part"),
        render: (status, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{status}</span>
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
                <Menu.Item onClick={() => this_Obj.setCompetitionID(record)} key={'1'}>
                    <NavLink to={{ pathname: "/liveScoreSettingsView", state: 'edit' }} ><span >Edit</span></NavLink>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(record, "part")}>
                    <span >Delete</span>
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    }
];



class LiveScoreCompetitions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onLoad: false,
            orgKey: getOrganisationData() ? getOrganisationData().organisationId : null,
            orgLevel: AppConstants.state,
            ownOffset: 0,
            partOffset: 0,
        }
        this_Obj = this

    }


    componentDidMount() {
        this.competitionListApi()
        checkOrganisationLevel().then((value) => (
            this.setState({ orgLevel: value })
        ))
    }

    competitionListApi() {
        const body = {
            "paging": {
                "offsetOwned": 0,
                "offsetParticipating": 0,
                "limitOwned": 10,
                "limitParticipating": 10
            }
        }
        this.props.liveScoreOwnPartCompetitionList(body, this.state.orgKey, null, null, "all")

    }

    setCompetitionID = (competitiondata) => {
        localStorage.setItem("LiveScoreCompetiton", JSON.stringify(competitiondata))
        localStorage.removeItem('stateWideMessege')
        setLiveScoreUmpireCompition(competitiondata.id)
        setLiveScoreUmpireCompitionData(JSON.stringify(competitiondata))
    }

    CompetitonDelete = (data, key) => {
        this.props.liveScoreCompetitionDeleteInitate(data.id, key)
    }
    showDeleteConfirm = (record, key) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this competition?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.CompetitonDelete(record, key)
            },
            onCancel() {

            },
        });
    }

    /// Handle Pagination 
    handlePagination(page, key) {
        let ownOffset = this.state.ownOffset
        let partOffset = this.state.partOffset
        if (key == "own") {
            ownOffset = page ? 10 * (page - 1) : 0;
        }
        if (key == "part") {
            partOffset = page ? 10 * (page - 1) : 0;
        }
        this.setState({
            ownOffset, partOffset
        })
        const body = {
            "paging": {
                "offsetOwned": ownOffset,
                "offsetParticipating": partOffset,
                "limitOwned": 10,
                "limitParticipating": 10
            }
        }
        this.props.liveScoreOwnPartCompetitionList(body, this.state.orgKey, null, null, key)
    }

    ///dropdown view containing dropdown and next screen navigation button/text
    partHeaderView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-4" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span className="form-heading">
                                {AppConstants.participateInComp}
                            </span>
                            <div style={{ marginTop: -10 }}>
                                <Tooltip placement="top" background='#ff8237'>
                                    <span>{AppConstants.participateCompMsg}</span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    ///dropdown view containing dropdown and next screen navigation button/text
    dropdownButtonView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width" style={{
                    display: "flex", maxWidth: "99%",
                    justifyContent: "flex-end"
                }}>
                    <div className="col-sm" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <span className="form-heading">
                            {AppConstants.ownedCompetitions}
                        </span>
                        <div style={{ marginTop: -10 }}>
                            <Tooltip placement="top" background='#ff8237'>
                                <span>{AppConstants.ownedCompetitionMsg}</span>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="row">

                        {this.state.orgLevel === "state" && <div className="col-sm">
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

                                <Button onClick={() => {
                                    setKeyForStateWideMessage('stateWideMessege')
                                    this.props.history.push({
                                        pathname: '/liveScoreNewsList',
                                        state: { screenKey: 'stateWideMsg' }
                                    })
                                }}
                                    className="primary-add-comp-form" type="primary">
                                    {AppConstants.stateWideMsg}
                                </Button>


                            </div>
                        </div>}

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
                                <Button
                                    onClick={() => {
                                        localStorage.removeItem('LiveScoreCompetiton')
                                        this.props.history.push('/liveScoreSettingsView', 'add')
                                    }}
                                    className="primary-add-comp-form" type="primary">
                                    + {AppConstants.addCompetition}
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
                                <Button className="primary-add-comp-form" type="primary">
                                    + {AppConstants.replicateCompetition}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* </div> */}

                </div>
            </div>
        );
    };
    ////////ownedView view for competition


    ownedView = () => {
        let { ownedCompetitions, ownedTotalCount, ownedCurrentPage, ownedLoad } = this.props.liveScoreCompetition
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsOwned}
                        dataSource={ownedCompetitions}
                        pagination={false}
                        loading={ownedLoad}
                        rowKey={(record, index) => "ownedCompetitions" + record.id + index}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={ownedCurrentPage}
                        total={ownedTotalCount}
                        onChange={(page) => this.handlePagination(page, "own")}
                    />
                </div>
            </div>
        );
        // }
    };

    participatedView = () => {
        let { participatingInComptitions, participateTotalCount, participateCurrentPage, partLoad } = this.props.liveScoreCompetition
        return (
            <div className="comp-dash-table-view">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsParticipate}
                        dataSource={participatingInComptitions}
                        pagination={false}
                        loading={partLoad}
                        rowKey={(record, index) => "participatingInComptitions" + record.id + index}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-0"
                        current={participateCurrentPage}
                        total={participateTotalCount}
                        onChange={(page) => this.handlePagination(page, "part")}
                    />
                </div>
            </div>
        );
        // }
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                {/* <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"1"} /> */}
                {this.partHeaderView()}
                {this.participatedView()}
                {this.dropdownButtonView()}
                {this.ownedView()}
            </div >
        );
    }
}
function mapStatetoProps(state) {
    return {
        liveScoreCompetition: state.liveScoreCompetition
    }
}
export default connect(
    mapStatetoProps,
    {
        liveScoreOwnPartCompetitionList,
        liveScoreCompetitionDeleteInitate,
    })(LiveScoreCompetitions);

