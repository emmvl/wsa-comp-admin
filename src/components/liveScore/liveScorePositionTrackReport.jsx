import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Layout, Breadcrumb, Button, Table, Pagination, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './liveScore.css';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import AppImages from '../../themes/appImages';
import {
  liveScorePositionTrackingAction,
  setPageSizeAction,
  setPageNumberAction,
} from '../../store/actions/LiveScoreAction/liveScorePositionTrackingAction';
import { getLiveScoreCompetiton, getOrganisationData } from '../../util/sessionStorage';
import { isArrayNotEmpty } from '../../util/helpers';
import history from '../../util/history';
import { exportFilesAction } from '../../store/actions/appAction';

const { Content } = Layout;
const { Option } = Select;
var this_obj = null;

function sorting(a, b, key) {
  let stringA = JSON.stringify(a[key]);
  let stringB = JSON.stringify(b[key]);
  return stringA.localeCompare(stringB);
}

// listeners for sorting
const listeners = key => ({
  onClick: () => tableSort(key),
});

function tableSort(key) {
  let sortBy = key;
  let sortOrder = null;
  if (this_obj.state.sortBy !== key) {
    sortOrder = 'ASC';
  } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'ASC') {
    sortOrder = 'DESC';
  } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'DESC') {
    sortBy = sortOrder = null;
  }

  this_obj.setState({ sortBy, sortOrder });

  let { pageSize } = this_obj.props.liveScorePositionTrackState;
  pageSize = pageSize ? pageSize : 10;

  const body = {
    paging: {
      limit: pageSize,
      offset: this_obj.state.offset,
    },
  };

  this_obj.props.liveScorePositionTrackingAction({
    compId: this_obj.state.competitionId,
    aggregate: this_obj.state.aggregate,
    reporting: this_obj.state.reporting,
    pagination: body,
    search: this_obj.state.searchText,
    sortBy,
    sortOrder,
    IsParent: this_obj.state.liveScoreCompIsParent,
    compOrgId: this_obj.state.compOrgId,
  });
}

const columns_1 = [
  {
    title: AppConstants.tableMatchID,
    dataIndex: 'matchId',
    key: 'matchId',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('matchId'),
  },
  {
    title: AppConstants.team,
    dataIndex: 'teamName',
    key: 'teamName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('team'),
  },
  {
    title: AppConstants.firstName,
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('firstName'),
  },
  {
    title: AppConstants.lastName,
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('lastName'),
  },
  {
    title: 'GS',
    dataIndex: 'gs',
    key: 'gs',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('gs'),
    render: (gs, records) => (
      <span nowrap className="column-width-style">
        {gs}
      </span>
    ),
  },
  {
    title: 'GA',
    dataIndex: 'ga',
    key: 'ga',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('ga'),
    render: (ga, records) => (
      <span nowrap className="column-width-style">
        {ga}
      </span>
    ),
  },
  {
    title: 'WA',
    dataIndex: 'wa',
    key: 'wa',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('wa'),
    render: (wa, records) => (
      <span nowrap className="column-width-style">
        {wa}
      </span>
    ),
  },
  {
    title: 'C',
    dataIndex: 'c',
    key: 'c',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('c'),
    render: (c, records) => (
      <span nowrap className="column-width-style">
        {c}
      </span>
    ),
  },
  {
    title: 'WD',
    dataIndex: 'wd',
    key: 'wd',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('wd'),
    render: (wd, records) => (
      <span nowrap className="column-width-style">
        {wd}
      </span>
    ),
  },
  {
    title: 'GD',
    dataIndex: 'gd',
    key: 'gd',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('gd'),
    render: (gd, records) => (
      <span nowrap className="column-width-style">
        {gd}
      </span>
    ),
  },
  {
    title: 'GK',
    dataIndex: 'gk',
    key: 'gk',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('gk'),
    render: (gk, records) => (
      <span nowrap className="column-width-style">
        {gk}
      </span>
    ),
  },
  {
    title: AppConstants.played,
    dataIndex: 'played',
    key: 'played',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('played'),
    render(played, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{played}</div>,
      };
    },
  },
  {
    title: AppConstants.bench,
    dataIndex: 'bench',
    key: 'bench',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('bench'),
    render(bench, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{bench}</div>,
      };
    },
  },
  {
    title: AppConstants.noPlay,
    dataIndex: 'noPlay',
    key: 'noPlay',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('noPlay'),
    render(noPlay, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{noPlay}</div>,
      };
    },
  },
];

