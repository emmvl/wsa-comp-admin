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
import { umpireListAction } from "../../store/actions/umpireAction/umpireAction"
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { entityTypes } from '../../util/entityTypes'
import { refRoleTypes } from '../../util/refRoles'
import { getUmpireCompetiton, setUmpireCompition } from '../../util/sessionStorage'

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
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstsName',
        sorter: (a, b) => tableSort(a, b, "firstName"),
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => tableSort(a, b, "lastName"),
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
        title: 'Affiliate',
        dataIndex: 'linkedEntity',
        key: 'linkedEntity',
        sorter: (a, b) => tableSort(a, b, "linkedEntity"),
        render: (linkedEntity, record) => {

            return (
                <div>
                    {linkedEntity.length > 0 && linkedEntity.map((item) => (

                        <span style={{ color: '#ff8237', cursor: 'pointer' }} className="live-score-desc-text side-bar-profile-data" >{item.name}</span>
                    ))
                    }
                </div>)
        },
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
                    <NavLink to={{
                        pathname: '/addUmpire',
                        state: { isEdit: true, tableRecord: record }
                    }}><span >Edit</span></NavLink>
                </Menu.Item>
                {/* <Menu.Item key="2" >
                    <NavLink to={{
                        pathname: "./liveScoreAssignMatch",
                        state: { record: record }
                    }}><span >Assign to match</span></NavLink>
                </Menu.Item> */}
            </Menu.SubMenu>
        </Menu>
    }


];

const data = []

class Umpire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionid: null,
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null
        }
        this_obj = this
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
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
                this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: firstComp, offset: 0 })
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey })
            }
        }
    }

    /// Handle Page change
    handlePageChnage(page) {
        console.log(page, 'page')
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

        this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: selectedComp, offset: 0 })
        this.setState({ selectedComp, competitionUniqueKey: compKey })

    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {

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
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            this.props.umpireListAction({ refRoleId: refRoleTypes('umpire'), entityTypes: entityTypes('COMPETITION'), compId: this.state.selectedComp, userName: this.state.searchText, offset: 0 })
        }
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
                                className="year-select"
                                style={{ minWidth: 160 }}
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
        umpireListAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireState: state.UmpireState,
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((Umpire));

