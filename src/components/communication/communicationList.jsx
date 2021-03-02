import React, { Component } from "react";
import {
    Layout, Button, Table, Breadcrumb,
} from "antd";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { liveScore_formateDate, liveScore_MatchFormate } from '../../themes/dateformate';
import AppImages from "../../themes/appImages";
import { getKeyForStateWideMessage, getOrganisationData } from "../../util/sessionStorage";
import { communicationListAction } from "../../store/actions/communicationAction/communicationAction";

const { Content } = Layout;

/// /columens data

function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length;
    }
}
/// //function to sort table column
function tableSort(a, b, key) {
    // if (a[key] && b[key]) {
    const stringA = JSON.stringify(a[key]);
    const stringB = JSON.stringify(b[key]);
    return stringA.localeCompare(stringB);
    // }
}

// compare dates
function checkDate(expiryDate, publishedDate) {
    const currentDate = new Date();
    if (expiryDate && publishedDate) {
        const expiryFormate = new Date(expiryDate);
        if (expiryFormate > currentDate || expiryFormate === currentDate) {
            return 'green';
        } return 'grey';
    } if (publishedDate) {
        if (expiryDate) {
            const expiryFormate = new Date(expiryDate);
            if (expiryFormate > currentDate || expiryFormate === currentDate) {
                return 'green';
            }
            return 'grey';
        }
        return 'green';
    }
    return 'red';
}

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.length - b.title.length,
        render: (title, record) => (
            <NavLink to={{
                pathname: '/communicationView',
                state: { item: record },
            }}
            >
                <span className="input-heading-add-another pt-0">{title}</span>
            </NavLink>
        ),
    },
    {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
        sorter: (a, b) => checkSorting(a, b, 'author'),
    },
    {
        title: 'Expiry',
        dataIndex: 'expiryDate',
        key: 'expiryDate',
        sorter: (a, b) => checkSorting(a, b, 'expiryDate'),
        render: (expiryDate) => <span>{expiryDate ? liveScore_MatchFormate(expiryDate) : ""}</span>,
    },
    {
        title: "Published",
        dataIndex: 'isActive',
        key: 'isActive',
        sorter: (a, b) => tableSort(a, b, 'isActive'),
        render: (isActive) => <span>{isActive === 1 ? "Yes" : "NO"}</span>,
    },
    {
        title: "Published Date",
        dataIndex: 'publishedAt',
        key: 'publishedAt',
        render: (publishedAt) => <span>{publishedAt && liveScore_formateDate(publishedAt)}</span>,
    },
    {
        title: 'Notification',
        dataIndex: 'isNotification',
        key: 'isNotification',
        sorter: (a, b) => checkSorting(a, b, 'isNotification'),
        render: (isNotification) => <span>{isNotification === 1 ? "Yes" : "NO"}</span>,
    },
    {
        title: 'Active',
        dataIndex: 'expiryDate',
        key: 'communication_expire_date_Active',
        render: (expiryDate, record) => (
            <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                <img
                    className="dot-image"
                    src={
                        checkDate(expiryDate, record.publishedAt) === 'green'
                            ? AppImages.greenDot
                            : checkDate(expiryDate, record.publishedAt) === 'grey'
                                ? AppImages.greyDot
                                : AppImages.redDot
                    }
                    alt=""
                    width="12"
                    height="12"
                />
            </span>
        ),
    },
];

class CommunicationList extends Component {
    constructor(props) {
        super(props);
        this.state = { screenKey: props?.location?.state?.screenKey };
    }

    componentDidMount() {
        this.props.communicationListAction({ organisationId: getOrganisationData().organisationId });
    }

    // view for breadcrumb
    headerView = () => (
        <div className="comp-player-grades-header-drop-down-view mt-4">
            <div className="row">
                <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.communicationList}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div
                    className="col-sm"
                    style={{
                        display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: '100%',
                    }}
                >
                    <div className="row">

                        <div className="col-sm">
                            <div
                                className="comp-dashboard-botton-view-mobile"
                                style={{
                                    width: '100%',
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <NavLink
                                    to={{
                                        pathname: '/addCommunication',
                                        state: { key: 'List', item: null, screenKey: this.state.screenKey },
                                    }}
                                >
                                    <Button className="primary-add-comp-form" type="primary">
                                            +
                                        {' '}
                                        {AppConstants.addCommunication}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

    /// /////tableView view for Umpire list
    tableView = () => {
        const { communicationState } = this.props;
        const communicationData = communicationState.communicationList || [];
        const stateWideMsg = getKeyForStateWideMessage();
        return (
            <div className="comp-dash-table-view mt-4 pb-5">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.communicationState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={communicationData}
                        pagination={false}
                        rowKey={(record, index) => `communicationData${index}`}
                    />
                </div>

                {stateWideMsg && this.footerView()}

            </div>
        );
    };

    /// ///footer view containing all the buttons like submit and cancel
    footerView = () => (
        <div className="fluid-width paddingBottom56px">
            <div className="row">
                <div className="col-sm-3 mt-5">
                    <div className="reg-add-save-button">
                        <NavLink to="/matchDayCompetitions">
                            <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.back}</Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.Communication} menuName={AppConstants.Communication} />

                <InnerHorizontalMenu menu="communication" userSelectedKey="1" />

                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ communicationListAction }, dispatch);
}

function mapStateToProps(state) {
    return {
        liveScoreNewsState: state.LiveScoreNewsState,
        communicationState: state.CommunicationState,
    };
}
export default connect(mapStateToProps, mapDispatchToProps)((CommunicationList));
