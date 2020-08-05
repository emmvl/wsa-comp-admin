import React, { Component } from "react";
import { Input, Layout, Button, Table, Select, Menu, Icon, DatePicker } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";

const { Content } = Layout
const { SubMenu } = Menu
const { Option } = Select

function tableSort(a, b, key) {
    let stringA = JSON.stringify(key[a])
    let stringB = JSON.stringify(key[b])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => tableSort(a, b, "date"),
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, "name"),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => tableSort(a, b, "affiliate"),
    },
    {
        title: 'Competition',
        dataIndex: 'competition',
        key: 'competition',
        sorter: (a, b) => tableSort(a, b, "competition"),
    },


    {
        title: 'PassCode',
        dataIndex: 'passcode',
        key: 'passcode',
        sorter: (a, b) => tableSort(a, b, "away"),
    },
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
        sorter: (a, b) => tableSort(a, b, "orderId"),
    },
    {
        title: 'Free Paid',
        dataIndex: 'paid',
        key: 'paid',
        sorter: (a, b) => tableSort(a, b, "paid"),
    },
    {
        title: 'Net Profit',
        dataIndex: 'profit',
        key: 'profit',
        sorter: (a, b) => tableSort(a, b, "profit"),
    },
    {
        title: 'Payment Method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        sorter: (a, b) => tableSort(a, b, "paymentMethod"),
    },

]

const dataSource = [
    {
        name: "Chloe Price",
        date: "16/06/2020",
        affiliate: "MWNA",
        competition: "MWNA",
        passcode: "2233",
        orderId: "12311",
        paid: "$200",
        profit: "$32",
        paymentMethod: "Cash",

    },
    {
        name: "Chloe Price",
        date: "16/06/2020",
        affiliate: "MWNA",
        competition: "MWNA",
        passcode: "2233",
        orderId: "12311",
        paid: "$200",
        profit: "$32",
        paymentMethod: "Cash",

    },
    {
        name: "Chloe Price",
        date: "16/06/2020",
        affiliate: "MWNA",
        competition: "MWNA",
        passcode: "2233",
        orderId: "12311",
        paid: "$200",
        profit: "$32",
        paymentMethod: "Cash",

    },
    {
        name: "Chloe Price",
        date: "16/06/2020",
        affiliate: "MWNA",
        competition: "MWNA",
        passcode: "2233",
        orderId: "12311",
        paid: "$200",
        profit: "$32",
        paymentMethod: "Cash",

    },
    {
        name: "Chloe Price",
        date: "16/06/2020",
        affiliate: "MWNA",
        competition: "MWNA",
        passcode: "2233",
        orderId: "12311",
        paid: "$200",
        profit: "$32",
        paymentMethod: "Cash",

    },

]


class OrderSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            affiliate: "All",
            year: "2020",
            paid: "All",
            postCode: "All",
            comp: "All"
        }
    }


    componentDidMount() {

    }

    onChangeYear(data) {
        this.setState({ year: data.year })
    }

    onChangeComp(data) {
        this.setState({ comp: data.comp })
    }

    onChangeAffiliate(data) {
        this.setState({ affiliate: data.affiliate })
    }

    onChangePaid(data) {
        this.setState({ paid: data.paid })
    }

    onChangeDropDownValue(data) {
        this.setState({ postCode: data.postCode })
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.orderSummary}
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
            </div >
        );
    }

    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width" >
                    <div className="row reg-filter-row" >

                        <div className="reg-col" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.year} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={(year) => this.onChangeYear({ year })}
                                    value={this.state.year}
                                    className="year-select reg-filter-select mr-5" >
                                    <Option key={"year"} value="year">{"2020"}</Option>

                                </Select>
                            </div>
                        </div>

                        <div className="reg-col mr-3" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.competition} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.affiliate}
                                    className="year-select reg-filter-select ml-3" >
                                    <Option key={"all"} value="all">{"All"}</Option>

                                </Select>
                            </div>
                        </div>

                        <div className="reg-col" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.affiliate} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={(affiliate) => this.onChangeAffiliate({ affiliate })}
                                    value={this.state.affiliate}
                                    className="year-select reg-filter-select mr-3" >
                                    <Option key={"all"} value="all">{"All"}</Option>

                                </Select>
                            </div>
                        </div>

                        <div className="reg-col" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.postCode} :</div>
                                <Select
                                    //  mode="multiple"
                                    className="year-select reg-filter-select mr-3"
                                    style={{ minWidth: 160 }}
                                    onChange={(postCode) => this.onChangeDropDownValue({ postCode })}
                                    value={this.state.postCode}>
                                    <Option key={"all"} value="all">{"All"}</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="reg-col" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.payment} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={(paid) => this.onChangePaid({ paid })}
                                    value={this.state.paid}
                                    className="year-select reg-filter-select mr-5" >
                                    <Option key={"amount"} value="amount">{"All"}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    noOfRegisteredUmpires() {
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">Number of ORDERS</div>
                                <div className="reg-payment-price-text">$60,000 </div>
                            </div>
                        </div>
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">Value of ORDERS</div>
                                <div className="reg-payment-price-text">$60,000 </div>
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

    render = () => {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"3"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.noOfRegisteredUmpires()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        )
    }
}


export default OrderSummary