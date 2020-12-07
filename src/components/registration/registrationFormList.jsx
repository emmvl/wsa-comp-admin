import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination } from 'antd';
import './product.scss';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getOnlyYearListAction,
} from "../../store/actions/appAction";
import {
    regDashboardListAction
}
    from "../../store/actions/registrationAction/registrationDashboardAction"
import moment from "moment"
import Tooltip from 'react-png-tooltip'
import { getCurrentYear } from "util/permissions"

const { Footer, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;

let this_Obj = null

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
    this_Obj.setState({ sortBy, sortOrder });
    this_Obj.props.regDashboardListAction(this_Obj.state.offset, this_Obj.state.yearRefId, sortBy, sortOrder)
}

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [

    {
        title: 'Competition Name',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Registration Open',
        dataIndex: 'registrationOpenDate',
        key: 'registrationOpenDate',
        render: (registrationOpenDate, record) => {
            return (
                <span>{registrationOpenDate ? moment(registrationOpenDate).format("DD-MM-YYYY") : null}</span>
            )
        },
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("registrationOpen"),

    },
    {
        title: 'Registration Close',
        dataIndex: 'registrationCloseDate',
        key: 'registrationCloseDate',
        render: (registrationCloseDate, record) => {
            return (
                <span>{registrationCloseDate ? moment(registrationCloseDate).format("DD-MM-YYYY") : null}</span>
            )
        },
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("registrationClose"),

    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),

    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, record) => (
            // isUsed == false ? <Menu
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            alt=""
                            width="16"
                            height="16"
                        />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink to={{
                            pathname: `/registrationForm`, state: {
                                id: record.competitionId,
                                year: record.yearId,
                                orgRegId: record.orgRegId, compCloseDate: record.compRegCloseDate,
                                compName: record.competitionName
                            }
                        }}
                        >
                            {/*  */}
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
            //  : null
        )
    }

];


class RegistrationFormList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: null,
            offset: 0,
            sortBy: null,
            sortOrder: null,
            allyearload: false

        }
        this_Obj = this

    }

    async componentDidUpdate(nextProps) {
        if (this.state.allyearload === true && this.props.appState.onLoad == false) {
            if (this.props.appState.yearList.length > 0) {
                let mainYearRefId = getCurrentYear(this.props.appState.yearList)
                const { regFormListAction } = this.props.dashboardState
                let page = 1
                let sortBy = this.state.sortBy
                let sortOrder = this.state.sortOrder;
                if (regFormListAction) {
                    let offset = regFormListAction.offset
                    sortBy = regFormListAction.sortBy
                    sortOrder = regFormListAction.sortOrder
                    let yearRefId = regFormListAction.yearRefId
                    let allyearload = false;
                    await this.setState({ offset, sortBy, sortOrder, yearRefId, allyearload })
                    page = Math.floor(offset / 10) + 1;
                    this.handleMembershipTableList(page, yearRefId)

                } else {
                    this.handleMembershipTableList(1, mainYearRefId)
                    await this.setState({
                        yearRefId: mainYearRefId, allyearload: false
                    })
                }

            }
        }
    }

    async componentDidMount() {
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        await this.setState({
            allyearload: true
        })
        // const { regFormListAction } = this.props.dashboardState
        // let page = 1
        // let sortBy = this.state.sortBy
        // let sortOrder = this.state.sortOrder
        // if (regFormListAction) {
        //     let offset = regFormListAction.offset
        //     sortBy = regFormListAction.sortBy
        //     sortOrder = regFormListAction.sortOrder
        //     let yearRefId = regFormListAction.yearRefId

        //     await this.setState({ offset, sortBy, sortOrder, yearRefId })
        //     page = Math.floor(offset / 10) + 1;

        //     this.handleMembershipTableList(page, yearRefId)
        // } else {
        //     this.handleMembershipTableList(1, this.state.yearRefId)
        // }


    }

    handleMembershipTableList = (page, yearRefId) => {
        let { sortBy, sortOrder } = this.state
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offset
        })
        this.props.regDashboardListAction(offset, yearRefId, sortBy, sortOrder)
    };

    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm d-flex align-items-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.registrationForm}</Breadcrumb.Item>
                        </Breadcrumb>
                        <Tooltip>
                            <span>{AppConstants.regFormDashBoardMsg}</span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        );
    }

    onYearChange = (yearRefId) => {
        this.setState({ yearRefId });
        this.handleMembershipTableList(1, yearRefId);
    }

    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-2">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    name="yearRefId"
                                    className="year-select reg-filter-select-year ml-2"
                                    style={{ width: 90 }}
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
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
        const { dashboardState } = this.props;
        let total = dashboardState.regDashboardListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={dashboardState.regDashboardListData}
                        pagination={false}
                        loading={this.props.dashboardState.onLoad === true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={dashboardState.regDashboardListPage}
                        total={total}
                        onChange={(page) => this.handleMembershipTableList(page, this.state.yearRefId)}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        )
    }

    footerView = () => {
        return (
            <div className="d-flex flex-row-reverse">
                <NavLink to="/productAddRegistration" className="text-decoration-none">
                    <Button className="primary-add-product" type="primary">+ {AppConstants.addAFee}</Button>
                </NavLink>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu="registration" regSelectedKey="3" />
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
        regDashboardListAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        dashboardState: state.RegistrationDashboardState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationFormList);
