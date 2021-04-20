import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Input,
  Layout,
  Button,
  Table,
  Select,
  Menu,
  Pagination,
  message,
  Form,
  Modal,
  Spin,
} from 'antd';
import Icon from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { getRefBadgeData } from '../../store/actions/appAction';

import AppConstants from 'themes/appConstants';
import AppImages from 'themes/appImages';
import ValidationConstants from 'themes/validationConstant';
// import { entityTypes } from "util/entityTypes";
import { isArrayNotEmpty } from 'util/helpers';
import history from 'util/history';
import {
  getUmpireCompetitionId,
  setUmpireCompetitionId,
  setUmpireCompetitionData,
  getOrganisationData,
  getUmpireCompetitionData,
} from 'util/sessionStorage';
import { userExportFilesAction } from 'store/actions/appAction';
import {
  umpireMainListAction,
  setUmpireListPageSizeAction,
  setUmpireListPageNumberAction,
  getUmpireList,
  getRankedUmpiresCount,
  updateUmpireRank,
} from 'store/actions/umpireAction/umpireAction';
import { umpireCompetitionListAction } from 'store/actions/umpireAction/umpireCompetetionAction';
import InnerHorizontalMenu from 'pages/innerHorizontalMenu';
import DashboardLayout from 'pages/dashboardLayout';
import { isEqual } from 'lodash';

import './umpire.css';

const { Content } = Layout;
const { Option } = Select;

let this_obj = null;

const listeners = key => ({
  onClick: () => tableSort(key),
});

function checkUserRoll(rolesArr, index) {
  let isClub = 'NO';
  if (isArrayNotEmpty(rolesArr)) {
    for (let i in rolesArr) {
      let roleId = rolesArr[i].roleId;
      if (roleId === 20) {
        isClub = 'YES';
      }
    }
  }
  return isClub;
}

function checkUmpireUserRoll(rolesArr, key) {
  let isUmpire = 'NO';
  if (isArrayNotEmpty(rolesArr)) {
    for (let i in rolesArr) {
      if (rolesArr[i].roleId === key) {
        isUmpire = 'YES';
      }
    }
  }
  return isUmpire;
}

function tableSort(key) {
  let sortBy = key;
  let sortOrder = null;
  const { organisationId } = getOrganisationData() || {};
  if (this_obj.state.sortBy !== key) {
    sortOrder = 'ASC';
  } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'ASC') {
    sortOrder = 'DESC';
  } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'DESC') {
    sortBy = sortOrder = null;
  }

  this_obj.setState({ sortBy, sortOrder });
  if (organisationId && this_obj.state.selectedComp)
    this_obj.props.getUmpireList({
      organisationId,
      competitionId: this_obj.state.selectedComp,
      offset: this_obj.state.offsetData,
      sortBy,
      sortOrder,
    });
}

