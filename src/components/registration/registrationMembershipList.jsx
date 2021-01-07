import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal } from 'antd';
import './product.scss';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { getCurrentYear } from 'util/permissions'
import { bindActionCreators } from 'redux';
import {
    regMembershipListAction, regMembershipListDeleteAction,
    clearReducerDataAction
} from "../../store/actions/registrationAction/registration";
import { getOnlyYearListAction } from "../../store/actions/appAction";
import { routePermissionForOrgLevel } from "../../util/permissions";
import { currencyFormat } from "../../util/currencyFormat";
import { getGlobalYear, setGlobalYear } from "util/sessionStorage";

const { confirm } = Modal;
const { Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;

let this_Obj = null;

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
    this_Obj.props.regMembershipListAction(this_Obj.state.offset, this_Obj.state.yearRefId, sortBy, sortOrder)

}
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [
    {
        title: 'Membership Product',
        dataIndex: 'membershipProductName',
        key: 'membershipProductName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("membershipProduct"),
    },
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipProductTypeName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("membershipType"),
    },
    {
        title: 'Discounts',
        dataIndex: 'isDiscountApplicable',
        key: 'isDiscountApplicable',
        render: isDiscountApplicable => (
            <span>{isDiscountApplicable ? "Yes" : "No"}</span>
        ),
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("discounts"),

    },
    {
        title: 'Individual User Seasonal Fee (inc GST)',
        dataIndex: 'seasonalFee',
        key: 'seasonalFee',
        render: (seasonalFee, record) => {
            let fee = (JSON.parse(seasonalFee) + JSON.parse(record.seasonalGst))
            return (
                <span>{currencyFormat(fee)}</span>
            )
        },
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Single Game Fee (inc GST)',
        dataIndex: 'casualFee',
        key: 'casualFee',
        render: (casualFee, record) => {
            let fee = (JSON.parse(casualFee) + JSON.parse(record.casualGst))
            return (
                <span>{currencyFormat(fee)}</span>
            )
        },
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Action',
        dataIndex: 'isUsed',
        key: 'isUsed',
        render: (isUsed, record) => {
            return (
                isUsed == false ?
                    <Menu
                        className="action-triple-dot-submenu"
                        theme="light"
                        mode="horizontal"
                        style={{ lineHeight: '25px' }}
                    >
                        <SubMenu
                            key="sub1"
                            title={
                                <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                            }
                        >
                            <Menu.Item key="1">
                                <NavLink to={{ pathname: `/registrationMembershipFee`, state: { id: record.membershipProductId } }}>
                                    <span >Edit</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(record.membershipProductId)}>
                                <span >Delete</span>
                            </Menu.Item>
                        </SubMenu>
                    </Menu> :
                    <Menu
                        className="action-triple-dot-submenu"
                        theme="light"
                        mode="horizontal"
                        style={{ lineHeight: '25px' }}
                    >
                        <SubMenu
                            key="sub2"
                            title={
                                <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                            }
                        >
                            <Menu.Item key="1">
                                <NavLink to={{ pathname: `/registrationMembershipFee`, state: { id: record.membershipProductId } }}>
                                    <span >View</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>

            )
        }
    },

];

