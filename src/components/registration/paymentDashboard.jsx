import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Menu, Pagination, Modal, Button, DatePicker,Tag } from "antd";
import "./product.scss";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppImages from "../../themes/appImages";
import { getOnlyYearListAction } from "../../store/actions/appAction";
import { currencyFormat } from "../../util/currencyFormat";
import { getPaymentList, exportPaymentApi } from "../../store/actions/stripeAction/stripeAction"
import InputWithHead from "../../customComponents/InputWithHead"

const { confirm } = Modal;
const { Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
let this_Obj = null;

//listeners for sorting
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

    this_Obj.setState({ sortBy, sortOrder });
    this_Obj.props.getPaymentList(this_Obj.state.offset, sortBy, sortOrder, this_Obj.state.userId);
}


const columns = [
    {
        title: "Name",
        dataIndex: "userFirstName",
        key: "userFirstName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("name"),
        render: (userFirstName, record) => (
            <span>{record.userFirstName + " " + record.userLastName}</span>
        )
    },
    {
        title: "Paid By",
        dataIndex: "paidBy",
        key: "paidBy",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Affiliate",
        dataIndex: "affiliateName",
        key: "affiliateName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("affiliate"),
        render: affiliateName => (
            <span>{affiliateName === null || affiliateName === "" ? "N/A" : affiliateName}</span>

        ),

    },
    {
        title: "Competition",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("competition"),
        render: competitionName => (
            <span>{competitionName}</span>
        ),

    },
    {
        title: "Fee Type",
        dataIndex: "feeType",
        key: "feeType",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Total Fee (inc GST)",
        dataIndex: "invoiceTotal",
        key: "invoiceTotal",
        render: (invoiceTotal, record) => currencyFormat(invoiceTotal),
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("totalFee"),
    },
    {
        title: "Our Portion",
        dataIndex: "affiliatePortion",
        key: "affiliatePortion",
        render: (affiliatePortion, record) => (
            affiliatePortion < 0 ?
               <span style={{color:"red"}}>{ "(" + currencyFormat(affiliatePortion * -1) + ")"}</span> 
               :
               <span>{currencyFormat(affiliatePortion)}</span> 
        ),
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("ourPortion"),
    },
    {
        title: "Payment",
        dataIndex: "paymentType",
        key: "paymentType",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("payment"),
    },
    {
        title: "Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("status"),
        render: paymentStatus => (
            <span>{paymentStatus == "pending" ? "Not Paid" : "Paid"}</span>

        ),

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
            year: "2020",
            competition: "all",
            paymentFor: "all",
            loadingSave: false,
            offset: 0,
            userInfo: null,
            userId: -1,
            registrationId: null
        };
        this_Obj = this;

    }
    componentDidMount() {
        let userInfo = this.props.location.state ? this.props.location.state.personal : null;
        let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
        this.setState({userInfo: userInfo, registrationId: registrationId});
        let userId = userInfo != null ? userInfo.userId : -1;
        let regId = registrationId!= null ? registrationId: '-1';
        console.log("registrationId", registrationId);
        this.handlePaymentTableList(1,userId, regId)
    }

    onExport() {
        this.props.exportPaymentApi("paymentDashboard")
    }

    clearFilterByUserId = () => {
        this.setState({userInfo: null});
        this.handlePaymentTableList(this.state.offset,-1, "-1")
    } 

    ///////view for breadcrumb
    headerView = () => {
        let tagName = this.state.userInfo != null ? this.state.userInfo.firstName + " " + this.state.userInfo.lastName : null;
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className='col-sm' style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.dashboard}
                            </span>
                        </div>
                        <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                            <div className="row">
                                {this.state.userInfo &&
                                    <div className="col-sm pt-1" style={{alignSelf: "center"}}>
                                        <Tag 
                                        closable 
                                        color="volcano"
                                        style={{paddingTop:"3px",height:"30px"}}
                                        onClose={() => {this.clearFilterByUserId()}}
                                        >{tagName}</Tag>
                                    </div>
                                }
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
                                        <Button
                                            onClick={() => this.onExport()}
                                            className="primary-add-comp-form" type="primary">
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
                </div>
            </div >
        );
    };
    ///setting the available from date
    dateOnChangeFrom = date => {
        // this.setState({ endDate: moment(date).utc().toISOString() })
        console.log(date)
    }

    ////setting the available to date
    dateOnChangeTo = date => {
        console.log(date)
    }

    handlePaymentTableList = (page,userId, regId) => {
        let { sortBy, sortOrder } = this.state
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offset: offset,
            userId: userId,
            registrationId: regId
        })
        this.props.getPaymentList(offset, sortBy, sortOrder, userId, regId);
    };
    dropdownView = () => {
        return (
            <div className="row pb-5" >
                <div className="col-sm" >
                    <InputWithHead required={"pt-0"} heading={AppConstants.year} />
                    <Select
                        className="reg-payment-select"
                        style={{ width: "100%", paddingRight: 1, minWidth: 160, maxHeight: 60, minHeight: 44 }}
                        onChange={(year) => this.setState({ year })}
                        value={this.state.year}
                    >
                        <Option value={"2020"}>{AppConstants.year2020}</Option>
                        <Option value={"2019"}>{AppConstants.year2019}</Option>
                        <Option value={"2018"}>{AppConstants.year2018}</Option>
                        <Option value={"2017"}>{AppConstants.year2017}</Option>
                        <Option value={"2016"}>{AppConstants.year2016}</Option>
                    </Select>
                </div>
                <div className="col-sm" >
                    <InputWithHead required={"pt-0"} heading={AppConstants.competition} />

                    <Select
                        className="reg-payment-select"
                        style={{ width: "100%", paddingRight: 1, minWidth: 160 }}
                        onChange={(competition) => this.setState({ competition })}
                        value={this.state.competition}
                    >
                        <Option value={"all"}>{AppConstants.all}</Option>
                        <Option value={"2020"}>{AppConstants.year2020}</Option>
                        <Option value={"2019"}>{AppConstants.year2019}</Option>
                        <Option value={"2018"}>{AppConstants.year2018}</Option>
                        <Option value={"2017"}>{AppConstants.year2017}</Option>
                        <Option value={"2016"}>{AppConstants.year2016}</Option>
                    </Select>
                </div>
                <div className="col-sm" >
                    <InputWithHead required={"pt-0"} heading={AppConstants.paymentFor} />
                    <Select
                        className="reg-payment-select"
                        style={{ width: "100%", paddingRight: 1, minWidth: 160 }}
                        onChange={(paymentFor) => this.setState({ paymentFor })}
                        value={this.state.paymentFor}
                    >
                        <Option value={"all"}>{AppConstants.all}</Option>
                        <Option value={"2020"}>{AppConstants.year2020}</Option>
                        <Option value={"2019"}>{AppConstants.year2019}</Option>
                        <Option value={"2018"}>{AppConstants.year2018}</Option>
                        <Option value={"2017"}>{AppConstants.year2017}</Option>
                        <Option value={"2016"}>{AppConstants.year2016}</Option>
                    </Select>
                </div>
                <div className="col-sm" >
                    <InputWithHead required={"pt-0"} heading={AppConstants.dateFrom} />
                    <DatePicker
                        className="reg-payment-datepicker"
                        size="large"
                        style={{ width: "100%", minWidth: 160 }}
                        onChange={date => this.dateOnChangeFrom(date)}
                        format={'DD-MM-YYYY'}
                        showTime={false}
                        placeholder={"dd-mm-yyyy"}
                    />
                </div>
                <div className="col-sm" >
                    <InputWithHead required={"pt-0"} heading={AppConstants.dateTo} />
                    <DatePicker
                        className="reg-payment-datepicker"
                        size="large"
                        style={{ width: "100%", minWidth: 160 }}
                        onChange={date => this.dateOnChangeTo(date)}
                        format={'DD-MM-YYYY'}
                        showTime={false}
                        placeholder={"dd-mm-yyyy"}

                    />
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        const { paymentState } = this.props;
        let total = paymentState.paymentListTotalCount;
        console.log(paymentState)
        let userId = this.state.userInfo != null ? this.state.userInfo.userId : -1;
        let regId = this.state.registrationId!= null ? this.state.registrationId: '-1';
        return (

            <div className="comp-dash-table-view mt-2">
                {this.dropdownView()}
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
                        onChange={(page) => this.handlePaymentTableList(page,userId, regId)}
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
        getPaymentList,
        exportPaymentApi
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        paymentState: state.StripeState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((PaymentDashboard));
