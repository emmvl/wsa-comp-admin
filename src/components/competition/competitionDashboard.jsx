import React, { Component } from "react";
import { Layout, Button, Table, Select, Tag, Modal, Menu } from "antd";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearCompReducerDataAction } from "../../store/actions/registrationAction/competitionFeeAction";
import { competitionDashboardAction, updateCompetitionStatus } from '../../store/actions/competitionModuleAction/competitionDashboardAction';
import history from "../../util/history";
import { getOnlyYearListAction, CLEAR_OWN_COMPETITION_DATA } from '../../store/actions/appAction'
import { isArrayNotEmpty } from "../../util/helpers";
import moment from "moment";
import { checkRegistrationType } from "../../util/permissions";
import Tooltip from 'react-png-tooltip'
import AppImages from "../../themes/appImages"
import AppUniqueId from "../../themes/appUniqueId";
import Loader from '../../customComponents/loader'

const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu
let this_Obj = null;
/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: "Name",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => tableSort(a, b, "competitionName")

    },
    {
        title: "Divisions",
        dataIndex: "divisions",
        key: "divisions",
        render: divisions => {
            let divisionList = isArrayNotEmpty(divisions) ? divisions : []
            return (

                < span >
                    {
                        divisionList.map(item => (
                            <Tag
                                className="comp-dashboard-table-tag"
                                color={item.color}
                                key={item.id}
                            >
                                {item.divisionName}
                            </Tag>
                        ))
                    }
                </span >
            )
        },
        sorter: (a, b) => tableSort(a, b, "divisions")
    },

    {
        title: "Teams",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: (a, b) => tableSort(a, b, "teamCount"),
        render: teamCount => (
            <span>{teamCount == null || teamCount == "" ? "N/A" : teamCount}</span>
        )
    },
    {
        title: "Players",
        dataIndex: "playersCount",
        key: "playersCount",
        sorter: (a, b) => tableSort(a, b, "playersCount"),
        render: playersCount => (
            <span>{playersCount == null || playersCount == "" ? "N/A" : playersCount}</span>
        )
    },
    {
        title: "Status",
        dataIndex: "statusName",
        key: "statusName",
        sorter: (a, b) => tableSort(a, b, "statusName")
    }
];

const columnsOwned = [
    {
        title: "Name",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => tableSort(a, b, "competitionName")
    },
    {
        title: "Divisions",
        dataIndex: "divisions",
        key: "divisions",
        render: divisions => {
            let divisionList = isArrayNotEmpty(divisions) ? divisions : []
            return (
                < span >
                    {
                        divisionList.map(item => (
                            <Tag
                                className="comp-dashboard-table-tag"
                                color={item.color}
                                key={item.id}
                            >
                                {item.divisionName}
                            </Tag>
                        ))
                    }
                </span >
            )
        },
        sorter: (a, b) => tableSort(a, b, "divisions")
    },

    {
        title: "Teams",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: (a, b) => tableSort(a, b, "teamCount"),
        render: teamCount => (
            <span>{teamCount == null || teamCount == "" ? "N/A" : teamCount}</span>
        )
    },
    {
        title: "Players",
        dataIndex: "playersCount",
        key: "playersCount",
        sorter: (a, b) => tableSort(a, b, "playersCount"),
        render: playersCount => (
            <span>{playersCount == null || playersCount == "" ? "N/A" : playersCount}</span>
        )
    },
    {
        title: "Status",
        dataIndex: "statusName",
        key: "statusName",
        sorter: (a, b) => tableSort(a, b, "statusName")

    },
    {
        title: "Registration Type",
        dataIndex: "invitees",
        key: "invitees",
        render: invitees => {
            let inviteesRegType = isArrayNotEmpty(invitees) ? invitees : []
            let registrationInviteesRefId = isArrayNotEmpty(inviteesRegType) ? inviteesRegType[0].registrationInviteesRefId : 0
            return (
                < span >
                    {checkRegistrationType(registrationInviteesRefId)}
                </span >
            )
        },
        sorter: (a, b) => tableSort(a, b, "invitees")
    },
    {
        title: 'Action',
        dataIndex: 'statusRefId',
        key: 'statusRefId',
        render: (statusRefId, record) => {
            return (
                statusRefId == 1 &&
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
                            <Menu.Item key="1"
                                onClick={() => this_Obj.updateCompetitionStatus(record)}
                            >
                                <span>{AppConstants.editRegrade}</span>
                            </Menu.Item>

                        </SubMenu>
                    </Menu>
                </div>
            )
        }
    },
];

class CompetitionDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            loading: false
        };
        this.props.CLEAR_OWN_COMPETITION_DATA("participate_CompetitionArr")
        this_Obj = this
    }

    componentDidMount() {

        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.setState({ loading: true })
    }

    componentDidUpdate(nextProps) {
        const { yearList } = this.props.appState
        if (this.state.loading == true && this.props.appState.onLoad == false) {
            if (yearList.length > 0) {
                let storedYearID = localStorage.getItem("yearId");
                let yearRefId = null
                if (storedYearID == null || storedYearID == "null") {
                    yearRefId = yearList[0].id
                } else {
                    yearRefId = storedYearID
                }
                this.props.competitionDashboardAction(yearRefId)
                this.setState({ loading: false })
            }
        }
    }
    updateCompetitionStatus = (record) => {
        let storedYearID = localStorage.getItem("yearId");
        let selectedYearId = (storedYearID == null || storedYearID == 'null') ? 1 : JSON.parse(storedYearID)
        let payload = {
            competitionUniqueKey: record.competitionId,
            statusRefId: 2
        }
        this.props.updateCompetitionStatus(payload, selectedYearId)
    }
    onChange = e => {
        this.setState({
            value: e.target.value
        });
    };
    onYearClick(yearId) {
        localStorage.setItem("yearId", yearId)
        this.props.competitionDashboardAction(yearId)
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        const { yearList, selectedYear } = this.props.appState
        let storedYearID = localStorage.getItem("yearId");
        let selectedYearId = (storedYearID == null || storedYearID == 'null') ? 1 : JSON.parse(storedYearID)
        return (
            <div
                className="comp-player-grades-header-drop-down-view"
                style={{ marginTop: 15 }}
            >
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
                        <div className="col-sm-8">
                            <div className="year-select-heading-view">
                                <span className="year-select-heading">
                                    {AppConstants.year}:</span>
                                <Select
                                    className="year-select reg-filter-select-year ml-2"
                                    style={{ width: 90 }}
                                    onChange={yearId => this.onYearClick(yearId)}
                                    value={selectedYearId}
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
            </div>
        );
    };

    openModel = (props) => {
        let competitionId = this.props.competitionFeesState.competitionId
        let this_ = this
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
                this_.onRegistrationCompScreen()

            },
            onCancel() {
                this_.onCompetitionScreen()
            },
        });
    }

    onCompetitionScreen = () => {
        this.props.clearCompReducerDataAction("all")
        history.push("/registrationCompetitionForm", { id: null })
    }

    onRegistrationCompScreen = () => {
        this.props.clearCompReducerDataAction("all")
        history.push("/registrationCompetitionFee", { id: null })
    }



    ///dropdown view containing dropdown and next screen navigation button/text
    dropdownButtonView = () => {
        const { yearList, selectedYear } = this.props.appState
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span id={AppUniqueId.ownedCompetition_column_headers_table} className="form-heading">
                                {AppConstants.ownedCompetitions}
                            </span>
                            <div style={{ marginTop: -10 }}>
                                <Tooltip placement="top" background='#ff8237'>
                                    <span>{AppConstants.ownedCompetitionMsg}</span>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="col-sm" style={{
                            display: "flex", maxWidth: "99%",
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
                                        <NavLink to="/quickCompetition">
                                            <Button className="primary-add-comp-form" type="primary"
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
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <Button id={AppUniqueId.newCompetitionButton} className="primary-add-comp-form" type="primary" onClick={() => this.openModel(this.props)}
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
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <NavLink to="/competitionReplicate">
                                            <Button id={AppUniqueId.replicateCompetitionButton} className="primary-add-comp-form" type="primary">
                                                + {AppConstants.replicateCompetition}
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


    compScreenDeciderCheck = (record) => {
        let registrationCloseDate = record.registrationCloseDate && moment(record.registrationCloseDate)
        let isRegClosed = registrationCloseDate ? !registrationCloseDate.isSameOrAfter(moment()) : false;

        // if (record.hasRegistration == 1 && isRegClosed == false) {
        //     history.push("/registrationCompetitionFee", { id: record.competitionId })
        // }
        // else {
        history.push("/registrationCompetitionForm", { id: record.competitionId })
        // }
    }

    ////////participatedView view for competition
    participatedView = () => {
        return (
            <div className="comp-dash-table-view">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.competitionDashboardState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={this.props.competitionDashboardState.participatingInComptitions}
                        pagination={false}
                        onRow={(record) => ({
                            onClick: () =>
                                this.compScreenDeciderCheck(record)
                        })}
                    />

                </div>
            </div>
        );
    };

    ////////ownedView view for competition
    ownedView = () => {
        return (
            <div className="comp-dash-table-view " style={{ paddingBottom: 100 }}>
                <div id={AppUniqueId.ownedCompetition_Table} className="table-responsive home-dash-table-view ">
                    <Table
                        loading={this.props.competitionDashboardState.onLoad === true && true}
                        className="home-dashboard-table"
                        columns={columnsOwned}
                        dataSource={this.props.competitionDashboardState.ownedCompetitions}
                        pagination={false}
                        onRow={(record) => ({
                            onClick: () =>
                                this.compScreenDeciderCheck(record)
                        })}
                    />
                </div>
            </div >
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.competitions}
                    menuName={AppConstants.competitions}
                />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"1"} />
                <Layout>
                    <Content>
                        {this.dropdownView()}
                        <Loader visible={this.props.competitionDashboardState.updateLoad} />
                        {this.participatedView()}
                        {this.dropdownButtonView()}
                        {this.ownedView()}
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
        updateCompetitionStatus
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        competitionDashboardState: state.CompetitionDashboardState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((CompetitionDashboard));
