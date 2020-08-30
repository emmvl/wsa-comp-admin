import React, { Component } from "react";
import { Input, Layout, Button, Table, Select, Menu, Icon, DatePicker, Pagination } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOnlyYearListAction } from '../../store/actions/appAction';
import { getOrderStatusListingAction, updateOrderStatusAction } from '../../store/actions/shopAction/orderStatusAction';
import { currencyFormat } from "../../util/currencyFormat";
import moment from "moment";

const { Content } = Layout
const { SubMenu } = Menu
const { Option } = Select
let this_obj = null;

//listeners for sorting
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_obj.state.sortBy !== key) {
        sortOrder = 'asc';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'asc') {
        sortOrder = 'desc';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'desc') {
        sortBy = sortOrder = null;
    }
    this_obj.setState({ sortBy, sortOrder });
    let { yearRefId, searchText, paymentStatus, fulfilmentStatus, product } = this_obj.state
    let page = this_obj.props.shopOrderStatusState.orderStatusCurrentPage
    let params =
    {
        limit: 10,
        offset: (page ? (10 * (page - 1)) : 0),
        search: searchText,
        year: yearRefId,
        paymentStatus: paymentStatus,
        fulfilmentStatus: fulfilmentStatus,
        product: product,
        order: sortOrder ? sortOrder : "",
        sorterBy: sortBy ? sortBy : ""
    }
    this_obj.props.getOrderStatusListingAction(params)
}

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("id"),
        render: (orderId, record) =>
            <NavLink to={{
                pathname: `/orderDetails`,
                state: { orderId: orderId }
            }}>
                <span className="input-heading-add-another pt-0" >{orderId}</span>
            </NavLink>
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("createdOn"),
        render: (date) => {
            return (
                <span>{date ? moment(date).format("DD-MM-YYYY") : "N/A"}</span>
            )
        },
    },
    {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (customer, record) =>
            // <NavLink to={{
            //     pathname: `/userPersonal`,
            //     state: { userId: record.userId, screenKey: 'registration', screen: "/registration" }
            // }}>
            <span className="input-heading-add-another pt-0" >{customer}</span>
        // </NavLink>
    },

    {
        title: 'Products',
        dataIndex: 'products',
        key: 'products',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Payment Status',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Fulfilment Status',
        dataIndex: 'fulfilmentStatus',
        key: 'fulfilmentStatus',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: total => (
            <span>{currencyFormat(total)}</span>
        )
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (action, record) =>
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: '25px' }}>

                <SubMenu
                    key="sub1"
                    title={
                        <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                    }>

                    <Menu.Item key="1" onClick={() => this_obj.updateOrderStatusApi(record, AppConstants.paid)}>
                        <span >{AppConstants.paid}</span>
                    </Menu.Item>

                    <Menu.Item key="2" onClick={() => this_obj.updateOrderStatusApi(record, AppConstants.refundFullAmount)}>
                        <span >{AppConstants.refundFullAmount}</span>
                    </Menu.Item>

                    <Menu.Item key="3" onClick={() => this_obj.updateOrderStatusApi(record, AppConstants.refundPartialAmount)}>
                        <span >{AppConstants.refundPartialAmount}</span>
                    </Menu.Item>

                    <Menu.Item key="4" onClick={() => this_obj.updateOrderStatusApi(record, AppConstants.pickedUp)}>
                        <span >{AppConstants.pickedUp}</span>
                    </Menu.Item>

                    <Menu.Item key="5" onClick={() => this_obj.updateOrderStatusApi(record, AppConstants.shipped)}>
                        <span >{AppConstants.shipped}</span>
                    </Menu.Item>
                </SubMenu>

            </Menu>
    }
]

class ShopOrderStatus extends Component {

    constructor(props) {
        super(props)

        this.state = {
            yearRefId: -1,
            paymentStatus: -1,
            fulfilmentStatus: -1,
            product: -1,
            searchText: props.location.state ? props.location.state.orderId : "",
        }
        this_obj = this
    }

    componentDidMount() {
        this.referenceCalls()
        let { yearRefId, searchText, paymentStatus, fulfilmentStatus, product } = this.state
        let params =
        {
            limit: 10,
            offset: 0,
            search: searchText,
            year: yearRefId,
            paymentStatus: paymentStatus,
            fulfilmentStatus: fulfilmentStatus,
            product: product,
            order: "",
            sorterBy: ""
        }
        this.props.getOrderStatusListingAction(params)
    }

    referenceCalls = () => {
        this.props.getOnlyYearListAction();
    }

    handleTableList = (page) => {
        let { yearRefId, searchText, paymentStatus, fulfilmentStatus, product } = this.state
        let params =
        {
            limit: 10,
            offset: (page ? (10 * (page - 1)) : 0),
            search: searchText,
            year: yearRefId,
            paymentStatus: paymentStatus,
            fulfilmentStatus: fulfilmentStatus,
            product: product,
            order: "",
            sorterBy: ""
        }
        this.props.getOrderStatusListingAction(params)
    }

