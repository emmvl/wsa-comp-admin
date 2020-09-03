import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
    Button,
    Table,
    Select,
    Tag,
    Menu,
    Modal,
    Pagination,
} from "antd";
import Tooltip from "react-png-tooltip";

import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import ColorsArray from "util/colorsArray";
// import { isArrayNotEmpty } from "util/helpers";
import history from "util/history";
import { checkOrganisationLevel } from "util/permissions";
import { getOrganisationData, getPrevUrl, setLiveScoreUmpireCompition, setLiveScoreUmpireCompitionData, setKeyForStateWideMessage } from "util/sessionStorage";
import { getOnlyYearListAction } from "store/actions/appAction";
import { liveScoreOwnPartCompetitionList, liveScoreCompetitionActionInitiate, liveScoreCompetitionDeleteInitiate } from "store/actions/LiveScoreAction/liveScoreCompetitionAction";
// import Loader from "customComponents/loader";
import DashboardLayout from "pages/dashboardLayout";

import "./liveScore.css";

const { Option } = Select;
const { confirm } = Modal;
let this_Obj = null;

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function tableSort(key, tableName) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = "ASC";
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === "ASC") {
        sortOrder = "DESC";
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === "DESC") {
        sortBy = sortOrder = null;
    }

    this_Obj.setState({ sortBy, sortOrder });

    const body = {
        paging: {
            offsetOwned: this_Obj.state.ownOffset,
            offsetParticipating: this_Obj.state.partOffset,
            limitOwned: 10,
            limitParticipating: 10,
        },
    };
    this_Obj.props.liveScoreOwnPartCompetitionList(body, this_Obj.state.orgKey, sortBy, sortOrder, tableName, this_Obj.state.year);
}

const columnsOwned = [
    {
        title: "Name",
        dataIndex: "longName",
        key: "longName",
        sorter: true,
        onHeaderCell: () => listeners("oname", "own"),
        render: (longName, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push("/liveScoreDashboard");
                }}
            >
                {longName}
            </span>
        ),
    },
    {
        title: "Divisions/Age",
        dataIndex: "divisions",
        key: "divisions",
        sorter: true,
        onHeaderCell: () => listeners("odivisions", "part"),
        render: divisions => {
            if (divisions != null) {
                const divisionArray = divisions.split(",");
                return (
                    <span>
                        {divisionArray != null && (
                            divisionArray.map((data, index) => (
                                index <= 38 ? (
                                    data && (
                                        <Tag
                                            className="comp-dashboard-table-tag"
                                            color={ColorsArray[index]}
                                            key={data}
                                        >
                                            {data}
                                        </Tag>
                                    )
                                ) : (
                                        <Tag
                                            className="comp-dashboard-table-tag"
                                            color="#c2c2c2"
                                            key={data}
                                        >
                                            {data}
                                        </Tag>
                                    )
                            ))
                        )}
                    </span>
                );
            }

            return <></>;
        }
    },
    {
        title: "Teams",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: true,
        onHeaderCell: () => listeners("oteams", "part"),
        render: (teamCount, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push("/liveScoreDashboard");
                }}
            >
                {teamCount}
            </span>
        ),
    },
    {
        title: "Players",
        dataIndex: "playerCount",
        key: "playerCount",
        sorter: true,
        onHeaderCell: () => listeners("oplayers", "part"),
        render: (playerCount, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push("/liveScoreDashboard");
                }}
            >
                {playerCount}
            </span>
        ),
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        onHeaderCell: () => listeners("ostatus", "part"),
        render: (status, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push("/liveScoreDashboard");
                }}
            >
                {status}
            </span>
        ),
    },
    {
        title: "Action",
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <Menu.SubMenu
                    key="sub1"
                    title={
                        <img className="dot-image" src={AppImages.moreTripleDot} width="16" height="16" alt="" />
                    }
                >
                    <Menu.Item
                        key="1"
                        onClick={() => {
                            this_Obj.setCompetitionID(record);
                        }}
                    >
                        <NavLink to={{ pathname: "/liveScoreSettingsView", state: "edit" }}>
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item
                        key="2"
                        onClick={() => {
                            this_Obj.showDeleteConfirm(record, "own");
                        }}
                    >
                        <span>Delete</span>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        ),
    }
];

