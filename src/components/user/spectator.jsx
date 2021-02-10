import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Menu, Pagination } from "antd";
import './user.css';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getOrganisationData, getGlobalYear, setGlobalYear } from "../../util/sessionStorage";
import { getSpectatorListAction, setSpectatorListPageSizeAction, setSpectatorListPageNumberAction } from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from '../../store/actions/appAction'

const {
    // Footer,
    Content
} = Layout;
const { Option } = Select;
// const { confirm } = Modal;
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

    let { spectatorPageSize } = this.props.userState;
    spectatorPageSize = spectatorPageSize ? spectatorPageSize : 10;
    let filterData = {
        organisationUniqueKey: this_Obj.state.organisationId,
        yearRefId: this_Obj.state.yearRefId,
        paging: {
            limit: spectatorPageSize,
            offset: (this_Obj.state.pageNo ? (spectatorPageSize * (this_Obj.state.pageNo - 1)) : 0)
        }
    }

    this_Obj.setState({ sortBy, sortOrder });
    this_Obj.props.getSpectatorListAction(filterData, sortBy, sortOrder);
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) => (
            <NavLink to={{ pathname: "/userPersonal", state: { userId: record.id } }}>
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
        ),
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Linked',
        dataIndex: 'organisationName',
        key: 'organisationName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Competition',
        dataIndex: 'competitionName',
        key: 'competitionName',
    },
    {
        title: 'DOB',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (dateOfBirth) => (
            <div>
                {dateOfBirth != null ? moment(dateOfBirth).format('DD/MM/YYYY') : ''}
            </div>
        ),
    },
    {
        title: 'Action',
        render: (id, e) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: '25px' }}
            >
                <SubMenu
                    key="sub1"
                    title={
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            width="16"
                            height="16"
                            alt=""
                        />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: '/userPersonal', state: { userId: e.id } }}>
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    {/* {!e.role.find(x => x.role === 'Admin') && (
                        <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(e)}>
                            <span>Delete</span>
                        </Menu.Item>
                    )} */}
                </SubMenu>
            </Menu>
        ),
    },

];

class Spectator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            yearRefId: null,
            pageNo: 1,
            sortBy: null,
            sortOrder: null
        }
        this_Obj = this
    }

    async componentDidMount() {
        let yearId = getGlobalYear() ? getGlobalYear() : '-1'
        const { spectatorListAction } = this.props.userState
        this.referenceCalls();
        let pageNo = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (spectatorListAction) {
            let offset = spectatorListAction.payload.paging.offset
            sortBy = spectatorListAction.sortBy
            sortOrder = spectatorListAction.sortOrder
            let yearRefId = JSON.parse(yearId)
            let { spectatorPageSize } = this.props.userState;
            spectatorPageSize = spectatorPageSize ? spectatorPageSize : 10;
            pageNo = Math.floor(offset / spectatorPageSize) + 1;
            await this.setState({ offset, sortBy, sortOrder, yearRefId, pageNo })

            this.handleSpectatorTableList(pageNo);
        } else {
            this.setState({ yearRefId: JSON.parse(yearId) })
            this.handleSpectatorTableList(1);
        }
    }

    handleShowSizeChange = async (page, pageSize) => {
        await this.props.setSpectatorListPageSizeAction(pageSize);
        this.handleSpectatorTableList(page);
    }

    handleSpectatorTableList = async (page) => {
        await this.props.setSpectatorListPageNumberAction(page);
        let yearId = getGlobalYear() ? getGlobalYear() : '-1'
        this.setState({ pageNo: page });
        let { spectatorPageSize } = this.props.userState;
        let filter = {
            organisationUniqueKey: this.state.organisationId,
            yearRefId: this.state.yearRefId === -1 ? this.state.yearRefId : JSON.parse(yearId),
            paging: {
                limit: spectatorPageSize,
                offset: (page ? (spectatorPageSize * (page - 1)) : 0)
            }
        }
        this.props.getSpectatorListAction(filter, this.state.sortBy, this.state.sortOrder);
    }

    referenceCalls = () => {
        this.props.getOnlyYearListAction();
    }

    componentDidUpdate(nextProps) {

    }

    onChangeDropDownValue = async (value, key) => {
        if (key === "yearRefId")
            await this.setState({ yearRefId: value });
        if (value != -1) {
            setGlobalYear(value)
        }

        this.handleSpectatorTableList(1);
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants._spectator}</Breadcrumb.Item>
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
        const { spectatorList, spectatorPage, spectatorTotalCount, onLoad, spectatorPageSize } = this.userState;

        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns}
                        dataSource={spectatorList}
                        pagination={false}
                        loading={onLoad}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        showSizeChanger
                        current={spectatorPage}
                        total={spectatorTotalCount}
                        onChange={this.handleSpectatorTableList}
                        onShowSizeChange={this.handleShowSizeChange}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu="user" userSelectedKey="67" />
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
        getOnlyYearListAction,
        getSpectatorListAction,
        setSpectatorListPageSizeAction,
        setSpectatorListPageNumberAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((Spectator));
