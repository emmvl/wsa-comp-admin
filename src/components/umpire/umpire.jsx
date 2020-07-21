import React, { Component } from "react";
import { Input, Layout, Button, Table, Select, Menu, Icon, Pagination, message } from 'antd';
import './umpire.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireListAction } from "../../store/actions/umpireAction/umpireAction"
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { entityTypes } from '../../util/entityTypes'
import { refRoleTypes } from '../../util/refRoles'
import { getUmpireCompetiton, setUmpireCompition, setUmpireCompitionData } from '../../util/sessionStorage'
import { userExportFilesAction } from "../../store/actions/appAction"
import ValidationConstants from "../../themes/validationConstant";
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
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstsName',
        sorter: (a, b) => tableSort(a, b, "firstName"),
        render: (firstName, record) =>
            <NavLink to={{
                pathname: '/userPersonal',
                state: { userId: record.id, screenKey: "umpire", screen: "/umpire" }
            }}>
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => tableSort(a, b, "lastName"),
        render: (lastName, record) =>
            <NavLink to={{
                pathname: '/userPersonal',
                state: { userId: record.id, screenKey: "umpire", screen: "/umpire" }
            }}>
                <span className="input-heading-add-another pt-0">{lastName}</span>
            </NavLink>
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => tableSort(a, b, "email")
    },
    {
        title: 'Contact No',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
        sorter: (a, b) => tableSort(a, b, "mobileNumber"),
    },
    {
        title: 'Organisation',
        dataIndex: 'linkedEntity',
        key: 'linkedEntity',
        sorter: (a, b) => tableSort(a, b, "linkedEntity"),
        render: (linkedEntity, record) => {

            return (
                <div>
                    {linkedEntity.length > 0 && linkedEntity.map((item, index) => (
                        <span key={`entityName` + index} className='multi-column-text-aligned'>{item.name}</span>
                    ))
                    }
                </div>)
        },
    },
    {
        title: "Action",
        dataIndex: 'action',
        key: 'action',
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
                    <NavLink to={{
                        pathname: '/addUmpire',
                        state: { isEdit: true, tableRecord: record }
                    }}><span >Edit</span></NavLink>
                </Menu.Item>
                <Menu.Item key="2" >
                    <NavLink to={{
                        pathname: "./assignUmpire",
                        state: { record: record }
                    }}><span >Assign to match</span></NavLink>
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    }


];

class Umpire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionid: null,
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            compArray: []
        }
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading === true && this.props.umpireCompetitionState.onLoad === false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                let compData = compList.length > 0 && compList[0]
                // let compId = JSON.parse(getUmpireCompetiton())
                // firstComp = compId

                // let compObj = JSON.parse(getUmpireCompetitonData())
                // compData = compObj

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
                if (firstComp !== false) {
                    this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: firstComp, offset: 0 })
                    this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey, compArray: compList })
                } else {
                    this.setState({ loading: false })
                }
            }
        }
    }

    checkUserId(record) {
        if (record.userId === null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.umpireMessage)
        }
        else {
            history.push("/userPersonal", { userId: record.userId, screenKey: "umpire", screen: "/umpire" })
        }
    }

    /// Handle Page change
    handlePageChnage(page) {
        let offset = page ? 10 * (page - 1) : 0;
        this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, offset: offset })
    }


    ////////form content view
    contentView = () => {
        const { umpireList } = this.props.umpireState
        let umpireListResult = isArrayNotEmpty(umpireList) ? umpireList : []
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.umpireState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={umpireListResult}
                        pagination={false}
                        rowKey={(record, index) => "umpireListResult" + record.id + index}
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
        // setUmpireCompId(selectedComp)

        let compObj = null
        for (let i in this.state.compArray) {
            if (compID.comp === this.state.compArray[i].id) {
                compObj = this.state.compArray[i]
                break;
            }
        }
        setUmpireCompition(selectedComp)
        setUmpireCompitionData(JSON.stringify(compObj))



        let compKey = compID.competitionUniqueKey

        this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: selectedComp, offset: 0 })
        this.setState({ selectedComp, competitionUniqueKey: compKey })

    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value === null || e.target.value === "") {

            this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, offset: 0, userName: e.target.value })
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, userName: this.state.searchText, offset: 0 })
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        if (this.state.searchText === null || this.state.searchText === "") {
        }
        else {
            this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, userName: this.state.searchText, offset: 0 })
        }
    }

    onExport() {
        let url = AppConstants.umpireListExport + `entityTypeId=${1}&entityId=${this.state.selectedComp}&roleId=${15}`
        this.props.userExportFilesAction(url)
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
                                {AppConstants.umpireList}
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
                                        <NavLink to={`/addUmpire`} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                + {AppConstants.addUmpire}
                                            </Button>
                                        </NavLink>
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
                                            state: { screenName: 'umpire' }
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
                    <div className="mt-5" style={{ display: "flex", justifyContent: 'space-between', }} >
                        {/* <div className="mt-5" > */}
                        <div style={{
                            width: "100%", display: "flex",
                            flexDirection: "row",
                            alignItems: "center", marginRight: 50,
                        }} >
                            <span className='year-select-heading'>{AppConstants.competition}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 200, maxWidth: 250 }}
                                onChange={(comp) => this.onChangeComp({ comp })}
                                value={this.state.selectedComp}
                            >
                                {
                                    competition.map((item, index) => {
                                        return <Option key={`competition` + index} value={item.id}>{item.longName}</Option>
                                    })
                                }

                            </Select>
                        </div>

                        <div className="comp-product-search-inp-width" >
                            {/* <div  > */}
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
            </div >
        );
    };


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {/* {this.dropdownView()} */}
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
        umpireListAction,
        userExportFilesAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireState: state.UmpireState,
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((Umpire));