const columnsParticipate = [
    {
        title: "Name",
        dataIndex: "longName",
        key: "longName",
        sorter: true,
        onHeaderCell: () => listeners("pname", "own"),
        render: (longName, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push("/liveScoreDashboard");
                }}
            >
                {longName}
            </span>
        ),
    },
    {
        title: "Divisions/Age",
        dataIndex: "divisions",
        key: "divisions",
        sorter: true,
        onHeaderCell: () => listeners("pdivisions", "part"),
        render: divisions => {
            if (divisions != null) {
                const divisionArray = divisions.split(",");
                return (
                    <span>
                        {divisionArray != null && (
                            divisionArray.map((data, index) => (
                                index <= 38 ? (
                                    data && (
                                        <Tag
                                            className="comp-dashboard-table-tag"
                                            color={ColorsArray[index]}
                                            key={data}
                                        >
                                            {data}
                                        </Tag>
                                    )
                                ) : (
                                        <Tag
                                            className="comp-dashboard-table-tag"
                                            color="#c2c2c2"
                                            key={data}
                                        >
                                            {data}
                                        </Tag>
                                    )
                            ))
                        )}
                    </span>
                );
            }

            return <></>;
        }
    },
    {
        title: "Teams",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: true,
        onHeaderCell: () => listeners("pteams", "part"),
        render: (teamCount, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push("/liveScoreDashboard");
                }}
            >
                {teamCount}
            </span>
        ),
    },
    {
        title: "Players",
        dataIndex: "playerCount",
        key: "playerCount",
        sorter: true,
        onHeaderCell: () => listeners("pplayers", "part"),
        render: (playerCount, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push("/liveScoreDashboard");
                }}
            >
                {playerCount}
            </span>
        ),
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        onHeaderCell: () => listeners("pstatus", "part"),
        render: (status, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push("/liveScoreDashboard");
                }}
            >
                {status}
            </span>
        ),
    }
];

