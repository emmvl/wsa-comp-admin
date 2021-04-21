import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import {
  Layout,
  Button,
  Table,
  Breadcrumb,
  Pagination,
  Input,
  message,
  Menu,
  Modal,
  DatePicker,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { checkLivScoreCompIsParent } from 'util/permissions';
import InputWithHead from 'customComponents/InputWithHead';
import moment from 'moment';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import AppImages from '../../themes/appImages';
import {
  liveScoreIncidentList,
  createPlayerSuspensionAction,
  updatePlayerSuspensionAction,
  setPageSizeAction,
  setPageNumberAction,
} from '../../store/actions/LiveScoreAction/liveScoreIncidentAction';
import { liveScore_MatchFormate, liveScore_formateDate } from '../../themes/dateformate';
import history from '../../util/history';
import { getLiveScoreCompetiton, getUmpireCompetitionData } from '../../util/sessionStorage';
import { isArrayNotEmpty } from '../../util/helpers';
import ValidationConstants from '../../themes/validationConstant';

import { exportFilesAction } from '../../store/actions/appAction';

const { Content } = Layout;
const { SubMenu } = Menu;

let this_Obj = null;

const listeners = key => ({
  onClick: () => tableSort(key),
});

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
  const { id } = JSON.parse(getLiveScoreCompetiton());
  const { searchText, offset } = this_Obj.state;
  let { liveScoreIncidentPageSize } = this_Obj.props.liveScoreIncidentState;
  liveScoreIncidentPageSize = liveScoreIncidentPageSize || 10;
  this_Obj.props.liveScoreIncidentList(
    id,
    searchText,
    liveScoreIncidentPageSize,
    offset,
    sortBy,
    sortOrder,
    this_Obj.state.liveScoreCompIsParent,
    this_Obj.state.compOrgId,
  );
}