class Umpire extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      selectedComp: null,
      loading: false,
      competitionUniqueKey: null,
      compArray: [],
      offsetData: 0,
      sortBy: null,
      sortOrder: null,
      isCompParent: false,
      compOrganisationId: 0,
      visible: false,
      umpireRank: null,
      umpireId: null,
      columns: [
        {
          title: 'Rank',
          dataIndex: 'rank',
          key: 'rank',
          sorter: true,
          onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
          render: (rank, record) => {
            const { rankedUmpiresCount } = this.props.umpireState;

            const { organisationId } = getOrganisationData() || {};

            const competitionOrganisationId = JSON.parse(
              localStorage.getItem('umpireCompetitionData'),
            )?.organisationId;

            return (
              <Form>
                {organisationId === competitionOrganisationId ? (
                  <Select
                    onChange={(i, option) => this.handleSelectChange(i, option, record.id)}
                    value={record.rank ? record.rank : ''}
                  >
                    {Array.apply(null, { length: rankedUmpiresCount + 1 }).map((rank, i, arr) => {
                      return (
                        <Option
                          style={i === arr.length - 1 ? { backgroundColor: 'lightgreen' } : {}}
                          key={i}
                        >
                          {i + 1}
                        </Option>
                      );
                    })}
                  </Select>
                ) : (
                  <div>{record.rank ? record.rank : ''}</div>
                )}
              </Form>
            );
          },
        },
        {
          title: AppConstants.firstName,
          dataIndex: 'firstName',
          key: 'firstsName',
          sorter: true,
          onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
          render: (firstName, record) => (
            <NavLink
              to={{
                pathname: '/userPersonal',
                state: {
                  userId: record.id,
                  screenKey: 'umpire',
                  screen: '/umpire',
                },
              }}
            >
              <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
          ),
        },
        {
          title: AppConstants.lastName,
          dataIndex: 'lastName',
          key: 'lastName',
          sorter: true,
          onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
          render: (lastName, record) => (
            <NavLink
              to={{
                pathname: '/userPersonal',
                state: {
                  userId: record.id,
                  screenKey: 'umpire',
                  screen: '/umpire',
                },
              }}
            >
              <span className="input-heading-add-another pt-0">{lastName}</span>
            </NavLink>
          ),
        },
        {
          title: AppConstants.email,
          dataIndex: 'email',
          key: 'email',
          sorter: true,
          onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        },
        {
          title: AppConstants.contact_No,
          dataIndex: 'mobileNumber',
          key: 'mobileNumber',
          sorter: true,
          onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        },
        {
          title: AppConstants.accreditation,
          dataIndex: 'accreditationLevelUmpireRefId',
          key: 'accreditationLevelUmpireRefId',
          sorter: false,
          render: (accreditationLevelUmpireRefId, record) => (
            <span>{this_obj.checkAccreditationLevel(accreditationLevelUmpireRefId)}</span>
          ),
        },
        {
          title: AppConstants.organisation,
          dataIndex: 'organisationName',
          key: 'organisationName',
          sorter: false,
          onHeaderCell: () => {},
          render: organisation => <span className="multi-column-text-aligned">{organisation}</span>,
        },
        {
          title: AppConstants.umpire,
          dataIndex: 'umpire',
          key: 'umpire',
          sorter: false,
          onHeaderCell: () => {},
          render: (umpireCoach, record) => (
            <span>{checkUmpireUserRoll(record.userRoleEntities, 15)}</span>
          ),
        },
        {
          title: 'Umpire Coach',
          dataIndex: 'umpireCoach',
          key: 'umpireCoach',
          sorter: false,
          onHeaderCell: () => {},
          render: (umpireCoach, record, index) => (
            <span>{checkUserRoll(record.userRoleEntities, index)}</span>
          ),
        },
        {
          title: AppConstants.action,
          dataIndex: 'action',
          key: 'action',
          render: (data, record) => (
            <Menu
              className="action-triple-dot-submenu"
              theme="light"
              mode="horizontal"
              style={{ lineHeight: '25px' }}
            >
              <Menu.SubMenu
                key="sub1"
                style={{ borderBottomStyle: 'solid', borderBottom: 0 }}
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
                <Menu.Item key="1">
                  <NavLink
                    to={{
                      pathname: '/addUmpire',
                      state: { isEdit: true, tableRecord: record },
                    }}
                  >
                    <span>Edit</span>
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="2">
                  <NavLink
                    to={{
                      pathname: './assignUmpire',
                      state: { record },
                    }}
                  >
                    <span>Assign to match</span>
                  </NavLink>
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          ),
        },
      ],
    };

    this_obj = this;
  }

  handleSelectChange = (i, option, id) => {
    const { rankedUmpiresCount } = this.props.umpireState;
    const { organisationId } = getOrganisationData() || {};
    const competitionId = getUmpireCompetitionId();
    if (competitionId && organisationId && option.children === rankedUmpiresCount + 1) {
      this.props.updateUmpireRank({
        competitionId,
        umpireRank: option.children,
        organisationId,
        umpireId: id,
        offset: this.state.offsetData,
        sortBy: this.state.sortBy,
        sortOrder: this.state.sortOrder,
      });
    } else {
      this.setState({
        visible: true,
        umpireRank: option.children,
        umpireId: id,
      });
    }
  };

  switchShiftHandler = updateRankType => {
    const { organisationId } = getOrganisationData() || {};
    const { umpireRank, umpireId } = this.state;
    const competitionId = getUmpireCompetitionId();
    if (competitionId)
      this.props.updateUmpireRank({
        competitionId,
        umpireRank,
        organisationId,
        umpireId,
        updateRankType,
        offset: this.state.offsetData,
        sortOrder: this.state.sortOrder,
        sortBy: this.state.sortBy,
      });
    this.setState({ visible: false });
  };

  ModalView() {
    return (
      <Modal
        visible={this.state.visible}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        centered
        closable
        footer={false}
        onCancel={() => this.setState({ visible: false })}
        style={{ maxWidth: 400 }}
      >
        <div className="umpire-modal">
          <span className="umpire-modal-text">Would you like to</span>
          <div className="umpire-modal-button-group">
            <Button
              className="primary-add-comp-form umpire-modal-button"
              type="primary"
              onClick={() => this.switchShiftHandler('replace')}
            >
              Switch ratings
            </Button>
            <Button
              className="primary-add-comp-form umpire-modal-button"
              type="primary"
              onClick={() => this.switchShiftHandler('shift')}
            >
              Shift ratings
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  async componentDidMount() {
    const { umpireListActionObject } = this.props.umpireState;
    let sortBy = this.state.sortBy;
    let sortOrder = this.state.sortOrder;
    if (umpireListActionObject) {
      let offsetData = umpireListActionObject.offset;
      let searchText = umpireListActionObject.userName ? umpireListActionObject.userName : '';
      sortBy = umpireListActionObject.sortBy;
      sortOrder = umpireListActionObject.sortOrder;
      await this.setState({ sortBy, sortOrder, offsetData, searchText });
    }

    let { organisationId } = getOrganisationData() || {};
    this.setState({ loading: true });
    if (organisationId) this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS');
    this.props.getRefBadgeData(this.props.appstate.accreditation);
    const competitionId = getUmpireCompetitionId();
    if (!!competitionId) {
      this.props.getRankedUmpiresCount({ competitionId });
    }
  }

  async componentDidUpdate(prevProps) {
    // const { sortBy, sortOrder } = this.state;
    if (!isEqual(prevProps.umpireCompetitionState, this.props.umpireCompetitionState)) {
      if (this.state.loading === true && this.props.umpireCompetitionState.onLoad === false) {
        let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList)
          ? this.props.umpireCompetitionState.umpireComptitionList
          : [];
        let firstComp = compList && compList.length > 0 ? compList[0]?.id : null;
        let compData = compList && compList.length > 0 ? compList[0] : null;

        const compId = getUmpireCompetitionId();
        const storedCompData = getUmpireCompetitionData()
          ? JSON.parse(getUmpireCompetitionData())
          : null;
        if (compId) {
          let index =
            compList && Array.isArray(compList) ? compList.findIndex(x => x.id === compId) : -1;
          if (
            index > -1 &&
            compList &&
            !!compList.length &&
            compList[index] &&
            compList[index].id
          ) {
            firstComp = compList[index].id;
            compData = compList[index];
          }
        }

        if (firstComp) setUmpireCompetitionId(firstComp);
        if (!isEqual(compData, storedCompData)) setUmpireCompetitionData(JSON.stringify(compData));

        let compKey = compList.length > 0 && compList[0].competitionUniqueKey;
        let orgItem = getOrganisationData();
        let userOrganisationId = orgItem ? orgItem?.organisationId : null;
        let compOrgId = compData ? compData.organisationId : null;
        let compOrganisationId = compData
          ? compData.competitionOrganisation
            ? compData.competitionOrganisation.id
            : null
          : null;
        let isCompParent = userOrganisationId === compOrgId;
        this.setState({ isCompParent, compOrganisationId });
        let sortBy = this.state.sortBy;
        let sortOrder = this.state.sortOrder;
        const { organisationId } = getOrganisationData() || {};
        const competitionId = getUmpireCompetitionId();
        if (organisationId && competitionId) {
          this.props.getUmpireList({
            organisationId,
            competitionId,
            offset: this.state.offsetData,
            sortBy,
            sortOrder,
          });
          this.setState({
            selectedComp: competitionId,
            loading: false,
            competitionUniqueKey: compKey,
            compArray: compList,
          });
        } else {
          this.setState({ loading: false });
        }
      }
    }
  }

  checkUserId = record => {
    if (record.userId === null) {
      message.config({ duration: 1.5, maxCount: 1 });
      message.warn(ValidationConstants.umpireMessage);
    } else {
      history.push('/userPersonal', {
        userId: record.userId,
        screenKey: 'umpire',
        screen: '/umpire',
      });
    }
  };

  checkAccreditationLevel = accreditation => {
    if (this.props.appstate.accreditation) {
      let accreditationArr = this.props.appstate.accreditation;
      for (let i in accreditationArr) {
        if (accreditationArr[i].id == accreditation) {
          return accreditationArr[i].description;
        }
      }
    }
    return '';
  };

  handleShowSizeChange = async (page, pageSize) => {
    await this.props.setUmpireListPageSizeAction(pageSize);
    this.handlePageChange(page);
  };

  handlePageChange = async page => {
    await this.props.setUmpireListPageNumberAction(page);
    const { sortBy, sortOrder } = this.state;
    let { pageSize_Data } = this.props.umpireState;
    let offset = page ? pageSize_Data * (page - 1) : 0;
    this.setState({
      offsetData: offset,
    });

    const { organisationId } = getOrganisationData() || {};
    const competitionId = getUmpireCompetitionId();
    if (organisationId && competitionId)
      this.props.getUmpireList({
        organisationId,
        competitionId,
        offset,
        limit: pageSize_Data,
        sortBy,
        sortOrder,
      });
  };

  contentView = () => {
    const {
      umpireListDataNew,
      totalCount_Data,
      currentPage_Data,
      pageSize_Data,
    } = this.props.umpireState;
    let umpireListResult = isArrayNotEmpty(umpireListDataNew) ? umpireListDataNew : [];
    return (
      <div className="comp-dash-table-view mt-4">
        <div className="table-responsive home-dash-table-view">
          <Table
            loading={this.props.umpireState.onLoad || this.props.umpireCompetitionState.onLoad}
            className="home-dashboard-table"
            columns={this.state.columns}
            dataSource={umpireListResult}
            pagination={false}
            rowKey={record => 'umpireListResult' + record.id}
          />
        </div>
        <div className="comp-dashboard-botton-view-mobile">
          <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end" />

          <div className="d-flex justify-content-end">
            <Pagination
              className="antd-pagination"
              showSizeChanger
              current={currentPage_Data}
              defaultCurrent={currentPage_Data}
              defaultPageSize={pageSize_Data}
              total={totalCount_Data}
              onChange={this.handlePageChange}
              onShowSizeChange={this.handleShowSizeChange}
            />
          </div>
        </div>
      </div>
    );
  };

  onChangeComp = async compID => {
    let selectedComp = compID?.comp;

    const { sortBy, sortOrder } = this.state;
    let compObj = this.state.compArray.find(comp => comp.id === selectedComp);
    let orgItem = getOrganisationData();
    let userOrganisationId = orgItem ? orgItem.organisationId : null;
    let compOrgId = compObj ? compObj.organisationId : null;
    let isCompParent = userOrganisationId === compOrgId;
    this.setState({ isCompParent });

    if (selectedComp) setUmpireCompetitionId(selectedComp);
    if (compObj) setUmpireCompetitionData(JSON.stringify(compObj));

    let compKey = compID.competitionUniqueKey;

    if (userOrganisationId && selectedComp)
      this.props.getUmpireList({
        organisationId: userOrganisationId,
        competitionId: selectedComp,
        offset: 0,
        sortBy,
        sortOrder,
      });

    this.setState({ selectedComp, competitionUniqueKey: compKey });
  };

  // on change search text
  onChangeSearchText = e => {
    this.setState({ searchText: e.target.value, offsetData: 0 });

    const { sortBy, sortOrder } = this.state;
    if (e.target.value === null || e.target.value === '') {
      const orgData = getOrganisationData();
      const orgId = orgData && orgData.organisationId ? orgData.organisationId : null;
      const compId = getUmpireCompetitionId();
      this.props.getUmpireList({
        organisationId: orgId,
        competitionId: compId,
        offset: 0,
        sortBy,
        sortOrder,
      });
    }
  };

  // search key
  onKeyEnterSearchText = e => {
    this.setState({ offsetData: 0 });
    const { sortBy, sortOrder } = this.state;
    const code = e.keyCode || e.which;
    if (code === 13) {
      // 13 is the enter keycode
      const { organisationId } = getOrganisationData() || {};
      const competitionId = getUmpireCompetitionId();

      if (organisationId && competitionId)
        this.props.getUmpireList({
          organisationId,
          competitionId,
          offset: 0,
          sortBy,
          sortOrder,
        });
    }
  };

  // on click of search icon
  onClickSearchIcon = () => {
    this.setState({ offsetData: 0 });
    const { sortBy, sortOrder } = this.state;
    if (this.state.searchText === null || this.state.searchText === '') {
    } else {
      const { organisationId } = getOrganisationData() || {};
      const compId = getUmpireCompetitionId();
      if (compId && organisationId) {
        this.props.getUmpireList({
          organisationId,
          competitionId: compId,
          offset: 0,
          sortBy,
          sortOrder,
        });
      }
    }
  };

  onExport = () => {
    const url =
      AppConstants.umpireListExport +
      `entityTypeId=${1}&entityId=${this.state.selectedComp}&roleIds=[15,19,20]`;
    this.props.userExportFilesAction(url, 'umpire');
  };

  headerView = () => {
    let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList)
      ? this.props.umpireCompetitionState.umpireComptitionList
      : [];
    let { isCompParent } = this.state;
    let isCompetitionAvailable = this.state.selectedComp ? false : true;
    return (
      <div className="comp-player-grades-header-drop-down-view mt-4">
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm pt-1 d-flex align-content-center">
              <span className="form-heading">{AppConstants.umpireList}</span>
            </div>

            <div className="col-sm-8 w-100 d-flex flex-row align-items-center justify-content-end">
              <div className="row">
                <div className="col-sm pt-1">
                  <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                    <NavLink to="/addUmpire" className="text-decoration-none">
                      <Button
                        disabled={isCompetitionAvailable}
                        className="primary-add-comp-form"
                        type="primary"
                      >
                        + {AppConstants.addUmpire}
                      </Button>
                    </NavLink>
                  </div>
                </div>

                <div className="col-sm pt-1">
                  <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                    <Button
                      className="primary-add-comp-form"
                      type="primary"
                      onClick={this.onExport}
                      disabled={isCompetitionAvailable}
                    >
                      <div className="row">
                        <div className="col-sm">
                          <img className="export-image" src={AppImages.export} alt="" />
                          {AppConstants.export}
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="col-sm pt-1">
                  {isCompParent && (
                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                      <NavLink
                        className="text-decoration-none"
                        to={{
                          pathname: `/umpireImport`,
                          state: { screenName: 'umpire' },
                        }}
                      >
                        <Button className="primary-add-comp-form" type="primary">
                          <div className="row">
                            <div className="col-sm">
                              <img className="export-image" src={AppImages.import} alt="" />
                              {AppConstants.import}
                            </div>
                          </div>
                        </Button>
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 d-flex justify-content-between">
            <div className="w-ft d-flex flex-row align-items-center" style={{ marginRight: 50 }}>
              <span className="year-select-heading">{AppConstants.competition}:</span>
              <Select
                className="year-select reg-filter-select1 ml-2"
                style={{ minWidth: 200 }}
                onChange={comp => this.onChangeComp({ comp })}
                value={this.state.selectedComp || ''}
                loading={this.props.umpireCompetitionState.onLoad}
              >
                {competition.map(item => (
                  <Option key={'competition_' + item.id} value={item.id}>
                    {item.longName}
                  </Option>
                ))}
              </Select>
            </div>

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
      </div>
    );
  };

  render() {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />

        <InnerHorizontalMenu menu="umpire" umpireSelectedKey="2" />

        <Layout>
          {this.headerView()}

          <Content>
            {/* {this.dropdownView()} */}
            {this.contentView()}
            {this.ModalView()}
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      umpireCompetitionListAction,
      umpireMainListAction,
      userExportFilesAction,
      getRefBadgeData,
      setUmpireListPageSizeAction,
      setUmpireListPageNumberAction,
      getUmpireList,
      getRankedUmpiresCount,
      updateUmpireRank,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    umpireState: state.UmpireState,
    umpireCompetitionState: state.UmpireCompetitionState,
    appstate: state.AppState,
    rankedUmpiresCount: state.rankedUmpiresCount,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Umpire);
