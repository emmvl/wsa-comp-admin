import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreNewsListAction } from '../../store/actions/LiveScoreAction/liveScoreNewsAction'
import { liveScore_formateDate } from '../../themes/dateformate'
import AppImages from "../../themes/appImages";
const { Content } = Layout;

////columens data

function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}


// compare dates

function checkDate(expiryDate) {
    let currentDate = new Date()

    if (expiryDate) {
        let expiryFormate = new Date(expiryDate)
        if (expiryFormate > currentDate) {
            return true
        } else {
            return true
        }

    } else {
        return false
    }

}

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.length - b.title.length,
        render: (title, record) => <NavLink to={{
            pathname: '/liveScoreNewsView',
            state: { item: record }
        }}>
            <span class="input-heading-add-another pt-0">{title}</span>
        </NavLink>
    },
    {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
        sorter: (a, b) => checkSorting(a, b, 'author'),
    },
    {
        title: 'Expiry',
        dataIndex: 'news_expire_date',
        key: 'news_expire_date',
        sorter: (a, b) => checkSorting(a, b, 'news_expire_date'),
        render: (news_expire_date) =>
            <span >{news_expire_date ? liveScore_formateDate(news_expire_date) : ""}</span>
    },
    {
        title: 'Recipients',
        dataIndex: 'recipients',
        key: 'recipients',
        sorter: (a, b) => checkSorting(a, b, 'recipients'),

    },
    {
        title: 'Published',
        dataIndex: 'published_at',
        key: 'published_at',
        sorter: (a, b) => checkSorting(a, b, 'published_at'),
    },
    {
        title: 'Notification',
        dataIndex: 'isNotification',
        key: 'isNotification',
        sorter: (a, b) => checkSorting(a, b, 'isNotification'),
    },
    {
        title: 'Active',
        dataIndex: 'news_expire_date',
        key: 'news_expire_date',
        sorter: (a, b) => a.news_expire_date.length - b.news_expire_date.length,
        render: news_expire_date =>
            <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                <img className="dot-image"
                    src={checkDate(news_expire_date) === true ? AppImages.greenDot : AppImages.redDot}
                    alt="" width="12" height="12" />
            </span>,
    },
];

class LiveScoreNewsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.liveScoreNewsListAction(1)
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}  >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.newsList}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                        <div className="row">

                            <div className="col-sm">
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
                                    <NavLink
                                        to={{
                                            pathname: '/liveScoreAddNews',
                                            state: { key: 'List', item: null }
                                        }}
                                    >
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addNews}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }


    ////////tableView view for Umpire list
    tableView = () => {
        const { liveScoreNewsState } = this.props;
        let newsData = liveScoreNewsState ? liveScoreNewsState.liveScoreNewsListData : [];

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreNewsState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={newsData}
                        pagination={false}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }} >
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            defaultCurrent={1}
                            total={8}
                        // onChange={this.handleTableChange}
                        />
                    </div>
                </div>
            </div>
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"21"} />
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
    return bindActionCreators({ liveScoreNewsListAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreNewsState: state.LiveScoreNewsState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreNewsList));