const columns = [
  {
    title: AppConstants.date,
    dataIndex: 'incidentTime',
    key: 'incidentTime',
    sorter: true,
    onHeaderCell: () => listeners('date'),
    render: (incidentTime, record) => (
      <NavLink
        to={{
          pathname: '/matchDayIncidentView',
          state: {
            item: record,
            screenName: 'incident',
            umpireKey: this_Obj.props.liveScoreIncidentState.umpireKey,
          },
        }}
      >
        <span className="input-heading-add-another pt-0">
          {liveScore_MatchFormate(incidentTime)}
        </span>
      </NavLink>
    ),
  },
  {
    title: AppConstants.tableMatchID,
    dataIndex: 'matchId',
    key: 'matchId',
    sorter: true,
    onHeaderCell: () => listeners('matchId'),
    render: matchId => (
      <NavLink
        to={{
          pathname: '/matchDayMatchDetails',
          state: {
            matchId,
            screenName: 'incident',
            umpireKey: this_Obj.props.liveScoreIncidentState.umpireKey,
          },
        }}
      >
        <span className="input-heading-add-another pt-0">{matchId}</span>
      </NavLink>
    ),
  },
  {
    title: AppConstants.playerId,
    key: 'player id',
    render: row => {
      const { incidentPlayers, foulUserId, foulUser } = row;
      const isFoul = !!foulUserId;
      const isIncident = incidentPlayers.length;

      if (isFoul) {
        return (
          <span
            onClick={() => this_Obj.checkUserId(foulUser)}
            key={foulUserId}
            style={{ color: '#ff8237', cursor: 'pointer' }}
            className="desc-text-style side-bar-profile-data"
          >
            {foulUserId}
          </span>
        );
      }

      if (isIncident) {
        return (
          isArrayNotEmpty(incidentPlayers) &&
          incidentPlayers.map((item, index) => (
            <span
              onClick={() => this_Obj.checkUserId(item.player)}
              key={`playerId${index}${item.playerId}`}
              style={{ color: '#ff8237', cursor: 'pointer' }}
              className="desc-text-style side-bar-profile-data"
            >
              {item.playerId}
            </span>
          ))
        );
      }
    },
  },
  {
    title: AppConstants.firstName,
    key: 'Incident Players First Name',
    sorter: true,
    onHeaderCell: () => listeners('firstName'),
    render: row => {
      const { incidentPlayers, foulUserId, foulUser } = row;
      const isFoul = !!foulUserId;
      const isIncident = incidentPlayers.length;

      if (isFoul) {
        return (
          <span
            onClick={() => this_Obj.checkUserId(foulUser)}
            key={`playerFirstName${foulUserId}`}
            style={{ color: '#ff8237', cursor: 'pointer' }}
            className="desc-text-style side-bar-profile-data"
          >
            {foulUser.firstName}
          </span>
        );
      }

      if (isIncident) {
        return (
          isArrayNotEmpty(incidentPlayers) &&
          incidentPlayers.map((item, index) => (
            <span
              onClick={() => this_Obj.checkUserId(item.player)}
              key={`playerFirstName${index}${item.playerId}`}
              style={{ color: '#ff8237', cursor: 'pointer' }}
              className="desc-text-style side-bar-profile-data"
            >
              {item.player.firstName}
            </span>
          ))
        );
      }
    },
  },
  {
    title: AppConstants.lastName,
    key: 'Incident Players Last Name',
    sorter: true,
    onHeaderCell: () => listeners('lastName'),
    render: row => {
      const { incidentPlayers, foulUserId, foulUser } = row;
      const isFoul = !!foulUserId;
      const isIncident = incidentPlayers.length;

      if (isFoul) {
        return (
          <span
            onClick={() => this_Obj.checkUserId(foulUser)}
            key={`playerLastName${foulUserId}`}
            style={{ color: '#ff8237', cursor: 'pointer' }}
            className="desc-text-style side-bar-profile-data"
          >
            {foulUser.lastName}
          </span>
        );
      }

      if (isIncident) {
        return (
          isArrayNotEmpty(incidentPlayers) &&
          incidentPlayers.map((item, index) => (
            <span
              onClick={() => this_Obj.checkUserId(item.player)}
              key={`playerLastName${index}${item.playerId}`}
              style={{ color: '#ff8237', cursor: 'pointer' }}
              className="desc-text-style side-bar-profile-data"
            >
              {item.player.lastName}
            </span>
          ))
        );
      }
    },
  },
  {
    title: AppConstants.type,
    dataIndex: 'incidentType',
    key: 'incidentType',
    render: incidentType => <span>{incidentType.name}</span>,
    sorter: true,
    onHeaderCell: () => listeners('type'),
  },
  {
    title: AppConstants.status,
    dataIndex: 'suspension',
    key: 'suspension',
    render: suspension => (
      <span>
        {suspension ? `Suspended till ${liveScore_formateDate(suspension.suspendedTo)}` : ''}
      </span>
    ),
  },
  {
    title: AppConstants.action,
    render: row => (
      <Menu
        className="action-triple-dot-submenu"
        theme="light"
        mode="horizontal"
        style={{ lineHeight: '25px' }}
      >
        <SubMenu
          key="sub1"
          title={
            <img
              className="dot-image"
              src={AppImages.moreTripleDot}
              width="16"
              height="16"
              alt=""
            />
          }
        >
          <Menu.Item key="1" onClick={() => this_Obj.openSuspensionDialog(row)}>
            <span>Suspension</span>
          </Menu.Item>
        </SubMenu>
      </Menu>
    ),
  },
];

const defaultSuspendedDate = {
  from: null,
  to: null,
};

class LiveScoreIncidentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      offset: 0,
      limit: 10,
      sortBy: null,
      sortOrder: null,
      screenName: get(props, 'location.state.screenName', null),
      competitionId: null,
      compOrgId: null,
      liveScoreCompIsParent: false,
      isSuspensionModelShow: false,
      activeIncident: null,
      suspendedDates: { ...defaultSuspendedDate },
    };
    this_Obj = this;
  }

  componentDidMount() {
    const { incidentListActionObject, umpireKey } = this.props.liveScoreIncidentState;
    let { sortBy } = this.state;
    let { sortOrder } = this.state;

    if (umpireKey) {
      if (getUmpireCompetitionData()) {
        checkLivScoreCompIsParent().then(value => {
          const { id, competitionOrganisation } = JSON.parse(getUmpireCompetitionData());
          const compOrgId = competitionOrganisation ? competitionOrganisation.id : 0;
          this.setState({ compOrgId, liveScoreCompIsParent: value });
          let { liveScoreIncidentPageSize } = this.props.liveScoreIncidentState;
          liveScoreIncidentPageSize = liveScoreIncidentPageSize || 10;
          if (incidentListActionObject) {
            const { offset } = incidentListActionObject;
            const searchText = incidentListActionObject.search;
            sortBy = incidentListActionObject.sortBy;
            sortOrder = incidentListActionObject.sortOrder;
            this.setState({
              sortBy,
              sortOrder,
              offset,
              searchText,
            });
            this.props.liveScoreIncidentList(
              id,
              searchText,
              liveScoreIncidentPageSize,
              offset,
              sortBy,
              sortOrder,
              value,
              compOrgId,
            );
          } else {
            const { searchText, offset, sortBy, sortOrder } = this.state;
            this.props.liveScoreIncidentList(
              id,
              searchText,
              liveScoreIncidentPageSize,
              offset,
              sortBy,
              sortOrder,
              value,
              compOrgId,
            );
          }
        });
      } else {
        history.push('/umpireDashboard');
      }
    } else if (getLiveScoreCompetiton()) {
      checkLivScoreCompIsParent().then(value => {
        const { id, competitionOrganisation } = JSON.parse(getLiveScoreCompetiton());
        const compOrgId = competitionOrganisation ? competitionOrganisation.id : 0;
        const { liveScoreIncidentPageSize = 10 } = this.props.liveScoreIncidentState;

        this.setState({ competitionId: id, liveScoreCompIsParent: value, compOrgId });

        if (incidentListActionObject) {
          const { offset } = incidentListActionObject;
          const searchText = incidentListActionObject.search;
          sortBy = incidentListActionObject.sortBy;
          sortOrder = incidentListActionObject.sortOrder;
          this.setState({
            sortBy,
            sortOrder,
            offset,
            searchText,
          });
          this.props.liveScoreIncidentList(
            id,
            searchText,
            liveScoreIncidentPageSize,
            offset,
            sortBy,
            sortOrder,
            value,
            compOrgId,
          );
        } else {
          const { searchText, offset, sortBy, sortOrder } = this.state;
          this.props.liveScoreIncidentList(
            id,
            searchText,
            liveScoreIncidentPageSize,
            offset,
            sortBy,
            sortOrder,
            value,
            compOrgId,
          );
        }
      });
    } else {
      history.push('/matchDayCompetitions');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.clearActiveIncident(prevState);
  }

  clearActiveIncident = prevState => {
    const { isSuspensionModelShow } = this.state;
    const isPropChanged = prevState.isSuspensionModelShow !== isSuspensionModelShow;

    if (isPropChanged && !isSuspensionModelShow) {
      this.setState({
        activeIncident: null,
        suspendedDates: { ...defaultSuspendedDate },
      });
    }
  };

  onExport = () => {
    let url = null;
    if (this.state.liveScoreCompIsParent) {
      url = `${AppConstants.incidentExport + this.state.competitionId}&entityTypeId=1&search=`;
    } else {
      url = `${AppConstants.incidentExport + this.state.compOrgId}&entityTypeId=6&search=`;
    }
    this.props.exportFilesAction(url);
  };

  checkUserId = record => {
    if (record.userId == null) {
      message.config({ duration: 1.5, maxCount: 1 });
      message.warn(ValidationConstants.playerMessage);
    } else {
      history.push('/userPersonal', {
        userId: record.userId,
        screenKey: 'livescore',
        screen: '/matchDayIncidentList',
      });
    }
  };

  // on change search text
  onChangeSearchText = e => {
    const { umpireKey, liveScoreIncidentPageSize = 10 } = this.props.liveScoreIncidentState;
    const { sortBy, sortOrder } = this.state;

    let compId = null;
    if (umpireKey) {
      const { id } = JSON.parse(getUmpireCompetitionData());
      compId = id;
    } else {
      const { id } = JSON.parse(getLiveScoreCompetiton());
      compId = id;
    }

    this.setState({ searchText: e.target.value, offset: 0 });
    if (e.target.value === null || e.target.value === '') {
      this.props.liveScoreIncidentList(
        compId,
        e.target.value,
        liveScoreIncidentPageSize,
        0,
        sortBy,
        sortOrder,
        this.state.liveScoreCompIsParent,
        this.state.compOrgId,
      );
    }
  };

  // search key
  onKeyEnterSearchText = e => {
    const { umpireKey } = this.props.liveScoreIncidentState;
    let compId = null;
    if (umpireKey) {
      const { id } = JSON.parse(getUmpireCompetitionData());
      compId = id;
    } else {
      const { id } = JSON.parse(getLiveScoreCompetiton());
      compId = id;
    }

    this.setState({ offset: 0 });
    const code = e.keyCode || e.which;
    const { sortBy, sortOrder } = this.state;
    let { liveScoreIncidentPageSize } = this.props.liveScoreIncidentState;
    liveScoreIncidentPageSize = liveScoreIncidentPageSize || 10;
    if (code === 13) {
      // 13 is the enter keycode
      this.props.liveScoreIncidentList(
        compId,
        e.target.value,
        liveScoreIncidentPageSize,
        0,
        sortBy,
        sortOrder,
        this.state.liveScoreCompIsParent,
        this.state.compOrgId,
      );
    }
  };

  // on click of search icon
  onClickSearchIcon = () => {
    this.setState({ offset: 0 });
    const { umpireKey, liveScoreIncidentPageSize = 10 } = this.props.liveScoreIncidentState;
    let compId = null;
    if (umpireKey) {
      const { id } = JSON.parse(getUmpireCompetitionData());
      compId = id;
    } else {
      const { id } = JSON.parse(getLiveScoreCompetiton());
      compId = id;
    }

    const { searchText, sortBy, sortOrder } = this.state;

    if (searchText) {
      this.props.liveScoreIncidentList(
        compId,
        searchText,
        liveScoreIncidentPageSize,
        0,
        sortBy,
        sortOrder,
        this.state.liveScoreCompIsParent,
        this.state.compOrgId,
      );
    }
  };

  handleShowSizeChange = async (page, pageSize) => {
    await this.props.setPageSizeAction(pageSize);
    this.handleTableChange(page);
  };

  handleTableChange = async page => {
    await this.props.setPageNumberAction(page);
    let { liveScoreIncidentPageSize } = this.props.liveScoreIncidentState;
    liveScoreIncidentPageSize = liveScoreIncidentPageSize || 10;
    const offset = page ? liveScoreIncidentPageSize * (page - 1) : 0;
    const { searchText, sortBy, sortOrder } = this.state;
    this.setState({ offset });
    const { umpireKey } = this.props.liveScoreIncidentState;
    let compId = null;
    if (umpireKey) {
      const { id } = JSON.parse(getUmpireCompetitionData());
      compId = id;
    } else {
      const { id } = JSON.parse(getLiveScoreCompetiton());
      compId = id;
    }
    this.props.liveScoreIncidentList(
      compId,
      searchText,
      liveScoreIncidentPageSize,
      offset,
      sortBy,
      sortOrder,
      this.state.liveScoreCompIsParent,
      this.state.compOrgId,
    );
  };

  headerView = () => (
    <div className="comp-player-grades-header-drop-down-view mt-4">
      <div className="row">
        <div className="col-sm d-flex align-content-center">
          <Breadcrumb separator=" > ">
            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.incidents}</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="col-sm-8 d-flex justify-content-end w-100 flex-row align-items-center">
          <div className="row">
            {/* <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                    <NavLink to="/matchDayAddIncident">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addIncident}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div> */}
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
            <div className="col-sm">
              <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                <NavLink to="/matchDayIncidentImport">
                  <Button className="primary-add-comp-form" type="primary">
                    <div className="row">
                      <div className="col-sm">
                        <img src={AppImages.import} alt="" className="export-image" />
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
      {/* search box */}
      <div className="col-sm pt-4 ml-3 d-flex justify-content-end">
        <div className="comp-product-search-inp-width">
          <Input
            className="product-reg-search-input"
            onChange={this.onChangeSearchText}
            placeholder="Search..."
            onKeyPress={this.onKeyEnterSearchText}
            value={this.state.searchText}
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
  );

  /// /////tableView view for Umpire list
  tableView = () => {
    const {
      onLoad,
      liveScoreIncidentResult,
      liveScoreIncidentTotalCount,
      liveScoreIncidentCurrentPage,
      liveScoreIncidentPageSize,
    } = this.props.liveScoreIncidentState;

    return (
      <div className="comp-dash-table-view mt-4">
        <div className="table-responsive home-dash-table-view">
          <Table
            loading={onLoad === true}
            className="home-dashboard-table"
            columns={columns}
            dataSource={liveScoreIncidentResult}
            pagination={false}
            rowKey={record => `incident${record.id}`}
          />
        </div>
        <div className="comp-dashboard-botton-view-mobile">
          <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end" />
          <div className="d-flex justify-content-end">
            <Pagination
              className="antd-pagination"
              showSizeChanger
              current={liveScoreIncidentCurrentPage}
              defaultCurrent={liveScoreIncidentCurrentPage}
              defaultPageSize={liveScoreIncidentPageSize}
              total={liveScoreIncidentTotalCount}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleShowSizeChange}
            />
          </div>
        </div>
      </div>
    );
  };

  suspensionModalView = () => (
    <Modal
      title={AppConstants.suspendedQuestion}
      visible={!!this.state.isSuspensionModelShow}
      onCancel={this.toggleSuspensionDialog}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
      centered
      footer={null}
    >
      <div className="row">
        <div className="col-sm-6">
          <InputWithHead required="pt-0" heading={AppConstants.dateFrom} />
          <DatePicker
            className="reg-payment-datepicker w-100"
            size="default"
            style={{ minWidth: 160 }}
            format="DD-MM-YYYY"
            showTime={false}
            placeholder="dd-mm-yyyy"
            onChange={val => this.handleSuspendedDateChange(val, 'from')}
            value={this.getSuspendedDate('from')}
          />
        </div>

        <div className="col-sm-6">
          <InputWithHead required="pt-0" heading={AppConstants.dateTo} />
          <DatePicker
            className="reg-payment-datepicker w-100"
            size="default"
            style={{ minWidth: 160 }}
            format="DD-MM-YYYY"
            showTime={false}
            placeholder="dd-mm-yyyy"
            onChange={val => this.handleSuspendedDateChange(val, 'to')}
            value={this.getSuspendedDate('to')}
          />
        </div>
      </div>

      <div
        className="comp-dashboard-botton-view-mobile d-flex justify-content-between"
        style={{ paddingTop: 24 }}
      >
        <Button onClick={this.toggleSuspensionDialog} type="cancel-button">
          {AppConstants.cancel}
        </Button>
        <Button onClick={this.submitSuspensionDialog} type="primary">
          {AppConstants.confirm}
        </Button>
      </div>
    </Modal>
  );

  submitSuspensionDialog = () => {
    const { from, to } = this.state.suspendedDates;
    const { incidentPlayers, id: incidentId, suspension } = this.state.activeIncident;
    const player = incidentPlayers[0];

    const dataToAction = {
      incidentId,
      body: {
        incidentId,
        playerId: player.playerId,
        suspendedFrom: moment(from, 'DD/MM/YYYY'),
        suspendedTo: moment(to, 'DD/MM/YYYY'),
        suspensionTypeRefId: 1,
      },
    };

    if (suspension) {
      this.props.updatePlayerSuspensionAction(suspension.id, dataToAction);
    } else {
      this.props.createPlayerSuspensionAction(dataToAction);
    }
    this.toggleSuspensionDialog();
  };

  handleSuspendedDateChange = (value, dateKey) => {
    const dateValue = value ? liveScore_formateDate(value) : value;

    this.setState(state => ({
      suspendedDates: {
        ...state.suspendedDates,
        [dateKey]: dateValue,
      },
    }));
  };

  getSuspendedDate = dateKey => {
    const dateString = this.state.suspendedDates[dateKey];

    if (dateString) {
      return moment(dateString, 'DD/MM/YYYY');
    }

    return null;
  };

  openSuspensionDialog = activeRow => {
    const { suspendedFrom, suspendedTo } = activeRow.suspension || {};
    const isDatesCorrect = suspendedFrom && suspendedTo;
    const dataToUpdate = {
      activeIncident: activeRow,
    };

    if (isDatesCorrect) {
      dataToUpdate.suspendedDates = {
        from: liveScore_formateDate(suspendedFrom),
        to: liveScore_formateDate(suspendedTo),
      };
    }

    this.setState(dataToUpdate);
    this.toggleSuspensionDialog();
  };

  toggleSuspensionDialog = () => {
    this.setState(state => ({
      isSuspensionModelShow: !state.isSuspensionModelShow,
    }));
  };

  render() {
    const { liveScoreIncidentState, location } = this.props;
    const { umpireKey } = liveScoreIncidentState;
    const screen = get(location, 'state.screenName', null);

    return (
      <div className="fluid-width default-bg">
        {umpireKey ? (
          <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
        ) : (
          <DashboardLayout
            menuHeading={AppConstants.matchDay}
            menuName={AppConstants.liveScores}
            onMenuHeadingClick={() => history.push('./matchDayCompetitions')}
          />
        )}

        {umpireKey ? (
          <InnerHorizontalMenu
            menu="umpire"
            umpireSelectedKey={screen == 'umpireList' ? '2' : '1'}
          />
        ) : (
          <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="17" />
        )}

        <Layout>
          {this.headerView()}
          <Content>
            {this.tableView()}
            {this.suspensionModalView()}
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      liveScoreIncidentList,
      exportFilesAction,
      createPlayerSuspensionAction,
      updatePlayerSuspensionAction,
      setPageSizeAction,
      setPageNumberAction,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    liveScoreIncidentState: state.LiveScoreIncidentState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreIncidentList);
