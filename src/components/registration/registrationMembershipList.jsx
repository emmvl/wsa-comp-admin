import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal } from 'antd';
import './product.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    regMembershipListAction, regMembershipListDeleteAction,
    clearReducerDataAction
} from "../../store/actions/registrationAction/registration";
import { getOnlyYearListAction } from "../../store/actions/appAction";
import { routePermissionForOrgLevel } from "../../util/permissions";
import { currencyFormat } from "../../util/currencyFormat";


const { confirm } = Modal;
const { Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
let this_Obj = null;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: 'Membership Product',
        dataIndex: 'membershipProductName',
        key: 'membershipProductName',
        sorter: (a, b) => tableSort(a, b, "membershipProductName")
    },
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipProductTypeName',
        sorter: (a, b) => tableSort(a, b, "membershipProductTypeName")
    },
    {
        title: 'Discounts',
        dataIndex: 'isDiscountApplicable',
        key: 'isDiscountApplicable',
        render: isDiscountApplicable => (
            <span>{isDiscountApplicable ? "Yes" : "No"}</span>
        ),
        sorter: (a, b) => tableSort(a, b, "isDiscountApplicable")

    },
    {
        title: 'Seasonal Fee (inc GST)',
        dataIndex: 'seasonalFee',
        key: 'seasonalFee',
        render: (seasonalFee, record) => {
            let fee = (JSON.parse(seasonalFee) + JSON.parse(record.seasonalGst))
            return (
                <span>{currencyFormat(fee)}</span>
            )
        },
        sorter: (a, b) => tableSort(a, b, "seasonalFee")
    },
    {
        title: 'Casual Fee (inc GST)',
        dataIndex: 'casualFee',
        key: 'casualFee',
        render: (casualFee, record) => {
            let fee = (JSON.parse(casualFee) + JSON.parse(record.casualGst))
            return (
                <span>{currencyFormat(fee)}</span>
            )
        },
        sorter: (a, b) => tableSort(a, b, "casualFee")
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
                                <NavLink to={{ pathname: `/registrationMembershipFee`, state: { id: record.membershipProductId } }} >
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
                                <NavLink to={{ pathname: `/registrationMembershipFee`, state: { id: record.membershipProductId } }} >
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
            yearRefId: 1,
            deleteLoading: false
        }
        this_Obj = this;
        this.props.getOnlyYearListAction(this.props.appState.yearList)
    }


    componentDidUpdate(nextProps) {
        if (this.props.registrationState.onLoad === false && this.state.deleteLoading == true) {
            this.setState({
                deleteLoading: false,
            })
            this.handleMembershipTableList(1, this.state.yearRefId)
        }
    }

    componentDidMount() {
        routePermissionForOrgLevel(AppConstants.national, AppConstants.state)
        this.handleMembershipTableList(1, this.state.yearRefId)
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
            okType: 'danger',
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
        let offset = page ? 10 * (page - 1) : 0;
        this.props.regMembershipListAction(offset, yearRefId)
    };


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.membershipFees}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    //////year change onchange
    yearChange = (yearRefId) => {
        this.setState({ yearRefId })
        this.handleMembershipTableList(1, yearRefId)
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width" >
                    <div className="row">
                        <div className="col-sm-2" >
                            <div className="com-year-select-heading-view" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    className="year-select"
                                    value={this.state.yearRefId}
                                    onChange={(e) => this.yearChange(e)}
                                >
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
                        <div className="col-sm d-flex justify-content-end" style={{ display: 'flex', alignItems: 'center' }}
                            onClick={() => this.props.clearReducerDataAction("getMembershipProductDetails")}>
                            <NavLink to={{ pathname: `/registrationMembershipFee`, state: { id: null } }}
                                className="text-decoration-none">
                                <Button className='primary-add-product' type='primary'>+ {AppConstants.addMembershipProduct}</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    ////////form content view
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
                        loading={this.props.registrationState.onLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={registrationState.regMembershipFeeListPage}
                        total={total}
                        onChange={(page) => this.handleMembershipTableList(page, this.state.yearRefId)}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"6"} />
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

function mapStatetoProps(state) {
    return {
        registrationState: state.RegistrationState,
        appState: state.AppState,
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)((RegistrationMembershipList));
