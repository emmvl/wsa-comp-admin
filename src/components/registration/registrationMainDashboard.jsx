import React, { Component } from "react";
import { Layout, Button, Table, Select, Tag, Modal } from "antd";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOnlyYearListAction } from '../../store/actions/appAction'
import { isArrayNotEmpty } from "../../util/helpers";
import { registrationMainDashboardListAction } from "../../store/actions/registrationAction/registrationDashboardAction";
import { checkRegistrationType } from "../../util/permissions";
import { clearCompReducerDataAction } from "../../store/actions/registrationAction/competitionFeeAction";
import history from "../../util/history";

const { Content } = Layout;
const { Option } = Select;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: "Competition Name",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => tableSort(a, b, "competitionName")

    },
    {
        title: "Registration Divisions",
        dataIndex: "divisions",
        key: "divisions",
        render: divisions => {
            let divisionList = isArrayNotEmpty(divisions) ? divisions : []
            return (
                < span key={"part1"}>
                    {
                        divisionList.map(item => (
                            <Tag
                                className="comp-dashboard-table-tag"
                                color={item.color}
                                key={"part" + item.id}
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
        title: "Status",
        dataIndex: "statusName",
        key: "statusName",
        sorter: (a, b) => tableSort(a, b, "statusName"),
    },
];

const columnsOwned = [
    {
        title: "Competition Name",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => tableSort(a, b, "competitionName")
    },
    {
        title: "Registration Divisions",
        dataIndex: "divisions",
        key: "divisions",
        render: divisions => {
            let divisionList = isArrayNotEmpty(divisions) ? divisions : []
            return (
                < span key={"owned1"} >
                    {
                        divisionList.map(item => (
                            <Tag
                                className="comp-dashboard-table-tag"
                                color={item.color}
                                key={"owned" + item.id}
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
        title: "Status",
        dataIndex: "statusName",
        key: "statusName",
        sorter: (a, b) => tableSort(a, b, "statusName")

    },

];

class RegistrationMainDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: 1,
            loading: false
        };
    }

    componentDidMount() {
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.setState({ loading: true })
        this.props.registrationMainDashboardListAction(this.state.year)
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
                this.setState({ loading: false })
            }
        }
    }

    onChange = e => {
        this.setState({
            value: e.target.value
        });
    };
    onYearClick(yearId) {
        localStorage.setItem("yearId", yearId)
        this.setState({ year: yearId })
        this.props.registrationMainDashboardListAction(yearId)
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
                        <div className="col-sm-6" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span className="form-heading">
                                {AppConstants.participateInCompReg}
                            </span>
                            {/* <div style={{ marginTop: -10 }}>
                                <Tooltip placement="top" background='#ff8237'>
                                    <span>{AppConstants.participateCompMsg}</span>
                                </Tooltip>
                            </div> */}
                        </div>
                        <div className="col-sm-6">
                            <div className="year-select-heading-view">
                                <span className="year-select-heading">
                                    {AppConstants.year}:
                </span>
                                <Select
                                    className="year-select"
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
            </div>
        );
    };

    ///dropdown view containing dropdown and next screen navigation button/text
    dropdownButtonView = () => {
        const { yearList, selectedYear } = this.props.appState
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-4" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span className="form-heading">
                                {AppConstants.ownedCompetitionsReg}
                            </span>
                            {/* <div style={{ marginTop: -10 }}>
                                <Tooltip placement="top" background='#ff8237'>
                                    <span>{AppConstants.ownedCompetitionMsg}</span>
                                </Tooltip>
                            </div> */}
                        </div>
                        <div className="col-sm">
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
                                        onClick={() => this.props.clearCompReducerDataAction("all")}
                                    >
                                        <NavLink
                                            to={{ pathname: `/registrationCompetitionFee`, state: { id: null } }}
                                            className="text-decoration-none"
                                        >
                                            <Button className="primary-add-comp-form" type="primary"
                                            >
                                                + {AppConstants.newCompetitionReg}
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

    ////////participatedView view for competition
    participatedView = () => {
        return (
            <div className="comp-dash-table-view">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.registrationDashboardState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={this.props.registrationDashboardState.participatingInRegistrations}
                        pagination={false}
                        rowKey={record => "participatingInRegistrations" + record.competitionId}
                        onRow={(record) => ({
                            onClick: () => history.push("/registrationCompetitionFee", { id: record.competitionId })
                        })}
                    />

                </div>
            </div>
        );
    };

    ////////ownedView view for competition
    ownedView = () => {
        console.log(this.props.registrationDashboardState)
        return (
            <div className="comp-dash-table-view">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.registrationDashboardState.onLoad === true && true}
                        className="home-dashboard-table"
                        columns={columnsOwned}
                        dataSource={this.props.registrationDashboardState.ownedRegistrations}
                        pagination={false}
                        rowKey={record => "ownedRegistrations" + record.competitionId}
                        onRow={(record) => ({
                            onClick: () => history.push("/registrationCompetitionFee", { id: record.competitionId })
                        })}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"1"} />
                <Layout>
                    <Content>
                        {this.dropdownView()}
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
        getOnlyYearListAction,
        registrationMainDashboardListAction,
        clearCompReducerDataAction,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        registrationDashboardState: state.RegistrationDashboardState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((RegistrationMainDashboard));
