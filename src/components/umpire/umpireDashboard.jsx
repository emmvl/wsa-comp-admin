import React, { Component } from "react";
import { Input, Layout, Button, Table, Select, Menu, Icon, Pagination } from 'antd';
import './umpire.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from "../../util/helpers";
import { getUmpireDashboardList, getUmpireDashboardVenueList, getUmpireDashboardDivisionList } from "../../store/actions/umpireAction/umpireDashboardAction"
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { entityTypes } from '../../util/entityTypes'
import { refRoleTypes } from '../../util/refRoles'
import { getUmpireCompetiton, setUmpireCompition, getOrganisationData } from '../../util/sessionStorage'
import moment, { utc } from "moment";

const { Content } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;


/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}
let this_obj = null;


const columns = [

    {
        title: 'Match ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, "id"),
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, "startTime"),
        render: (startTime, record) =>
            <span >{moment(startTime).format("DD/MM/YYYY HH:mm")}</span>
    },
    {
        title: 'Home',
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, "team1"),
        render: (team1, record) =>
            <span >{team1.name}</span>
    },
    {
        title: 'Away',
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, "team2"),
        render: (team2, record) =>
            <span >{team2.name}</span>
    },
    {
        title: 'Round',
        dataIndex: 'round',
        key: 'round',
        sorter: (a, b) => tableSort(a, b, "round"),
        render: (round, record) =>
            <span >{round.name}</span>
    },
    {
        title: 'Umpire 1',
        dataIndex: 'umpires',
        key: 'umpires',
        sorter: (a, b) => tableSort(a, b, "umpires"),
        render: (umpires, record) => {
            return (

                umpires &&
                <span style={{ color: (umpires[0].verifiedBy !== null || umpires[0].status == 'YES') ? 'green' : (umpires[0].verifiedBy !== null || umpires[0].status == 'NO') ? 'red' : 'grey' }} >{umpires[0].umpireName}</span>

            )
        }


    },
    {
        title: 'Umpire 1 Organisation',
        dataIndex: 'umpires',
        key: 'umpires',
        sorter: (a, b) => tableSort(a, b, "umpires"),
        render: (umpires, record) => <span >

            {isArrayNotEmpty(umpires) && umpires[0].organisations.map((item) => (
                <span className="live-score-desc-text side-bar-profile-data" >{item.name}</span>
            ))
            }
        </span>
    },
    {
        title: 'Umpire 2',
        dataIndex: 'umpires',
        key: 'umpires',
        sorter: (a, b) => tableSort(a, b, "umpires"),
        render: (umpires, record) => {
            return (

                umpires &&
                <span style={{ color: (umpires[1].verifiedBy !== null || umpires[1].status == 'YES') ? 'green' : (umpires[1].verifiedBy !== null || umpires[1].status == 'NO') ? 'red' : 'grey' }} >{umpires[1].umpireName}</span>

            )
        }
    },
    {
        title: 'Umpire 2 Organisation',
        dataIndex: 'umpires',
        key: 'umpires',
        sorter: (a, b) => tableSort(a, b, "umpires"),
        render: (umpires, record) => <span >

            {isArrayNotEmpty(umpires) && umpires[1].organisations.map((item) => (
                <span className="live-score-desc-text side-bar-profile-data" >{item.name}</span>
            ))
            }
        </span>
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
                    {/* <NavLink to={{
                        pathname: '/addUmpire',
                        state: { isEdit: true, tableRecord: record }
                    }}> */}
                    <span >Edit</span>
                    {/* </NavLink> */}
                </Menu.Item>
                <Menu.Item key="2" >
                    {/* <NavLink to={{
                        pathname: "./liveScoreAssignMatch",
                        state: { record: record }
                    }}> */}
                    <span >Delete</span>
                    {/* </NavLink> */}
                </Menu.Item>
                <Menu.Item key="3" >
                    {/* <NavLink to={{
                        pathname: "./liveScoreAssignMatch",
                        state: { record: record }
                    }}> */}
                    <span >Invite</span>
                    {/* </NavLink> */}
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    }


];

const data = []

class UmpireDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionid: null,
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            venue: null,
            venueLoad: false,
            division: null,
            divisionLoad: false,
            venueSuccess: false,
            divisionSuccess: false,
            orgId: null
        }
        this_obj = this
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        let orgId = getOrganisationData().organisationId;
        this.setState({ loading: true, orgId: orgId })

        this.props.umpireCompetitionListAction(organisationId)

    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading == true && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id


                if (getUmpireCompetiton()) {
                    let compId = JSON.parse(getUmpireCompetiton())
                    firstComp = compId
                } else {
                    setUmpireCompition(firstComp)
                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey

                // const body =
                // {
                //     "paging": {
                //         "limit": 10,
                //         "offset": 0
                //     }
                // }

                // this.props.getUmpireDashboardList({compId: firstComp,divisionid:this.state.division,venueId:this.state.venue,pageData:body})
                this.props.getUmpireDashboardVenueList(firstComp)
                this.props.getUmpireDashboardDivisionList(firstComp)

                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey, venueLoad: true, divisionLoad: true })
            }
        }

        if (nextProps.umpireDashboardState !== this.props.umpireDashboardState) {
            if (this.props.umpireDashboardState.onVenueLoad !== this.state.venueLoad) {
                let venueList = isArrayNotEmpty(this.props.umpireDashboardState.umpireVenueList) ? this.props.umpireDashboardState.umpireVenueList : []
                let firstVenue = venueList.length > 0 && venueList[0].venueId
                this.setState({ venue: firstVenue, venueLoad: false, venueSuccess: firstVenue && true })
            }
        }

        if (nextProps.umpireDashboardState !== this.props.umpireDashboardState) {
            if (this.props.umpireDashboardState.onDivisionLoad !== this.state.divisionLoad) {
                let divisionList = isArrayNotEmpty(this.props.umpireDashboardState.umpireDivisionList) ? this.props.umpireDashboardState.umpireDivisionList : []
                let firstDivision = divisionList.length > 0 && divisionList[0].id
                this.setState({ division: firstDivision, divisionLoad: false, divisionSuccess: firstDivision && true })
            }
        }

        if (this.state.venueSuccess && this.state.divisionSuccess) {
            console.log('checking')
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                }
            }

            this.props.getUmpireDashboardList({ compId: this.state.selectedComp, divisionid: this.state.division, venueId: this.state.venue, orgId: this.state.orgId, pageData: body })
            this.setState({ venueSuccess: false, divisionSuccess: false })
        }
    }

    /// Handle Page change
    handlePageChnage(page) {
        console.log(page, 'page')
        let offset = page ? 10 * (page - 1) : 0;

        this.props.getUmpireDashboardList({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, offset: offset })

    }


    ////////form content view
    contentView = () => {
        const { umpireDashboardList } = this.props.umpireDashboardState
        let umpireListResult = isArrayNotEmpty(umpireDashboardList) ? umpireDashboardList : []
        console.log(umpireListResult, 'umpireListResult')
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.umpireDashboardState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={umpireListResult}
                        pagination={false} />
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
                            current={1}
                            total={10}
                            defaultPageSize={10}
                            onChange={(page) => this.handlePageChnage(page)}
                        />
                    </div>
                </div>
            </div>
        )
    }



    onChangeComp(compID) {
        let selectedComp = compID.comp
        setUmpireCompition(selectedComp)
        let compKey = compID.competitionUniqueKey
        this.props.getUmpireDashboardVenueList(selectedComp)
        this.props.getUmpireDashboardDivisionList(selectedComp)
        this.props.getUmpireDashboardList({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: selectedComp, offset: 0 })
        this.setState({ selectedComp, competitionUniqueKey: compKey, venueLoad: true, divisionLoad: true })

    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {

            this.props.getUmpireDashboardList({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, offset: 0, userName: e.target.value })
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.props.getUmpireDashboardList({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, userName: this.state.searchText, offset: 0 })
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            this.props.getUmpireDashboardList({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, userName: this.state.searchText, offset: 0 })
        }
    }

    onVenueChange(venueId) {
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }

        this.props.getUmpireDashboardList({ compId: this.state.selectedComp, divisionid: this.state.division, venueId: venueId, orgId: this.state.orgId, pageData: body })
        this.setState({ venue: venueId })

    }

    onDivisionChange(divisionid) {

        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }

        this.props.getUmpireDashboardList({ compId: this.state.selectedComp, divisionid: divisionid, venueId: this.state.venue, orgId: this.state.orgId, pageData: body })
        this.setState({ division: divisionid })
    }


    ///////view for breadcrumb
    headerView = () => {

        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.dashboard}
                            </span>
                        </div>

                        <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                            <div className="row">

                                <div className="col-sm pt-1">
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
                                        {/* <NavLink to={`/addUmpire`} className="text-decoration-none"> */}
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addUmpire}
                                        </Button>
                                        {/* </NavLink> */}
                                    </div>
                                </div>
                                <div className="col-sm pt-1">
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
                                <div className="col-sm pt-1">
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
                                        <NavLink to={{
                                            pathname: `/umpireImport`,
                                            state: { screenName: 'umpireDashboard' }
                                        }} className="text-decoration-none">
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
                    {/* <div className="mt-5 ml-4" style={{ display: "flex", justifyContent: 'space-between' }} >
                        <div className="row" >
                            <div >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select

                                    className="year-select reg-filter-select"
                                    style={{ minWidth: 160, marginLeft: 30 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item) => {
                                            return <Option value={item.id}>{item.longName}</Option>
                                        })
                                    }

                                </Select>
                            </div>

                            <div style={{ marginLeft: 40 }} >
                                <span className='year-select-heading'>{AppConstants.venue}:</span>
                                <Select
                                    className="year-select"
                                    className="year-select reg-filter-select"
                                    style={{ minWidth: 160, marginLeft: 30 }}
                                    onChange={(venueId) => this.onVenueChange(venueId)}
                                    value={this.state.venue}
                                >
                                    {
                                        venueList.map((item) => {
                                            return <Option value={item.venueId}>{item.venueName}</Option>
                                        })
                                    }

                                </Select>
                            </div>

                            <div style={{ marginLeft: 40 }}>
                                <span className='year-select-heading'>{AppConstants.division}:</span>
                                <Select
                                    className="year-select"
                                    className="year-select reg-filter-select"
                                    style={{ minWidth: 160, marginLeft: 30 }}
                                    onChange={(divisionId) => this.onDivisionChange(divisionId)}
                                    value={this.state.division}
                                >
                                    {
                                        divisionList.map((item) => {
                                            return <Option value={item.id}>{item.name}</Option>
                                        })
                                    }

                                </Select>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div >
        );
    };

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        const { umpireVenueList, umpireDivisionList } = this.props.umpireDashboardState
        let venueList = isArrayNotEmpty(umpireVenueList) ? umpireVenueList : []
        let divisionList = isArrayNotEmpty(umpireDivisionList) ? umpireDivisionList : []
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width" >
                    <div className="row reg-filter-row" >

                        {/* Comp List */}

                        <div className="reg-col" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.competition}</div>
                                <Select
                                    // showSearch
                                    // optionFilterProp="children"
                                    className="year-select reg-filter-select1"
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item) => {
                                            return <Option value={item.id}>{item.longName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>

                        {/* Venue List */}
                        <div className="reg-col1" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.venue}</div>
                                <Select
                                    className="year-select reg-filter-select1"
                                    onChange={(venueId) => this.onVenueChange(venueId)}
                                    value={this.state.venue}
                                >
                                    {
                                        venueList.map((item) => {
                                            return <Option value={item.venueId}>{item.venueName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>


                        {/* Division List */}

                        <div className="reg-col1" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.division}</div>
                                <Select
                                    className="year-select reg-filter-select1"
                                    onChange={(divisionId) => this.onDivisionChange(divisionId)}
                                    value={this.state.division}
                                >
                                    {
                                        divisionList.map((item) => {
                                            return <Option value={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>




                    </div>


                </div>
            </div>
        )
    }

    countView = () => {
        // let userRegistrationState = this.props.userRegistrationState;
        // let userRegDashboardList = userRegistrationState.userRegDashboardListData;
        // let total = userRegistrationState.userRegDashboardListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of umpires</div>
                                <div className="reg-payment-price-text">{0}</div>
                            </div>
                        </div>
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of registered umpires</div>
                                <div className="reg-payment-price-text">{0}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"1"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {/* {this.countView()} */}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        getUmpireDashboardVenueList,
        getUmpireDashboardDivisionList,
        getUmpireDashboardList
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireDashboardState: state.UmpireDashboardState,
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((UmpireDashboard));

