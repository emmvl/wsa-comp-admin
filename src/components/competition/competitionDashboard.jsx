import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Button, Table, Select, Tag, Modal, Menu, Radio } from "antd";
import moment from "moment";
import Tooltip from "react-png-tooltip";
import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import AppUniqueId from "themes/appUniqueId";
import { isArrayNotEmpty } from "util/helpers";
import history from "util/history";
import { checkRegistrationType, getCurrentYear } from "util/permissions";
import { getPrevUrl } from "util/sessionStorage";
import { getOnlyYearListAction, CLEAR_OWN_COMPETITION_DATA } from "store/actions/appAction";
import {
    competitionDashboardAction,
    updateCompetitionStatus,
    deleteCompetitionAction
} from "store/actions/competitionModuleAction/competitionDashboardAction";
import { clearCompReducerDataAction } from "store/actions/registrationAction/competitionFeeAction";
import Loader from "customComponents/loader";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";
import {
    setOwnCompetitionYear,
    setOwn_competition,
} from "../../util/sessionStorage";

const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu
let this_Obj = null;

function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key]);
    let stringB = JSON.stringify(b[key]);
    return stringA.localeCompare(stringB);
}

const columns = [
    {
        title: "Name",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => tableSort(a, b, "competitionName"),
    },
    {
        title: "Divisions",
        dataIndex: "divisions",
        key: "divisions",
        render: divisions => {
            let divisionList = isArrayNotEmpty(divisions) ? divisions : [];
            return (
                <span>
                    {divisionList.map(item => (
                        <Tag
                            className="comp-dashboard-table-tag"
                            color={item.color}
                            key={item.id}
                        >
                            {item.divisionName}
                        </Tag>
                    ))}
                </span>
            );
        },
        sorter: (a, b) => tableSort(a, b, "divisions"),
    },
    {
        title: "Teams",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: (a, b) => tableSort(a, b, "teamCount"),
        render: teamCount => (
            <span>{teamCount == null || teamCount === "" ? "N/A" : teamCount}</span>
        ),
    },
    {
        title: "Players",
        dataIndex: "playersCount",
        key: "playersCount",
        sorter: (a, b) => tableSort(a, b, "playersCount"),
        render: playersCount => (
            <span>{playersCount == null || playersCount === "" ? "N/A" : playersCount}</span>
        ),
    },
    {
        title: "Status",
        dataIndex: "statusName",
        key: "statusName",
        sorter: (a, b) => tableSort(a, b, "statusName"),
    },
];

const columnsOwned = [
    {
        title: "Name",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => tableSort(a, b, "competitionName"),
    },
    {
        title: "Divisions",
        dataIndex: "divisions",
        key: "divisions",
        render: divisions => {
            let divisionList = isArrayNotEmpty(divisions) ? divisions : [];
            return (
                <span>
                    {divisionList.map(item => (
                        <Tag
                            className="comp-dashboard-table-tag"
                            color={item.color}
                            key={item.id}
                        >
                            {item.divisionName}
                        </Tag>
                    ))}
                </span>
            );
        },
        sorter: (a, b) => tableSort(a, b, "divisions"),
    },
    {
        title: "Teams",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: (a, b) => tableSort(a, b, "teamCount"),
        render: teamCount => (
            <span>{teamCount == null || teamCount === "" ? "N/A" : teamCount}</span>
        ),
    },
    {
        title: "Players",
        dataIndex: "playersCount",
        key: "playersCount",
        sorter: (a, b) => tableSort(a, b, "playersCount"),
        render: playersCount => (
            <span>{playersCount == null || playersCount === "" ? "N/A" : playersCount}</span>
        ),
    },
    {
        title: "Status",
        dataIndex: "statusName",
        key: "statusName",
        sorter: (a, b) => tableSort(a, b, "statusName"),
    },
    {
        title: "Registration Type",
        dataIndex: "invitees",
        key: "invitees",
        render: invitees => {
            let inviteesRegType = isArrayNotEmpty(invitees) ? invitees : [];
            let registrationInviteesRefId = isArrayNotEmpty(inviteesRegType) ? inviteesRegType[0].registrationInviteesRefId : 0;
            return (
                <span>
                    {checkRegistrationType(registrationInviteesRefId)}
                </span>
            );
        },
        sorter: (a, b) => tableSort(a, b, "invitees"),
    },
    {
        title: 'Action',
        dataIndex: 'statusRefId',
        key: 'statusRefId',
        render: (statusRefId, record) => (
            statusRefId === 1 ? (
                <div onClick={(e) => e.stopPropagation()}>
                    <Menu
                        className="action-triple-dot-submenu"
                        theme="light"
                        mode="horizontal"
                        style={{ lineHeight: '25px' }}
                    >
                        <SubMenu
                            key="sub1"
                            title={
                                <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                            }
                        >
                            <Menu.Item key="1" onClick={() => this_Obj.updateCompetitionStatus(record)}>
                                <span>{AppConstants.editRegrade}</span>
                            </Menu.Item>
                            <Menu.Item key="2" onClick={() => this_Obj.deleteCompetition("show", record)}>
                                <span>{AppConstants.delete}</span>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
            ) : (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Menu
                            className="action-triple-dot-submenu"
                            theme="light"
                            mode="horizontal"
                            style={{ lineHeight: '25px' }}
                        >
                            <SubMenu
                                key="sub1"
                                title={
                                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                                }
                            >
                                <Menu.Item key="1" onClick={() => this_Obj.deleteCompetition("show", record)}>
                                    <span>{AppConstants.delete}</span>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                )
        ),
    },
];

class CompetitionDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: "2019",
            loading: false,
            modalVisible: false,
            competitionId: "",
            competitionName: "",
            statusRefId: null,
            onDeleteTargetValue: 2,
            deleteCompLoad: false,
        };

        this.props.CLEAR_OWN_COMPETITION_DATA("all");

        this_Obj = this;
    }

    componentDidMount() {
        const prevUrl = getPrevUrl();
        if (!prevUrl || !(history.location.pathname === prevUrl.pathname && history.location.key === prevUrl.key)) {
            this.props.getOnlyYearListAction(this.props.appState.yearList);
            this.setState({ loading: true });
        } else {
            history.push("/");
        }
    }

    componentDidUpdate(nextProps) {
        const { yearList } = this.props.appState;
        if (this.state.loading === true && this.props.appState.onLoad === false) {
            if (yearList.length > 0) {
                let yearRefId = this.getYearRefId();
                this.props.competitionDashboardAction(yearRefId);
                this.setState({ loading: false });
            }
        }

        if (this.state.deleteCompLoad === true && this.props.competitionDashboardState.deleteCompLoad === false) {
            this.setState({ deleteCompLoad: false });
            if (yearList.length > 0) {
                window.location.reload();
                // let yearRefId = this.getYearRefId();
                // this.props.competitionDashboardAction(yearRefId);
                // this.setState({ loading: false });
            }
        }
    }

    getYearRefId = () => {
        const { yearList } = this.props.appState;
        let storedYearID = localStorage.getItem("yearId");
        let yearRefId;
        if (storedYearID == null || storedYearID == "null") {
            yearRefId = getCurrentYear(yearList)
        } else {
            yearRefId = storedYearID;
        }
        return yearRefId;
    };

    updateCompetitionStatus = (record) => {
        let storedYearID = localStorage.getItem("yearId");
        let selectedYearId = (storedYearID == null || storedYearID == 'null') ? 1 : JSON.parse(storedYearID);
        let payload = {
            competitionUniqueKey: record.competitionId,
            statusRefId: 2,
        };
        this.props.updateCompetitionStatus(payload, selectedYearId);
    };

    deleteCompetition = (key, record) => {
        if (key === "show") {
            this.setState({
                modalVisible: true,
                competitionId: record.competitionId,
                competitionName: record.competitionName,
                statusRefId: record.statusRefId,
            });
        } else if (key === "ok") {
            this.props.deleteCompetitionAction(this.state.competitionId, this.state.onDeleteTargetValue);
            this.setState({
                modalVisible: false,
                deleteCompLoad: true,
            });
        } else if (key === "cancel") {
            this.setState({
                modalVisible: false,
                onDeleteTargetValue: 2,
            });
        }
    };

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    onYearClick = (yearId) => {
        localStorage.setItem("yearId", yearId);
        this.props.competitionDashboardAction(yearId);
    };

    dropdownView = () => {
        const { yearList, selectedYear } = this.props.appState;
        let storedYearID = localStorage.getItem("yearId");
        let selectedYearId = (storedYearID == null || storedYearID == 'null') ? 1 : JSON.parse(storedYearID);
        return (
            <div
                className="comp-player-grades-header-drop-down-view"
                style={{ marginTop: 15 }}
            >
                <div className="row">
                    <div className="col-sm-8">
                        <div className="year-select-heading-view pb-3">
                            <span className="year-select-heading">{AppConstants.year}:</span>
                            <Select
                                className="year-select reg-filter-select-year ml-2"
                                style={{ width: 90 }}
                                onChange={this.onYearClick}
                                value={selectedYearId}
                            >
                                {yearList.map((item) => (
                                    <Option key={'year_' + item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="fluid-width">
                    <div className="row">
                        <div
                            className="col-sm-4"
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <span className="form-heading">
                                {AppConstants.ownedCompetitions}
                            </span>
                            <div style={{ marginTop: -10 }}>
                                <Tooltip placement="top" background="#ff8237">
                                    <span>{AppConstants.ownedCompetitionMsg}</span>
                                </Tooltip>
                            </div>
                        </div>
                        <div
                            className="col-sm"
                            style={{
                                maxWidth: "99%",
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
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
                                        <NavLink to="/quickCompetition">
                                            <Button
                                                id={AppUniqueId.quickCom_Button}
                                                className="primary-add-comp-form"
                                                type="primary"
                                            >
                                                + {AppConstants.quickCompetition}
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
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Button
                                            id={AppUniqueId.newCompetitionButton}
                                            className="primary-add-comp-form"
                                            type="primary"
                                            onClick={() => this.openModel(this.props)}
                                        >
                                            + {AppConstants.fullCompetition}
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
                                        <NavLink to="/competitionReplicate">
                                            <Button
                                                id={AppUniqueId.replicateCompetitionButton}
                                                className="primary-add-comp-form"
                                                type="primary"
                                            >
                                                + {AppConstants.replicateCompetition}
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    openModel = (props) => {
        let competitionId = this.props.competitionFeesState.competitionId;
        let this_ = this;
        confirm({
            title: 'Do you want to add registration?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                // [
                // <NavLink
                //     // onClick={() => this.props.clearCompReducerDataAction("all")}
                //     to={{ pathname: `/registrationCompetitionForm`, state: { id: null } }}
                // />
                // ]
                this_.onRegistrationCompScreen();
            },
            onCancel() {
                this_.onCompetitionScreen();
            },
        });
    };

    onCompetitionScreen = () => {
        this.props.clearCompReducerDataAction("all");
        history.push("/registrationCompetitionForm", { id: null });
    };

    onRegistrationCompScreen = () => {
        this.props.clearCompReducerDataAction("all");
        history.push("/registrationCompetitionFee", { id: null });
    };

    dropdownButtonView = () => {
        const { yearList, selectedYear } = this.props.appState;
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div
                            className="col-sm"
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <span id={AppUniqueId.ownedCompetition_column_headers_table} className="form-heading">
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
            </div>
        );
    };

    compScreenDeciderCheck = (record, key) => {
        let storedYearID = localStorage.getItem("yearId");
        let selectedYearId = (storedYearID == null || storedYearID == 'null') ? 1 : JSON.parse(storedYearID);
        if (key === "own") {
            history.push("/competitionOpenRegForm", { id: record.competitionId, screenKey: "compDashboard" });
            setOwn_competition(record.competitionId)
            setOwnCompetitionYear(selectedYearId)
        } else {
            history.push("/registrationCompetitionForm", { id: record.competitionId });
        }
    };

    participatedView = () => (
        <div className="comp-dash-table-view" style={{ paddingBottom: 100 }}>
            <div className="table-responsive home-dash-table-view">
                <Table
                    loading={this.props.competitionDashboardState.onLoad}
                    className="home-dashboard-table"
                    columns={columns}
                    dataSource={this.props.competitionDashboardState.participatingInComptitions}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => this.compScreenDeciderCheck(record, "part"),
                    })}
                    rowKey={(record, index) => "participatingInComptitions" + record.competitionId + index}
                />
            </div>
        </div>
    );

    onChangeSetValue = (targetValue) => {
        this.setState({
            onDeleteTargetValue: targetValue,
        });
    }

    ownedView = () => (
        <div className="comp-dash-table-view">
            <div className="table-responsive home-dash-table-view">
                <Table
                    loading={this.props.competitionDashboardState.onLoad}
                    className="home-dashboard-table"
                    columns={columnsOwned}
                    dataSource={this.props.competitionDashboardState.ownedCompetitions}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => this.compScreenDeciderCheck(record, "own"),
                    })}
                    key={AppUniqueId.owned_compet_content_table}
                    rowKey={(record, index) => "ownedCompetitions" + record.competitionId + index}
                />
            </div>
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.deleteCompetition}
                visible={this.state.modalVisible}
                onOk={() => this.deleteCompetition("ok", this.state.competitionId)}
                onCancel={() => this.deleteCompetition("cancel", this.state.competitionId)}
                okText={AppConstants.yes}
                cancelText={AppConstants.no}
            >
                {this.state.statusRefId === 0 ? (
                    <p>{AppConstants.compDeleteConfirm.replace("(COMP_NAME)", this.state.competitionName)}</p>
                ) : (
                        <div>
                            <p>
                                {AppConstants.deletePublishToLsMsg
                                    .replace("(COMP_NAME)", this.state.competitionName)
                                    .replace("(COMP_NAME)", this.state.competitionName)}
                            </p>
                            <Radio.Group
                                className="reg-competition-radio customize-radio-text"
                                onChange={(e) => this.onChangeSetValue(e.target.value)}
                                value={this.state.onDeleteTargetValue}
                            >
                                <Radio value={1}>{AppConstants.both}</Radio>
                                <Radio value={2}>{AppConstants.onlyCompMngmt}</Radio>
                            </Radio.Group>
                        </div>
                    )}
            </Modal>
        </div>
    );

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.competitions}
                    menuName={AppConstants.competitions}
                />

                <InnerHorizontalMenu menu="competition" compSelectedKey="1" />

                <Layout>
                    <Content>
                        {this.dropdownView()}
                        <Loader visible={this.props.competitionDashboardState.updateLoad} />
                        {this.ownedView()}
                        {this.dropdownButtonView()}
                        {this.participatedView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clearCompReducerDataAction,
        competitionDashboardAction,
        getOnlyYearListAction,
        CLEAR_OWN_COMPETITION_DATA,
        updateCompetitionStatus,
        deleteCompetitionAction
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        competitionDashboardState: state.CompetitionDashboardState,
        appState: state.AppState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionDashboard);
