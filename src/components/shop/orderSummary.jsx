import React, { Component } from "react";
import { Input, Layout, Button, Table, Select, Menu, Icon, Pagination } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import history from "../../util/history";
import { isArrayNotEmpty } from "../../util/helpers";
import { getOrderSummaryListingAction } from "../../store/actions/shopAction/orderSummaryAction";
import { currencyFormat } from "../../util/currencyFormat";
import moment from "moment";
import { getOnlyYearListAction } from '../../store/actions/appAction'
import { getAffiliateToOrganisationAction } from "../../store/actions/userAction/userAction";
import { getOrganisationData } from "../../util/sessionStorage";
import { isEmptyArray } from "formik";
import InputWithHead from "../../customComponents/InputWithHead";

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
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: 140,
        sorter: (a, b) => tableSort(a, b, "date"),
        render: (date) => {
            return (
                <span>{date ? moment(date).format("DD-MM-YYYY") : "N/A"}</span>
            )
        },
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
        title: 'Postcode',
        dataIndex: 'postcode',
        key: 'postcode',
        sorter: (a, b) => tableSort(a, b, "postcode"),
    },
    {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, "id"),
    },
    {
        title: 'Paid',
        dataIndex: 'paid',
        key: 'paid',
        sorter: (a, b) => tableSort(a, b, "paid"),
        render: paid => (
            <span>{currencyFormat(paid)}</span>
        )
    },
    {
        title: 'Net Profit',
        dataIndex: 'netProfit',
        key: 'netProfit',
        sorter: (a, b) => tableSort(a, b, "netProfit"),
        render: netProfit => (
            <span>{currencyFormat(netProfit)}</span>
        )
    },
    {
        title: 'Payment Method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        sorter: (a, b) => tableSort(a, b, "paymentMethod"),
    },

]

class OrderSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: -1,
            affiliateOrgId: -1,
            postcode: "",
            searchText: "",
            paymentMethod: -1
        }
    }


    componentDidMount() {
        this.referenceCalls()
        let { yearRefId, affiliateOrgId, postcode, searchText, paymentMethod } = this.state
        let params =
        {
            limit: 10,
            offset: 0,
            search: searchText,
            year: yearRefId,
            postcode: postcode,
            organisationId: affiliateOrgId,
            paymentMethod: paymentMethod,
            order: "",
            sorterBy: ""
        }
        this.props.getOrderSummaryListingAction(params)
    }

    referenceCalls = () => {
        let organisationUniqueKey = getOrganisationData().organisationUniqueKey
        this.props.getAffiliateToOrganisationAction(organisationUniqueKey);
        this.props.getOnlyYearListAction();
    }

    handleTableList = (page) => {
        let { yearRefId, affiliateOrgId, postcode, searchText, paymentMethod } = this.state
        let params =
        {
            limit: 10,
            offset: (page ? (10 * (page - 1)) : 0),
            search: searchText,
            year: yearRefId,
            postcode: postcode,
            organisationId: affiliateOrgId,
            paymentMethod: paymentMethod,
            order: "",
            sorterBy: ""
        }
        this.props.getOrderSummaryListingAction(params)
    }

    onChangeDropDownValue = async (value, key) => {
        if (key == "yearRefId") {
            await this.setState({ yearRefId: value });
            this.handleTableList(1);
        }
        else if (key == "affiliateOrgId") {
            await this.setState({ affiliateOrgId: value });
            this.handleTableList(1);
        }
        else if (key == "postcode") {
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
            await this.setState({ postcode: value });
            if (canCall) {
                this.handleTableList(1);
            }
            else if (value.length == 0) {
                this.handleTableList(1);
            }
        }
        else if (key == "searchText") {
            await this.setState({ searchText: value });
            this.handleTableList(1);
        }
        else if (key == "paymentMethod") {
            await this.setState({ paymentMethod: value });
            this.handleTableList(1);
        }
    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value === null || e.target.value === "") {
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
            <div className="comp-player-grades-header-drop-down-view mt-4 pt-2">
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
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        if (affiliateToData.affiliatedTo != undefined) {
            let obj = {
                organisationId: getOrganisationData().organisationUniqueKey,
                name: getOrganisationData().name
            }
            uniqueValues.push(obj);
            let arr = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["organisationId"], obj])).values()];
            if (isEmptyArray) {
                uniqueValues = [...uniqueValues, ...arr];
            }
        }
        let paymentData = [
            { name: "Cash", value: "cash" },
            { name: "Direct Debit", value: "credit card" },
            { name: "Credit Card", value: "direct debit" }
        ]
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1 order-summ-drop-down-padding order-summary-dropdown-view">
                <div className="fluid-width" >
                    <div className="row reg-filter-row" >

                        <div className="reg-col col-md-3 col-sm-6" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.year} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}
                                    className="year-select reg-filter-select" >
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


                        <div className="reg-col col-md-3 col-sm-6" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.affiliate} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    className="year-select reg-filter-select"
                                    onChange={affiliateOrgId => this.onChangeDropDownValue(affiliateOrgId, "affiliateOrgId")}
                                    value={this.state.affiliateOrgId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(uniqueValues || []).map((org, index) => (
                                        <Option key={org.organisationId} value={org.organisationId}>{org.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="reg-col col-md-3 col-sm-6" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading' style={{ width: 95 }}>{AppConstants.postCode}</div>
                                <div style={{ width: '76%' }}>
                                    <InputWithHead
                                        placeholder={AppConstants.postCode}
                                        onChange={(e) => this.onChangeDropDownValue(e.target.value, 'postcode')}
                                        value={this.state.postcode}
                                        type="number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="reg-col col-md-3 col-sm-6" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.payment} :</div>
                                <Select
                                    style={{ minWidth: 160 }}
                                    onChange={paymentMethod => this.onChangeDropDownValue(paymentMethod, "paymentMethod")}
                                    value={this.state.paymentMethod}
                                    className="year-select reg-filter-select" >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {paymentData.map((item, index) => (
                                        <Option key={item.value} value={item.value}>{item.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    noOfRegisteredUmpires() {
        let { numberOfOrders, valueOfOrders } = this.props.shopOrderSummaryState
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">{AppConstants.numberOfOrders}</div>
                                <div className="reg-payment-price-text">{numberOfOrders}</div>
                            </div>
                        </div>
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">{AppConstants.valueOfOrders}</div>
                                <div className="reg-payment-price-text">{currencyFormat(valueOfOrders)} </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        let { onLoad, orderSummaryListingData, orderSummaryTotalCount, orderSummaryCurrentPage } = this.props.shopOrderSummaryState
        console.log("this.props.shopOrderSummaryState", this.props.shopOrderSummaryState)
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={orderSummaryListingData}
                        pagination={false} />

                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={orderSummaryCurrentPage}
                        total={orderSummaryTotalCount}
                        onChange={(page) => this.handleTableList(page)}
                    />
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOrderSummaryListingAction,
        getOnlyYearListAction,
        getAffiliateToOrganisationAction,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopOrderSummaryState: state.ShopOrderSummaryState,
        userState: state.UserState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((OrderSummary));