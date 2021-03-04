import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Button,
    Table,
    Select,
    Tag,
    Menu,
    Modal,
    Pagination,
} from 'antd';
import Tooltip from 'react-png-tooltip';
import AppConstants from 'themes/appConstants';
import AppImages from 'themes/appImages';
import ColorsArray from 'util/colorsArray';
// import { isArrayNotEmpty } from "util/helpers";
import history from 'util/history';
import { checkOrganisationLevel, getCurrentYear } from 'util/permissions';
import {
    getOrganisationData, getPrevUrl, setLiveScoreUmpireCompition, setLiveScoreUmpireCompitionData, setKeyForStateWideMessage, getGlobalYear, setGlobalYear
} from 'util/sessionStorage';
import { getOnlyYearListAction } from 'store/actions/appAction';
import {
    liveScoreOwnPartCompetitionList,
    liveScoreCompetitionActionInitiate,
    liveScoreCompetitionDeleteInitiate,
    setParticipatePageSizeAction,
    setParticipatePageNumberAction,
    setOwnedPageSizeAction,
    setOwnedPageNumberAction,
} from 'store/actions/LiveScoreAction/liveScoreCompetitionAction';
// import Loader from "customComponents/loader";
import DashboardLayout from 'pages/dashboardLayout';
import './liveScore.css';
import {
    updateInnerHorizontalData,
    // initializeCompData
} from '../../store/actions/LiveScoreAction/liveScoreInnerHorizontalAction';

const { Option } = Select;
const { confirm } = Modal;
let this_Obj = null;

const listeners = (key, tableName) => ({
    onClick: () => tableSort(key, tableName),
});

function tableSort(key, tableName) {
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
    let { participatePageSize } = this_Obj.props.liveScoreCompetition;
    participatePageSize = participatePageSize ? participatePageSize : 10;
    let { ownedPageSize } = this_Obj.props.liveScoreCompetition;
    ownedPageSize = ownedPageSize ? ownedPageSize : 10;
    const body = {
        paging: {
            offsetOwned: this_Obj.state.ownOffset,
            offsetParticipating: this_Obj.state.partOffset,
            limitOwned: ownedPageSize,
            limitParticipating: participatePageSize,
        },
    };
    this_Obj.props.liveScoreOwnPartCompetitionList(body, this_Obj.state.orgKey, sortBy, sortOrder, tableName, this_Obj.state.year);
}

const columnsOwned = [
    {
        title: 'Name',
        dataIndex: 'longName',
        key: 'longName',
        sorter: true,
        onHeaderCell: () => listeners('oname', 'own'),
        render: (longName, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push('/matchDayDashboard');
                }}
            >
                {longName}
            </span>
        ),
    },
    {
        title: AppConstants.divisionAge,
        dataIndex: 'divisions',
        key: 'divisions',
        sorter: true,
        onHeaderCell: () => listeners('odivisions', 'own'),
        render: (divisions) => {
            if (divisions != null) {
                const divisionArray = divisions.split(',');
                return (
                    <span>
                        {divisionArray != null && (
                            divisionArray.map((data, index) => (
                                index <= 38 ? (
                                    data && (
                                        <Tag
                                            className="comp-dashboard-table-tag"
                                            color={ColorsArray[index]}
                                            key={data}
                                        >
                                            {data}
                                        </Tag>
                                    )
                                ) : (
                                        <Tag
                                            className="comp-dashboard-table-tag"
                                            color="#c2c2c2"
                                            key={data}
                                        >
                                            {data}
                                        </Tag>
                                    )
                            ))
                        )}
                    </span>
                );
            }

            return <></>;
        },
    },
    {
        title: 'Teams',
        dataIndex: 'teamCount',
        key: 'teamCount',
        sorter: true,
        onHeaderCell: () => listeners('oteams', 'own'),
        render: (teamCount, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push('/matchDayDashboard');
                }}
            >
                {teamCount}
            </span>
        ),
    },
    {
        title: 'Players',
        dataIndex: 'playerCount',
        key: 'playerCount',
        sorter: true,
        onHeaderCell: () => listeners('oplayers', 'own'),
        render: (playerCount, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push('/matchDayDashboard');
                }}
            >
                {playerCount}
            </span>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        onHeaderCell: () => listeners('ostatus', 'own'),
        render: (status, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push('/matchDayDashboard');
                }}
            >
                {status}
            </span>
        ),
    },
    {
        title: 'Action',
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
                        <img className="dot-image" src={AppImages.moreTripleDot} width="16" height="16" alt="" />
                    }
                >
                    <Menu.Item
                        key="1"
                        onClick={() => {
                            this_Obj.setCompetitionID(record);
                        }}
                    >
                        <NavLink to={{ pathname: '/matchDaySettingsView', state: 'edit' }}>
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item
                        key="2"
                        onClick={() => {
                            this_Obj.showDeleteConfirm(record, 'own');
                        }}
                    >
                        <span>Delete</span>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        ),
    },
];

