import React, { Component } from "react";
import { Layout, Button, Table, Select, Menu, Pagination, message } from 'antd';
import './umpire.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireRoasterListAction, umpireRoasterOnActionClick } from "../../store/actions/umpireAction/umpirRoasterAction"
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { refRoleTypes } from '../../util/refRoles'
import { setUmpireCompId, getUmpireCompId, getUmpireCompetiton, setUmpireCompition, setUmpireCompitionData } from '../../util/sessionStorage'
import moment, { utc } from "moment";
import ValidationConstants from "../../themes/validationConstant";
import history from "../../util/history";
import { exportFilesAction } from "../../store/actions/appAction"

const { Content } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

let this_obj = null;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [

    {
        title: 'First Name',
        dataIndex: 'user',
        key: 'First Name',
        sorter: (a, b) => tableSort(a, b, 'user'),
        render: (firstName, record) =>

            <span className="input-heading-add-another pt-0" onClick={() => this_obj.checkUserId(record)}>{record.user.firstName}</span>
    },
    {
        title: 'Last Name',
        dataIndex: 'user',
        key: 'Last Name',
        sorter: (a, b) => tableSort(a, b, "user"),
        render: (lastName, record) =>

            <span className="input-heading-add-another pt-0" onClick={() => this_obj.checkUserId(record)}>{record.user.lastName}</span>
    },
    {
        title: 'Organisation',
        dataIndex: 'user',
        key: 'Organisation',
        sorter: (a, b) => a.user.length - b.user.length,
        render: (user, record) => {

            return (
                <div>
                    {record.user.userRoleEntities.length > 0 && record.user.userRoleEntities.map((item) => (
                        <span key={"userRoleEntities" + item.organisation.id} className='multi-column-text-aligned'>{item.organisation.name}</span>
                    ))
                    }
                </div>)
        },
    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => tableSort(a, b, "matchId"),
        // render: (matchId) => <NavLink to={{
        //     pathname: '/liveScoreMatchDetails',
        //     state: { matchId: matchId, key: 'umpireRoster' }
        // }} >

        render: (matchId) => {
            return (
                <NavLink to={{
                    pathname: '/liveScoreMatchDetails',
                    state: { matchId: matchId, umpireKey: 'umpire' }
                }} >
                    <span className="input-heading-add-another pt-0">{matchId}</span>
                </NavLink>
            )
        }

    },
    {
        title: 'Start Time',
        dataIndex: 'match',
        key: 'Start Time',
        sorter: (a, b) => tableSort(a, b, "match"),
        render: (startTime, record) =>
            <span >{moment(record.match.startTime).format("DD/MM/YYYY HH:mm")}</span>
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => tableSort(a, b, "status"),
    },
    {
        title: 'Verified By',
        dataIndex: 'verifiedBy',
        key: 'verifiedBy',
        sorter: (a, b) => tableSort(a, b, "verifiedBy"),
        // render: (user, record) => <span className="input-heading-add-another pt-0" onClick={() => this_obj.checkUserId(record)}>{record.user.firstName + " " + record.user.lastName}</span>
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
                style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                <Menu.Item key={'1'}>

                    <span onClick={() => this_obj.onActionPerform(record, 'YES')} >Accept</span>
                </Menu.Item>
                <Menu.Item key="2" >

                    <span onClick={() => this_obj.onActionPerform(record, 'NO')}>Decline</span>

                </Menu.Item>
                <Menu.Item key="3" >

                    <span onClick={() => this_obj.onActionPerform(record, 'DELETE')}>Unassign</span>

                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    }


];

const data = [
    {
    },
]

class UmpireRoaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionid: null,
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            status: 'All',
            roasterLoad: false,
            compArray: []
        }
        this_obj = this
    }

    componentDidMount() {
        let { organisationId, } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading == true && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                let compData = compList.length > 0 && compList[0]

                if (getUmpireCompetiton()) {
                    let compId = JSON.parse(getUmpireCompetiton())
                    let index = compList.findIndex(x => x.id === compId)
                    if (index > -1) {
                        firstComp = compList[index].id
                        compData = compList[index]
                    } else {

                        setUmpireCompition(firstComp)
                        setUmpireCompitionData(JSON.stringify(compData))
                    }
                } else {
                    // setUmpireCompId(firstComp)
                    setUmpireCompition(firstComp)
                    setUmpireCompitionData(JSON.stringify(compData))

                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey
                const body =
                {
                    "paging": {
                        "limit": 10,
                        "offset": 0
                    }
                }
                if (firstComp !== false) {
                    this.props.umpireRoasterListAction(firstComp, this.state.status, refRoleTypes('umpire'), body)
                    this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey, compArray: compList })
                } else {
                    this.setState({ loading: false })
                }
            }
        }

        if (nextProps.umpireRoasterdState !== this.props.umpireRoasterdState) {
            if (this.props.umpireRoasterdState.roasterLoading !== this.state.roasterLoad) {

                const body =
                {
                    "paging": {
                        "limit": 10,
                        "offset": 0
                    }
                }

                this.props.umpireRoasterListAction(this.state.selectedComp, this.state.status, refRoleTypes('umpire'), body)
                this.setState({ roasterLoad: false })
            }
        }

    }

    onActionPerform(record, status) {
        this.props.umpireRoasterOnActionClick({ roasterId: record.id, status: status, category: 'umpiring' })
        this.setState({ roasterLoad: true })
    }

    checkUserId(record) {
        if (record.userId == null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.umpireMessage)
        }
        else {
            history.push("/userPersonal", { userId: record.userId, screenKey: "umpireRoaster", screen: "/umpireRoaster" })
        }
    }

    /// Handle Page change
    handlePageChnage(page) {
        let offset = page ? 10 * (page - 1) : 0;

        const body =
        {
            "paging": {
                "limit": 10,
                "offset": offset
            },
        }

        this.props.umpireRoasterListAction(this.state.selectedComp, this.state.status, refRoleTypes('umpire'), body)

    }


    ////////form content view
    contentView = () => {
        const { umpireRoasterList, umpireCurrentPage, umpireTotalCount } = this.props.umpireRoasterdState
        let umpireListResult = isArrayNotEmpty(umpireRoasterList) ? umpireRoasterList : []
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.umpireRoasterdState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={umpireListResult}
                        pagination={false}
                        rowKey={(record, index) => record.id + index} />
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
                            total={umpireTotalCount}
                            onChange={(page) => this.handlePageChnage(page)}
                        />
                    </div>
                </div>
            </div>
        )
    }



    onChangeComp(compID) {
        let selectedComp = compID.comp
        // setUmpireCompId(selectedComp)


        let compObj = null
        for (let i in this.state.compArray) {
            if (compID.comp == this.state.compArray[i].id) {
                compObj = this.state.compArray[i]
                break;
            }
        }
        setUmpireCompition(selectedComp)
        setUmpireCompitionData(JSON.stringify(compObj))



        let compKey = compID.competitionUniqueKey

        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            },
        }

        this.props.umpireRoasterListAction(selectedComp, this.state.status, refRoleTypes('umpire'), body)
        this.setState({ selectedComp, competitionUniqueKey: compKey })

    }

    onChangeStatus(status) {
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            },
        }

        if (this.state.selectedComp) {
            this.props.umpireRoasterListAction(this.state.selectedComp, status, refRoleTypes('umpire'), body)

        }
        this.setState({ status })
    }

    // on Export
    onExport() {

        let url = AppConstants.rosterExport + `competitionId=${this.state.selectedComp}&roleId=${15}`

        // if(this.state.status=='All'){

        //     url = `/roster/export/umpire?competitionId=${this.state.selectedComp}&roleId=${15}`
        // }else{
        //     url = `/roster/export/umpire?competitionId=${this.state.selectedComp}&status=${this.state.status}&roleId=${15}`
        // }
        this.props.exportFilesAction(url)
    }


    ///////view for breadcrumb
    headerView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.umpireRoster}
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
                                {/* <div className="col-sm pt-1">
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
                                            state: { screenName: 'umpireRoaster' }
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
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5" style={{ display: "flex", width: 'fit-content' }} >
                        <div style={{
                            width: "100%", display: "flex",
                            flexDirection: "row",
                            alignItems: "center", marginRight: 50,
                        }} >
                            <span className='year-select-heading'>{AppConstants.competition}:</span>
                            <Select
                                className="year-select"
                                style={{ minWidth: 160 }}
                                onChange={(comp) => this.onChangeComp({ comp })}
                                value={this.state.selectedComp}
                            >
                                {
                                    competition.map((item) => {
                                        return <Option key={"competition" + item.id} value={item.id}>{item.longName}</Option>
                                    })
                                }

                            </Select>
                        </div>

                        <div style={{
                            width: "100%", display: "flex",
                            flexDirection: "row",
                            alignItems: "center", marginRight: 50,
                        }} >
                            <span className='year-select-heading'>{AppConstants.status}:</span>
                            <Select
                                className="year-select"
                                style={{ minWidth: 160 }}
                                onChange={(status) => this.onChangeStatus(status)}
                                value={this.state.status}
                            >
                                <Option value={'All'}>{'All'}</Option>
                                <Option value={'YES'}>{'Accepted'}</Option>
                                <Option value={'NO'}>{'Declined'}</Option>
                                <Option value={'NONE'}>{'No Response'}</Option>
                            </Select>
                        </div>

                    </div>
                </div>
            </div >
        );
    };


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"3"} />
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
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        umpireRoasterListAction,
        umpireRoasterOnActionClick,
        exportFilesAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireRoasterdState: state.UmpireRoasterdState,
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((UmpireRoaster));

