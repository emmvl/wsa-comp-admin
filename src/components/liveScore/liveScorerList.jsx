import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Layout, Breadcrumb, Button, Table, Pagination, Menu, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import scorerData from "../../mocks/liveScorerList";
import { liveScoreScorerListAction } from "../../store/actions/LiveScoreAction/liveScoreScorerAction";
import { getLiveScoreCompetiton } from "../../util/sessionStorage";
import history from "../../util/history";
import { exportFilesAction } from "../../store/actions/appAction";
import { teamListData } from "../../util/helpers";

function getName(item) {
    return item.name;
}

const { Content, Footer } = Layout;

let _this = null;

/////function to sort table column
function tableSort(key) {
    const body = {
        paging: {
            limit: 10,
            offset: _this.state.offset
        },
        search: _this.state.searchText
    };

    let sortBy = key;
    let sortOrder = null;

    if (_this.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (_this.state.sortBy === key && _this.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (_this.state.sortBy === key && _this.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    _this.setState({ sortBy, sortOrder });
    _this.props.liveScoreScorerListAction(_this.state.competitionId, 4, body, _this.state.searchText, sortBy, sortOrder);
}

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) => (
            <NavLink
                to={{
                    pathname: '/liveScorerView',
                    // pathname: '/userPersonal',
                    state: { tableRecord: record, userId: record.id }
                }}
            >
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
        )
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) => (
            <NavLink
                to={{
                    pathname: '/liveScorerView',
                    state: { tableRecord: record, userId: record.id }
                }}
            >
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
        )
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Contact No',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Team',
        dataIndex: 'teams',
        key: 'teams',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (teams, record) => (
            <div>
                {teams.map((item, i) => (
                    teamListData(item.id) ? (
                        <div key={`teams${i}` + item.id}>
                            <NavLink
                                to={{
                                    pathname: '/liveScorerView',
                                    // pathname: '/userPersonal',
                                    state: { tableRecord: record, userId: record.id }
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span
                                        style={{ color: '#ff8237', cursor: 'pointer' }}
                                        className="desc-text-style side-bar-profile-data"
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            </NavLink>
                        </div>
                    ) : (
                        <span>{item.name}</span>
                    )
                ))}
            </div>
        )
    },
    {
        title: "Action",
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: '25px' }}
            >
                <Menu.SubMenu
                    key="sub1"
                    title={
                        <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink
                            to={{
                                pathname: '/liveScoreAddScorer',
                                state: { isEdit: true, tableRecord: record }
                            }}
                        >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <NavLink
                            to={{
                                pathname: "./liveScoreAssignMatch",
                                state: { record }
                            }}
                        >
                            <span>Assign to match</span>
                        </NavLink>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        )
    }
];

const { id } = 1;

class LiveScorerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            scorerTableData: scorerData.scorerData,
            searchText: '',
            competitionId: null,
            offset: 0,
            sortBy: null,
            sortOrder: null,
        }

        _this = this;
    }

    componentDidMount() {
        let { scorerActionObject } = this.props.liveScoreScorerState
        const body = {
            paging: {
                limit: 10,
                offset: 0
            },
            search: ""
        };

        if (getLiveScoreCompetiton()) {
            const { id } = JSON.parse(getLiveScoreCompetiton());
            this.setState({ competitionId: id });
            if (id !== null) {
                if (scorerActionObject) {
                    let body = scorerActionObject.body
                    let searchText = scorerActionObject.body.search
                    let sortBy = scorerActionObject.sortBy
                    let sortOrder = scorerActionObject.sortOrder
                    this.setState({ searchText, sortBy, sortOrder })
                    this.props.liveScoreScorerListAction(id, 4, body, searchText, sortBy, sortOrder);
                } else {
                    this.props.liveScoreScorerListAction(id, 4, body, this.state.searchText, this.state.sortBy, this.state.sortOrder);
                }
            } else {
                history.push('/');
            }
        } else {
            history.push('/liveScoreCompetitions')
        }
    }

    handlePagination(page) {
        let offset = page ? 10 * (page - 1) : 0;
        let { searchText, sortBy, sortOrder } = this.state
        const body = {
            paging: {
                limit: 10,
                offset: offset
            },
            search: searchText,
            sortBy,
            sortOrder
        }
        this.props.liveScoreScorerListAction(id, 4, body, searchText, sortBy, sortOrder)
    }

    // on Export
    onExport = () => {
        // let url = AppConstants.scorerExport + this.state.competitionId + '&roleId=4'
        let url = AppConstants.scorerExport + this.state.competitionId + `&roleId=${4}`
        this.props.exportFilesAction(url)
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.scorers}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div
                        className="col-sm"
                        style={{
                            display: "flex",
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "flex-end",
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
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <NavLink to="/liveScoreAddScorer">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addScorer}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: '100%',
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end"
                                    }}
                                >
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
                {/* search box */}
                <div className="col-sm pt-5 ml-3" style={{ display: "flex", justifyContent: 'flex-end', }}>
                    <div className="comp-product-search-inp-width">
                        <Input
                            className="product-reg-search-input"
                            onChange={this.onChangeSearchText}
                            placeholder="Search..."
                            onKeyPress={this.onKeyEnterSearchText}
                            value={this.state.searchText}
                            prefix={
                                <SearchOutlined
                                    style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                    onClick={this.onClickSearchIcon}
                                />
                            }
                            allowClear
                        />
                    </div>
                </div>
            </div>
        )
    }

    // on change search text
    onChangeSearchText = (e) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ searchText: e.target.value, offset: 0 })
        let { sortBy, sortOrder } = this.state
        if (e.target.value == null || e.target.value == "") {
            const body = {
                paging: {
                    limit: 10,
                    offset: 0
                },
                search: e.target.value,
                sortBy,
                sortOrder
            }

            this.props.liveScoreScorerListAction(id, 4, body, e.target.value, sortBy, sortOrder)
        }
    }

    // search key
    onKeyEnterSearchText = (e) => {
        this.setState({ offset: 0 })
        let { sortBy, sortOrder } = this.state
        var code = e.keyCode || e.which;
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (code === 13) { //13 is the enter keycode
            const body = {
                paging: {
                    limit: 10,
                    offset: 0
                },
                search: e.target.value,
                sortBy,
                sortOrder
            }
            this.props.liveScoreScorerListAction(id, 4, body, this.state.searchText, sortBy, sortOrder)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        this.setState({ offset: 0 })
        let { searchText, sortBy, sortOrder } = this.state
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (searchText == null || searchText == "") {
        } else {
            const body = {
                paging: {
                    limit: 10,
                    offset: 0
                },
                search: searchText,
                sortBy,
                sortOrder
            }
            this.props.liveScoreScorerListAction(id, 4, body, searchText, sortBy, sortOrder)
        }
    }

    ////////form content view
    contentView = () => {
        let { liveScoreScorerState } = this.props;
        const { scorerListResult, scorerListCurrentPage, scorerListTotalCount } = this.props.liveScoreScorerState
        let dataSource = scorerListResult ? scorerListResult : []
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        loading={this.props.liveScoreScorerState.onLoad}
                        rowKey={(record) => "scorerData" + record.id}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={scorerListCurrentPage}
                        total={scorerListTotalCount}
                        onChange={(page) => this.handlePagination(page)}
                        // defaultPageSize={10}
                    />
                </div>
            </div>
        )
    }

    /////// render function
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="5" />
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
    return bindActionCreators({ liveScoreScorerListAction, exportFilesAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreScorerState: state.LiveScoreScorerState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScorerList);