const columnsParticipate = [
    {
        title: 'Name',
        dataIndex: 'longName',
        key: 'longName',
        sorter: true,
        onHeaderCell: () => listeners('pname', 'part'),
        render: (longName, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push('/matchDayDashboard');
                }}
            >
                {longName}
            </span>
        ),
    },
    {
        title: AppConstants.divisionAge,
        dataIndex: 'divisions',
        key: 'divisions',
        sorter: true,
        onHeaderCell: () => listeners('pdivisions', 'part'),
        render: (divisions) => {
            if (divisions != null) {
                const divisionArray = divisions.split(',');
                return (
                    <span>
                        {divisionArray != null && (
                            divisionArray.map((data, index) => (
                                index <= 38 ? (
                                    data && (
                                        <Tag
                                            className="comp-dashboard-table-tag"
                                            color={ColorsArray[index]}
                                            key={data}
                                        >
                                            {data}
                                        </Tag>
                                    )
                                ) : (
                                        <Tag
                                            className="comp-dashboard-table-tag"
                                            color="#c2c2c2"
                                            key={data}
                                        >
                                            {data}
                                        </Tag>
                                    )
                            ))
                        )}
                    </span>
                );
            }

            return <></>;
        },
    },
    {
        title: 'Teams',
        dataIndex: 'teamCount',
        key: 'teamCount',
        sorter: true,
        onHeaderCell: () => listeners('pteams', 'part'),
        render: (teamCount, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push('/matchDayDashboard');
                }}
            >
                {teamCount}
            </span>
        ),
    },
    {
        title: 'Players',
        dataIndex: 'playerCount',
        key: 'playerCount',
        sorter: true,
        onHeaderCell: () => listeners('pplayers', 'part'),
        render: (playerCount, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push('/matchDayDashboard');
                }}
            >
                {playerCount}
            </span>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        onHeaderCell: () => listeners('pstatus', 'part'),
        render: (status, record) => (
            <span
                className="input-heading-add-another pt-0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    this_Obj.setCompetitionID(record);
                    this_Obj.props.history.push('/matchDayDashboard');
                }}
            >
                {status}
            </span>
        ),
    },
];