    ////update order status api call
    updateOrderStatusApi = (record, actionValue) => {
        let payload = {
            orderId: record.orderId,
            action: actionValue,
            amount: record.total
        }
        this.props.updateOrderStatusAction(payload)
    }

    onChangeDropDownValue = async (value, key) => {
        if (key == "yearRefId") {
            await this.setState({ yearRefId: value });
            this.handleTableList(1);
        }
        else if (key == "product") {
            await this.setState({ product: value });
            this.handleTableList(1);
        }
        else if (key == "paymentStatus") {
            await this.setState({ paymentStatus: value });
            this.handleTableList(1);
        }
        else if (key == "fulfilmentStatus") {
            await this.setState({ fulfilmentStatus: value });
            this.handleTableList(1);
        }
    }

    // on change search text
    onChangeSearchText = async (e) => {
        let value = e.target.value;
        await this.setState({ searchText: e.target.value })
        if (value == null || value == "") {
            this.handleTableList(1);
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.handleTableList(1);
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        if (this.state.searchText === null || this.state.searchText === "") {
        }
        else {
            this.handleTableList(1);
        }
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4 pt-2 orderSpace">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.orderStatus}
                            </span>
                        </div>
                        <div className="row">
                            <div className="col-sm pt-1">
                                <div style={{ display: "flex", justifyContent: 'flex-end' }} >
                                    <div className="comp-product-search-inp-width" >
                                        <Input className="product-reg-search-input"
                                            value={this.state.searchText}
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
                                        {AppConstants.addOrder}
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        );
    }



    onChangeYear(data) {
        this.setState({ year: data.year })
    }

    onChangePaymentStatus(data) {
        this.setState({ paymentStatus: data.paymentStatus })
    }

    onChangefulfilmentStatus(data) {
        this.setState({ fulfilmentStatus: data.fulfilmentStatus })
    }

    dropdownView = () => {
        let paymentStatusData = [
            { name: "Not Paid", value: "not paid" },
            { name: "Paid", value: "paid" },
            { name: "Refunded", value: "refunded" },
            { name: "Partially refunded", value: "partially refunded" }
        ]
        let fulfilmentStatusData = [
            { name: "To Be Sent", value: "to be sent" },
            { name: "Awaiting Pickup", value: "awaiting pickup" },
            { name: "In Transit", value: "in transit" },
            { name: "Completed", value: "completed" }
        ]
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1 order-summ-drop-down-padding order-summary-dropdown-view">
                <div className="fluid-width" >
                    <div className="row reg-filter-row" >

                        <div className="reg-col col-md-6 col-sm-6" >
                            <div className="reg-filter-col-cont">
                                <div style={{ width: 180 }} className='year-select-heading'>{AppConstants.year} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}
                                    className="year-select reg-filter-select mr-3" >
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

                        <div className="reg-col col-md-6 col-sm-6" >
                            <div className="reg-filter-col-cont">
                                <div style={{ width: 180 }} className='year-select-heading'>{AppConstants.product} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={(product) => this.onChangeDropDownValue(product, "product")}
                                    value={this.state.product}
                                    className="year-select reg-filter-select mr-3" >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    <Option key={AppConstants.direct} value={AppConstants.direct}>{AppConstants.direct}</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="reg-col col-md-6 col-sm-6" >
                            <div className="reg-filter-col-cont">
                                <div style={{ width: 180 }} className='year-select-heading'>{AppConstants.paymentStatus} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={(paymentStatus) => this.onChangeDropDownValue(paymentStatus, "paymentStatus")}
                                    value={this.state.paymentStatus}
                                    className="year-select reg-filter-select mr-3" >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {paymentStatusData.map(item => {
                                        return (
                                            <Option key={"paymentStatus" + item.name} value={item.value}>
                                                {item.name}
                                            </Option>
                                        );
                                    })}

                                </Select>
                            </div>
                        </div>

                        <div className="reg-col col-md-6 col-sm-6" >
                            <div className="reg-filter-col-cont" >
                                <div style={{ width: 180 }} className='year-select-heading'>{AppConstants.fulfilmentStatus} :</div>
                                <Select
                                    //  mode="multiple"
                                    className="year-select reg-filter-select mr-3"
                                    style={{ minWidth: 160 }}
                                    onChange={(fulfilmentStatus) => this.onChangeDropDownValue(fulfilmentStatus, "fulfilmentStatus")}
                                    value={this.state.fulfilmentStatus}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {fulfilmentStatusData.map(item => {
                                        return (
                                            <Option key={"fulfilmentStatus" + item.name} value={item.value}>
                                                {item.name}
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

    contentView = () => {
        let { onLoad, orderStatusListingData, orderStatusTotalCount, orderStatusCurrentPage } = this.props.shopOrderStatusState
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={orderStatusListingData}
                        pagination={false}
                        rowKey={(record, index) => "orderStatusListingData" + record.orderId + index}
                    />

                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={orderStatusCurrentPage}
                        total={orderStatusTotalCount}
                        onChange={(page) => this.handleTableList(page)}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        )
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOnlyYearListAction,
        getOrderStatusListingAction,
        updateOrderStatusAction,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopOrderStatusState: state.ShopOrderStatusState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ShopOrderStatus));