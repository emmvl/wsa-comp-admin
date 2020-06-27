import React, { Component } from "react";
import { Layout, Button, Table, Select, Tag, Modal } from "antd";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../../util/history";
import { getOnlyYearListAction } from '../../store/actions/appAction'
import { isArrayNotEmpty } from "../../util/helpers";
import moment from "moment";
import { checkRegistrationType } from "../../util/permissions";
import Tooltip from 'react-png-tooltip'

const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

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
        title: "Registration Division",
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
        title: "Registration Type",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: (a, b) => tableSort(a, b, "teamCount"),
        render: teamCount => (
            <span>{teamCount == null || teamCount == "" ? "N/A" : teamCount}</span>
        )
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => tableSort(a, b, "playersCount"),
        render: playersCount => (
            <span>{playersCount == null || playersCount == "" ? "N/A" : playersCount}</span>
        )
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
        title: "Registration Division",
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
        title: "Registration Type",
        dataIndex: "teamCount",
        key: "teamCount",
        sorter: (a, b) => tableSort(a, b, "teamCount"),
        render: teamCount => (
            <span>{teamCount == null || teamCount == "" ? "N/A" : teamCount}</span>
        )
    },

    {
        title: "Status",
        dataIndex: "statusName",
        key: "statusName",
        sorter: (a, b) => tableSort(a, b, "statusName")

    },
   
];

const data = []

class RegisteredUser extends Component {
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
                                        <Button className="primary-add-comp-form" type="primary"
                                        >
                                            + {AppConstants.newCompetition}
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
                                        {/* <NavLink to="/competitionReplicate"> */}
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.replicateCompetition}
                                        </Button>
                                        {/* </NavLink> */}
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
                                        <Button className="primary-add-comp-form" type="primary"
                                        >
                                            + {AppConstants.newCompetitionReg}
                                        </Button>

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
                        // loading={this.props.competitionDashboardState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    // onRow={(record) => ({
                    //     onClick: () =>
                    //         this.compScreenDeciderCheck(record)
                    // })}
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
                        // loading={this.props.competitionDashboardState.onLoad === true && true}
                        className="home-dashboard-table"
                        columns={columnsOwned}
                        dataSource={data}
                        pagination={false}
                    // onRow={(record) => ({
                    //     onClick: () =>
                    //         this.compScreenDeciderCheck(record)
                    // })}
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
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((RegisteredUser));