class LiveScoreCompetitions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: null,
            onLoad: false,
            orgKey: getOrganisationData() ? getOrganisationData().organisationId : null,
            orgLevel: null,
            offsetData: 0,
            ownOffset: 0,
            partOffset: 0,
            allCompListLoad: false,
            sortBy: null,
            sortOrder: null,
            allyearload: false,

        };

        this_Obj = this;
    }

    componentDidMount() {
        this.props.updateInnerHorizontalData();
        localStorage.setItem('yearValue', 'false');
        if (getGlobalYear()) {
            let yearRefId = getGlobalYear()
            this.setState({ year: JSON.parse(yearRefId) });
        }

        checkOrganisationLevel().then((value) => {
            this.setState({ orgLevel: value });
        });

        const prevUrl = getPrevUrl();
        if (!prevUrl || !(history.location.pathname === prevUrl.pathname && history.location.key === prevUrl.key)) {
            if (this.state.year) {
                this.competitionListApi();

                // checkOrganisationLevel().then((value) => {
                //     this.setState({ orgLevel: value });
                // });
            } else {
                this.props.getOnlyYearListAction(this.props.appState.yearList);
                this.setState({
                    allyearload: true,
                });
            }
        } else {
            history.push('/');
        }
    }

    componentDidUpdate(nextProps) {
        const { allCompListLoad } = this.props.liveScoreCompetition;
        if (this.state.allCompListLoad === true && allCompListLoad === false) {
            this.setState({ allCompListLoad: false });
            localStorage.setItem('defaultYearId', this.state.year);
        }
        if (this.state.allyearload === true && this.props.appState.onLoad == false) {
            if (this.props.appState.yearList.length > 0) {
                const yearRefId = getGlobalYear() ? getGlobalYear() : getCurrentYear(this.props.appState.yearList);
                localStorage.setItem('yearId', yearRefId);
                setGlobalYear(yearRefId)
                this.setState({ year: JSON.parse(yearRefId), allyearload: false });
                this.competitionListApi(yearRefId);
            }
        }
    }

    competitionListApi = (yearRefId) => {
        const { competitionListActionObject } = this.props.liveScoreCompetition;
        if (competitionListActionObject) {
            const body = competitionListActionObject.payload;
            const { orgKey } = competitionListActionObject;
            const { sortBy } = competitionListActionObject;
            const { sortOrder } = competitionListActionObject;
            const { key } = competitionListActionObject;
            // const year = competitionListActionObject.yearRefId;
            let year = getGlobalYear()
            this.props.liveScoreOwnPartCompetitionList(body, orgKey, sortBy, sortOrder, key, year);
            this.setState({
                allCompListLoad: true, sortBy, sortOrder, year,
            });
        } else {
            let { participatePageSize } = this.props.liveScoreCompetition;
            participatePageSize = participatePageSize ? participatePageSize : 10;
            let { ownedPageSize } = this.props.liveScoreCompetition;
            ownedPageSize = ownedPageSize ? ownedPageSize : 10;
            const body = {
                paging: {
                    offsetOwned: 0,
                    offsetParticipating: 0,
                    limitOwned: ownedPageSize,
                    limitParticipating: participatePageSize,
                },
            };
            this.props.liveScoreOwnPartCompetitionList(body, this.state.orgKey, null, null, 'all', yearRefId);
            this.setState({ allCompListLoad: true });
        }
    };

    setCompetitionID = (competitionData) => {
        localStorage.setItem('LiveScoreCompetition', JSON.stringify(competitionData));
        localStorage.removeItem('stateWideMessage');
        setLiveScoreUmpireCompition(competitionData.id);
        setLiveScoreUmpireCompitionData(JSON.stringify(competitionData));
    };

    deleteCompetition = (data, key) => {
        this.props.liveScoreCompetitionDeleteInitiate(data.id, key);
    };

    showDeleteConfirm = (record, key) => {
        const this_ = this;
        confirm({
            title: 'Are you sure you want to delete this competition?',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                this_.deleteCompetition(record, key);
            },
            onCancel() {

            },
        });
    };

    handleShowSizeChange = (key) => async (page, pageSize) => {
        if (key === 'own') {
            await this.props.setOwnedPageSizeAction(pageSize);
        } else {
            await this.props.setParticipatePageSizeAction(pageSize);
        }
        this.handlePagination(page, key);
    }

    handlePagination = async (page, key) => {
        let { ownOffset } = this.state;
        let { partOffset } = this.state;
        let { participatePageSize } = this.props.liveScoreCompetition;
        participatePageSize = participatePageSize ? participatePageSize : 10;
        let { ownedPageSize } = this.props.liveScoreCompetition;
        ownedPageSize = ownedPageSize ? ownedPageSize : 10;
        if (key === 'own') {
            await this.props.setOwnedPageNumberAction(page);
            ownOffset = page ? participatePageSize * (page - 1) : 0;
        } else if (key === 'part') {
            await this.props.setParticipatePageNumberAction(page);
            partOffset = page ? ownedPageSize * (page - 1) : 0;
        }

        this.setState({ ownOffset, partOffset });

        const body = {
            paging: {
                offsetOwned: ownOffset,
                offsetParticipating: partOffset,
                limitOwned: ownedPageSize,
                limitParticipating: participatePageSize,
            },
        };

        this.props.liveScoreOwnPartCompetitionList(body, this.state.orgKey, this.state.sortBy, this.state.sortOrder, key, this.state.year);
    };

    onChangeYear = (evt) => {
        this.setState({ year: evt.year });
        this.handlePagination();
    };

    dropdownButtonView = () => (
        <div className="comp-player-grades-header-drop-down-view mt-4">
            <div className="row fluid-width d-flex justify-content-end">
                <div className="col-sm d-flex flex-row align-items-center">
                    <span className="form-heading">
                        {AppConstants.ownedCompetitions}
                    </span>
                    <div className="mt-n20">
                        <Tooltip placement="top">
                            <span>{AppConstants.ownedCompetitionMsg}</span>
                        </Tooltip>
                    </div>
                </div>

                <div className="row fluid-width">
                    {this.state.orgLevel === 'state' && (
                        <div className="col-sm">
                            <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                <Button
                                    type="primary"
                                    className="primary-add-comp-form"
                                    onClick={() => {
                                        setKeyForStateWideMessage('stateWideMessage');
                                        this.props.history.push({
                                            pathname: '/matchDayNewsList',
                                            state: { screenKey: 'stateWideMsg' },
                                        });
                                    }}
                                >
                                    {AppConstants.comunityWideMsg}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="col-sm">
                        <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                            <Button
                                className="primary-add-comp-form"
                                type="primary"
                                onClick={() => {
                                    localStorage.removeItem('LiveScoreCompetition');
                                    this.props.history.push('/matchDaySettingsView', 'add');
                                }}
                            >
                                +
                                {' '}
                                {AppConstants.addCompetition}
                            </Button>
                        </div>
                    </div>

                    <div className="col-sm">
                        <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                            <Button
                                className="primary-add-comp-form"
                                type="primary"
                            >
                                +
                                {' '}
                                {AppConstants.replicateCompetition}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    partHeaderView = () => (
        <div className="comp-player-grades-header-drop-down-view">
            <div className="fluid-width">
                <div className="row">
                    <div className="col-sm-4 d-flex flex-row align-items-center">
                        <span className="form-heading">
                            {AppConstants.participateInComp}
                        </span>
                        <div className="mt-n20">
                            <Tooltip placement="top">
                                <span>{AppConstants.participateCompMsg}</span>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    participatedView = () => {
        const {
            participatingInComptitions, participateTotalCount, participateCurrentPage, participatePageSize, partLoad,
        } = this.props.liveScoreCompetition;
        return (
            <div className="comp-dash-table-view">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsParticipate}
                        dataSource={participatingInComptitions}
                        pagination={false}
                        loading={partLoad}
                        rowKey={(record) => `participatingInComptitions${record.id}`}
                    />
                </div>

                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        showSizeChanger
                        current={participateCurrentPage}
                        defaultCurrent={participateCurrentPage}
                        defaultPageSize={participatePageSize}
                        total={participateTotalCount}
                        onChange={(page) => this.handlePagination(page, 'part')}
                        onShowSizeChange={this.handleShowSizeChange('part')}
                    />
                </div>
            </div>
        );
    };

    onYearClick(yearId) {
        localStorage.setItem('yearId', yearId);
        setGlobalYear(yearId)
        this.setState({ year: yearId });
        let { participatePageSize } = this.props.liveScoreCompetition;
        participatePageSize = participatePageSize ? participatePageSize : 10;
        let { ownedPageSize } = this.props.liveScoreCompetition;
        ownedPageSize = ownedPageSize ? ownedPageSize : 10;
        const body = {
            paging: {
                offsetOwned: 0,
                offsetParticipating: 0,
                limitOwned: ownedPageSize,
                limitParticipating: participatePageSize,
            },
        };
        this.props.liveScoreOwnPartCompetitionList(body, this.state.orgKey, this.state.sortBy, this.state.sortOrder, 'all', yearId);
    }

    /// dropdown view containing all the dropdown of header
    dropDownView = () => {
        const { yearList } = this.props.appState;
        let yearRefId = null
        if (getGlobalYear()) {
            yearRefId = getGlobalYear()
        }
        return (
            <div
                className="comp-player-grades-header-drop-down-view"
                style={{ marginTop: 15 }}
            >
                <div className="col-sm-2">
                    <div className="year-select-heading-view pb-3">
                        <div className="reg-filter-col-cont">
                            <span className="year-select-heading">
                                {AppConstants.year}
                                :
                            </span>
                            <Select
                                className="year-select reg-filter-select-year ml-2"
                                style={{ width: 90 }}
                                onChange={(yearId) => this.onYearClick(yearId)}
                                value={yearRefId ? JSON.parse(yearRefId) : this.state.year}
                            >
                                {yearList.map((item) => (
                                    <Option key={`year_${item.id}`} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    ownedView = () => {
        const { ownedCompetitions, ownedTotalCount, ownedCurrentPage, ownedPageSize, ownedLoad } = this.props.liveScoreCompetition;

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsOwned}
                        dataSource={[...ownedCompetitions]}
                        pagination={false}
                        loading={ownedLoad}
                        rowKey={(record) => `ownedCompetitions${record.id}`}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-0"
                        current={ownedCurrentPage}
                        defaultCurrent={ownedCurrentPage}
                        defaultPageSize={ownedPageSize}
                        total={ownedTotalCount}
                        onChange={(page) => this.handlePagination(page, 'own')}
                        onShowSizeChange={this.handleShowSizeChange('own')}
                        showSizeChanger
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.matchDay} menuName={AppConstants.liveScores} />
                {/* <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="1" /> */}
                {this.dropdownButtonView()}
                {this.dropDownView()}
                {this.ownedView()}
                {this.partHeaderView()}
                {this.participatedView()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        liveScoreCompetition: state.liveScoreCompetition,
        appState: state.AppState,
    };
}

export default connect(mapStateToProps, {
    liveScoreOwnPartCompetitionList,
    liveScoreCompetitionActionInitiate,
    liveScoreCompetitionDeleteInitiate,
    getOnlyYearListAction,
    updateInnerHorizontalData,
    setParticipatePageSizeAction,
    setParticipatePageNumberAction,
    setOwnedPageSizeAction,
    setOwnedPageNumberAction,
})(LiveScoreCompetitions);
