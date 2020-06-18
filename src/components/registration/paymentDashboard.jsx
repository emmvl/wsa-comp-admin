import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Menu, Pagination, Modal } from "antd";
import "./product.css";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppImages from "../../themes/appImages";
import { getOnlyYearListAction } from "../../store/actions/appAction";
import { currencyFormat } from "../../util/currencyFormat";
import { stringTONumber } from "../../util/helpers"
import { getPaymentList } from "../../store/actions/stripeAction/stripeAction"

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

function totalSeasonalFees(seasonalFees1, record) {
    let affiliateFeeStatus = false;
    if (record.childSeasonalFee == null && record.childSeasonalGst == null && record.parentCreator === false) {
        affiliateFeeStatus = true;  ////need to verify to change
    } else {
        affiliateFeeStatus = false;
    }

    let childSeasonalFee = stringTONumber(record.childSeasonalFee);
    let childSeasonalGst = stringTONumber(record.childSeasonalGst);
    let mSeasonalfee = stringTONumber(record.mSeasonalfee);
    let mSeasonalgst = stringTONumber(record.mSeasonalgst);
    let seasonalGST = stringTONumber(record.seasonalGST);
    let seasonalFees = stringTONumber(record.seasonalFees);
    let parentFees = (seasonalFees + seasonalGST + mSeasonalfee + mSeasonalgst);
    let childFees = parentFees + (childSeasonalFee + childSeasonalGst)
    let fee = record.parentCreator ? parentFees : childFees
    return (
        affiliateFeeStatus ?
            <span>{record.feeOrgId == null ? "N/A" : (record.seasonalFees == null && record.seasonalGST == null) ? "N/A" : "Affiliate fee not set!"}</span>
            :
            <span>
                {(record.seasonalFees == null && record.seasonalGST == null) && record.parentCreator === true ? "N/A" : currencyFormat(fee)}
            </span>
        // <span>
        //     {(record.seasonalFees == null && record.seasonalGST == null) && record.parentCreator === true ? "" : currencyFormat(fee)}
        // </span>
    )
}

function totalCasualFees(casualFees1, record) {
    let affiliateFeeStatus = false;
    if (record.childCasualFee == null && record.childCasualGst == null && record.parentCreator === false) {
        affiliateFeeStatus = true;/////need to verify to change
    } else {
        affiliateFeeStatus = false;
    }
    let childCasualFee = stringTONumber(record.childCasualFee);
    let childCasualGst = stringTONumber(record.childCasualGst);
    let mCasualfee = stringTONumber(record.mCasualfee);
    let mCasualgst = stringTONumber(record.mCasualgst);
    let casualGST = stringTONumber(record.casualGST);
    let casualFees = stringTONumber(record.casualFees);

    let parentFees = (casualFees + casualGST + mCasualfee + mCasualgst);
    let childFees = parentFees + (childCasualFee + childCasualGst)

    let fee = record.parentCreator ? parentFees : childFees

    return (
        affiliateFeeStatus ?
            <span>{record.feeOrgId == null ? "N/A" : (record.casualFees == null && record.casualGST == null) ? "N/A" : "Affiliate fee not set!"}</span>
            :
            <span>
                {(record.casualFees == null && record.casualGST == null) && record.parentCreator === true ? "N/A" : currencyFormat(fee)}
            </span>
        // <span>
        //     {(record.casualFees == null && record.casualGST == null) && record.parentCreator === true ? "" : currencyFormat(fee)}
        // </span>
    )
}


const columns = [
    {
        title: "Name",
        dataIndex: "userFirstName",
        key: "userFirstName",
        sorter: (a, b) => tableSort(a, b, "userFirstName"),
        render: (userFirstName, record) => (
            <span>{record.userFirstName + " " + record.userLastName}</span>
        )
    },
    {
        title: "Affiliate",
        dataIndex: "affiliateName",
        key: "affiliateName",
        render: affiliateName => (
            <span>{affiliateName === null || affiliateName === "" ? "N/A" : affiliateName}</span>

        ),
        sorter: (a, b) => tableSort(a, b, "affiliateName")
    },
    {
        title: "Competition",
        dataIndex: "competitionName",
        key: "competitionName",
        render: competitionName => (
            <span>{competitionName}</span>
        ),
        sorter: (a, b) => tableSort(a, b, "competitionName")
    },
    {
        title: "Fee Type",
        dataIndex: "feeType",
        key: "feeType",
        sorter: (a, b) => tableSort(a, b, "feeType")
    },
    {
        title: "Total Fee",
        dataIndex: "invoiceFeeTotal",
        key: "invoiceFeeTotal",
        sorter: (a, b) => tableSort(a, b, "invoiceFeeTotal")
    },
    {
        title: "Affiliate Portion",
        dataIndex: "affiliatePortion",
        key: "affiliatePortion",
        sorter: (a, b) => tableSort(a, b, "affiliatePortion")
    },
    {
        title: "Payment",
        dataIndex: "paymentType",
        key: "paymentType",
        sorter: (a, b) => tableSort(a, b, "paymentType")
    },
    {
        title: "Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        render: paymentStatus => (
            <span>{paymentStatus == "pending" ? "Not Paid" : "Paid"}</span>

        ),
        sorter: (a, b) => tableSort(a, b, "paymentStatus")
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, record) => (
            <Menu
                className="action-triple-dot-submenu "
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    style={{ borderBottomStyle: "solid", borderBottom: 0 }}
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
                        <span>Redeem Voucher</span>
                    </Menu.Item>
                    <Menu.Item key="2"
                    >
                        <span>Cash Payment received</span>
                    </Menu.Item>
                    <Menu.Item key="3"
                    >
                        <span>Refund</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
];

class PaymentDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteLoading: false,

        };
        this_Obj = this;

    }
    componentDidMount() {
        this.handlePaymentTableList(1)
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div
                        className="col-sm"
                        style={{ display: "flex", alignContent: "center" }}
                    >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {/* Payments  */}
                                Dashboard
                          </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        );
    };

    handlePaymentTableList = (page) => {
        let offset = page ? 10 * (page - 1) : 0;
        this.props.getPaymentList(offset);
    };


    ////////form content view
    contentView = () => {
        const { paymentState } = this.props;
        let total = paymentState.paymentListTotalCount;
        console.log(paymentState)
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={paymentState.paymentListData}
                        pagination={false}
                        loading={this.props.paymentState.onLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={paymentState.paymentListPage}
                        total={total}
                        onChange={(page) => this.handlePaymentTableList(page)}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"8"} />
                <Layout>
                    {this.headerView()}
                    <Content>

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
        getPaymentList
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        paymentState: state.StripeState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((PaymentDashboard));
