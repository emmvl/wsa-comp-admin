import React, { Component } from "react";
import { Layout, Button, Table, Select, Tag } from "antd";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearCompReducerDataAction } from "../../store/actions/registrationAction/competitionFeeAction";
import { competitionDashboardAction } from '../../store/actions/competitionModuleAction/competitionDashboardAction';
import history from "../../util/history";
import { getOnlyYearListAction } from '../../store/actions/appAction'
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";

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

    }
];

class CompetitionDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            loading: false
        };
    }

    componentDidMount() {

        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.setState({ loading: true })
    }

    componentDidUpdate(nextProps) {
        const { yearList } = this.props.appState
        console.log(this.props.appState, 'componentDidUpdate')

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

    onChange = e => {
        console.log("radio checked", e.target.value);
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
                        <div className="col-sm-4">
                            <span className="form-heading">
                                {AppConstants.participateInComp}
                            </span>
                        </div>
                        <div className="col-sm-8">
                            <div className="year-select-heading-view">
                                <span className="year-select-heading">
                                    {AppConstants.year}:
                </span>
                                <Select
                                    className="year-select"
                                    onChange={yearId => this.onYearClick(yearId)}
                                    value={selectedYearId}
                                >
                                    {yearList.length > 0 && yearList.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
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
                        <div className="col-sm">
                            <span className="form-heading">
                                {AppConstants.ownedCompetitions}
                            </span>
                        </div>
                        {/* <div className="col-sm">
                            <div className="year-select-heading-view">
                                <span className="year-select-heading">
                                    {AppConstants.year}:
                                    </span>
                                <Select
                                    className="year-select"
                                    onChange={yearId => this.onYearClick(yearId)}
                                    value={selectedYear}
                                >
                                    {yearList.length > 0 && yearList.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            </div>
                        </div> */}
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
                                    >
                                        <NavLink
                                            onClick={() => this.props.clearCompReducerDataAction("all")}
                                            to={{ pathname: `/registrationCompetitionForm`, state: { id: null } }}
                                            className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary"
                                            >
                                                + {AppConstants.newCompetition}
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
                                        <NavLink to="/competitionReplicate">
                                            <Button className="primary-add-comp-form" type="primary">
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
                                history.push("/registrationCompetitionForm", { id: record.competitionId })
                        })}
                    />

                </div>
            </div>
        );
    };

    ////////ownedView view for competition
    ownedView = () => {
        return (
            <div className="comp-dash-table-view">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.competitionDashboardState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columnsOwned}
                        dataSource={this.props.competitionDashboardState.ownedCompetitions}
                        pagination={false}
                        onRow={(record) => ({
                            onClick: () =>
                                history.push("/registrationCompetitionForm", { id: record.competitionId })
                        })}
                    />
                </div>
            </div>
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
        getOnlyYearListAction
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