const columns_2 = [
  {
    title: AppConstants.team,
    dataIndex: 'teamName',
    key: 'teamName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('team'),
  },
  {
    title: AppConstants.firstName,
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('firstName'),
  },
  {
    title: AppConstants.lastName,
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('lastName'),
  },
  {
    title: 'GS',
    dataIndex: 'gs',
    key: 'gs',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('gs'),
    render: (gs, records) => (
      <span nowrap className="column-width-style">
        {gs}
      </span>
    ),
  },
  {
    title: 'GA',
    dataIndex: 'ga',
    key: 'ga',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('ga'),
    render: (ga, records) => (
      <span nowrap className="column-width-style">
        {ga}
      </span>
    ),
  },
  {
    title: 'WA',
    dataIndex: 'wa',
    key: 'wa',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('wa'),
    render: (wa, records) => (
      <span nowrap className="column-width-style">
        {wa}
      </span>
    ),
  },
  {
    title: 'C',
    dataIndex: 'c',
    key: 'c',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('c'),
    render: (c, records) => (
      <span nowrap className="column-width-style">
        {c}
      </span>
    ),
  },
  {
    title: 'WD',
    dataIndex: 'wd',
    key: 'wd',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('wd'),
    render: (wd, records) => (
      <span nowrap className="column-width-style">
        {wd}
      </span>
    ),
  },
  {
    title: 'GD',
    dataIndex: 'gd',
    key: 'gd',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('gd'),
    render: (gd, records) => (
      <span nowrap className="column-width-style">
        {gd}
      </span>
    ),
  },
  {
    title: 'GK',
    dataIndex: 'gk',
    key: 'gk',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('gk'),
    render: (gk, records) => (
      <span nowrap className="column-width-style">
        {gk}
      </span>
    ),
  },
  {
    title: AppConstants.played,
    dataIndex: 'played',
    key: 'played',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('played'),
    render(played, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{played}</div>,
      };
    },
  },
  {
    title: AppConstants.bench,
    dataIndex: 'bench',
    key: 'bench',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('bench'),
    render(bench, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{bench}</div>,
      };
    },
  },
];