class RegistrationMembershipList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: null,
            deleteLoading: false,
            offset: 0,
            sortBy: null,
            sortOrder: null,
            allyearload: false
        }
        this_Obj = this;
        this.props.getOnlyYearListAction(this.props.appState.yearList)
    }

    async componentDidMount() {
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.setState({
            allyearload: true
        })
        // const { regMembershipListAction } = this.props.registrationState
        // routePermissionForOrgLevel(AppConstants.national, AppConstants.state)
        // let page = 1
        // let sortBy = this.state.sortBy
        // let sortOrder = this.state.sortOrder
        // if (regMembershipListAction) {
        //     let offset = regMembershipListAction.offset
        //     sortBy = regMembershipListAction.sortBy
        //     sortOrder = regMembershipListAction.sortOrder
        //     let yearRefId = regMembershipListAction.yearRefId

        //     await this.setState({ offset, sortBy, sortOrder, yearRefId })
        //     page = Math.floor(offset / 10) + 1;

        //     this.handleMembershipTableList(page, yearRefId)
        // } else {
        //     this.handleMembershipTableList(1, this.state.yearRefId)
        // }


    }

    async componentDidUpdate(nextProps) {
        if (this.props.registrationState.onLoad === false && this.state.deleteLoading) {
            this.setState({
                deleteLoading: false,
            })
            this.handleMembershipTableList(1, this.state.yearRefId)
        }
        if (this.state.allyearload === true && this.props.appState.onLoad == false) {
            if (this.props.appState.yearList.length > 0) {
                let mainYearRefId = getGlobalYear() ? JSON.parse(getGlobalYear()) : getCurrentYear(this.props.appState.yearList)
                const { regMembershipListAction } = this.props.registrationState
                routePermissionForOrgLevel(AppConstants.national, AppConstants.state)
                let page = 1
                let sortBy = this.state.sortBy
                let sortOrder = this.state.sortOrder
                if (regMembershipListAction) {
                    let offset = regMembershipListAction.offset
                    sortBy = regMembershipListAction.sortBy
                    sortOrder = regMembershipListAction.sortOrder
                    let yearRefId = regMembershipListAction.yearRefId

                    await this.setState({ offset, sortBy, sortOrder, yearRefId, allyearload: false })
                    page = Math.floor(offset / 10) + 1;
                    setGlobalYear(yearRefId)
                    this.handleMembershipTableList(page, yearRefId)
                } else {
                    this.handleMembershipTableList(1, mainYearRefId)
                    setGlobalYear(mainYearRefId)
                    this.setState({
                        yearRefId: mainYearRefId, allyearload: false
                    })
                }
            }
        }
    }

    deleteProduct = (membershipProductId) => {
        this.props.regMembershipListDeleteAction(membershipProductId)
        this.setState({ deleteLoading: true })
    }

    showDeleteConfirm = (membershipProductId) => {
        let this_ = this
        confirm({
            title: 'Are you sure delete this product?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                this_.deleteProduct(membershipProductId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    handleMembershipTableList = (page, yearRefId) => {
        let { sortBy, sortOrder } = this.state
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offset
        })
        this.props.regMembershipListAction(offset, yearRefId, sortBy, sortOrder)
    };

    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.membershipFees}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }

    yearChange = (yearRefId) => {
        setGlobalYear(yearRefId)
        this.setState({ yearRefId })
        this.handleMembershipTableList(1, yearRefId)
    }

    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-2">
                            <div className="com-year-select-heading-view pb-3">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    className="year-select reg-filter-select-year ml-2"
                                    style={{ width: 90 }}
                                    value={this.state.yearRefId}
                                    onChange={(e) => this.yearChange(e)}
                                >
                                    {this.props.appState.yearList.map(item => (
                                        <Option key={'year_' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div
                            className="col-sm d-flex align-items-center justify-content-end pb-3"
                            onClick={() => this.props.clearReducerDataAction("getMembershipProductDetails")}
                        >
                            <NavLink
                                to={{ pathname: `/registrationMembershipFee`, state: { id: null ,addNew: true} }}
                                className="text-decoration-none"
                            >
                                <Button className="primary-add-product" type="primary">+ {AppConstants.addMembershipProduct}</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        const { registrationState } = this.props;
        let total = registrationState.regMembershipFeeListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={registrationState.regMembershipFeeListData}
                        pagination={false}
                        loading={this.props.registrationState.onLoad && true}
                        rowKey={(record, index) => record.membershipProductId + index}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={registrationState.regMembershipFeeListPage}
                        total={total}
                        onChange={(page) => this.handleMembershipTableList(page, this.state.yearRefId)}
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
                <InnerHorizontalMenu menu="registration" regSelectedKey="4" />
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
        regMembershipListAction,
        regMembershipListDeleteAction,
        clearReducerDataAction,
        getOnlyYearListAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        registrationState: state.RegistrationState,
        appState: state.AppState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationMembershipList);
