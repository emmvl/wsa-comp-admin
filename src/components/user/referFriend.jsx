import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal, DatePicker } from "antd";
import './user.css';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getOrganisationData } from "../../util/sessionStorage";
import {getUserReferFriendAction} from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from '../../store/actions/appAction'

const { Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;

const columns = [

    {
        title: 'Registered User',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Affiliate Name',
        dataIndex: 'affiliateName',
        key: 'affiliateName',
        sorter: (a, b) => a.affiliateName.localeCompare(b.affiliateName),
    },
    {
        title: 'Competition Name',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: 'Division',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
    },
    {
        title: 'Friend Name',
        dataIndex: 'friendName',
        key: 'friendName',
        sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
        title: 'Friend Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
        title: 'Friend Phone',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
        sorter: (a, b) => a.mobileNumber.localeCompare(b.mobileNumber),
    },
    {
        title: 'Friend Status',
        dataIndex: 'friendStatus',
        key: 'friendStatus',
        sorter: (a, b) => a.friendStatus.localeCompare(b.friendStatus),
    },
    
    

];

class ReferFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
        }
    }

    componentDidMount(){
        this.referenceCalls();
        this.handleFriendTableList(1);
    }
    componentDidUpdate(nextProps){

    }

    handleFriendTableList = (page) => {
        let filter =
        {
            organisationUniqueKey: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.getUserReferFriendAction(filter);
    }

    referenceCalls = () => {
        this.props.getOnlyYearListAction();
    }

    onChangeDropDownValue = async (value, key) => {
        if(key == "yearRefId")
          await this.setState({yearRefId: value});

        this.handleFriendTableList(1);
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.referaFriend}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-2" >
                            <div className="com-year-select-heading-view" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select"
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
                    </div>
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        let userState = this.props.userState;
        let friendList = userState.referFriendList;
        let total = userState.referFriendTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
            <div className="table-responsive home-dash-table-view">
                <Table className="home-dashboard-table"
                    columns={columns}
                    dataSource={friendList}
                    pagination={false}
                    loading={this.props.onLoad === true && true}
                />
            </div>
            <div className="d-flex justify-content-end">
                <Pagination
                    className="antd-pagination"
                    current={userState.referFriendPage}
                    total={total}
                    onChange={(page) => this.handleFriendTableList(page)}
                />
            </div>
        </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu  menu={"user"} userSelectedKey={"6"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserReferFriendAction,
        getOnlyYearListAction
    }, dispatch);
}

function mapStatetoProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ReferFriend));