class LiveScoreCompetitions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: 1,
            onLoad: false,
            orgKey: getOrganisationData() ? getOrganisationData().organisationId : null,
            orgLevel: AppConstants.state,
            offsetData: 0,
            ownOffset: 0,
            partOffset: 0,
        };

        this_Obj = this;
    }

    componentDidMount() {
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        localStorage.setItem("yearId", this.state.year)

        const prevUrl = getPrevUrl();
        if (!prevUrl || !(history.location.pathname === prevUrl.pathname && history.location.key === prevUrl.key)) {
            this.competitionListApi();

            checkOrganisationLevel().then((value) => {
                this.setState({ orgLevel: value });
            });
        } else {
            history.push("/");
        }
    }

    competitionListApi = () => {
        const body = {
            paging: {
                offsetOwned: 0,
                offsetParticipating: 0,
                limitOwned: 10,
                limitParticipating: 10,
            },
        };
        this.props.liveScoreOwnPartCompetitionList(body, this.state.orgKey, null, null, "all", this.state.year);
    };

    setCompetitionID = (competitionData) => {
        localStorage.setItem("LiveScoreCompetition", JSON.stringify(competitionData));
        localStorage.removeItem("stateWideMessage");
        setLiveScoreUmpireCompition(competitionData.id);
        setLiveScoreUmpireCompitionData(JSON.stringify(competitionData));
    };

    deleteCompetition = (data, key) => {
        this.props.liveScoreCompetitionDeleteInitiate(data.id, key);
    };

    showDeleteConfirm = (record, key) => {
        let this_ = this;
        confirm({
            title: "Are you sure you want to delete this competition?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                this_.deleteCompetition(record, key);
            },
            onCancel() {

            },
        });
    };

    handlePagination = (page, key) => {
        let ownOffset = this.state.ownOffset;
        let partOffset = this.state.partOffset;
        if (key === "own") {
            ownOffset = page ? 10 * (page - 1) : 0;
        } else if (key === "part") {
            partOffset = page ? 10 * (page - 1) : 0;
        }

        this.setState({ ownOffset, partOffset });

        const body = {
            paging: {
                offsetOwned: ownOffset,
                offsetParticipating: partOffset,
                limitOwned: 10,
                limitParticipating: 10,
            },
        }

        this.props.liveScoreOwnPartCompetitionList(body, this.state.orgKey, null, null, key, this.state.year);
    };

    onChangeYear = (evt) => {
        this.setState({ year: evt.year });
        this.handlePagination();
    };

    dropdownButtonView = () => {
        // let yearList = this.props.liveScoreCompetition.yearList;
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div
                    className="row fluid-width"
                    style={{
                        maxWidth: "99%",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <div className="col-sm" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <span className="form-heading">
                            {AppConstants.ownedCompetitions}
                        </span>
                        <div style={{ marginTop: -10 }}>
                            <Tooltip placement="top" background="#ff8237">
                                <span>{AppConstants.ownedCompetitionMsg}</span>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="row fluid-width">
                        {this.state.orgLevel === "state" && (
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
                                    <Button
                                        type="primary"
                                        className="primary-add-comp-form"
                                        onClick={() => {
                                            setKeyForStateWideMessage("stateWideMessage");
                                            this.props.history.push({
                                                pathname: "/liveScoreNewsList",
                                                state: { screenKey: "stateWideMsg" },
                                            });
                                        }}
                                    >
                                        {AppConstants.stateWideMsg}
                                    </Button>
                                </div>
                            </div>
                        )}

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
                                <Button
                                    className="primary-add-comp-form"
                                    type="primary"
                                    onClick={() => {
                                        localStorage.removeItem("LiveScoreCompetition");
                                        this.props.history.push("/liveScoreSettingsView", "add");
                                    }}
                                >
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
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button className="primary-add-comp-form" type="primary"
                                >
                                    + {AppConstants.replicateCompetition}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    partHeaderView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-4" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <span className="form-heading">
                                {AppConstants.participateInComp}
                            </span>
                            <div style={{ marginTop: -10 }}>
                                <Tooltip placement="top" background="#ff8237">
                                    <span>{AppConstants.participateCompMsg}</span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    participatedView = () => {
        let { participatingInComptitions, participateTotalCount, participateCurrentPage, partLoad } = this.props.liveScoreCompetition;
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
    };

    onYearClick(yearId) {
        localStorage.setItem("yearId", yearId)
        this.setState({ year: yearId })

        const body = {
            paging: {
                offsetOwned: 0,
                offsetParticipating: 0,
                limitOwned: 10,
                limitParticipating: 10,
            },
        };
        this.props.liveScoreOwnPartCompetitionList(body, this.state.orgKey, null, null, "all", yearId);
    }

    ///dropdown view containing all the dropdown of header
    dropDownView = () => {
        const { yearList } = this.props.appState
        return (
            <div
                className="comp-player-grades-header-drop-down-view"
                style={{ marginTop: 15 }}
            >
                <div className="col-sm-2">
                    <div className="year-select-heading-view pb-3">
                        <div className="reg-filter-col-cont"  >
                            <span className="year-select-heading">
                                {AppConstants.year}:</span>
                            <Select
                                className="year-select reg-filter-select-year ml-2"
                                style={{ width: 90 }}
                                onChange={yearId => this.onYearClick(yearId)}
                                value={this.state.year}
                            >
                                {yearList.length > 0 && yearList.map((item, yearIndex) => (
                                    < Option key={"yearlist" + yearIndex} value={item.id} > {item.name}</Option>
                                ))
                                }
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    ownedView = () => {
        let { ownedCompetitions, ownedTotalCount, ownedCurrentPage, ownedLoad } = this.props.liveScoreCompetition;
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
                        className="antd-pagination pb-0"
                        current={ownedCurrentPage}
                        total={ownedTotalCount}
                        onChange={(page) => this.handlePagination(page, "own")}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />

                {/* <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="1" /> */}


                {this.dropdownButtonView()}
                {this.dropDownView()}
                {this.ownedView()}
                {this.partHeaderView()}
                {this.participatedView()}
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        liveScoreCompetition: state.liveScoreCompetition,
        appState: state.AppState,
    };
}

export default connect(mapStateToProps, {
    liveScoreOwnPartCompetitionList,
    liveScoreCompetitionActionInitiate,
    liveScoreCompetitionDeleteInitiate,
    getOnlyYearListAction,
})(LiveScoreCompetitions);