const percentColumn = [
  {
    title: AppConstants.tableMatchID,
    dataIndex: 'matchId',
    key: 'matchId',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('matchId'),
  },
  {
    title: AppConstants.team,
    dataIndex: 'teamName',
    key: 'teamName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('team'),
  },
  {
    title: AppConstants.firstName,
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('firstName'),
  },
  {
    title: AppConstants.lastName,
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('lastName'),
  },
  {
    title: 'GS',
    dataIndex: 'gs',
    key: 'gs',
    sorter: (a, b) => sorting(a, b, 'gs'),
    render: (gs, records) => (
      <span nowrap className="column-width-style">
        {gs}
      </span>
    ),
  },
  {
    title: 'GA',
    dataIndex: 'ga',
    key: 'ga',
    sorter: (a, b) => sorting(a, b, 'ga'),
    render: (ga, records) => (
      <span nowrap className="column-width-style">
        {ga}
      </span>
    ),
  },
  {
    title: 'WA',
    dataIndex: 'wa',
    key: 'wa',
    sorter: (a, b) => sorting(a, b, 'wa'),
    render: (wa, records) => (
      <span nowrap className="column-width-style">
        {wa}
      </span>
    ),
  },
  {
    title: 'C',
    dataIndex: 'c',
    key: 'c',
    sorter: (a, b) => sorting(a, b, 'c'),
    render: (c, records) => (
      <span nowrap className="column-width-style">
        {c}
      </span>
    ),
  },
  {
    title: 'WD',
    dataIndex: 'wd',
    key: 'wd',
    sorter: (a, b) => sorting(a, b, 'wd'),
    render: (wd, records) => (
      <span nowrap className="column-width-style">
        {wd}
      </span>
    ),
  },
  {
    title: 'GD',
    dataIndex: 'gd',
    key: 'gd',
    sorter: (a, b) => sorting(a, b, 'gd'),
    render: (gd, records) => (
      <span nowrap className="column-width-style">
        {gd}
      </span>
    ),
  },
  {
    title: 'GK',
    dataIndex: 'gk',
    key: 'gk',
    sorter: (a, b) => sorting(a, b, 'gk'),
    render: (gk, records) => (
      <span nowrap className="column-width-style">
        {gk}
      </span>
    ),
  },
  {
    title: AppConstants.played,
    dataIndex: 'played',
    key: 'played',
    sorter: (a, b) => sorting(a, b, 'played'),
    render(played, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{played}</div>,
      };
    },
  },
  {
    title: AppConstants.bench,
    dataIndex: 'bench',
    key: 'bench',
    sorter: (a, b) => sorting(a, b, 'bench'),
    render(bench, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{bench}</div>,
      };
    },
  },
  {
    title: AppConstants.noPlay,
    dataIndex: 'noPlay',
    key: 'noPlay',
    sorter: (a, b) => sorting(a, b, 'noPlay'),
    render(noPlay, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{noPlay}</div>,
      };
    },
  },
];

const percentColumn_1 = [
  {
    title: AppConstants.team,
    dataIndex: 'teamName',
    key: 'teamName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('team'),
  },
  {
    title: AppConstants.firstName,
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('firstName'),
  },
  {
    title: AppConstants.lastName,
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners('lastName'),
  },
  {
    title: 'GS',
    dataIndex: 'gs',
    key: 'gs',
    sorter: (a, b) => sorting(a, b, 'gs'),
    render: (gs, records) => (
      <span nowrap className="column-width-style">
        {gs}
      </span>
    ),
  },
  {
    title: 'GA',
    dataIndex: 'ga',
    key: 'ga',
    sorter: (a, b) => sorting(a, b, 'ga'),
    render: (ga, records) => (
      <span nowrap className="column-width-style">
        {ga}
      </span>
    ),
  },
  {
    title: 'WA',
    dataIndex: 'wa',
    key: 'wa',
    sorter: (a, b) => sorting(a, b, 'wa'),
    render: (wa, records) => (
      <span nowrap className="column-width-style">
        {wa}
      </span>
    ),
  },
  {
    title: 'C',
    dataIndex: 'c',
    key: 'c',
    sorter: (a, b) => sorting(a, b, 'c'),
    render: (c, records) => (
      <span nowrap className="column-width-style">
        {c}
      </span>
    ),
  },
  {
    title: 'WD',
    dataIndex: 'wd',
    key: 'wd',
    sorter: (a, b) => sorting(a, b, 'wd'),
    render: (wd, records) => (
      <span nowrap className="column-width-style">
        {wd}
      </span>
    ),
  },
  {
    title: 'GD',
    dataIndex: 'gd',
    key: 'gd',
    sorter: (a, b) => sorting(a, b, 'gd'),
    render: (gd, records) => (
      <span nowrap className="column-width-style">
        {gd}
      </span>
    ),
  },
  {
    title: 'GK',
    dataIndex: 'gk',
    key: 'gk',
    sorter: (a, b) => sorting(a, b, 'gk'),
    render: (gk, records) => (
      <span nowrap className="column-width-style">
        {gk}
      </span>
    ),
  },
  {
    title: AppConstants.played,
    dataIndex: 'played',
    key: 'played',
    sorter: (a, b) => sorting(a, b, 'played'),
    render(played, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{played}</div>,
      };
    },
  },
  {
    title: AppConstants.bench,
    dataIndex: 'bench',
    key: 'bench',
    sorter: (a, b) => sorting(a, b, 'bench'),
    render(bench, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{bench}</div>,
      };
    },
  },
  {
    title: AppConstants.noPlay,
    dataIndex: 'noPlay',
    key: 'noPlay',
    sorter: (a, b) => sorting(a, b, 'noPlay'),
    render(noPlay, record) {
      return {
        props: {
          style: { background: 'rgb(248, 225, 209)' },
        },
        children: <div>{noPlay}</div>,
      };
    },
  },
];

class LiveScorePositionTrackReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      competitionId: null,
      searchText: '',
      reporting: AppConstants.period,
      aggregate: AppConstants.matches,
      offset: 0,
      liveScoreCompIsParent: false,
      compOrgId: 0,
    };
    this_obj = this;
  }

  async componentDidMount() {
    if (getLiveScoreCompetiton()) {
      const { id, organisationId, competitionOrganisation } = JSON.parse(getLiveScoreCompetiton());
      const orgItem = await getOrganisationData();
      const userOrganisationId = orgItem ? orgItem.organisationId : 0;
      let liveScoreCompIsParent = userOrganisationId === organisationId;
      let compOrgId = competitionOrganisation ? competitionOrganisation.id : 0;
      let { pageSize } = this.props.liveScorePositionTrackState;
      pageSize = pageSize ? pageSize : 10;
      const body = {
        paging: {
          limit: pageSize,
          offset: 0,
        },
      };
      this.props.liveScorePositionTrackingAction({
        compId: id,
        aggregate: this.state.aggregate,
        reporting: this.state.reporting,
        pagination: body,
        search: this.state.searchText,
        IsParent: liveScoreCompIsParent,
        compOrgId: compOrgId,
      });

      this.setState({ competitionId: id, liveScoreCompIsParent, compOrgId });
    } else {
      history.push('/matchDayCompetitions');
    }
  }

  // on Export
  onExport = () => {
    const { id, competitionOrganisation } = JSON.parse(getLiveScoreCompetiton());
    let compOrgId = competitionOrganisation ? competitionOrganisation.id : 0;
    let url = '';
    if (this.state.liveScoreCompIsParent) {
      url =
        AppConstants.positionExport +
        `aggregate=${this.state.aggregate}&reporting=${this.state.reporting}&competitionId=${id}`;
    } else {
      url =
        AppConstants.positionExport +
        `aggregate=${this.state.aggregate}&reporting=${this.state.reporting}&competitionId=${id}&competitionOrganisationId=${compOrgId}`;
    }
    this.props.exportFilesAction(url);
  };

  headerView = () => {
    return (
      <div className="comp-player-grades-header-drop-down-view mt-4">
        <div className="row">
          <div className="col-sm d-flex align-content-center">
            <Breadcrumb separator=" > ">
              <Breadcrumb.Item className="breadcrumb-add">
                {AppConstants.positionTrackReport}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="col-sm-8 w-100 d-flex flex-row align-items-center justify-content-end">
            <div className="row">
              <div className="col-sm">
                <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                  <Button
                    className="primary-add-comp-form"
                    type="primary"
                    onClick={() => this.onExport()}
                  >
                    <div className="row">
                      <div className="col-sm">
                        <img src={AppImages.export} alt="" className="export-image" />
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
    );
  };

  handleShowSizeChange = async (page, pageSize) => {
    await this.props.setPageSizeAction(pageSize);
    this.handlePageChange(page);
  };

  /// Handle Page change
  handlePageChange = async page => {
    await this.props.setPageNumberAction(page);
    let { pageSize } = this.props.liveScorePositionTrackState;
    pageSize = pageSize ? pageSize : 10;
    let offset = page ? pageSize * (page - 1) : 0;
    let { sortBy, sortOrder } = this.state;
    const body = {
      paging: {
        limit: pageSize,
        offset,
      },
    };
    this.setState({ offset });
    this.props.liveScorePositionTrackingAction({
      compId: this.state.competitionId,
      aggregate: this.state.aggregate,
      reporting: this.state.reporting,
      pagination: body,
      search: this.state.searchText,
      sortBy,
      sortOrder,
      IsParent: this.state.liveScoreCompIsParent,
      compOrgId: this.state.compOrgId,
    });
  };

  //////// tableView
  tableView = () => {
    const {
      positionTrackResult,
      totalCount,
      onLoad,
      currentPage,
      pageSize,
    } = this.props.liveScorePositionTrackState;
    let positionTrackData = isArrayNotEmpty(positionTrackResult) ? positionTrackResult : [];
    return (
      <div className="comp-dash-table-view mt-4">
        <div className="table-responsive home-dash-table-view">
          <Table
            loading={onLoad}
            className="home-dashboard-table"
            columns={
              this.state.aggregate == 'MATCH' && this.state.reporting === 'PERCENT'
                ? percentColumn
                : this.state.aggregate == 'MATCH'
                ? columns_1
                : this.state.aggregate == 'ALL' && this.state.reporting === 'PERCENT'
                ? percentColumn_1
                : columns_2
            }
            dataSource={positionTrackData}
            pagination={false}
            rowKey={index => 'positionTrackReport' + index}
          />
        </div>
        <div className="d-flex justify-content-end">
          <Pagination
            className="antd-pagination pb-5"
            showSizeChanger
            current={currentPage}
            defaultCurrent={currentPage}
            defaultPageSize={pageSize}
            total={totalCount}
            onChange={this.handlePageChange}
            onShowSizeChange={this.handleShowSizeChange}
          />
        </div>
      </div>
    );
  };

  onChangePeriod(reportId) {
    let { sortBy, sortOrder } = this.state;
    let { pageSize } = this.props.liveScorePositionTrackState;
    pageSize = pageSize ? pageSize : 10;
    const body = {
      paging: {
        limit: pageSize,
        offset: 0,
      },
    };
    this.props.liveScorePositionTrackingAction({
      compId: this.state.competitionId,
      aggregate: this.state.aggregate,
      reporting: reportId,
      pagination: body,
      search: this.state.searchText,
      sortBy,
      sortOrder,
      IsParent: this.state.liveScoreCompIsParent,
      compOrgId: this.state.compOrgId,
    });
    this.setState({ reporting: reportId });
  }

  onChangeGame(aggregateId) {
    let { sortBy, sortOrder } = this.state;
    let { pageSize } = this.props.liveScorePositionTrackState;
    pageSize = pageSize ? pageSize : 10;
    const body = {
      paging: {
        limit: pageSize,
        offset: 0,
      },
    };
    this.props.liveScorePositionTrackingAction({
      compId: this.state.competitionId,
      aggregate: aggregateId,
      reporting: this.state.reporting,
      pagination: body,
      search: this.state.searchText,
      sortBy,
      sortOrder,
      IsParent: this.state.liveScoreCompIsParent,
      compOrgId: this.state.compOrgId,
    });
    this.setState({ aggregate: aggregateId });
  }

  // on change search text
  onChangeSearchText = e => {
    let { sortBy, sortOrder } = this.state;
    this.setState({ searchText: e.target.value, offset: 0 });
    let { pageSize } = this.props.liveScorePositionTrackState;
    pageSize = pageSize ? pageSize : 10;
    if (e.target.value == null || e.target.value == '') {
      const body = {
        paging: {
          limit: pageSize,
          offset: 0,
        },
      };
      this.props.liveScorePositionTrackingAction({
        compId: this.state.competitionId,
        aggregate: this.state.aggregate,
        reporting: this.state.reporting,
        pagination: body,
        search: e.target.value,
        sortBy,
        sortOrder,
        IsParent: this.state.liveScoreCompIsParent,
        compOrgId: this.state.compOrgId,
      });
    }
  };

  // search key
  onKeyEnterSearchText = e => {
    this.setState({ offset: 0 });
    let { sortBy, sortOrder } = this.state;
    var code = e.keyCode || e.which;
    let { pageSize } = this.props.liveScorePositionTrackState;
    pageSize = pageSize ? pageSize : 10;
    if (code === 13) {
      // 13 is the enter keycode
      const body = {
        paging: {
          limit: pageSize,
          offset: 0,
        },
      };
      this.props.liveScorePositionTrackingAction({
        compId: this.state.competitionId,
        aggregate: this.state.aggregate,
        reporting: this.state.reporting,
        pagination: body,
        search: this.state.searchText,
        sortBy,
        sortOrder,
        IsParent: this.state.liveScoreCompIsParent,
        compOrgId: this.state.compOrgId,
      });
    }
  };

  // on click of search icon
  onClickSearchIcon = () => {
    this.setState({ offset: 0 });
    let { sortBy, sortOrder } = this.state;
    let { pageSize } = this.props.liveScorePositionTrackState;
    pageSize = pageSize ? pageSize : 10;
    if (this.state.searchText == null || this.state.searchText == '') {
    } else {
      const body = {
        paging: {
          limit: pageSize,
          offset: 0,
        },
      };
      this.props.liveScorePositionTrackingAction({
        compId: this.state.competitionId,
        aggregate: this.state.aggregate,
        reporting: this.state.reporting,
        pagination: body,
        search: this.state.searchText,
        sortBy,
        sortOrder,
        IsParent: this.state.liveScoreCompIsParent,
        compOrgId: this.state.compOrgId,
      });
    }
  };

  dropdownView = () => {
    return (
      <div className="comp-player-grades-header-drop-down-view">
        <div className="row">
          <div className="col-sm">
            <div className="reg-filter-col-cont pb-3">
              <span className="year-select-heading">{AppConstants.periodFilter}:</span>
              <Select
                className="year-select reg-filter-select1 ml-2"
                style={{ minWidth: 160 }}
                onChange={reportId => this.onChangePeriod(reportId)}
                value={this.state.reporting}
              >
                <Option value="PERIOD">Period</Option>
                <Option value="PERCENT">%</Option>
                <Option value="MINUTE">Minutes</Option>
              </Select>
            </div>
          </div>
          <div className="col-sm">
            <div className="reg-filter-col-cont pb-3">
              <span className="year-select-heading">{AppConstants.byGame}:</span>
              <Select
                className="year-select reg-filter-select1 ml-2"
                style={{ minWidth: 160 }}
                onChange={aggregateId => this.onChangeGame(aggregateId)}
                value={this.state.aggregate}
              >
                <Option value="MATCH">By Game</Option>
                <Option value="ALL">All Games</Option>
              </Select>
            </div>
          </div>

          <div className="col-sm d-flex justify-content-end align-items-center">
            <div className="comp-product-search-inp-width pb-3">
              <Input
                className="product-reg-search-input"
                onChange={this.onChangeSearchText}
                placeholder="Search..."
                onKeyPress={this.onKeyEnterSearchText}
                prefix={
                  <SearchOutlined
                    style={{ color: 'rgba(0,0,0,.25)', height: 16, width: 16 }}
                    onClick={this.onClickSearchIcon}
                  />
                }
                allowClear
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout menuHeading={AppConstants.matchDay} menuName={AppConstants.liveScores} />

        <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey={'24'} />
        <Layout>
          {this.headerView()}
          {this.dropdownView()}
          <Content>{this.tableView()}</Content>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      liveScorePositionTrackingAction,
      exportFilesAction,
      setPageSizeAction,
      setPageNumberAction,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    liveScorePositionTrackState: state.LiveScorePositionTrackState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScorePositionTrackReport);
