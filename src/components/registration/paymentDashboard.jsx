import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Menu, Pagination, Modal, Button, DatePicker, Tag, Input } from "antd";
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
import { getOrganisationData } from "util/sessionStorage";
import { getAffiliateToOrganisationAction } from "store/actions/userAction/userAction";
import { isEmptyArray } from "formik";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";

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
    this_Obj.props.getPaymentList(this_Obj.state.offset, sortBy, sortOrder, -1, "-1", this_Obj.state.yearRefId, this_Obj.state.competitionUniqueKey, this_Obj.state.filterOrganisation, this_Obj.state.dateFrom, this_Obj.state.dateTo);
}


const columns = [
    {
        title: "Name",
        dataIndex: "userFirstName",
        key: "userFirstName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("name"),
        render: (userFirstName, record) => (
            <NavLink
                to={{
                    pathname: `/userPersonal`,
                    state: {
                        userId: record.userId,
                        screenKey: "paymentDashboard",
                        screen: "/paymentDashboard",
                    },
                }}
            >
                <span className="input-heading-add-another pt-0">{record.userFirstName + " " + record.userLastName}</span>
            </NavLink>
        ),
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
                <span style={{ color: "red" }}>{"(" + currencyFormat(affiliatePortion * -1) + ")"}</span>
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
            <span>{paymentStatus === "pending" ? "Not Paid" : "Paid"}</span>

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
            organisationUniqueKey: getOrganisationData().organisationUniqueKey,
            deleteLoading: false,
            yearRefId: -1,
            competitionUniqueKey: "-1",
            filterOrganisation: -1,
            loadingSave: false,
            offset: 0,
            userInfo: null,
            userId: -1,
            registrationId: "-1",
            sortBy: null,
            sortOrder: null,
            dateFrom: null,
            dateTo: null,
            type: -1,
            status: -1
        };
        this_Obj = this;

    }
    async componentDidMount() {
        const { paymentDashboardListAction } = this.props.paymentState
        this.referenceCalls(this.state.organisationUniqueKey);
        let page = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (paymentDashboardListAction) {
            let offset = paymentDashboardListAction.offset
            sortBy = paymentDashboardListAction.sortBy
            sortOrder = paymentDashboardListAction.sortOrder
            let registrationId = paymentDashboardListAction.registrationId == null ? '-1' : paymentDashboardListAction.registrationId
            let userId = paymentDashboardListAction.userId == null ? -1 : paymentDashboardListAction.userId
            let yearRefId = paymentDashboardListAction.yearId
            let competitionUniqueKey = paymentDashboardListAction.competitionKey
            let dateFrom = paymentDashboardListAction.dateFrom
            let dateTo = paymentDashboardListAction.dateTo
            let filterOrganisation = paymentDashboardListAction.paymentFor

            await this.setState({ offset, sortBy, sortOrder, registrationId, userId, yearRefId, competitionUniqueKey, dateFrom, dateTo, filterOrganisation })
            page = Math.floor(offset / 10) + 1;

            this.handlePaymentTableList(page, userId, registrationId)
        } else {

            let userInfo = this.props.location.state ? this.props.location.state.personal : null;
            let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
            this.setState({ userInfo: userInfo, registrationId: registrationId });
            let userId = userInfo != null ? userInfo.userId : -1;
            let regId = registrationId != null ? registrationId : '-1';

            this.handlePaymentTableList(1, userId, regId)
        }


    }

    referenceCalls = (organisationId) => {
        this.props.getAffiliateToOrganisationAction(organisationId);
        this.props.getOnlyYearListAction();
    };

    onExport() {
        this.props.exportPaymentApi("paymentDashboard")
    }

    clearFilterByUserId = () => {
        this.setState({ userInfo: null });
        this.handlePaymentTableList(this.state.offset, -1, "-1")
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
                        <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: '100%' }}>
                            <div className="row">
                                {this.state.userInfo &&
                                    <div className="col-sm pt-1" style={{ alignSelf: "center" }}>
                                        <Tag
                                            closable
                                            color="volcano"
                                            style={{ paddingTop: "3px", height: "30px" }}
                                            onClose={() => { this.clearFilterByUserId() }}
                                        >{tagName}</Tag>
                                    </div>
                                }

                                <div className="pt-1" style={{ display: "flex", justifyContent: 'flex-end' }}>
                                    <div className="comp-product-search-inp-width">
                                        <Input
                                            className="product-reg-search-input"
                                            // onChange={this.onChangeSearchText}
                                            placeholder="Search..."
                                            // onKeyPress={this.onKeyEnterSearchText}
                                            prefix={
                                                <SearchOutlined
                                                    style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                                // onClick={this.onClickSearchIcon}
                                                />
                                            }
                                            allowClear
                                        />
                                    </div>
                                </div>

                                <div className="col-sm pt-1">

                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: '100%',
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
            </div>
        );
    };
    ///setting the available from date
    dateOnChangeFrom = date => {
        // this.setState({ endDate: moment(date).utc().toISOString() })
    }

    ////setting the available to date
    dateOnChangeTo = date => {
        console.log(date)
    }

    handlePaymentTableList = (page, userId, regId) => {
        let { sortBy, sortOrder, yearRefId, competitionUniqueKey, filterOrganisation, dateFrom, dateTo } = this.state
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offset,
            userId: userId,
            registrationId: regId
        })
        this.props.getPaymentList(offset, sortBy, sortOrder, -1, "-1", yearRefId, competitionUniqueKey, filterOrganisation, dateFrom, dateTo);
    };

    onChangeDropDownValue = async (value, key) => {
        if (key === "yearRefId") {
            await this.setState({ yearRefId: value });
            this.handlePaymentTableList(1);
        } else if (key === "competitionId") {
            await this.setState({ competitionUniqueKey: value });
            this.handlePaymentTableList(1);
        } else if (key === "filterOrganisation") {
            await this.setState({ filterOrganisation: value });
            this.handlePaymentTableList(1, -1, "-1");
        } else if (key === "dateFrom") {
            await this.setState({ dateFrom: value });
            this.handlePaymentTableList(1, -1, "-1");
        } else if (key === "dateTo") {
            await this.setState({ dateTo: value });
            this.handlePaymentTableList(1, -1, "-1");
        }
    };


    dropdownView_1 = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        let paymentStatus = [
            { id: 1, description: "Pending Membership" },
            { id: 2, description: "Pending Registration Fee" },
            { id: 3, description: "Registered" },
        ];

        if (affiliateToData.affiliatedTo !== undefined) {
            let obj = {
                organisationId: getOrganisationData().organisationUniqueKey,
                name: getOrganisationData().name,
            };
            uniqueValues.push(obj);
            let arr = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["organisationId"], obj])).values()];
            if (isEmptyArray) {
                uniqueValues = [...uniqueValues, ...arr];
            }
        }
        const { paymentCompetitionList } = this.props.paymentState;
        return (
            <div>
                <div className="row pb-5">
                    <div className="col-sm">
                        <InputWithHead required="pt-0" heading={AppConstants.year} />
                        <Select
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160, maxHeight: 60, minHeight: 44 }}
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
                    <div className="col-sm">
                        <InputWithHead required="pt-0" heading={AppConstants.competition} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
                            onChange={competitionId => this.onChangeDropDownValue(competitionId, "competitionId")}
                            value={this.state.competitionUniqueKey}
                        >
                            <Option key={-1} value={"-1"}>{AppConstants.all}</Option>
                            {(paymentCompetitionList || []).map(item => (
                                <Option
                                    // key={'competition_' + item.competitionUniquekey}
                                    key={item.competitionUniquekey}
                                    value={item.competitionUniqueKey}
                                >
                                    {item.competitionName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-sm">
                        <InputWithHead required="pt-0" heading={AppConstants.paymentFor} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
                            onChange={(e) => this.onChangeDropDownValue(e, "filterOrganisation")}
                            value={this.state.filterOrganisation}
                        >
                            <Option key={-1} value={-1}>{AppConstants.all}</Option>
                            {(uniqueValues || []).map((org) => (
                                <Option key={'organisation_' + org.organisationId} value={org.organisationId}>
                                    {org.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-sm">
                        <InputWithHead required="pt-0" heading={AppConstants.dateFrom} />
                        <DatePicker
                            className="reg-payment-datepicker"
                            size="default"
                            style={{ width: '100%', minWidth: 160 }}
                            format="DD-MM-YYYY"
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            onChange={e => this.onChangeDropDownValue(e, "dateFrom")}
                            value={this.state.dateFrom !== null && moment(this.state.dateFrom, "YYYY-MM-DD")}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead required="pt-0" heading={AppConstants.dateTo} />
                        <DatePicker
                            className="reg-payment-datepicker"
                            size="default"
                            style={{ width: '100%', minWidth: 160 }}
                            format="DD-MM-YYYY"
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            onChange={e => this.onChangeDropDownValue(e, "dateTo")}
                            value={this.state.dateTo !== null && moment(this.state.dateTo, "YYYY-MM-DD")}
                        />
                    </div>

                </div>
                <div className='row pb-5'>
                    <div className="col-sm-3">
                        <InputWithHead required="pt-0" heading={AppConstants.type} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
                            onChange={(type) => this.setState({ type })}
                            value={this.state.type}
                        >
                            <Option key={-1} value={-1}>{AppConstants.all}</Option>
                            <Option key={"playerRegistration"} value={"playerRegistration"}>{"Player Registration"}</Option>
                            <Option key={"coachRegistration"} value={"coachRegistration"}>{"Coach Registration"}</Option>
                            <Option key={"teamRegistration"} value={"teamRegistration"}>{"Team Registration"}</Option>
                            <Option key={"shop"} value={"shop"}>{"Shop"}</Option>
                            <Option key={"umpire"} value={"umpire"}>{"Umpire"}</Option>
                        </Select>
                    </div>
                    <div className="col-sm-3">
                        <InputWithHead required="pt-0" heading={AppConstants.status} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
                            onChange={(status) => this.setState({ status })}
                            value={this.state.status}
                        >
                            <Option key={-1} value={-1}>{AppConstants.all}</Option>
                            <Option key={"paid"} value={"paid"}>{"Paid"}</Option>
                            <Option key={"pending"} value={"pending"}>{"Pending"}</Option>
                            <Option key={"declined"} value={"declined"}>{"Declined"}</Option>
                        </Select>
                    </div>
                </div>
            </div>
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        let paymentStatus = [
            { id: 1, description: "Pending Membership" },
            { id: 2, description: "Pending Registration Fee" },
            { id: 3, description: "Registered" },
        ];

        if (affiliateToData.affiliatedTo !== undefined) {
            let obj = {
                organisationId: getOrganisationData().organisationUniqueKey,
                name: getOrganisationData().name,
            };
            uniqueValues.push(obj);
            let arr = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["organisationId"], obj])).values()];
            if (isEmptyArray) {
                uniqueValues = [...uniqueValues, ...arr];
            }
        }
        const { paymentCompetitionList } = this.props.paymentState;
        return (
            <div>
                <div className="row">
                    <div className="col-sm-3">
                        <InputWithHead required="pt-0" heading={AppConstants.year} />
                        <Select
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160, maxHeight: 60, minHeight: 44 }}
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
                    <div className="col-sm-3">
                        <InputWithHead required="pt-0" heading={AppConstants.competition} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
                            onChange={competitionId => this.onChangeDropDownValue(competitionId, "competitionId")}
                            value={this.state.competitionUniqueKey}
                        >
                            <Option key={-1} value={"-1"}>{AppConstants.all}</Option>
                            {(paymentCompetitionList || []).map(item => (
                                <Option
                                    // key={'competition_' + item.competitionUniquekey}
                                    key={item.competitionUniquekey}
                                    value={item.competitionUniqueKey}
                                >
                                    {item.competitionName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-sm-3">
                        <InputWithHead required="pt-0" heading={AppConstants.paymentFor} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
                            onChange={(e) => this.onChangeDropDownValue(e, "filterOrganisation")}
                            value={this.state.filterOrganisation}
                        >
                            <Option key={-1} value={-1}>{AppConstants.all}</Option>
                            {(uniqueValues || []).map((org) => (
                                <Option key={'organisation_' + org.organisationId} value={org.organisationId}>
                                    {org.name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-sm-3">
                        <InputWithHead required="pt-0" heading={AppConstants.type} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
                            onChange={(type) => this.setState({ type })}
                            value={this.state.type}
                        >
                            <Option key={-1} value={-1}>{AppConstants.all}</Option>
                            <Option key={"playerRegistration"} value={"playerRegistration"}>{"Player Registration"}</Option>
                            <Option key={"coachRegistration"} value={"coachRegistration"}>{"Coach Registration"}</Option>
                            <Option key={"teamRegistration"} value={"teamRegistration"}>{"Team Registration"}</Option>
                            <Option key={"shop"} value={"shop"}>{"Shop"}</Option>
                            <Option key={"umpire"} value={"umpire"}>{"Umpire"}</Option>
                        </Select>
                    </div>

                </div>

                <div className='row pb-5'>
                    <div className="col-sm-3 pt-2">
                        <InputWithHead required="pt-0" heading={AppConstants.status} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            className="reg-payment-select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
                            onChange={(status) => this.setState({ status })}
                            value={this.state.status}
                        >
                            <Option key={-1} value={-1}>{AppConstants.all}</Option>
                            <Option key={"paid"} value={"paid"}>{"Paid"}</Option>
                            <Option key={"pending"} value={"pending"}>{"Pending"}</Option>
                            <Option key={"declined"} value={"declined"}>{"Declined"}</Option>
                        </Select>
                    </div>

                    <div className="col-sm-3 pt-2">
                        <InputWithHead required="pt-0" heading={AppConstants.dateFrom} />
                        <DatePicker
                            className="reg-payment-datepicker"
                            size="default"
                            style={{ width: '100%', minWidth: 160 }}
                            format="DD-MM-YYYY"
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            onChange={e => this.onChangeDropDownValue(e, "dateFrom")}
                            value={this.state.dateFrom !== null && moment(this.state.dateFrom, "YYYY-MM-DD")}
                        />
                    </div>

                    <div className="col-sm-3 pt-2">
                        <InputWithHead required="pt-0" heading={AppConstants.dateTo} />
                        <DatePicker
                            className="reg-payment-datepicker"
                            size="default"
                            style={{ width: '100%', minWidth: 160 }}
                            format="DD-MM-YYYY"
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            onChange={e => this.onChangeDropDownValue(e, "dateTo")}
                            value={this.state.dateTo !== null && moment(this.state.dateTo, "YYYY-MM-DD")}
                        />
                    </div>
                </div>

            </div>
        )
    }

    ////////form content view
    contentView = () => {
        const { paymentState } = this.props;
        let total = paymentState.paymentListTotalCount;
        let userId = this.state.userInfo != null ? this.state.userInfo.userId : -1;
        let regId = this.state.registrationId != null ? this.state.registrationId : '-1';
        return (

            <div className="comp-dash-table-view mt-2">
                {this.dropdownView()}
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={paymentState.paymentListData}
                        pagination={false}
                        loading={this.props.paymentState.onLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={paymentState.paymentListPage}
                        total={total}
                        onChange={(page) => this.handlePaymentTableList(page, userId, regId)}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.finance}
                    menuName={AppConstants.finance}
                />
                <InnerHorizontalMenu menu="finance" finSelectedKey="1" />
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
        exportPaymentApi,
        getAffiliateToOrganisationAction,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        paymentState: state.StripeState,
        appState: state.AppState,
        userState: state.UserState,
        userRegistrationState: state.EndUserRegistrationState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((PaymentDashboard));
