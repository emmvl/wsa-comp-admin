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
import { getUserFriendAction } from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from '../../store/actions/appAction';
import { getNetSetGoActionList } from "../../store/actions/userAction/userAction";


const { Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;
let this_Obj = null

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

    let filterData = {
        organisationId: this_Obj.state.organisationId,
        yearRefId: this_Obj.state.yearRefId,
        paging: {
            limit: 10,
            offset: (this_Obj.state.pageNo ? (10 * (this_Obj.state.pageNo - 1)) : 0)
        }
    }

    this_Obj.setState({ sortBy, sortOrder });
    this_Obj.props.getNetSetGoActionList(filterData, sortBy, sortOrder);
}
const columns = [

    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (name, record) => (
            <NavLink to={{ pathname: "/userPersonal", state: { userId: record.userId } }}>
                <span className="input-heading-add-another pt-0">{name}</span>
            </NavLink>
        ),
    },
    {
        title: 'Registration date',
        dataIndex: 'registrationDate',
        key: 'registrationDate',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (regDate) => (
            <span>{moment(regDate).format("DD/MM/YYYY")}</span>
        )
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliateName',
        key: 'affiliate',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'DOB',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (dob) => {
            return(
                <span>{moment(dob).format("DD/MM/YYYY")}</span>
            )
        }
    },
    {
        title: 'Address',
        dataIndex: 'street1',
        key: 'address',
        render: (address, record) => (
            <span>{record.street1} {record.street2} {record.suburb}</span>
        )
    },
    {
        title: "T'Shirt Size",
        dataIndex: 'tShirtSize',
        key: 'tShirtSize',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },

];

class NetSetGo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            yearRefId: -1,
            pageNo: 1,
            sortBy: null,
            sortOrder: null
        }
        this_Obj = this
    }

    async componentDidMount() {

        const { netSetGoListAction } = this.props.userState
        this.referenceCalls();
        let pageNo = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (netSetGoListAction) {
            let offset = netSetGoListAction.payload.paging.offset
            sortBy = netSetGoListAction.sortBy
            sortOrder = netSetGoListAction.sortOrder
            let yearRefId = netSetGoListAction.payload.yearRefId
            pageNo = Math.floor(offset / 10) + 1;
            await this.setState({ offset, sortBy, sortOrder, yearRefId, pageNo })

            this.handleNetSetGoTableList(pageNo);
        } else {
            this.handleNetSetGoTableList(1);
        }
    }
    componentDidUpdate(nextProps) {

    }

    handleNetSetGoTableList = (page) => {
        this.setState({
            pageNo: page
        })
        let filter =
        {
            organisationId: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.getNetSetGoActionList(filter, this.state.sortBy, this.state.sortOrder);
    }

    referenceCalls = () => {
        this.props.getOnlyYearListAction();
    }

    onChangeDropDownValue = async (value, key) => {
        if (key === "yearRefId")
            await this.setState({ yearRefId: value });

        this.handleNetSetGoTableList(1);
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.netSetGo}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }

    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-2">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    name="yearRefId"
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ maxWidth: 80 }}
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {this.props.appState.yearList.map(item => (
                                        <Option key={'year_' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        let userState = this.props.userState;
        let netSetGoList = userState.netSetGoList;
        let total = userState.netSetGoTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns}
                        dataSource={netSetGoList}
                        pagination={false}
                        loading={this.props.userState.onLoad}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.netSetGoPage}
                        total={total}
                        onChange={(page) => this.handleNetSetGoTableList(page)}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu="registration" regSelectedKey="8" />
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
        getUserFriendAction,
        getOnlyYearListAction,
        getNetSetGoActionList
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((NetSetGo));
