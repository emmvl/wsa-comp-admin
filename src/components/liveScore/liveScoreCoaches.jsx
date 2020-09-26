import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    Layout,
    Breadcrumb,
    Button,
    Table,
    Pagination,
    Menu,
    Input,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

import "./liveScore.css";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { liveScoreCoachListAction } from "../../store/actions/LiveScoreAction/liveScoreCoachAction";
import { getLiveScoreCompetiton } from "../../util/sessionStorage";
import { isArrayNotEmpty } from "../../util/helpers";
import { getliveScoreTeams } from "../../store/actions/LiveScoreAction/liveScoreTeamAction";
import { userExportFilesAction } from "../../store/actions/appAction";
import { teamListData } from "../../util/helpers";

const { Content } = Layout;
const { SubMenu } = Menu;

let _this = null;

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (_this.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (_this.state.sortBy === key && _this.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (_this.state.sortBy === key && _this.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    _this.setState({ sortBy: sortBy, sortOrder: sortOrder });
    _this.props.liveScoreCoachListAction(17, 1, _this.state.competitionId, _this.state.searchText, _this.state.offset, sortBy, sortOrder);
}

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) =>
            <NavLink to={{
                pathname: '/userPersonal',
                state: { userId: record.id, screenKey: "livescore", screen: "/LiveScoreCoaches" }
            }}>
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (lastName, record) =>
            <NavLink to={{
                pathname: '/userPersonal',
                state: { userId: record.id, screenKey: "livescore", screen: "/LiveScoreCoaches" }
            }}>
                <span className="input-heading-add-another pt-0">{lastName}</span>
            </NavLink>
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Contact No",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Team",
        dataIndex: "linkedEntity",
        key: "Linked Entity Name",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (linkedEntity, record) => (
            <div>
                {linkedEntity.length > 0 && linkedEntity.map((item, i) => (
                    teamListData(item.entityId) ? (
                        <div key={`name${i}` + linkedEntity.entityId}>
                            <NavLink
                                to={{
                                    pathname: '/liveScoreTeamView',
                                    state: { teamId: item.entityId, screenKey: "livescore" }
                                }}
                            >
                                <span
                                    style={{ color: '#ff8237', cursor: 'pointer' }}
                                    className="live-score-desc-text side-bar-profile-data"
                                >
                                    {item.name}
                                </span>
                            </NavLink>
                        </div>
                    ) : (
                        <span>{item.name}</span>
                    )
                ))}
            </div>
        ),
    },
    {
        title: 'Action',
        dataIndex: 'isUsed',
        key: 'isUsed',
        render: (isUsed, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: '25px' }}
            >
                <SubMenu
                    key="sub1"
                    title={
                        <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink
                            to={{
                                pathname: "/liveScoreAddEditCoach",
                                state: { isEdit: true, tableRecord: record }
                            }}
                        >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
];

class LiveScoreCoaches extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            competitionId: null,
            offset: 0
        };

        _this = this;
    }

    componentDidMount() {
        if (getLiveScoreCompetiton()) {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            this.setState({ competitionId: id })
            let offset = 0
            this.props.liveScoreCoachListAction(17, 1, id, this.state.searchText, offset)

            if (id !== null) {
                this.props.getliveScoreTeams(id)
            } else {
                history.push('/liveScoreCompetitions')
            }
        } else {
            history.push('/liveScoreCompetitions')
        }
    }

    /// Handle Page change
    handlePageChange = (page) => {
        let offset = page ? 10 * (page - 1) : 0;
        let { sortBy, sortOrder, searchText, competitionId } = this.state
        this.setState({
            offset
        })
        this.props.liveScoreCoachListAction(17, 1, competitionId, searchText, offset, sortBy, sortOrder)
    }

    contentView = () => {
        const { coachesResult, currentPage, totalCount } = this.props.liveScoreCoachState
        let couchesList = isArrayNotEmpty(coachesResult) ? coachesResult : []
        let teamList = isArrayNotEmpty(coachesResult) ? coachesResult : []

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={couchesList}
                        pagination={false}
                        loading={this.props.liveScoreCoachState.onLoad}
                        rowKey={(record) => "couchesList" + record.id}
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
                        }}
                    >
                        <Pagination
                            className="antd-pagination"
                            current={currentPage}
                            total={totalCount}
                            defaultPageSize={10}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>
        );
    };

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.coachList}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div
                        className="col-sm-8"
                        style={{
                            display: "flex",
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "100%"
                        }}
                    >
                        <div className="row">
                            <div className="col-sm">
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <NavLink to="/liveScoreAddEditCoach">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addCoach}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
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
                                    <Button onClick={this.onExport} className="primary-add-comp-form" type="primary">
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
                                    <NavLink to="/liveScoreCoachImport">
                                        <Button className="primary-add-comp-form" type="primary">
                                            <div className="row">
                                                <div className="col-sm">
                                                    <img
                                                        src={AppImages.import}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.import}
                                                </div>
                                            </div>
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5" style={{ display: "flex", justifyContent: 'flex-end' }}>
                    <div className="comp-product-search-inp-width">
                        <Input
                            className="product-reg-search-input"
                            onChange={this.onChangeSearchText}
                            placeholder="Search..."
                            onKeyPress={this.onKeyEnterSearchText}
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

    // on Export
    onExport = () => {
        let url = AppConstants.coachExport + this.state.competitionId
        this.props.userExportFilesAction(url)
    }

    // on change search text
    onChangeSearchText = (e) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ searchText: e.target.value })
        let { sortBy, sortOrder, offset } = this.state
        if (e.target.value == null || e.target.value === "") {
            this.props.liveScoreCoachListAction(17, 1, id, e.target.value, offset, sortBy, sortOrder)
        }
    }

    // search key
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let { sortBy, sortOrder, offset } = this.state
        if (code === 13) { //13 is the enter keycode
            this.props.liveScoreCoachListAction(17, 1, id, e.target.value, offset, sortBy, sortOrder)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (this.state.searchText == null || this.state.searchText === "") {
        } else {
            // this.props.getTeamsWithPagging(this.state.conpetitionId, 0, 10, this.state.searchText)
            this.props.liveScoreCoachListAction(17, 1, id, this.state.searchText, this.state.offset)
        }
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"23"} />
                <Layout>
                    {this.headerView()}

                    <Content>{this.contentView()}</Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreCoachListAction,
        getliveScoreTeams,
        userExportFilesAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreCoachState: state.LiveScoreCoachState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreCoaches);
