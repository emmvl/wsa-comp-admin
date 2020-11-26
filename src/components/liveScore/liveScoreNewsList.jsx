import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreNewsListAction } from '../../store/actions/LiveScoreAction/liveScoreNewsAction'
import { liveScore_formateDate, liveScore_MatchFormate } from '../../themes/dateformate'
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { getKeyForStateWideMessage, getLiveScoreCompetiton } from "../../util/sessionStorage"

const { Content } = Layout;

////columens data

function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}
/////function to sort table column
function tableSort(a, b, key) {
    //if (a[key] && b[key]) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
    //}

}

// compare dates

function checkDate(expiryDate, publishedDate) {
    // let currentDate = new Date()
    // if (expiryDate && publishedDate) {
    //     let expiryFormate = new Date(expiryDate)
    //     if (expiryFormate > currentDate || expiryFormate === currentDate) {
    //         return 'green'
    //     } else return 'grey'
    // } else if (publishedDate) {
    //     return 'green'
    // } else if (expiryDate) {
    //     let expiryFormate = new Date(expiryDate)
    //     if (expiryFormate > currentDate || expiryFormate === currentDate) {
    //         return 'green'
    //     } else if (expiryFormate < currentDate) {
    //         return 'grey'
    //     } else return 'red'
    // } else return 'red'

    let currentDate = new Date()
    if (expiryDate && publishedDate) {
        let expiryFormate = new Date(expiryDate)
        if (expiryFormate > currentDate || expiryFormate === currentDate) {
            return 'green'
        } else return 'grey'
    } else if (publishedDate) {
        if (expiryDate) {
            let expiryFormate = new Date(expiryDate)
            if (expiryFormate > currentDate || expiryFormate === currentDate) {
                return 'green'
            } else {
                return 'grey'
            }
        } else {
            return 'green'
        }

    } else {
        return 'red'
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
            <span className="input-heading-add-another pt-0">{title}</span>
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
            <span >{news_expire_date ? liveScore_MatchFormate(news_expire_date) : ""}</span>
    },
    {
        title: 'Recipients',
        dataIndex: 'recipients',
        key: 'recipients',
        sorter: (a, b) => checkSorting(a, b, 'recipients'),

    },
    // {
    //     title: 'Published',
    //     dataIndex: 'published_at',
    //     key: 'published_at',
    //     sorter: (a, b) => checkSorting(a, b, 'published_at'),
    //     render: published_at =>
    //         <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
    //             {published_at && liveScore_formateDate(published_at)}
    //         </span>,

    // },
    {
        title: "Published",
        dataIndex: 'isActive',
        key: 'isActive',
        sorter: (a, b) => tableSort(a, b, 'isActive'),

        render: isActive =>
            <span>{isActive === 1 ? "Yes" : "NO"}</span>

    },
    {
        title: "Published Date",
        dataIndex: 'published_at',
        key: 'published_at',
        render: (published_at) =>
            <span>{published_at && liveScore_formateDate(published_at)}</span>

        // sorter: (a, b) => tableSort(a, b, 'Published_date'),

    },
    {
        title: 'Notification',
        dataIndex: 'isNotification',
        key: 'isNotification',
        sorter: (a, b) => checkSorting(a, b, 'isNotification'),
        render: isNotification =>
            <span>{isNotification === 1 ? "Yes" : "NO"}</span>
    },
    {
        title: 'Active',
        dataIndex: 'news_expire_date',
        key: 'news_expire_date_Active',
        // sorter: (a, b) => a.news_expire_date.length - b.news_expire_date.length,
        render: (news_expire_date, record) =>
            <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                <img className="dot-image"
                    src={checkDate(news_expire_date, record.published_at) === 'green' ? AppImages.greenDot : checkDate(news_expire_date, record.published_at) === 'grey' ? AppImages.greyDot : AppImages.redDot}
                    alt="" width="12" height="12" />
            </span>,
    },
];

class LiveScoreNewsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenKey: props.location ? props.location.state ? props.location.state.screenKey ? props.location.state.screenKey : null : null : null
        };
    }

    componentDidMount() {
        if (getLiveScoreCompetiton()) {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            this.props.liveScoreNewsListAction(id)
        } else {
            this.props.liveScoreNewsListAction(1)
        }
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

                    <div className="col-sm" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: '100%' }}>
                        <div className="row">

                            <div className="col-sm">
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
                                    <NavLink
                                        to={{
                                            pathname: '/matchDayAddNews',
                                            state: { key: 'List', item: null, screenKey: this.state.screenKey }
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
        let stateWideMsg = getKeyForStateWideMessage()
        return (
            <div className="comp-dash-table-view mt-4 pb-5">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreNewsState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={newsData}
                        pagination={false}
                        rowKey={(record, index) => "newsData" + index}
                    />
                </div>

                {stateWideMsg && this.footerView()}

            </div>
        );
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width paddingBottom56px">
                <div className="row">
                    <div className="col-sm-3 mt-5">
                        <div className="reg-add-save-button">
                            <NavLink to="/liveScoreCompetitions">
                                <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.back}</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        let stateWideMsg = getKeyForStateWideMessage()
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.matchDay} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />

                {
                    stateWideMsg ?
                        <InnerHorizontalMenu menu={"liveScoreNews"} liveScoreNewsSelectedKey={"21"} />
                        :
                        <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey={"21"} />
                }
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
