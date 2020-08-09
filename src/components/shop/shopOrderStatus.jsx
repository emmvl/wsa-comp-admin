import React, { Component } from "react";
import { Input, Layout, Button, Table, Select, Menu, Icon, DatePicker } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { data } from "jquery";

const { Content } = Layout
const { SubMenu } = Menu
const { Option } = Select

function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
        sorter: (a, b) => tableSort(a, b, "orderId"),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => tableSort(a, b, "date"),
    },
    {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        sorter: (a, b) => tableSort(a, b, "customer"),
    },

    {
        title: 'Products',
        dataIndex: 'products',
        key: 'products',
        sorter: (a, b) => tableSort(a, b, "products"),
    },
    {
        title: 'Payment Status',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        sorter: (a, b) => tableSort(a, b, "paymentStatus"),
    },
    {
        title: 'Fulfilment Status',
        dataIndex: 'fulfilmentStatus',
        key: 'fulfilmentStatus',
        sorter: (a, b) => tableSort(a, b, "fulfilmentStatus"),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        sorter: (a, b) => tableSort(a, b, "total"),
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

                    <Menu.Item key="1">
                        {/* <NavLink to={{
                            pathname: "/liveScoreAddDivision",
                            // state: { isEdit: true, tableRecord: record }
                        }}> */}
                        <span >Paid</span>
                        {/* </NavLink> */}
                    </Menu.Item>

                    <Menu.Item key="2" >
                        <span >Refunf Full Amount</span>
                    </Menu.Item>

                    <Menu.Item key="3" >
                        <span >Refunf Partial Amount</span>
                    </Menu.Item>

                    <Menu.Item key="4" >
                        <span >Picked Up</span>
                    </Menu.Item>

                    <Menu.Item key="5" >
                        <span >Shipped</span>
                    </Menu.Item>
                </SubMenu>

            </Menu>
    }
]

const dataSource = [
    {
        orderId: "123",
        date: "17/06/2020",
        customer: "Fran Look",
        products: "25",
        paymentStatus: "Paid",
        fulfilmentStatus: "To Be Sent",
        total: "$400"

    },
    {
        orderId: "123",
        date: "17/06/2020",
        customer: "Fran Look",
        products: "25",
        paymentStatus: "Paid",
        fulfilmentStatus: "To Be Sent",
        total: "$400"

    },
    {
        orderId: "123",
        date: "17/06/2020",
        customer: "Fran Look",
        products: "25",
        paymentStatus: "Not Paid",
        fulfilmentStatus: "To Be Sent",
        total: "$400"

    },
    {
        orderId: "123",
        date: "17/06/2020",
        customer: "Fran Look",
        products: "25",
        paymentStatus: "Paid",
        fulfilmentStatus: "To Be Sent",
        total: "$400"

    },
    {
        orderId: "123",
        date: "17/06/2020",
        customer: "Fran Look",
        products: "25",
        paymentStatus: "Not Paid",
        fulfilmentStatus: "In Transit",
        total: "$400"

    },
    {
        orderId: "123",
        date: "17/06/2020",
        customer: "Fran Look",
        products: "25",
        paymentStatus: "Paid",
        fulfilmentStatus: "Awaiting Pickup",
        total: "$400"

    },
]

class ShopOrderStatus extends Component {

    constructor(props) {
        super(props)

        this.state = {
            year: "2020",
            paymentStatus: "All",
            fulfilStatus: "All"
        }
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4 pt-2">
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
                                            //   onChange={(e) => this.onChangeSearchText(e)}
                                            placeholder="Search..."
                                            //   onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                            prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                            // onClick={() => this.onClickSearchIcon()}
                                            />}
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

    onChangefullFillmentStatus(data) {
        this.setState({ fulfilStatus: data.fulfilStatus })
    }

    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1 order-summ-drop-down-padding order-summary-dropdown-view">
                <div className="fluid-width" >
                    <div className="row reg-filter-row" >

                        <div className="reg-col col-md-4 col-sm-6" >
                            <div className="reg-filter-col-cont">
                                <div style={{width:120}}  className='year-select-heading'>{AppConstants.year} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={(year) => this.onChangeYear({ year })}
                                    value={this.state.year}
                                    className="year-select reg-filter-select mr-3" >
                                    <Option key={"year"} value="year">{"2020"}</Option>

                                </Select>
                            </div>
                        </div>

                        <div className="reg-col col-md-4 col-sm-6" >
                            <div className="reg-filter-col-cont">
                                <div style={{width:180}} className='year-select-heading'>{AppConstants.paymentStatus} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={(paymentStatus) => this.onChangePaymentStatus({ paymentStatus })}
                                    value={this.state.paymentStatus}
                                    className="year-select reg-filter-select mr-3" >
                                    <Option key={"all"} value="all">{"All"}</Option>

                                </Select>
                            </div>
                        </div>



                        <div className="reg-col col-md-4 col-sm-6" >
                            <div className="reg-filter-col-cont" >
                                <div style={{width:180}} className='year-select-heading'>{AppConstants.fullFillmentStatus} :</div>
                                <Select
                                    //  mode="multiple"
                                    className="year-select reg-filter-select mr-3"
                                    style={{ minWidth: 160 }}
                                    onChange={(fulfilStatus) => this.onChangefullFillmentStatus({ fulfilStatus })}
                                    value={this.state.fulfilStatus}>
                                    <Option key={"all"} value="all">{"All"}</Option>
                                </Select>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }

    contentView = () => {
        return (<div className="comp-dash-table-view mt-2">
            <div className="d-flex flex-row justify-content-between">
                {/* {this.noOfUmpires()} */}

            </div>
            <div className="table-responsive home-dash-table-view">
                <Table
                    // loading={this.props.umpireDashboardState.onLoad}
                    className="home-dashboard-table"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false} />

            </div>
        </div>)
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

export default ShopOrderStatus