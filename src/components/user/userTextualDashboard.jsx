import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Menu, Pagination, Button, Input, Icon, DatePicker, Modal } from 'antd';
import './user.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { getOrganisationData } from "../../util/sessionStorage";
import { getUserDashboardTextualAction, exportOrgRegQuestionAction, userDeleteAction } from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from '../../store/actions/appAction'
import { getGenderAction } from '../../store/actions/commonAction/commonAction';
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
let this_Obj = null;
const { confirm } = Modal;						  

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

/////function to sort table column
function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    this_Obj.setState({ sortBy: sortBy, sortOrder: sortOrder });
    this_Obj.props.getUserDashboardTextualAction(this_Obj.state.filter, sortBy, sortOrder);
}


const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (name, record) =>
            <NavLink to={{ pathname: `/userPersonal`, state: { userId: record.userId } }}>
                <span className="input-heading-add-another pt-0" >{name}</span>
            </NavLink>
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (role, record, index) => {

            return (
                <div>
                    {(role || []).map((item, index) => (
                        <div key={item.roleId}>{item.role}</div>
                    ))}
                </div>
            )
        }
    },
    {
        title: 'Linked',
        dataIndex: 'linked',
        key: 'linked',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (linked, record, index) => {
            return (
                <div>
                    {(linked || []).map((item, index) => (
                        <div key={item.linkedEntityId}>{item.linked}</div>
                    ))}
                </div>
            )
        }
    },
    {
        title: 'Competition',
        dataIndex: 'competition',
        key: 'competition',
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (competition, record, index) => {
            return (
                <div>
                    {(competition || []).map((item, index) => (
                        <div key={item.competitionId}>{item.competitionName}</div>
                    ))}
                </div>
            )
        }
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team, record, index) => {
            return (
                <div>
                    {(team || []).map((item, index) => (
                        <div key={item.teamId}>{item.team}</div>
                    ))}
                </div>
            )
        }
    },
    {
        title: 'DOB',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("dob"),
        render: (dateOfBirth, record, index) => {
            return (
                <div>
                    {dateOfBirth != null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, e) => (
            isUsed == false ? <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={<img className="dot-image" src={AppImages.moreTripleDot}
                        alt="" width="16" height="16" />}>
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: `/userPersonal`, state: { userId: e.userId } }} >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(e)}>
                        <span>Delete</span>
                    </Menu.Item>
                </SubMenu>
            </Menu> : null
        )
    }
];

class UserTextualDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
            competitionUniqueKey: '-1',
            roleId: -1,
            genderRefId: -1,
            linkedEntityId: '-1',
            postalCode: '',
            searchText: '',
            deleteLoading: false,
            dobFrom: '-1',
            dobTo: '-1',
        }
        this_Obj = this;
    }

    componentDidMount() {
        this.referenceCalls();
        this.handleTextualTableList(1)
    }

    componentDidUpdate(nextProps) {
        let userState = this.props.userState;
		if (userState.onLoad === false && this.state.deleteLoading === true) {
            this.setState({
                deleteLoading: false,
            })
            this.handleTextualTableList(userState.userDashboardTextualPage);
        }
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                })
            }
        }
    }

    referenceCalls = () => {
        this.props.getGenderAction();
        this.props.getOnlyYearListAction();
    }
    showDeleteConfirm = (user) => {
        let this_ = this
        let name = user.name
        confirm({
            title: 'Do you really want to delete the user '+'"'+name+ '"'+'?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            className:"user-delete-text",
            onOk() {
                this_.deleteUserId(user)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    deleteUserId = (user) => {
        let linkedList =  user.linked;
        let  organisations =  [];
        linkedList.map((item)=>{
            let obj ={
                linkedEntityId:item.linkedEntityId
            }
            organisations.push(obj);
        })
        let obj = {
            userId: user.userId,
            organisations: organisations
        }
        this.props.userDeleteAction(obj)
        this.setState({ deleteLoading: true })
    }
    onChangeDropDownValue = async (value, key) => {
        if (key == "yearRefId") {
            await this.setState({ yearRefId: value });
            this.handleTextualTableList(1);
        }
        else if (key == "competitionId") {
            await this.setState({ competitionUniqueKey: value });
            this.handleTextualTableList(1);
        }
        else if (key == "genderRefId") {
            await this.setState({ genderRefId: value });
            this.handleTextualTableList(1);
        }
        else if (key == "linkedEntityId") {
            await this.setState({ linkedEntityId: value });
            this.handleTextualTableList(1);
        }
        else if (key == "roleId") {
            await this.setState({ roleId: value });
            this.handleTextualTableList(1);
        }
        else if (key == "dobFrom") {
            let d = moment(value, 'YYYY-mm-dd');
            console.log("DDDD" + d);
            await this.setState({ dobFrom: d });
            this.handleTextualTableList(1);
        }
        else if (key == "dobTo") {
            let d = moment(value, 'YYYY-mm-dd');
            await this.setState({ dobTo: d });
            this.handleTextualTableList(1);
        }
        else if (key == "postalCode") {
            const regex = /,/gi;
            let canCall = false;
            let newVal = value.toString().split(',');
            newVal.map((x, index) => {
                console.log("Val::" + x + "**" + x.length);
                if (Number(x.length) % 4 == 0 && x.length > 0) {
                    canCall = true;
                }
                else {
                    canCall = false;
                }
            })


            await this.setState({ postalCode: value });
            if (canCall) {
                this.handleTextualTableList(1);
            }
            else if (value.length == 0) {
                this.handleTextualTableList(1);
            }
        }
    }

    onKeyEnterSearchText = async (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.handleTextualTableList(1);
        }
    }

    onChangeSearchText = async (e) => {
        let value = e.target.value;
        await this.setState({ searchText: e.target.value })
        if (value == null || value == "") {
            this.handleTextualTableList(1);
        }
    }

    onClickSearchIcon = async () => {
        this.handleTextualTableList(1);
    }


    handleTextualTableList = (page) => {
        console.log("RoleId:;" + this.state.roleId);
        let filter =
        {
            organisationId: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.competitionUniqueKey,
            roleId: this.state.roleId,
            genderRefId: this.state.genderRefId,
            linkedEntityId: this.state.linkedEntityId,
            dobFrom: (this.state.dobFrom != '-1' && !isNaN(this.state.dobFrom)) ? moment(this.state.dobFrom).format('YYYY-MM-DD') : '-1',
            dobTo: (this.state.dobTo != '-1' && !isNaN(this.state.dobTo)) ? moment(this.state.dobTo).format('YYYY-MM-DD') : '-1',
            postCode: (this.state.postalCode != '' && this.state.postalCode != null) ? this.state.postalCode.toString() : '-1',
            searchText: this.state.searchText,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.getUserDashboardTextualAction(filter);
        this.setState({
            filter
        })
    };

    exportOrgRegistrationQuestions = () => {
        let filter =
        {
            organisationId: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.competitionUniqueKey,
            roleId: this.state.roleId,
            genderRefId: this.state.genderRefId,
            linkedEntityId: this.state.linkedEntityId,
            postCode: (this.state.postalCode != '' && this.state.postalCode != null) ? this.state.postalCode.toString() : '-1',
            searchText: this.state.searchText
        }

        this.props.exportOrgRegQuestionAction(filter);
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-player-grades-header-view" style={{ padding: '0px 50px 0 45px' }} >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add">{AppConstants.userProfile}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm search-flex" >
                        <div className="row">
                            <div style={{ marginRight: "25px", marginTop: '-14px' }} >
                                <div className="reg-product-search-inp-width">
                                    <Input className="product-reg-search-input"
                                        onChange={(e) => this.onChangeSearchText(e)}
                                        placeholder="Search..." onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                        prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                            onClick={() => this.onClickSearchIcon()} />}
                                        allowClear
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="comp-dashboard-botton-view-mobile">
                                    <Button className="primary-add-comp-form" type="primary" onClick={() => this.exportOrgRegistrationQuestions()}>
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
                        </div>
                    </div>
                </div>
            </Header >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let uniqueValues = [];
        const { genderData } = this.props.commonReducerState;
        const { competitions, organisations, roles } = this.props.userState;
        let competitionList = [];
        if (this.state.yearRefId != -1) {
            competitionList = competitions.filter(x => x.yearRefId == this.state.yearRefId);
        }
        else {
            competitionList = competitions;
        }

        return (
            <div style={{ paddingLeft: '3.0%' }}>
                <div className="fluid-width" style={{ marginRight: 35 }}>
                    <div className="row user-filter-row" >
                        <div className="user-col col-lg-3 col-md-6" >
                            <div className="user-filter-col-cont">
                                <div className='year-select-heading  select-heading-wid'>{AppConstants.year}</div>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select user-filter-select-drop"
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {this.props.appState.yearList.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="user-col col-lg-3 col-md-6" >
                            <div className="user-filter-col-cont">
                                <div className='year-select-heading  select-heading-wid'>{AppConstants.competition}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select user-filter-select-drop"
                                    onChange={competitionId => this.onChangeDropDownValue(competitionId, "competitionId")}
                                    value={this.state.competitionUniqueKey}>
                                    <Option key={-1} value={'-1'}>{AppConstants.all}</Option>
                                    {(competitionList || []).map((item, cIndex) => {
                                        return (
                                            <Option key={"competition" + item.competitionUniqueKey + "" + cIndex} value={item.competitionUniqueKey}>
                                                {item.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="user-col col-lg-3 col-md-6" >
                            <div className="user-filter-col-cont" >
                                <div className='year-select-heading  select-heading-wid'>{AppConstants.roles}</div>
                                <Select
                                    className="year-select user-filter-select-drop"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'roleId')}
                                    value={this.state.roleId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(roles || []).map((org, index) => (
                                        <Option key={org.id} value={org.id}>{org.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="user-col col-lg-3 col-md-6" >
                            <div className="user-filter-col-cont" >
                                <div className='year-select-heading  select-heading-wid'>{AppConstants.gender}</div>
                                <Select
                                    className="year-select user-filter-select-drop"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'genderRefId')}
                                    value={this.state.genderRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(genderData || []).map((g, index) => (
                                        <Option key={g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="row user-filter-row" >
                        <div className="user-col col-lg-3 col-md-6" >
                            <div className="user-filter-col-cont" >
                                <div className='year-select-heading  select-heading-wid'>{AppConstants.linked}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select user-filter-select-drop"
                                    style={{ minWidth: 100 }}
                                    onChange={(e) => this.onChangeDropDownValue(e, 'linkedEntityId')}
                                    value={this.state.linkedEntityId}>
                                    <Option key={'-1'} value={'-1'}>{AppConstants.all}</Option>
                                    {(organisations || []).map((g, index) => (
                                        <Option key={g.organisationUniqueKey} value={g.organisationUniqueKey}>{g.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="user-col col-lg-3 col-md-6" >
                            <div className="user-filter-col-postal" >
                                <div className='year-select-heading  select-heading-wid'>{AppConstants.postCode}</div>
                                <div style={{ width: '100%' }}>
                                    <InputWithHead
                                        placeholder={AppConstants.postCode}
                                        onChange={(e) => this.onChangeDropDownValue(e.target.value, 'postalCode')}
                                        value={this.state.postalCode}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont">
                                <div className='year-select-heading  select-heading-wid'>{AppConstants.dobFrom}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select user-filter-select-cal"
                                    onChange={e => this.onChangeDropDownValue(e, 'dobFrom')}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    name={'dobFrom'}
                                    placeholder={"dd-mm-yyyy"}
                                />
                            </div>
                        </div>
                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont" >
                                <div className='year-select-heading  select-heading-wid'>{AppConstants.dobTo}</div>
                                <DatePicker
                                    placeholder={"dd-mm-yyyy"}
                                    size="large"
                                    className="year-select user-filter-select-cal"
                                    onChange={e => this.onChangeDropDownValue(e, 'dobTo')}
                                    //onChange={e => this.setState({dobTo: moment(e, "YYYY-MM-DD")}) }
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    name={'dobTo'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    countView = () => {
        const { userDashboardCounts } = this.props.userState;
        let noOfRegisteredUsers = userDashboardCounts != null ? userDashboardCounts.noOfRegisteredUsers : 0;
        let noOfUsers = userDashboardCounts != null ? userDashboardCounts.noOfUsers : 0;
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of Users</div>
                                <div className="reg-payment-price-text">{noOfUsers}</div>
                            </div>
                        </div>
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of Registered Users</div>
                                <div className="reg-payment-price-text">{noOfRegisteredUsers}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        let userState = this.props.userState;
        let userDashboardTextualList = userState.userDashboardTextualList;
        let total = userState.userDashboardTextualTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns}
                        dataSource={userDashboardTextualList}
                        pagination={false}
                        loading={this.props.userState.onTextualLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.userDashboardTextualPage}
                        total={total}
                        onChange={(page) => this.handleTextualTableList(page)}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu={"user"} userSelectedKey={"1"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.countView()}
                        {this.contentView()}
                        <Loader
                            visible={
                                this.props.userState.onExpOrgRegQuesLoad
                            } />
                    </Content>
                </Layout>
            </div>

        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserDashboardTextualAction,
        getOnlyYearListAction,
        getGenderAction,
        exportOrgRegQuestionAction,
		userDeleteAction					
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState,
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(UserTextualDashboard);