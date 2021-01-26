import React, { Component } from "react";
import {
    Layout, Breadcrumb, Button, Table,
} from 'antd';
import './product.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import moment from 'moment';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
// import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import {
    getTransactionPayoutListAction, exportPayoutTransaction,
} from "../../store/actions/stripeAction/stripeAction";
import { getOrganisationData } from "../../util/sessionStorage";
import { currencyFormat } from "../../util/currencyFormat";
// import Loader from '../../customComponents/loader';
import { liveScore_formateDate } from '../../themes/dateformate';
// import { SearchOutlined } from "@ant-design/icons";

const {
    // Header,
    Content
} = Layout;
// const { Option } = Select;
// const { SubMenu } = Menu;

/// //function to sort table column
// function tableSort(a, b, key) {
//     const stringA = JSON.stringify(a[key]);
//     const stringB = JSON.stringify(b[key]);
//     return stringA.localeCompare(stringB);
// }

const columns = [
    {
        title: "Transaction Id",
        dataIndex: 'id',
        key: 'id',
        sorter: false,
    },
    {
        title: "Description",
        dataIndex: 'source_transfer',
        key: 'source_transfer',
        sorter: false,
        render: (sourceTransfer) => (
            <span>{sourceTransfer ? sourceTransfer.description : "N/A"}</span>
        ),
    },
    {
        title: "Date",
        dataIndex: 'created',
        key: 'created',
        sorter: false,
        render: (created) => {
            const date = new Date(created * 1000);
            const finalDate = liveScore_formateDate(date);
            return (
                <span>{finalDate}</span>
            );
        },
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => (
            <span>{currencyFormat(amount)}</span>
        ),
        sorter: false,
    },
    {
        title: "Status",
        dataIndex: 'status',
        key: 'status',
        sorter: false,
    },
];

class RegistrationPayoutTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        if (this.stripeConnected()) {
            this.props.getTransactionPayoutListAction(1, null, null, this.props.location.state ? this.props.location.state.id : null)
        }
    }

    stripeConnected = () => {
        let orgData = getOrganisationData() ? getOrganisationData() : null
        let stripeAccountID = orgData ? orgData.stripeAccountID : null
        return stripeAccountID
    }

    onExport = () => {
        this.props.exportPayoutTransaction(this.props.location.state ? this.props.location.state.id : null);
    }

    /// ////view for breadcrumb
    headerView = () => (
        <div className="comp-player-grades-header-drop-down-view">
            <div className="row">
                <div className="col-sm d-flex align-content-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.transactions}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="col-sm-8 w-100 d-flex flex-row align-items-center justify-content-end">
                    <div className="row">
                        <div className="col-sm pt-1">
                            <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                <Button
                                    onClick={() => this.onExport()}
                                    className="primary-add-comp-form"
                                    type="primary"
                                >
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
    )

    handleStripeTransactionPayoutList = (key) => {
        let page = this.props.stripeState.stripeTransactionPayoutListPage
        let stripeTransactionPayoutList = this.props.stripeState.stripeTransactionPayoutList
        let starting_after = null
        let ending_before = null
        if (key === "next") {
            ///move forward
            page = parseInt(page) + 1
            let id = (stripeTransactionPayoutList[stripeTransactionPayoutList.length - 1]['id']);
            starting_after = id
            ending_before = null
        }
        if (key === "Previous") {
            //////move backward
            page = parseInt(page) - 1
            let id = (stripeTransactionPayoutList[0]['id']);
            starting_after = null
            ending_before = id
        }
        this.props.getTransactionPayoutListAction(page, starting_after, ending_before, this.props.location.state ? this.props.location.state.id : null)
    }

    ////checking for enabling click on next button or not
    checkNextEnabled = () => {
        let currentPage = this.props.stripeState.stripeTransactionPayoutListPage
        let totalCount = this.props.stripeState.stripeTransactionPayoutListTotalCount ? this.props.stripeState.stripeTransactionPayoutListTotalCount : 1
        let lastPage = Math.ceil(parseInt(totalCount) / 10)
        if (lastPage == currentPage) {
            return false
        } else {
            return true
        }
    }

    transactionPayoutListView = () => {
        let stripeTransactionPayoutList = this.props.stripeState.stripeTransactionPayoutList
        let previousEnabled = this.props.stripeState.stripeTransactionPayoutListPage == 1 ? false : true
        let nextEnabled = this.checkNextEnabled()
        let currentPage = this.props.stripeState.stripeTransactionPayoutListPage
        let totalCount = this.props.stripeState.stripeTransactionPayoutListTotalCount ? this.props.stripeState.stripeTransactionPayoutListTotalCount : 1
        let totalPageCount = Math.ceil(parseInt(totalCount) / 10)
        return (
            <div>
                <div className="table-responsive home-dash-table-view mt-5 mb-5">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={stripeTransactionPayoutList}
                        pagination={false}
                        loading={this.props.stripeState.onLoad && true}
                    />
                </div>
                <div className="reg-payment-pages-div mb-5">
                    <span className="reg-payment-paid-reg-text">{`${AppConstants.currentPage} - ${currentPage}`}</span>
                    <span className="reg-payment-paid-reg-text pt-2">{`${AppConstants.totalPages} - ${totalPageCount}`}</span>
                </div>
                <div className="d-flex justify-content-end paddingBottom56px">
                    <div className="pagination-button-div" onClick={() => previousEnabled && this.handleStripeTransactionPayoutList("Previous")}>
                        <span
                            style={!previousEnabled ? { color: "#9b9bad" } : null}
                            className="pagination-button-text"
                        >
                            {AppConstants.previous}
                        </span>
                    </div>
                    <div className="pagination-button-div" onClick={() => nextEnabled && this.handleStripeTransactionPayoutList("next")}>
                        <span
                            style={!nextEnabled ? { color: "#9b9bad" } : null}
                            className="pagination-button-text"
                        >
                            {AppConstants.next}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    contentView = () => (
        <div className="comp-dash-table-view mt-2">
            {this.transactionPayoutListView()}
        </div>
    )

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.finance} menuName={AppConstants.finance} />
                <InnerHorizontalMenu menu="finance" finSelectedKey="3" />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                        {/* <Loader visible={this.props.stripeState.onLoad} /> */}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getTransactionPayoutListAction,
        exportPayoutTransaction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        stripeState: state.StripeState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPayoutTransaction);
